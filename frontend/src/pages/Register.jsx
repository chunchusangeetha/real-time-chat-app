import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/Firebase";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../styles/Register.css";

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const token = await user.getIdToken();

      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/verify-token`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      navigate("/chat");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        setErrorMsg("Email already in use. Do you want to log in instead?");
      } else {
        setErrorMsg(error.message);
      }
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h1 className="register-header">Welcome to Chat Application</h1>
        <h2 className="register-subtitle">Sign Up</h2>
        <form onSubmit={handleRegister} className="register-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="register-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="register-input"
          />
          <button type="submit" className="register-button">
            Register
          </button>
        </form>

        {errorMsg && (
          <div className="register-error">
            <p>{errorMsg}</p>
            {errorMsg.includes("Email already in use") && (
              <p>
                <Link to="/login">Go to Login Page</Link>
              </p>
            )}
          </div>
        )}

        <p className="register-login-link">
          Already have an account? <Link to="/login">Login here</Link>.
        </p>
      </div>
    </div>
  );
};

export default Register;
