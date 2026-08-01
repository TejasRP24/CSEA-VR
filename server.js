import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ----------------------------------------------------------------
//  Chatbot knowledge — same data & algorithm as chatbot-data.js
// ----------------------------------------------------------------
const psgKnowledge = [
  {
    keywords: ["location", "where", "located", "city", "address", "peelamedu"],
    answer:
      "PSG College of Technology is centrally located on Avinashi Road in Peelamedu, Coimbatore, Tamil Nadu, India. It's easily accessible by bus, train (close to Coimbatore Junction), and air (near Coimbatore International Airport).",
  },
  {
    keywords: ["hour", "operating", "time", "open", "closing"],
    answer:
      "The general campus operating hours are from 8:30 AM to 4:30 PM, Monday through Friday. However, facilities like the library and computer labs remain open much later for student access.",
  },
  {
    keywords: ["tour", "visit", "see", "map", "visitor", "park", "parking", "guide"],
    answer:
      "Visitors can take a virtual campus tour via our website. Physical visits require prior permission from the PRO office. Visitor parking is available near the main gate. The campus map is displayed at all major intersections.",
  },
  {
    keywords: ["accreditation", "status", "affiliated", "nba", "naac", "ranking"],
    answer:
      "PSG Tech is a government-aided autonomous institution affiliated with Anna University. All our major programs are accredited by the NBA (National Board of Accreditation) and the college holds an A++ grade from NAAC. We consistently rank in the top 50 engineering colleges nationally by NIRF.",
  },
  {
    keywords: ["contact", "office", "admin", "administration", "number", "emergency", "directory", "faculty"],
    answer:
      "The main administration office is located in the A-Block. You can find faculty and department contact directories on our official website (www.psgtech.edu). In case of emergency, contact campus security at the main gate.",
  },
  {
    keywords: ["date", "term", "semester", "calendar", "schedule", "open", "holiday"],
    answer:
      "The academic calendar detailing term dates, exams, and holidays is available on the student portal and the official website. The odd semester typically begins in July/August, and the even semester in December/January.",
  },
  {
    keywords: ["transport", "bus", "train", "commute", "travel"],
    answer:
      "The campus is extremely well-connected by public transport. The Peelamedu bus stop is right outside the college gates, and the Peelamedu railway station is a short walk away.",
  },
  {
    keywords: ["website", "official", "link", "url"],
    answer:
      "Our official website is www.psgtech.edu. You can find all academic, administrative, and admission-related information there.",
  },
  {
    keywords: ["admission", "admisin", "apply", "application", "freshers", "enroll", "intake"],
    answer:
      "B.E./B.Tech admissions are primarily done through TNEA (Tamil Nadu Engineering Admissions) counseling based on 12th standard marks. Application deadlines align with the state government schedule. All procedures are online via the TNEA portal.",
  },
  {
    keywords: ["fee", "application", "cost"],
    answer:
      "Application fees vary based on the quota (Counseling vs Management). For specific fee details, please check the official admission notification released during the admission cycle.",
  },
  {
    keywords: ["transfer", "defer", "college", "credit"],
    answer:
      "Transferring credits from another college is subject to the strict regulations of Anna University and DOTE. Deferring admission to the next term is generally not permitted in regular UG programs.",
  },
  {
    keywords: ["document", "submit", "certificate", "mark"],
    answer:
      "For admissions, you must submit original 10th and 12th mark sheets, transfer certificate (TC), community certificate, and Nativity certificate (if applicable). Seat allotment orders must also be produced.",
  },
  {
    keywords: ["online", "degree", "distance", "programme"],
    answer:
      "PSG Tech currently focuses on full-time, on-campus degree programs. However, students use online platforms (Moodle, Coursera) to supplement their learning, and certain part-time courses are available for working professionals.",
  },
  {
    keywords: ["international", "foreign", "nri", "ielts", "sat"],
    answer:
      "International students and NRIs can apply under the Foreign Nationals/NRI quota. Specific eligibility criteria apply, but SAT or IELTS scores are typically not mandatory unless specified by the AICTE guidelines for that year.",
  },
  {
    keywords: ["tuition", "semester", "pay", "payment", "deadline", "receipt", "installment"],
    answer:
      "Tuition fees for government-aided courses are highly subsidized, while self-supporting courses follow a different structure. Fees must be paid at the beginning of each semester online through the student portal (CAMU/AMRITA). Installment plans are generally not offered, but official receipts can be downloaded instantly.",
  },
  {
    keywords: ["scholarship", "financial", "aid", "loan", "work-study"],
    answer:
      "PSG Tech offers numerous merit-based and need-based scholarships, including government scholarships (First Graduate, Post Matric) and alumni-funded aid. The Financial Aid office assists with these and educational loan documentation. Campus work-study is limited to specific research fellowships.",
  },
  {
    keywords: ["extra", "lab", "sports", "book", "supply"],
    answer:
      "Minor fees for laboratory usage, library, and sports are typically bundled into the semester fee. Books and personal supplies are an additional out-of-pocket estimated cost.",
  },
  {
    keywords: ["refund", "drop", "withdraw"],
    answer:
      "The fee refund policy adheres strictly to AICTE guidelines. If a student withdraws before the prescribed cutoff date, fees are refunded after deducting processing charges.",
  },
  {
    keywords: ["major", "course", "degree", "minor", "branch"],
    answer:
      "We offer top-tier B.E./B.Tech programs in CSE, IT, ECE, EEE, Mechanical, Production, Robotics, Bio-Medical, and more, alongside numerous M.E./M.Tech, MBA, MCA, and applied science degrees.",
  },
  {
    keywords: ["register", "class", "schedule", "timetable"],
    answer:
      "Course registration is done online via the student portal at the start of each semester. Your finalized class schedule and timetable will be accessible on the portal.",
  },
  {
    keywords: ["credit", "graduate", "gpa", "probation", "grade"],
    answer:
      "Graduation requires completing a specific number of credits (usually ~160 for B.E./B.Tech) with a minimum CGPA. Maintaining good academic standing is crucial to avoid probation. Final grades are published on the portal.",
  },
  {
    keywords: ["advisor", "faculty", "mentor"],
    answer:
      "Every student is assigned a faculty advisor or tutor who provides academic guidance, approves course registrations, and assists with career planning.",
  },
  {
    keywords: ["transcript", "certificate", "official"],
    answer:
      "Official academic transcripts can be requested through the Controller of Examinations (CoE) office. You can apply online or in person by submitting the required form and fee.",
  },
  {
    keywords: ["summer", "internship", "industry", "training"],
    answer:
      "Summer internships and in-plant training are highly encouraged and often mandatory. Our strong industry ties help students secure internships at top MNCs and core industries.",
  },
  {
    keywords: ["club", "society", "join", "start", "government", "event", "kriya", "intrams"],
    answer:
      "Campus life is incredibly vibrant! You can join over 30 clubs, including the Computer Science Engineering Association (CSEA), GitHub Campus Club, Robotics Club, and the Students Union. Flagship events include KRIYA (Techfest) and INTRAMS (Cultural fest).",
  },
  {
    keywords: ["id", "card", "lost", "found"],
    answer:
      "Student ID cards are issued during the first month of the first semester. If lost, report it to the HoD and the main office to apply for a duplicate. The lost and found desk is located near the security office.",
  },
  {
    keywords: ["gym", "health", "recreation", "sport", "varsity", "medical", "counselling"],
    answer:
      "The campus features excellent sports facilities, a modern gym, and courts for basketball, tennis, and more. A health centre and dispensary offer medical support, and professional mental health counselling is available confidentially.",
  },
  {
    keywords: ["career", "placement", "resume", "recruit", "job"],
    answer:
      "The Placement Cell is world-class, bringing in 500+ top global companies like Google, Microsoft, Amazon, and L&T. They provide career counselling, resume reviews, and extensive mock interview training.",
  },
  {
    keywords: ["disability", "support", "accessible"],
    answer:
      "PSG Tech is committed to inclusivity. The campus is equipped with ramps, elevators, and dedicated support services for students with disabilities to ensure equal access to all facilities.",
  },
  {
    keywords: ["hostel", "dorm", "housing", "roommate", "apply", "cost", "accommodation"],
    answer:
      "We provide excellent on-campus hostel facilities for boys and girls. Accommodation is allotted based on distance and merit. Roommate allocations are managed by the wardens. Detailed cost structures are provided during admission.",
  },
  {
    keywords: ["food", "dining", "meal", "mess", "canteen"],
    answer:
      "The hostel mess serves highly nutritious and hygienic vegetarian and non-vegetarian meals. Operating hours cover breakfast, lunch, snacks, and dinner. There are also multiple canteens and food courts on campus.",
  },
  {
    keywords: ["wifi", "internet", "laundry", "maintenance", "security"],
    answer:
      "Hostels are equipped with high-speed Wi-Fi, modern laundry facilities, and 24/7 security. Maintenance issues can be reported in the hostel office register for prompt resolution.",
  },
  {
    keywords: ["forbid", "ban", "rule", "winter", "summer", "break"],
    answer:
      "Strict disciplinary rules apply in dorms; alcohol, smoking, and ragging are strictly forbidden and carry severe penalties. Hostels typically close during major summer/winter breaks, except for students with special academic permissions.",
  },
  {
    keywords: ["password", "portal", "email", "reset", "login", "app"],
    answer:
      "You can reset your student portal password and access your official college email via the central IT helpdesk. We have a robust online portal to track attendance, grades, and fee payments.",
  },
  {
    keywords: ["library", "book", "borrow", "database", "journal", "study", "print"],
    answer:
      "The GRD Memorial Library is a state-of-the-art facility spanning multiple floors. It offers vast collections of books, online research databases (IEEE, ACM), printing services, and quiet study areas. You can borrow multiple books simultaneously.",
  },
  {
    keywords: ["computer", "lab", "tech", "support", "help", "desk", "software"],
    answer:
      "Campus features numerous specialized computer labs and a central IT centre. Technical support is available during working hours. Students get access to discounted or free educational software like Microsoft Office and MATLAB.",
  },
];

// Levenshtein distance — same as index.html
function getEditDistance(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const matrix = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

function findBestMatch(userMessage) {
  const words = userMessage
    .toLowerCase()
    .replace(/[^\w\s]/gi, "")
    .split(/\s+/);

  let bestAnswer = null;
  let bestScore = 999;

  for (const topic of psgKnowledge) {
    for (const keyword of topic.keywords) {
      for (const word of words) {
        if (word.length < 3) continue;
        if (word === keyword || word.includes(keyword) || keyword.includes(word)) {
          bestAnswer = topic.answer;
          bestScore = 0;
          break;
        }
        const distance = getEditDistance(word, keyword);
        const threshold = keyword.length > 5 ? 2 : 1;
        if (distance <= threshold && distance < bestScore) {
          bestScore = distance;
          bestAnswer = topic.answer;
        }
      }
      if (bestScore === 0) break;
    }
    if (bestScore === 0) break;
  }

  // Greetings
  if (!bestAnswer && (words.includes("hi") || words.includes("hello") || words.includes("hey"))) {
    return "Hello there! Feel free to ask me anything about PSG College of Technology.";
  }

  if (bestAnswer) {
    return bestAnswer;
  }

  return "I'm sorry, I specialize purely in PSG College of Technology data (like admissions, history, courses, placements, etc.). Could you check your phrasing and ask me about the college?";
}

// ----------------------------------------------------------------
//  Express server
// ----------------------------------------------------------------
const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from the Vite build output (production)
const distPath = path.join(__dirname, "dist");
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}

// Chat API endpoint
app.post("/api/chat", (req, res) => {
  const { message } = req.body;
  if (!message || typeof message !== "string") {
    return res.status(400).json({ reply: "Please provide a message." });
  }
  const reply = findBestMatch(message.trim());
  res.json({ reply });
});

// Fallback: serve index.html for any non-API routes (for SPA support)
app.get("*", (req, res) => {
  const indexPath = path.join(distPath, "index.html");
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).json({ error: "Build not found. Run `npm run build` first." });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🤖 CSEA Chatbot API running on http://localhost:${PORT}`);
  console.log(`   POST /api/chat  { "message": "your question" }`);
});