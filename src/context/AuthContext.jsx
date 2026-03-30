import { createContext, useContext, useState, useEffect } from "react";
import { auth, db, firebaseConfig } from "../firebase/config";
import { initializeApp, deleteApp, getApp } from "firebase/app";
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  getAuth
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Listen for Auth State Changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        // Fetch custom profile from Firestore
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: userData.name,
            role: userData.role,
            avatar: userData.name?.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() || "?"
          });
        } else {
          // Fallback if no Firestore doc exists yet (e.g. legacy/third-party)
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName || "Unknown User",
            role: "Staff",
            avatar: "?"
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signup = async (email, password, name, role) => {
    // Standard signup (used for migration or if we re-enable public signup)
    const res = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, "users", res.user.uid), {
      name,
      role,
      email: email.toLowerCase(),
      createdAt: new Date().toISOString()
    });
    return res;
  };

  // NEW: Admin Creation without logout
  const adminCreateUser = async (email, password, name, role) => {
    // 1. Initialize a secondary, temporary Firebase app
    // We use a unique name each time to avoid "already exists" errors
    const tempAppName = `TempApp_${Date.now()}`;
    const secondaryApp = initializeApp(firebaseConfig, tempAppName);
    const secondaryAuth = getAuth(secondaryApp);

    try {
      // 2. Create the user on the secondary instance
      const res = await createUserWithEmailAndPassword(secondaryAuth, email, password);
      
      // 3. Save profile to Firestore (using the primary db instance)
      await setDoc(doc(db, "users", res.user.uid), {
        name,
        role,
        email: email.toLowerCase(),
        createdAt: new Date().toISOString(),
        createdBy: user?.email || "admin"
      });

      // 4. Cleanup the secondary app
      await deleteApp(secondaryApp);
      return { success: true, uid: res.user.uid };
    } catch (error) {
      await deleteApp(secondaryApp);
      throw error;
    }
  };

  const logout = () => {
    return signOut(auth);
  };

  const updateProfile = async (updates) => {
    if (!user?.uid) return;
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, updates, { merge: true });
    setUser(prev => ({ ...prev, ...updates }));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, adminCreateUser, logout, updateProfile }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
