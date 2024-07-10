import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "[REDACTED]",
	authDomain: "taskhive-6599c.firebaseapp.com",
	projectId: "taskhive-6599c",
	storageBucket: "taskhive-6599c.appspot.com",
	messagingSenderId: "133342593921",
	appId: "1:133342593921:web:1ce4fcb53dc89b5ee85e80",
	measurementId: "G-MFLK1TTE82",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
