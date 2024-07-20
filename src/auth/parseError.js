export default function parseError(error) {
	switch (error) {
		case "Firebase: Error (auth/user-disabled).":
			return "User disabled. Please contact support.";
		case "Firebase: Error (auth/user-not-found).":
			return "User not found. Please register first.";
		case "Firebase: Error (auth/wrong-password).":
			return "Wrong password. Please try again.";
		case "Firebase: Error (auth/too-many-requests).":
			return "Too many requests. Please try again later.";
		case "Firebase: Error (auth/invalid-email).":
			return "Invalid email. Please try again.";
		case "Firebase: Error (auth/network-request-failed).":
			return "Network request failed. Please try again.";
		case "Firebase: Error (auth/weak-password).":
			return "Password must be at least 6 characters.";
		case "Firebase: Error (auth/invalid-credential).":
			return "Invalid credentials. Please try again.";
		default:
			return "An error occurred. Please try again.";
	}
}
