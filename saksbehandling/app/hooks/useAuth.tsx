import { useState, useEffect } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "FirebaseConfig";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "FirebaseConfig";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const subscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
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

  return { user, loading, logout, deleteAccount };
};


