import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "../firebase/config"; // Ensure this matches your config file name
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// In Vite, use import.meta.env.VITE_GEMINI_KEY
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite-preview" });

export const askGemini = async (prompt, userId, actionLabel, dataLang = "English") => {
  const languageInstruction = dataLang === "Auto-detect"
    ? "Please respond in the exact same language as the input/context provided."
    : `Please respond exclusively in the following language: ${dataLang}.`;

  const fullPrompt = `${prompt}\n\n${languageInstruction}`;

  try {
    const result = await model.generateContent(fullPrompt);
    const responseText = result.response.text();

    // 1. Log the action to Firebase (this feeds your "AI Actions Log" sidebar)
    await addDoc(collection(db, "ai_logs"), {
      userId: userId || "anonymous",
      label: actionLabel,
      prompt,
      response: responseText,
      timestamp: serverTimestamp(),
      icon: "✨"
    });

    return responseText;
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
};

export const draftReviewResponse = async (review, userId, dataLang = "English") => {
  const languageInstruction = dataLang === "Auto-detect"
    ? "the exact same language used in the guest's review text"
    : dataLang;

  const fullPrompt = `You are a professional hotel manager writing an empathetic response to a guest review.
  Review: "${review.text}"
  Sentiment: ${review.sentiment}
  Room: ${review.room || "N/A"}
  Department: ${review.department || "N/A"}
  
  Write a warm, professional 2-3 sentence response.
  
  CRITICAL: You MUST return ONLY a raw JSON object string with exactly two keys: "native" and "english". Do not include Markdown blocks like \`\`\`json.
  - "native": the response written in ${languageInstruction}.
  - "english": the exact English translation of the response.`;

  try {
    const result = await model.generateContent(fullPrompt);
    const responseText = result.response.text();

    let parsed;
    try {
      parsed = JSON.parse(responseText.replace(/\`\`\`json/gi, '').replace(/\`\`\`/g, '').trim());
    } catch (e) {
      console.error("Parse Error Drafting Review:", e);
      const cleanText = responseText.replace(/\`\`\`json/gi, '').replace(/\`\`\`/g, '').trim();
      parsed = { native: cleanText, english: cleanText };
    }

    await addDoc(collection(db, "ai_logs"), {
      userId: userId || "anonymous",
      label: "Drafted Review Response",
      prompt: fullPrompt,
      response: responseText,
      timestamp: serverTimestamp(),
      icon: "✨"
    });

    return parsed;
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
};

export const chatWithContext = async (userPrompt, reviews, userId, dataLang = "English") => {
  try {
    // 1. Prepare the review data as a text string for the AI to read
    const reviewContext = reviews.map(r =>
      `- [${r.sentiment}] Room ${r.room || 'N/A'}: "${r.text}" (Dept: ${r.department})`
    ).join("\n");

    const fullPrompt = `
      You are IntelSense AI, an expert hotel operations consultant. 
      Below is the LIVE data from our hotel guest reviews:
      
      ${reviewContext}
      
      Instructions:
      - Answer the user's question based ONLY on the data above.
      - If multiple guests mention the same issue (like AC or towels), identify it as a trend.
      - Be professional, concise, and prioritize HIGH priority issues.
      - ${dataLang === "Auto-detect" ? "Respond in the exact same language as the User Question." : `Respond exclusively in the following language: ${dataLang}.`}
      
      User Question: "${userPrompt}"
    `;

    const result = await model.generateContent(fullPrompt);
    const responseText = result.response.text();

    // 2. Log this interaction to your AI Actions Log in Firestore
    await addDoc(collection(db, "ai_logs"), {
      userId: userId || "anonymous",
      label: `Chat: ${userPrompt.substring(0, 30)}...`,
      prompt: userPrompt,
      response: responseText,
      timestamp: serverTimestamp(),
      icon: "💬"
    });

    return responseText;
  } catch (error) {
    console.error("Chat Error:", error);
    return "I'm having trouble accessing the live data right now. Please check your connection.";
  }
};

export const generateDailyBrief = async (reviews, userId, uiLang = "English") => {
  try {
    const reviewContext = reviews.slice(0, 15).map(r =>
      `- [${r.sentiment}] Room ${r.room || 'N/A'}: "${r.text}" (Dept: ${r.department})`
    ).join("\\n");

    const prompt = `
      You are an expert hotel manager AI. Based on the most recent reviews below, generate 3 short, punchy bullet points summarizing the most critical issues or notable trends today.
      Rules:
      - Return ONLY a JSON string array of 3 strings. Example: ["point 1", "point 2", "point 3"]
      - Do not include markdown formatting like \`\`\`json.
      - Keep each point under 12 words.
      - Focus on actionable insights.
      - Generate the bullet points exclusively in the following language: ${uiLang}.
      
      Recent Data:
      ${reviewContext}
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    let parsed;
    try {
      parsed = JSON.parse(responseText.replace(/\`\`\`json/gi, '').replace(/\`\`\`/g, '').trim());
    } catch (e) {
      console.error("Parse Error:", e);
      parsed = [
        "Unable to parse AI daily brief.",
        "Check recent reviews for trends.",
        "System operating normally.",
      ];
    }

    await addDoc(collection(db, "ai_logs"), {
      userId: userId || "anonymous",
      label: "Generated AI Daily Brief",
      prompt,
      response: responseText,
      timestamp: serverTimestamp(),
      icon: "💡"
    });

    return parsed;
  } catch (error) {
    console.error("Brief Error:", error);
    return ["AI Daily Brief unavailable.", "Check your connection.", "Review recent feedback manually."];
  }
};

export const generateSuggestedAction = async (room, issue, uiLang = "English") => {
  try {
    const prompt = `
      You are an expert hotel operations consultant.
      Context: Room ${room} has the following issue: "${issue}"
      Task: Provide a single, punchy, professional "Suggested Action" for the staff.
      Rules:
      - Return ONLY the suggestion text.
      - Maximum 8 words.
      - Respond exclusively in this language: ${uiLang}
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    return text;
  } catch (error) {
    console.error("Action Error:", error);
    return uiLang === "Thai" ? "กำลังประมวลผล..." : "Generating action...";
  }
};

export const translateText = async (text, targetLang = "English", reviewContext = "") => {
  try {
    const languageInstruction = targetLang === "Auto-detect" 
      ? "the same language as the guest's review provided in context" 
      : targetLang;

    const prompt = `
      You are a professional hotel manager assistant.
      Task: Translate the following response text exactly into this language: ${languageInstruction}
      
      Original Response to Translate: "${text}"
      ${reviewContext ? `\nContext (Original Guest Review): "${reviewContext}"` : ""}
      
      Rules:
      - Maintain the professional, empathetic tone.
      - Return ONLY the translated text.
      - Do not include explanation or markdown.
    `;

    const result = await model.generateContent(prompt);
    const translated = result.response.text().trim();

    return translated;
  } catch (error) {
    console.error("Translation Error:", error);
    return text;
  }
};