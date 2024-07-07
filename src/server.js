import express from "express";
import cron from "node-cron";
import nodemailer from "nodemailer";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { initializeApp } from "firebase/app";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Initialize Firebase
const firebaseConfig = {
  apiKey: "[REDACTED]",
  authDomain: "taskhive-6599c.firebaseapp.com",
  projectId: "taskhive-6599c",
  storageBucket: "taskhive-6599c.appspot.com",
  messagingSenderId: "133342593921",
  appId: "1:133342593921:web:1ce4fcb53dc89b5ee85e80",
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_PROVIDER,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to send email
const sendEmail = (subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.ADMIN_EMAIL,
    subject: subject,
    text: text,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};

// Check for task updates based on urgency
const checkTaskUpdates = async () => {
  const tasksSnapshot = await getDocs(collection(db, "tasks"));
  const now = new Date();
  const tasks = [];

  tasksSnapshot.forEach((doc) => {
    tasks.push({ id: doc.id, ...doc.data() });
  });

  tasks.forEach((task) => {
    const lastUpdated = new Date(task.lastUpdated);
    let interval;

    switch (task.priority) {
      case "Critical":
        interval = 1 * 60 * 60 * 1000; // 1 hour
        break;
      case "High":
        interval = 3 * 60 * 60 * 1000; // 3 hours
        break;
      case "Normal":
        interval = 24 * 60 * 60 * 1000; // 1 day
        break;
      case "Low":
        interval = 7 * 24 * 60 * 60 * 1000; // 1 week
        break;
      default:
        interval = 24 * 60 * 60 * 1000; // Default to 1 day
        break;
    }

    if (now - lastUpdated > interval) {
      sendEmail(
        `Task Update Reminder for ${task.priority} Priority`,
        `The task "${task.content}" has not been updated for ${task.priority} priority interval.`
      );
    }
  });
};

// Schedule jobs based on urgency
cron.schedule("0 * * * *", () => {
  // Every hour
  checkTaskUpdates();
});

app.get("/users", async (req, res) => {
  try {
    const listUsersResult = await admin.auth().listUsers();
    const users = listUsersResult.users.map((userRecord) => ({
      uid: userRecord.uid,
      email: userRecord.email,
    }));
    res.status(200).send(users);
  } catch (error) {
    console.log("Error listing users:", error);
    res.status(500).send("Error listing users");
  }
});

// Serve static files from the React app build directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const buildPath = path.join(__dirname, "..", "dist");
app.use(express.static(buildPath));

// Catch-all handler to serve the React app for any route
app.get("*", (req, res) => {
  res.sendFile(path.join(buildPath, "index.html"));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
