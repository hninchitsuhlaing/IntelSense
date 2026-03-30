import { db } from "../lib/firebase.js";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const MOCK_REVIEWS = [
  { text: "The AC in room 302 is making a loud rattling noise. Couldn't sleep!", sentiment: "Negative", department: "Maintenance", priority: "HIGH", room: "302", emoji: "😡", time: "Just now" },
  { text: "Amazing breakfast spread at the buffet. The staff was so kind.", sentiment: "Positive", department: "F&B", priority: "LOW", room: "405", emoji: "🍳", time: "2h ago" },
  { text: "Room was clean, but we ran out of towels by the pool.", sentiment: "Neutral", department: "Housekeeping", priority: "MEDIUM", room: "210", emoji: "🏊", time: "5h ago" },
  { text: "Check-in took over 45 minutes. Unacceptable for a 5-star hotel.", sentiment: "Negative", department: "Front Desk", priority: "HIGH", room: "101", emoji: "⏳", time: "1h ago" }
];

export const seedFirestore = async () => {
  try {
    const reviewsCol = collection(db, "reviews");
    
    for (const review of MOCK_REVIEWS) {
      await addDoc(reviewsCol, {
        ...review,
        date: serverTimestamp(), // Use real Firestore timestamps
        createdAt: serverTimestamp()
      });
    }
    
    console.log("✅ Database seeded successfully!");
    alert("Data added! Refresh the page to see your live dashboard.");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};