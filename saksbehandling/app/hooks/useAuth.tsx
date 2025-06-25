import { useState, useEffect } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "FirebaseConfig";
import { deleteDoc, doc, getDoc } from "firebase/firestore";
import { db } from "FirebaseConfig";
import type { CustomUserData } from "~/interfaces/interfaces";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [customUserData, setCustomUserData] = useState<CustomUserData>()

  useEffect(() => {
    const subscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
      getCustomUserData();
    });

    return subscribe;
  }, []);

  
  const logout = async () => {
    try {
      await auth.signOut();
      setUser(null);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const deleteAccount = async () => {
    if (user) {
      try {
        await deleteDoc(doc(db, "users", user.uid));
        await user.delete();
        setUser(null);
      } catch (error) {
        console.error("Error deleting account:", error);
      }
    }
  };

const getCustomUserData = async () => {
  const docRef = doc(db, "users", user!.uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    console.log("Document data:", data);

    const customData: CustomUserData = {
      id: user!.uid,
      email: data.email,
      role: data.role,
      createdAt: data.createdAt.toDate(), 
    };
    console.log(customData.email, customData.role)

    setCustomUserData(customData);
  } else {
    console.log("No such document!, goddam!!!");
    return;
  }
};


  return { user, loading, logout, deleteAccount, customUserData, getCustomUserData};
};
