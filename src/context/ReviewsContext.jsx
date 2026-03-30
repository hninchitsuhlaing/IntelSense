import { createContext, useContext, useState, useEffect } from "react";
import { db } from "../lib/firebase.jsx"; 
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

const ReviewsContext = createContext();

export function ReviewsProvider({ children }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This connects your app to the "reviews" collection in Firebase
    const q = query(collection(db, "reviews"), orderBy("date", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setReviews(data);
      setLoading(false);
    });

    return () => unsubscribe(); 
  }, []);

  return (
    <ReviewsContext.Provider value={{ reviews, loading }}>
      {children}
    </ReviewsContext.Provider>
  );
}

// --- THIS IS THE CRITICAL MISSING EXPORT ---
export function useReviews() {
  const context = useContext(ReviewsContext);
  if (!context) {
    throw new Error("useReviews must be used within a ReviewsProvider");
  }
  return context;
}