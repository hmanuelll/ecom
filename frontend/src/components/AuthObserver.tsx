"use client";

import { useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useStore } from "@/store/useStore";

export function AuthObserver() {
  const setUser = useStore((state) => state.setUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDocRef = doc(db, "users", firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser({
              id: firebaseUser.uid,
              name: userData.name || firebaseUser.displayName || "User",
              email: firebaseUser.email || "",
              role: userData.role || "customer",
              phone: userData.phone || "",
              addresses: userData.addresses || [],
            });
          } else {
            setUser({
              id: firebaseUser.uid,
              name: firebaseUser.displayName || "User",
              email: firebaseUser.email || "",
              role: "customer",
              phone: "",
              addresses: [],
            });
          }
        } catch (e) {
          console.error("Error fetching user document from Firestore:", e);
          setUser({
            id: firebaseUser.uid,
            name: firebaseUser.displayName || "User",
            email: firebaseUser.email || "",
            role: "customer",
            phone: "",
            addresses: [],
          });
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [setUser]);

  return null;
}
