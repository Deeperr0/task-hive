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
import admin from "firebase-admin";
import { fileURLToPath } from "url";
import { dirname } from "path";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Initialize Firebase App
const firebaseConfig = {
	apiKey: process.env.FIREBASE_API_KEY,
	authDomain: process.env.FIREBASE_AUTH_DOMAIN,
	projectId: process.env.FIREBASE_PROJECT_ID,
	storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.FIREBASE_APP_ID,
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

// Decode the base64-encoded Firebase service account key
const serviceAccount = JSON.parse(
	Buffer.from(
		process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64,
		"base64"
	).toString("utf-8")
);

// Initialize Firebase Admin SDK
admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	// databaseURL: "https://<your-database-name>.firebaseio.com", // Optional, if you use Realtime Database
});

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

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "../dist")));

app.get("/users", async (req, res) => {
	try {
		const usersList = [];
		const listUsersResult = await admin.auth().listUsers(1000);
		listUsersResult.users.forEach((userRecord) => {
			usersList.push({
				uid: userRecord.uid,
				email: userRecord.email,
				displayName: userRecord.displayName,
			});
		});
		res.json(usersList);
	} catch (error) {
		console.error("Error listing users:", error);
		res.status(500).json({ error: "Failed to list users" });
	}
});

app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "../dist/index.html"));
});

app.use(
	cors({
		origin: "https://task-hivee.netlify.app/",
	})
);

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
