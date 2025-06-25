
import { doc, getDoc } from "firebase/firestore";
import { db } from "FirebaseConfig";
import type { CustomUserData } from "../interfaces/interfaces";


async function getUserDataFromID(id: string): Promise<CustomUserData> {
    const docRef = doc(db, "users", id);
    const docSnap = await getDoc(docRef);

    const data = docSnap.data();

    if (!data) {
        throw new Error(`User with id ${id} not found`);
    }

    const user: CustomUserData = {
        id: docSnap.id,
        email: data.email,
        role: data.role,
        createdAt: data.createdAt,
    };

    return user;
}



export { getUserDataFromID };