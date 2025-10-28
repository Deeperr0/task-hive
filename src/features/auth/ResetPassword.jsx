import { startTransition, useState, useEffect } from "react";
import { auth } from "../../firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  async function handleResetPassword(event) {
    event.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage(
        "Password reset email sent. Please check your inbox. You will be redirected to the login page in 5 seconds."
      );
    } catch (error) {
      console.error("Error sending password reset email:", error);
      setMessage("Error sending password reset email.");
    }
  }

  useEffect(() => {
    if (
      message ==
      `Password reset email sent. Please check your inbox. You will be redirected to the login page in 5 seconds.`
    ) {
      let timerText = 5;
      const timerInterval = setInterval(() => {
        timerText--;
        setMessage(
          `Password reset email sent. Please check your inbox. You will be redirected to the login page in ${timerText} seconds.`
        );
        if (timerText === 0) {
          clearInterval(timerInterval);
          startTransition(() => navigate("/login"));
        }
      }, 1000);

      return () => clearInterval(timerInterval);
    }
  }, [message, navigate]);

  return (
    <div className="text-black w-11/12 md:w-3/5 lg:w-3/12 mx-auto mt-36 flex flex-col justify-center items-center py-10 gap-8 rounded-lg">
      <div className="text-center flex flex-col gap-3">
        <h2 className="text-2xl font-semibold">Reset Password</h2>
        <p className="text-neutral-500">
          Enter your email and we'll send you a instruction to reset your
          password
        </p>
      </div>
      <form
        onSubmit={handleResetPassword}
        className="flex flex-col gap-8 w-full *:w-full"
      >
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className="border border-neutral-300 rounded-lg py-4 p-2"
        />
        <button
          type="submit"
          className="py-4 bg-accent-500 hover:bg-accent-600 text-accent-50 rounded-lg"
        >
          Send Reset Email
        </button>
        <p className="text-center">
          Remember your password?{" "}
          <a
            href="/login"
            className="text-accent-500 hover:text-accent-300 transition-all duration-300 font-medium"
          >
            Log in here
          </a>
        </p>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
