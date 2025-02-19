import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, database } from "./backend/firebase-config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set } from "firebase/database";
import "./SignUp.css";

function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save user data to Realtime Database
      await set(ref(database, `users/${user.uid}`), { email });

      alert("Sign-up successful!");
      navigate("/voting"); // Navigate to the voting page
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="sign-up-container">
      <form onSubmit={handleSignUp} className="form-signUp">
        <h2>Sign Up</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="input-signUp"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="input-signUp"
        />
        <button type="submit" className="signupbtn">Sign Up</button>
        {/* Link to navigate to SignIn page */}
        <p>
          Already have an account?{" "}
          <span className="signin-link" onClick={() => navigate("/signin")}>
            Sign In
          </span>
        </p>
      </form>
    </div>
  );
}

export default SignUp;

