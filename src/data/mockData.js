//  REVIEWS 
export const INITIAL_REVIEWS = [
  { id: 1, text: "The AC is not working in Room 302", sentiment: "Negative", department: "Maintenance", priority: "HIGH", room: "302", time: "2 min ago", emoji: "😡" },
  { id: 2, text: "Elevator is incredibly slow, waited 10 minutes", sentiment: "Negative", department: "Maintenance", priority: "HIGH", room: "General", time: "5 min ago", emoji: "😡" },
  { id: 3, text: "WiFi is very slow on Floor 5", sentiment: "Negative", department: "IT", priority: "MEDIUM", room: "Floor 5", time: "8 min ago", emoji: "😞" },
  { id: 4, text: "Breakfast was absolutely amazing, best eggs ever!", sentiment: "Positive", department: "F&B", priority: "LOW", room: "Restaurant", time: "12 min ago", emoji: "😊" },
  { id: 5, text: "Room 305 has a leaking faucet, please fix ASAP", sentiment: "Negative", department: "Maintenance", priority: "HIGH", room: "305", time: "15 min ago", emoji: "😡" },
  { id: 6, text: "Housekeeping team was super friendly and efficient", sentiment: "Positive", department: "Housekeeping", priority: "LOW", room: "210", time: "20 min ago", emoji: "😊" },
  { id: 7, text: "Extra towels request was ignored for 2 hours", sentiment: "Negative", department: "Housekeeping", priority: "HIGH", room: "210", time: "25 min ago", emoji: "😤" },
  { id: 8, text: "Front desk staff were very welcoming on arrival", sentiment: "Positive", department: "Front Desk", priority: "LOW", room: "Lobby", time: "30 min ago", emoji: "😊" },
  { id: 9, text: "The pool area is stunning, great facilities", sentiment: "Positive", department: "F&B", priority: "LOW", room: "Pool", time: "35 min ago", emoji: "😍" },
  { id: 10, text: "บริการรูมเซอร์วิสใช้เวลานานกว่าหนึ่งชั่วโมง รับไม่ได้เลย", sentiment: "Negative", department: "F&B", priority: "MEDIUM", room: "418", time: "40 min ago", emoji: "😠" },
];

export const LIVE_REVIEW_POOL = [
  { text: "Great pool area!", sentiment: "Positive", department: "F&B", priority: "LOW", emoji: "😊" },
  { text: "Room service was prompt and delicious", sentiment: "Positive", department: "F&B", priority: "LOW", emoji: "😍" },
  { text: "Checkout process was confusing", sentiment: "Negative", department: "Front Desk", priority: "MEDIUM", emoji: "😞" },
  { text: "Bed was incredibly comfortable, slept like a baby", sentiment: "Positive", department: "Housekeeping", priority: "LOW", emoji: "😊" },
  { text: "No hot water in the morning, very frustrating", sentiment: "Negative", department: "Maintenance", priority: "HIGH", emoji: "😡" },
  { text: "Staff went above and beyond to help us", sentiment: "Positive", department: "Front Desk", priority: "LOW", emoji: "🤩" },
  { text: "Minibar was not restocked during our 3-day stay", sentiment: "Negative", department: "Housekeeping", priority: "MEDIUM", emoji: "😤" },
];

//  FLOOR ROOMS 
export const FLOOR_ROOMS = {
  1: [
    { num: "101", status: "green" },
    { num: "102", status: "red", issue: "AC broken", sentiment: "Angry", priority: "HIGH", action: "Send technician immediately" },
    { num: "103", status: "green" },
    { num: "104", status: "green" },
    { num: "105", status: "yellow", issue: "WiFi slow", sentiment: "Frustrated", priority: "MEDIUM", action: "Contact IT department" },
    { num: "106", status: "red", issue: "Leaking faucet", sentiment: "Angry", priority: "HIGH", action: "Send plumber immediately" },
    { num: "107", status: "green" },
    { num: "108", status: "green" },
  ],
  2: [
    { num: "201", status: "green" },
    { num: "202", status: "green" },
    { num: "203", status: "yellow", issue: "Noisy neighbors", sentiment: "Annoyed", priority: "MEDIUM", action: "Send security to check" },
    { num: "204", status: "green" },
    { num: "205", status: "green" },
    { num: "206", status: "green" },
    { num: "207", status: "green" },
    { num: "208", status: "red", issue: "No hot water", sentiment: "Angry", priority: "HIGH", action: "Maintenance urgent" },
  ],

  3: [
    { num: "301", status: "green" },
    { num: "302", status: "red", issue: "AC broken", sentiment: "Angry", priority: "HIGH", action: "Send technician immediately" },
    { num: "303", status: "green" },
    { num: "304", status: "green" },
    { num: "305", status: "yellow", issue: "WiFi slow", sentiment: "Frustrated", priority: "MEDIUM", action: "Contact IT department" },
    { num: "306", status: "red", issue: "Leaking faucet", sentiment: "Angry", priority: "HIGH", action: "Send plumber immediately" },
    { num: "307", status: "green" },
    { num: "308", status: "green" },
  ],
  4: [
    { num: "401", status: "green" },
    { num: "402", status: "green" },
    { num: "403", status: "yellow", issue: "Noisy neighbors", sentiment: "Annoyed", priority: "MEDIUM", action: "Send security to check" },
    { num: "404", status: "green" },
    { num: "405", status: "green" },
    { num: "406", status: "green" },
    { num: "407", status: "green" },
    { num: "408", status: "red", issue: "No hot water", sentiment: "Angry", priority: "HIGH", action: "Maintenance urgent" },
  ],
  5: [
    { num: "501", status: "green" },
    { num: "502", status: "green" },
    { num: "503", status: "green" },
    { num: "504", status: "green" },
    { num: "505", status: "yellow", issue: "WiFi slow", sentiment: "Frustrated", priority: "MEDIUM", action: "IT team check router" },
    { num: "506", status: "green" },
    { num: "507", status: "green" },
    { num: "508", status: "green" },
  ],
};

//  DEPARTMENT DATA 
export const DEPT_DATA = {
  Housekeeping: {
    score: 4.2,
    trend: "down",
    issues: ["Dirty rooms on checkout", "Slow service response", "Extra towels ignored"],
    strengths: ["Friendly staff", "Quick turnaround on requests"],
    urgent: [
      { loc: "Room 210", issue: "Extra towels request ignored 2h", sev: "red" },
      { loc: "Floor 4 hallway", issue: "Spilled coffee not cleaned", sev: "yellow" },
    ],
  },
  "Front Desk": {
    score: 4.8,
    trend: "up",
    issues: ["Long check-in wait during peak hours"],
    strengths: ["Welcoming staff", "Efficient check-out", "Multilingual support"],
    urgent: [
      { loc: "Lobby", issue: "Queue building at reception", sev: "yellow" },
    ],
  },
  Maintenance: {
    score: 3.9,
    trend: "down",
    issues: ["AC failures in multiple rooms", "Elevator slowness", "Leaking fixtures"],
    strengths: ["Night shift responsiveness"],
    urgent: [
      { loc: "Room 302", issue: "AC broken – guest very angry", sev: "red" },
      { loc: "Room 305", issue: "Leaking faucet – escalating", sev: "red" },
    ],
  },
  "F&B": {
    score: 4.5,
    trend: "neutral",
    issues: ["WiFi in restaurant is weak", "Room service delay reported"],
    strengths: ["Excellent breakfast quality", "Friendly waitstaff", "Wide menu variety"],
    urgent: [],
  },
};

//  LIVE ALERTS 
export const LIVE_ALERTS = [
  { room: "Room 302", issue: "AC not working", sev: "HIGH", color: "#ef4444" },
  { room: "WiFi slow", issue: "Floor 5 repeated complaint", sev: "MEDIUM", color: "#f59e0b" },
  { room: "Room 210", issue: "Towels request ignored", sev: "HIGH", color: "#ef4444" },
  { room: "Elevator", issue: "3 complaints this hour", sev: "MEDIUM", color: "#f59e0b" },
];

//  DEPT SCORECARDS 
export const DEPT_SCORECARDS = [
  { name: "Housekeeping", score: 4.2, trend: "↓", color: "#ef4444" },
  { name: "Front Desk", score: 4.8, trend: "↑", color: "#22c55e" },
  { name: "F&B", score: 4.5, trend: "↗", color: "#22c55e" },
];

//  AI ACTIONS LOG 
export const AI_ACTIONS = [
  { icon: "💡", label: "Generated Daily Summary — flagged Room 302 issue", time: "2 hours ago" },
  { icon: "✏️", label: "Suggested Improvements for elevator operations", time: "2 hours ago" },
  { icon: "📄", label: "Drafted response for WiFi complaint on Floor 5", time: "1 hour ago" },
];

//  NAVIGATION 
export const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "⊞" },
  { id: "departments", label: "Departments", icon: "📊" },
  { id: "actionmap", label: "Action Map", icon: "🗺️" },
  { id: "reviews", label: "Reviews Feed", icon: "💬" },
  { id: "ai", label: "AI Assistant", icon: "🤖" },
  { id: "responder", label: "Smart Responder", icon: "✉️" },
  { id: "reports", label: "Reports", icon: "📄" },
  { id: "settings", label: "Settings", icon: "⚙️" },
];

export const SCREEN_TITLES = {
  dashboard:   ["DASHBOARD"],
  departments: ["DEPARTMENTS"],
  actionmap:   ["ACTION MAP"],
  reviews:     ["REVIEWS FEED"],
  ai:          ["AI ASSISTANT"],
  responder:   ["SMART RESPONDER"],
  reports:     ["REPORTS"],
  settings:    ["SETTINGS"],
};
