import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { auth, db } from "FirebaseConfig";
import { useState, useEffect } from "react";
import { useParams } from "react-router";
import CommentItem from "~/components/CommentItem";
import { useAuth } from "~/hooks/useAuth";
import type { Case, Comment } from "~/interfaces";
import { getUserDataFromID } from "~/utils";

export default function CasePage() {
  const { user, customUserData } = useAuth();
  const { id } = useParams();
  const [caseData, setCaseData] = useState<Case>();
  const [email, setEmail] = useState<string>();
  const [commentIntput, setCommentInput] = useState<string>();
  const [role, setRole] = useState<string>();
  const [checked, setChecked] = useState<boolean>(false);

  useEffect(() => {
    if (caseData && caseData.creator) {
      getUserDataFromID(caseData.creator).then((creator) => {
        if (creator) {
          setEmail(creator.email);
          setRole(creator.role)
        } else {
          setEmail("Unknown user");
          setRole("")
        }
      });
    }
  }, [caseData]);

async function handleSubmitComment() {
  if (!commentIntput || !user?.uid || !id) {
    console.error("Missing required data.");
    return;
  }

  const commentData = {
    comment: commentIntput,
    commenter: user.uid,
    createdAt: new Date().toISOString(),
  };

  const commentRef = doc(db, "cases", id, "comments", crypto.randomUUID());
  setChecked(false);
  setCommentInput("");
  try {
    if (checked) {
      await setDoc(doc(db, "cases", id), { status: "lukket" }, { merge: true });
    }

    await setDoc(commentRef, commentData);
    console.log("Comment submitted successfully");
  } catch (error) {
    console.error("Error submitting comment:", error);
  }
      if (id) {
      getCaseById(id)
        .then(setCaseData)
        .catch((error) => {
          console.error(error);
          alert("Error fetching case data: " + error.message);
        });
    }
}

  async function getCaseById(id: string): Promise<Case> {
    const docRef = doc(db, "cases", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error("No such document!");
    }

    const caseData = docSnap.data();

    const commentsSnapshot = await getDocs(
      collection(db, "cases", id, "comments")
    );
    const comments: Comment[] = commentsSnapshot.docs
      .map((commentDoc) => {
        const data = commentDoc.data();
        return {
          id: commentDoc.id,
          comment: data.comment,
          commenter: data.commenter,
          createdAt: data.createdAt,
        };
      })
      .reverse();
    console.log("Comments:", comments);

    return {
      id: docSnap.id,
      status: caseData.status,
      category: caseData.category,
      title: caseData.title,
      description: caseData.description,
      creator: caseData.creator,
      createdAt: caseData.createdAt,
      updatedAt: caseData.updatedAt,
      priority: caseData.priority,
      comments,
    };
  }

  useEffect(() => {
    if (id) {
      getCaseById(id)
        .then(setCaseData)
        .catch((error) => {
          console.error(error);
          alert("Error fetching case data: " + error.message);
        });
    }
  }, [id]);

  if (!caseData) {
    return <div>Loading...</div>;
  }
  return (
  <div className="flex flex-col h-full overflow-hidden px-4 py-6">
    <div className="bg-white shadow-md rounded-xl p-6 max-w-4xl mx-auto mb-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <div className="text-gray-600 mb-1">
          <p className="text-3xl font-bold mb-3 text-gray-800">
            {caseData.title}
          </p>
          <span className="font-semibold">{caseData.category}</span> sak av{" "}
          <span className="font-semibold">{email}</span>
        </div>
        <p className="text-gray-500 text-sm mb-4">
          Sist oppdatert:{" "}
          {new Date(caseData.updatedAt).toLocaleString(undefined, {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </p>
      </div>

      <div className="text-gray-700 whitespace-pre-wrap">
        {caseData.description || <em>No description provided.</em>}
      </div>
    </div>

    <div className="flex-grow overflow-y-auto">
      {caseData.comments && caseData.comments.length > 0 ? (
        <ul className="space-y-4 pb-28 max-w-md mx-auto">
          {caseData.comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </ul>
      ) : (
        <p className="max-w-md mx-auto">Ingen kommentarer enda.</p>
      )}

      {caseData.status === "lukket" && (
        <div className="mt-10 mb-20 text-center">
          <span className="text-3xl font-bold text-gray-200">Saken er lukket</span>
        </div>
      )}
    </div>

    {caseData.status === "åpen" && (
      <div className="shrink-0 p-4">
        <div className="w-full max-w-md mx-auto">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Skriv en kommentar..."
                value={commentIntput}
                onChange={(e) => setCommentInput(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                className="mt-2 w-full bg-blue-500 text-white py-2 rounded-xl hover:bg-blue-600 transition-colors"
                onClick={handleSubmitComment}
              >
                Send kommentar
              </button>
            </div>

            {role === "behandler" && (
              <fieldset>
                <legend className="sr-only">Checkboxes</legend>
                <div className="flex flex-col items-start gap-3">
                  <label htmlFor="Option1" className="inline-flex items-center gap-3">
                    <input
                      type="checkbox"
                      className="size-10 rounded border-gray-300 shadow-sm"
                      id="Option1"
                      checked={checked}
                      onChange={(e) => setChecked(e.target.checked)}
                    />
                    <span className="font-medium text-gray-200">Lukk sak</span>
                  </label>
                </div>
              </fieldset>
            )}

          </div>
        </div>
      </div>
    )}
  </div>
);}
