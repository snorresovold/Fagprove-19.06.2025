import { useEffect, useState } from "react";
import type { Route } from "./+types/home";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "FirebaseConfig";
import { useAuth } from "~/hooks/useAuth";
import type { Case, CustomUserData } from "~/interfaces/interfaces";
import CaseComp from "~/components/CaseComp";
import { getUserDataFromID } from "~/utils/utils";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Saksbehandling" },
    { name: "description", content: "Velkommen til Saksbehandling!" },
  ];
}

export default function Home() {
  const { user } = useAuth();
  const [showPopup, setshowPopup] = useState<boolean>();
  const [cases, Setcases] = useState<Case[]>();
  const [customUserData, SetCustomUserData] = useState<CustomUserData>();
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("createdAt_desc");
  const [showClosed, setShowClosed] = useState<boolean>(true);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    priority: 0,
  });

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    await setDoc(doc(db, "cases", crypto.randomUUID()), {
      creator: user!.uid,
      status: "åpen",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...formData,
    });
    setshowPopup(false);
    console.log("Formulardata:", formData);
  };

  console.log("Home component rendered");
  const getDocuments = async (customUserData?: CustomUserData) => {
    if (!customUserData || !user) return;

    let q;

    if (customUserData.role === "bruker") {
      q = query(collection(db, "cases"), where("creator", "==", user.uid));
    } else {
      q = query(collection(db, "cases"));
    }

    const querySnapshot = await getDocs(q);
    const fetchedCases = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Case[];

    Setcases(fetchedCases);
  };

  const filteredAndSortedCases = cases
    ?.filter(
      (c) =>
        (filterCategory === "all" || c.category === filterCategory) &&
        (showClosed || c.status !== "lukket")
    )
    ?.sort((a, b) => {
      if (sortBy === "createdAt_desc") {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }
      if (sortBy === "createdAt_asc") {
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      }
      if (sortBy === "priority_desc") {
        return b.priority - a.priority;
      }
      if (sortBy === "priority_asc") {
        return a.priority - b.priority;
      }
      return 0;
    });

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      const userData = await getUserDataFromID(user.uid);
      SetCustomUserData(userData);

      await getDocuments(userData);

      setLoading(false);
    };

    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="text-center mt-10 text-lg text-gray-400">
        Laster inn brukerdata...
      </div>
    );
  }
  return (
    <>
      <div className="p-6">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <button
              onClick={() => setshowPopup(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Opprett ny sak
            </button>

            <select
              className="p-2 border border-gray-600 rounded bg-gray-800 text-white"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="all">Alle kategorier</option>
              <option value="Forespørsel">Forespørsel</option>
              <option value="Tilbakemelding">Tilbakemelding</option>
              <option value="Teknisk problem">Teknisk problem</option>
            </select>

            <select
              className="p-2 border border-gray-600 rounded bg-gray-800 text-white"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="createdAt_desc">Nyeste først</option>
              <option value="createdAt_asc">Eldste først</option>
              <option value="priority_desc">Høyest prioritet</option>
              <option value="priority_asc">Lavest prioritet</option>
            </select>
            <select
              className="p-2 border border-gray-600 rounded bg-gray-800 text-white"
              value={showClosed ? "show" : "hide"}
              onChange={(e) => setShowClosed(e.target.value === "show")}
            >
              <option value="show">Vis lukkede saker</option>
              <option value="hide">Skjul lukkede saker</option>
            </select>
          </div>
        </div>
      </div>
      <div className="mt-6 ml-6 mr-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-16">
        {filteredAndSortedCases?.map((c) => (
          <CaseComp
            key={c.id}
            c={{
              ...c,
              createdAt: new Date(c.createdAt),
              updatedAt: new Date(c.updatedAt),
            }}
          />
        ))}
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white text-black rounded-2xl shadow-xl p-8 w-full max-w-md animate-fadeIn">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Ny sak</h2>
              <button
                onClick={() => {
                  setshowPopup(false);
                  setFormData({
                    title: "",
                    description: "",
                    category: "",
                    priority: 0,
                  });
                  getDocuments();
                }}
                className="text-black hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-black"
                >
                  Sak Navn
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  onChange={handleChange}
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-black"
                >
                  Sak Beskrivelse
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  rows={4}
                  className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  onChange={handleChange}
                />
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-black"
                >
                  Kategori
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  onChange={handleChange}
                >
                  <option value="">Velg kategori</option>
                  <option value="Forespørsel">Forespørsel</option>
                  <option value="Tilbakemelding">Tilbakemelding</option>
                  <option value="Teknisk problem">Teknisk problem</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="priority"
                  className="block text-sm font-medium text-black"
                >
                  Prioritet
                </label>
                <input
                  type="number"
                  id="priority"
                  name="priority"
                  min="1"
                  max="5"
                  required
                  className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  onChange={handleChange}
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                  onClick={async () => {
                    if (!user) return;
                    const userData = await getUserDataFromID(user.uid);
                    await getDocuments(userData);
                  }}
                >
                  Opprett Sak
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
