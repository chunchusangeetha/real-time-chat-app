import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/Firebase"; // Make sure this is correctly exported
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/chat"); // Redirect to chat or dashboard on success
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        setErrorMsg("Email already in use. Do you want to log in instead?");
      } else {
        setErrorMsg(error.message);
      }
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        /><br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        /><br />
        <button type="submit">Register</button>
      </form>

      {/* Error message and conditional login link */}
      {errorMsg && (
        <div style={{ color: "red", marginTop: "1rem" }}>
          <p>{errorMsg}</p>
          {errorMsg.includes("Email already in use") && (
            <p>
              <Link to="/login">Go to Login Page</Link>
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Register;
