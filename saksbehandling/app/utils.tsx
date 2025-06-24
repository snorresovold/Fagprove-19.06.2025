
import { doc, getDoc } from "firebase/firestore";
import { db } from "FirebaseConfig";
import type { CustomUserData } from "./interfaces";

async function getUserDataFromID(id: string): Promise<CustomUserData | null> {
  const docRef = doc(db, "users", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const data = docSnap.data();

    const user: CustomUserData = {
      id: docSnap.id,
      email: data.email,
      role: data.role,
      createdAt: data.createdAt,
    };

    return user;
  } else {
    console.log("No such document!");
    return null;
  }
}

export { getUserDataFromID };