import React, { useState, useContext } from "react";
import {
  TextField,
  Button,
} from "@material-ui/core";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthProvider/AuthProvider';
import Navbar from "../navbar/Navbar";
import './Login.css'

function Login() {
  const [Username, setUsername] = useState("");
  const [Password, setPassword] = useState("");
  const [loginStatus, setLoginStatus] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = () => {
    axios
      .post("http://localhost:5000/login", {
        Username,
        Password,
      })
      .then((response) => {
        if (response.data.message) {
          setLoginStatus(response.data.message);
        } else {
          login(response.data.Username);
          if (response.data.Username === 'Admin') {
           navigate('/dashboard');
          } else {
           navigate('/sales');
          }
        }
      });
  };

  return (
    <div>
    <div className="Main_Frame">
        <div>
            <Navbar></Navbar>
        </div>

        <div className="main">
            <div className="sub-main">
                <div className="login_L">
                    <h1>Login</h1>
                </div>
                <div className="fist-input">
                    <TextField
                        id="username"
                        label="Username"
                        variant="outlined"
                        placeholder="Username"
                        onChange={(e) => {
                            setUsername(e.target.value);
                        }}
                        InputProps={{ style: { color: "white" } }}
                        InputLabelProps={{
                            style: { color: "white", fontSize: "1.2rem" },
                        }}
                        style={{ borderColor: "white", width: "80%" }}
                    />
                </div>
                <div className="second-input">
                    <TextField
                        id="password"
                        label="Password"
                        variant="outlined"
                        type="password"
                        placeholder="Password"
                        onChange={(e) => {
                            setPassword(e.target.value);
                        }}
                        InputProps={{ style: { color: "white" } }}
                        InputLabelProps={{
                            style: { color: "white", fontSize: "1.2rem" },
                        }}
                        style={{ borderColor: "white", width: "80%" }} />
                </div>
                <div className="login-btn">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleLogin}
                        style={{ width: "80%" }}
                    >
                        Login
                    </Button>
                </div>
                <div>
                    <p style={{ color: "white" }}>{loginStatus}</p>
                </div>
            </div>
        </div>
    </div>
</div>
  );
}

export default Login;