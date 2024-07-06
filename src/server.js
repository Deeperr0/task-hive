import express from "express";
import admin from "firebase-admin";
import cors from "cors";
import { readFile } from "fs/promises";
import crypto from "crypto";
import nodemailer from "nodemailer";
import cron from "node-cron";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const serviceAccount = JSON.parse(
  await readFile(
    new URL(
      "../taskhive-6599c-firebase-adminsdk-h16fi-f13859d1c4.json",
      import.meta.url
    )
  )
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const registrationTokens = {}; // In-memory store for registration tokens

const transporter = nodemailer.createTransport({
  service: "hotmail",
  auth: {
    user: "[REDACTED]";,
    pass: "@Yousef14102003",
  },
});

const sendEmail = (to, subject, text) => {
  const mailOptions = {
    from: "[REDACTED]";,
    to,
    subject,
    text,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};

const scheduleNotification = (task, interval) => {
  cron.schedule(
    interval,
    () => {
      const taskDocRef = admin.firestore().doc(`tasks/${task.id}`);
      taskDocRef.get().then((doc) => {
        if (doc.exists && doc.data().status !== "Done") {
          sendEmail(
            "[REDACTED]";, // Replace with the admin's email
            `Task ${task.content} Status Update Required`,
            `The task "${task.content}" with priority "${task.priority}" needs an update.`
          );
        }
      });
    },
    {
      scheduled: true,
      timezone: "Your/Timezone",
    }
  );
};

app.get("/users", async (req, res) => {
  try {
    const listUsersResult = await admin.auth().listUsers();
    const users = listUsersResult.users.map((userRecord) => ({
      uid: userRecord.uid,
      email: userRecord.email,
    }));
    res.status(200).json(users);
  } catch (error) {
    console.log("Error listing users:", error);
    res.status(500).json({ error: "Error listing users" });
  }
});

app.post("/sendRegistrationLink", async (req, res) => {
  const { email } = req.body;
  const token = crypto.randomBytes(20).toString("hex");
  registrationTokens[token] = email;

  const registrationLink = `http://localhost:3000/register?token=${token}`;
  res.status(200).json({ registrationLink });
});

app.post("/register", async (req, res) => {
  const { token, email, password } = req.body;
  const storedEmail = registrationTokens[token];

  if (storedEmail && storedEmail === email) {
    try {
      const userRecord = await admin.auth().createUser({ email, password });
      delete registrationTokens[token]; // Invalidate the token after successful registration
      res.status(200).json(userRecord);
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ error: "Error creating user" });
    }
  } else {
    res.status(400).json({ error: "Invalid or expired token" });
  }
});

const scheduleTaskNotifications = (task) => {
  switch (task.priority) {
    case "Critical":
      scheduleNotification(task, "0 * * * *"); // every hour
      break;
    case "High":
      scheduleNotification(task, "0 */3 * * *"); // every 3 hours
      break;
    case "Normal":
      scheduleNotification(task, "0 0 * * *"); // every day
      break;
    case "Low":
      scheduleNotification(task, "0 0 * * 0"); // every week
      break;
    default:
      break;
  }
};

app.post("/task", async (req, res) => {
  const task = req.body;
  try {
    const docRef = await admin.firestore().collection("tasks").add(task);
    task.id = docRef.id;
    scheduleTaskNotifications(task);
    res.status(200).json(task);
  } catch (error) {
    console.error("Error adding task:", error);
    res.status(500).json({ error: "Error adding task" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
