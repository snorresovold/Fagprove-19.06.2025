import { useEffect, useState } from "react";
import { getUserDataFromID } from "~/utils";
import type { Comment } from "~/interfaces";

export default function CommentItem({ comment }: { comment: Comment }) {
    const [email, setEmail] = useState<string>();

useEffect(() => {
  if (comment.commenter) {
    getUserDataFromID(comment.commenter).then((user) => {
      if (user) {
        setEmail(user.email);
      } else {
        setEmail("Unknown user");
      }
    });
  }
}, [comment.commenter]);




  return (
<div className="flex flex-col items-end w-full w-[720px] mx-auto">
  <div className="bg-white shadow-md rounded-xl p-6 w-full text-center">
        <p className="font-semibold text-gray-700">{email ?? "loading..."}</p>
        <p className="mt-2 text-gray-700">{comment.comment}</p>
      </div>

      {/* Timestamp below and right */}
      <span className="text-sm text-gray-500 mt-1">
        {new Date(comment.createdAt).toLocaleString()}
      </span>
    </div>
  );
}
