import { db } from "../firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const MOCK_REVIEWS = [
  { text: "แอร์ในห้อง 302 มีเสียงดังมาก นอนไม่หลับเลย!", sentiment: "Negative", department: "Maintenance", priority: "HIGH", room: "302", emoji: "😡", time: "Just now" },
  { text: "Amazing breakfast spread at the buffet. The staff was so kind.", sentiment: "Positive", department: "F&B", priority: "LOW", room: "405", emoji: "🍳", time: "2h ago" },
  { text: "Room was clean, but we ran out of towels by the pool.", sentiment: "Neutral", department: "Housekeeping", priority: "MEDIUM", room: "210", emoji: "🏊", time: "5h ago" },
  { text: "办理入住手续花了超过45分钟。对于一家五星级酒店来说是不折不扣的灾难。", sentiment: "Negative", department: "Front Desk", priority: "HIGH", room: "101", emoji: "⏳", time: "1h ago" },
  { text: "The WiFi kept disconnecting in the conference room. Really frustrating for my meeting.", sentiment: "Negative", department: "IT", priority: "HIGH", room: "Conf Room A", emoji: "📶", time: "10m ago" },
  { text: "ترك طاقم التنظيف الباب مفتوحًا بعد التنظيف. شعرت بعدم الأمان الشديد.", sentiment: "Negative", department: "Housekeeping", priority: "HIGH", room: "512", emoji: "🔓", time: "30m ago" },
  { text: "The concierge booked us an amazing local tour, highly recommend!", sentiment: "Positive", department: "Front Desk", priority: "LOW", room: "220", emoji: "🗺️", time: "4h ago" },
  { text: "Room service burger was cold when it arrived.", sentiment: "Negative", department: "F&B", priority: "MEDIUM", room: "314", emoji: "🍔", time: "15m ago" },
  { text: "Напор воды в душе просто фантастический. Лучший душ в отеле.", sentiment: "Positive", department: "Maintenance", priority: "LOW", room: "605", emoji: "🚿", time: "6h ago" },
  { text: "Elevator 2 has been out of order all day, making the wait terrible.", sentiment: "Negative", department: "Maintenance", priority: "HIGH", room: "Lobby", emoji: "🛗", time: "20m ago" },
  { text: "A really lovely stay, bed was super comfortable.", sentiment: "Positive", department: "Housekeeping", priority: "LOW", room: "411", emoji: "🛏️", time: "1d ago" },
  { text: "Bartender made an incredible custom cocktail for my anniversary.", sentiment: "Positive", department: "F&B", priority: "LOW", room: "Bar", emoji: "🍸", time: "12h ago" },
  { text: "Valet lost my keys for an hour. Missed our dinner reservation.", sentiment: "Negative", department: "Front Desk", priority: "HIGH", room: "Valet", emoji: "🔑", time: "2h ago" },
  { text: "テレビのリモコンの電池がない。", sentiment: "Neutral", department: "Housekeeping", priority: "MEDIUM", room: "308", emoji: "📺", time: "45m ago" },
  { text: "Gym equipment is brand new and the space air conditioning is perfect.", sentiment: "Positive", department: "Maintenance", priority: "LOW", room: "Gym", emoji: "🏋️", time: "3h ago" }
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