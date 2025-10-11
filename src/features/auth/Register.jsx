import { startTransition, useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAt,
  faEnvelope,
  faEye,
  faEyeSlash,
  faLock,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { v4 as uuidv4 } from "uuid";

export default function Register({ user, setUser, usersList }) {
  const [registrationDetails, setRegistrationDetails] = useState({
    username: "",
    fullName: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) startTransition(() => navigate("/"));
  }, [user, navigate]);

  async function handleRegister(event) {
    const url = window.location.href;

    const urlObj = new URL(url);
    const invitationCode = urlObj.searchParams.get("invitationCode");

    event.preventDefault();

    if (checkUsernameAvailability(registrationDetails.username) === false) {
      document.querySelector(".register-status").innerHTML =
        "Username already exists. Please choose a different username.";
      return;
    }

    if (registrationDetails.fullName.split(" ").length < 2) {
      document.querySelector(".register-status").innerHTML =
        "Please enter your full name.";
      return;
    }

    if (registrationDetails.password.length < 6) {
      document.querySelector(".register-status").innerHTML =
        "Password must be at least 6 characters.";
      return;
    }

    if (
      registrationDetails.email === "" ||
      registrationDetails.email.includes("@") === false
    ) {
      document.querySelector(".register-status").innerHTML =
        "Please enter a valid email address.";
      return;
    }

    if (registrationDetails.username === "") {
      document.querySelector(".register-status").innerHTML =
        "Please enter a username.";
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        registrationDetails.email,
        registrationDetails.password
      );

      const newUser = userCredential.user;

      await sendEmailVerification(auth.currentUser);

      const newUserRef = doc(db, "users", newUser.uid);
      const firstName = registrationDetails.fullName.split(" ")[0];
      const lastName = registrationDetails.fullName.split(" ")[1];
      const teamId = uuidv4();
      const newTeam = {
        teamName: "My Team",
        teamId,
        teamMembers: [
          {
            username: registrationDetails.username,
            uid: newUser.uid,
            email: registrationDetails.email,
          },
        ],
        tasks: [],
        lastUpdated: new Date().toISOString(),
        created: new Date().toISOString(),
        createdById: newUser.uid,
        subWorkspaces: [{}],
      };
      if (!invitationCode) {
        try {
          await setDoc(
            newUserRef,
            {
              username: registrationDetails.username,
              firstName,
              lastName,
              email: registrationDetails.email,
              teams: { [teamId]: { role: "admin" } },
            },
            { merge: true }
          );
          console.log("User doc created/updated");
        } catch (e) {
          console.error("setDoc(/users) failed:", e?.code, e?.message);
          setStatus(
            `User profile write failed: ${e?.code || ""} ${e?.message || ""}`
          );
          return;
        }

        await setDoc(doc(db, "teams", teamId), newTeam);
        const el = document.querySelector(".register-status");
        if (el) el.innerHTML = "User added successfully...";
        setTimeout(() => startTransition(() => navigate("/")), 5000);
      } else {
        const invitationDocRef = doc(db, "invitationCodes", invitationCode);
        const invitationDoc = await getDoc(invitationDocRef);

        if (invitationDoc.exists()) {
          const invitationData = invitationDoc.data();

          if (invitationData.used) {
            <div className="flex flex-col items-center justify-center">
              <p>This link has already been used.</p>
              <p>
                If this is a mistake, please ask your admin to add you again to
                the team.
              </p>
              <p>Thank you for using TaskHive.</p>
              <button onClick={startTransition(() => navigate("/"))}>
                Go back
              </button>
            </div>;
          } else {
            const teamDocRef = doc(db, "teams", invitationData.teamId);
            const teamDoc = await getDoc(teamDocRef);
            const teamData = teamDoc.data();
            const teamMembers = teamData.teamMembers;
            await updateDoc(teamDocRef, {
              teamMembers: [
                ...teamMembers,
                {
                  username: registrationDetails.username,
                  uid: newUser.uid,
                  email: registrationDetails.email,
                },
              ],
            });
            const newUserDoc = await getDoc(newUserRef);
            const newUserData = newUserDoc.data();
            await updateDoc(newUserRef, {
              ...newUserData,
              teams: {
                [invitationData.teamId]: { role: invitationData.chosenRole },
              },
            });

            await updateDoc(invitationDocRef, {
              ...invitationData,
              used: true,
            });
            setUser(newUser);
            setTimeout(() => startTransition(() => navigate("/")), 5000);
          }
        } else {
          console.log("Invitation document does not exist.");
        }
      }
    } catch (error) {
      console.error("Error registering:", error);
      if (error.code === "auth/email-already-in-use") {
        document.querySelector(".register-status").innerHTML =
          "Email already in use. Please try again with a different email.";
      }
    }
  }

  function checkUsernameAvailability(username) {
    return !usersList.some((user) => user.username === username);
  }

  function handleChange(e) {
    setRegistrationDetails({
      ...registrationDetails,
      [e.target.name]: e.target.value,
    });
  }
  return (
    <>
      <div className="text-black flex flex-col items-center h-11/12 gap-5 w-11/12 lg:w-5/12 mx-auto pt-16 pb-4 mt-6 rounded-lg lg:h-11/12">
        <h3 className="font-semibold">Welcome to TaskHive!</h3>
        <p className="w-11/12 md:w-9/12 text-neutral-500 text-center">
          Start managing your tasks and projects efficiently.
        </p>
        <form
          onSubmit={handleRegister}
          className="[&_svg]:text-accent-600 w-10/12 md:w-1/2 flex flex-col gap-4 [&>div]:bg-white *:h-12 *:pl-3 *:rounded-4 [&>div]:border [&>div]:border-neutral-300 [&_input]:h-full [&_input]:outline-none [&>div]:rounded-lg"
          autoComplete="off"
          noValidate
        >
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faUser} className="0" />
            <input
              name="fullName"
              type="text"
              value={registrationDetails.fullName}
              onChange={(e) => {
                handleChange(e);
              }}
              placeholder="Full Name"
              required
              autoFocus
              className="bg-transparent w-full"
            />
          </div>
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faAt} className="0" />
            <input
              name="username"
              type="text"
              value={registrationDetails.username}
              onChange={(e) => handleChange(e)}
              placeholder="Username"
              required
              autoFocus
              className="bg-transparent w-full"
            />
          </div>

          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faEnvelope} className="0" />
            <input
              name="email"
              type="email"
              value={registrationDetails.email}
              onChange={(e) => handleChange(e)}
              placeholder="Email"
              required
              autoFocus
              className="bg-transparent w-full"
            />
          </div>
          <div className="relative text-neutral1 flex items-center gap-2">
            <FontAwesomeIcon icon={faLock} className="0" />
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              value={registrationDetails.password}
              onChange={(e) => handleChange(e)}
              placeholder="Password"
              required
              minLength={6}
              maxLength={20}
              className="bg-transparent w-9/12 md:w-4/5"
            />
            <button
              type="button"
              className="absolute right-5 show-password"
              onClick={(e) => {
                e.preventDefault();
                setShowPassword(!showPassword);
              }}
            >
              {showPassword ? (
                <FontAwesomeIcon icon={faEye} />
              ) : (
                <FontAwesomeIcon icon={faEyeSlash} />
              )}
            </button>
          </div>
          <button
            type="submit"
            className="text-accent-50 bg-accent-500 border-2 border-transparent rounded-md hover:bg-transparent hover:border-accent-500 hover:text-accent-500 px-4 py-2 w-full text-xl  transition-all duration-300"
          >
            Create Account
          </button>
        </form>
        <p className="">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-accent-500 font-medium hover:text-accent-250 transition-all duration-200"
          >
            Login
          </a>
        </p>
        <div className="register-status"></div>
      </div>
    </>
  );
}

Register.propTypes = {
  user: PropTypes.object,
  setUser: PropTypes.func.isRequired,
  usersList: PropTypes.array.isRequired,
};
