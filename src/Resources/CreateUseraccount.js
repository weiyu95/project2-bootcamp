import React, { useState } from "react";
import "./cssfiles/login.css";
import { Message, Password, CaretRight } from "react-iconly";
import divider from "./images/Divider.png";
import apple from "./images/Apple.png";
import facebook from "./images/Facebook.png";
import google from "./images/Google.png";
import { Link, Navigate } from "react-router-dom";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

const Create = (props) => {
  const [username, setUsername] = useState(null);
  const [UserPassword, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("hi");
    createUserWithEmailAndPassword(auth, username, UserPassword)
      .then(() => {
        setPassword("");
      })
      .catch((err) => {
        window.alert(err);
      });
  };

  const handleInput = (event) => {
    if (event.target.id === "username") {
      setUsername(event.target.value);
    } else if (event.target.id === "Userpassword") {
      setPassword(event.target.value);
    }
  };

  return (
    <div>
      {props.info.userIsLoggedIn ? (
        <Navigate to="/profile" replace={true} />
      ) : (
        <div>
          <h1 style={{ top: 100 }}>Create Account</h1>
          <h3>Already have an account?</h3>
          <Link to="/Login">
            <h5>Sign in</h5>
          </Link>
          <div className="userAuthBox">
            <ul className="AuthDetailsHolder">
              <li>
                <Message set="bold" primaryColor="black" size={50} />
              </li>
              <li>
                <form className="userform">
                  <label className="label2">Username :</label>
                  <input
                    title="Enter Username here"
                    className="input"
                    type="text"
                    id="username"
                    onChange={handleInput}
                  />
                </form>
              </li>
            </ul>
          </div>
          <div className="passwordAuthBox">
            <ul className="AuthDetailsHolder">
              <li>
                <Password set="bold" primaryColor="black" size={50} />
              </li>
              <li>
                <form className="userform">
                  <label className="label2">Password :</label>
                  <input
                    title="Enter password here"
                    className="input"
                    type="password"
                    id="Userpassword"
                    onChange={handleInput}
                  />
                  <button onClick={handleSubmit} className="loginBtn">
                    <CaretRight set="bold" primaryColor="Black" />
                  </button>
                </form>
              </li>
            </ul>
          </div>
          <img className="cont" src={divider} alt="oops" />
          <ul className="socialMlogin">
            <li>
              <img src={apple} alt="oops" />
            </li>
            <li>
              <img src={facebook} alt="oops" />
            </li>
            <li>
              <img src={google} alt="oops" />
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export { Create };
