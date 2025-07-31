import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/Firebase"; // Adjust path if needed
import { useNavigate } from "react-router-dom";
import axios from "axios";
const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

      // const handleLogin = async (e) => {
      //   e.preventDefault();
      //   try {
      //     await signInWithEmailAndPassword(auth, email, password);
      //     navigate("/chat"); 
      //   } catch (err) {
      //     setError(err.message);
      //   }
      // };
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const token = await user.getIdToken();
       
            const res = await axios.post("http://127.0.0.1:5003/api/auth/verify-token", { token })


            console.log("Backend verified user:", res.data);
            navigate("/chat");
        } catch (err) {
            setError(err.message);
        }
    };
    return (
        <form onSubmit={handleLogin}>
            <h2>Login</h2>
            <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
            <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
            <button type="submit">Login</button>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
    );
};

export default Login;
