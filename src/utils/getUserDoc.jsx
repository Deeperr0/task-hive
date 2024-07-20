import { query, collection, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export default async function getUserDoc(username) {
	const q = query(collection(db, "users"), where("username", "==", username));
	const querySnapshot = await getDocs(q);
	return querySnapshot.docs[0];
}
