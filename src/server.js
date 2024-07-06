import express from "express";
import path from "path";
import admin from "firebase-admin";
import cors from "cors";
import { readFile } from "fs/promises";
import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import crypto from "crypto";
import nodemailer from "nodemailer";
import cron from "node-cron";

const app = express();
app.use(cors());
app.use(express.json());

const serviceAccount = JSON.parse(
  await readFile(
    new URL(
      "./taskhive-6599c-firebase-adminsdk-h16fi-f13859d1c4.json",
      import.meta.url
    )
  )
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const registrationTokens = {}; // In-memory store for registration tokens

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "[REDACTED]";, // Your email
    pass: "[REDACTED]", // Your email password or an app-specific password
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
      // Check if the task status has been updated
      const taskDocRef = admin.firestore().doc(`tasks/${task.id}`);
      taskDocRef.get().then((doc) => {
        if (doc.exists && doc.data().status !== "Done") {
          sendEmail(
            "[REDACTED]";,
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
    res.status(200).send(users);
  } catch (error) {
    console.log("Error listing users:", error);
    res.status(500).send("Error listing users");
  }
});

app.post("/register", async (req, res) => {
  const { token, email, password } = req.body;
  const storedEmail = registrationTokens[token];

  if (storedEmail && storedEmail === email) {
    try {
      const userRecord = await admin.auth().createUser({ email, password });
      delete registrationTokens[token]; // Invalidate the token after successful registration
      res.status(200).send(userRecord);
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).send("Error creating user");
    }
  } else {
    res.status(400).send("Invalid or expired token");
  }
});

const PORT = process.env.PORT || 5000;

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "build")));

// The "catchall" handler: for any request that doesn't
// match one above, send back index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
