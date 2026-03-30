import { useState, useEffect, useRef } from "react";
import { INITIAL_REVIEWS, LIVE_REVIEW_POOL } from "../data/mockData.js";
import { generateTrendData, randomRoom } from "../utils/helpers.js";

//  useLiveScore 
// Simulates a live-updating happiness score
export function useLiveScore(initial = 78, intervalMs = 3000) {
  const [score, setScore]   = useState(initial);
  const [pulsing, setPulse] = useState(false);

  useEffect(() => {
    const t = setInterval(() => {
      setScore(s => {
        const next = Math.min(100, Math.max(0, s + (Math.random() - 0.48) * 1.5));
        return Math.round(next * 10) / 10;
      });
      setPulse(true);
      setTimeout(() => setPulse(false), 600);
    }, intervalMs);
    return () => clearInterval(t);
  }, [intervalMs]);

  return { score, pulsing };
}

//  useTrendData 
// Returns memoised generated trend data
export function useTrendData(points = 24, base = 68, variance = 14) {
  const [data] = useState(() => generateTrendData(points, base, variance));
  return data;
}

//  useLiveReviews 
// Returns a live-updating list of reviews
export function useLiveReviews(intervalMs = 9000) {
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);

  useEffect(() => {
    const t = setInterval(() => {
      const pool = LIVE_REVIEW_POOL;
      const base = pool[Math.floor(Math.random() * pool.length)];
      const newReview = {
        ...base,
        id:   Date.now(),
        room: randomRoom(),
        time: "just now",
      };
      setReviews(prev => [newReview, ...prev.slice(0, 24)]);
    }, intervalMs);
    return () => clearInterval(t);
  }, [intervalMs]);

  return { reviews, setReviews };
}

//  useScrollToBottom 
export function useScrollToBottom(deps = []) {
  const ref = useRef(null);
  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, deps);
  return ref;
}

//  useChatMessages 
export function useChatMessages(initialMessages = []) {
  const [messages, setMessages]   = useState(initialMessages);
  const [loading,  setLoading]    = useState(false);

  const addMessage = (msg) => setMessages(prev => [...prev, msg]);
  const setTyping  = (val) => setLoading(val);

  return { messages, loading, addMessage, setTyping };
}
