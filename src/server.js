import express from "express";
import admin from "firebase-admin";
import cors from "cors";
import { writeFileSync } from "fs";
import { readFile } from "fs/promises";
import crypto from "crypto";

const app = express();
app.use(cors());
app.use(express.json());

// Decode base64 string and write to a JSON file
const serviceAccountBase64 = process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64;
if (serviceAccountBase64) {
  const serviceAccount = Buffer.from(serviceAccountBase64, "base64").toString(
    "utf-8"
  );
  writeFileSync("/app/serviceAccountKey.json", serviceAccount);
}

const serviceAccount = JSON.parse(
  await readFile(new URL("file:///app/serviceAccountKey.json", import.meta.url))
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const registrationTokens = {}; // In-memory store for registration tokens

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
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
