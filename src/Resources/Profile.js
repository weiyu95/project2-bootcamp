import React, { useState } from "react";
import { storage } from "../firebase";
import { ref, getDownloadURL } from "firebase/storage";
import { Link, Navigate } from "react-router-dom";
import { User, CaretLeft } from "react-iconly";
import { auth } from "../firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { signOut } from "firebase/auth";
import "./cssfiles/Profile.css";
import divider from "./images/NavBar Divider.svg";

const Profile = (props) => {
  const [imageurl, setimageurl] = useState(null);

  if (props.info.profilePicURL !== "") {
    const imagesRef = ref(
      storage,
      `ProfilePictures/${props.info.userID}/${props.info.profilePicURL}`
    );
    getDownloadURL(imagesRef)
      .then((url) => {
        setimageurl(url);
      })
      .catch((error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        console.log(error);
      });
  }

  const resetPassword = () => {
    sendPasswordResetEmail(auth, props.info.userdpname)
      .then(() =>
        window.alert("Please Check your email to reset your password")
      )
      .catch((err) => window.alert("Enter your username"));
  };

  return (
    <div>
      {props.info.userIsLoggedIn ? (
        <div className="profilepage">
          <ul>
            <li>
              <ul className="titlebar">
                <li>
                  <Link to="/newsfeed">
                    <CaretLeft set="bold" primaryColor="#2FF522" />
                  </Link>
                </li>
                <li>
                  <label className="title">Profile</label>
                </li>
              </ul>
            </li>
            <li>
              <img className="divider" src={divider} alt="divider" />
            </li>
            <li className="centerViewBox">
              <div className="Profilebox">
                <ul className="Profilelist">
                  <li>
                    {imageurl != null ? (
                      <img className="CircleBorder" src={imageurl} alt="lolz" />
                    ) : (
                      <div className="CircleBorder">
                        <User
                          className="userNotLogin"
                          set="bold"
                          primaryColor="black"
                        />
                      </div>
                    )}
                  </li>
                  <li className="changeDisplayPic">
                    <Link to="uploadpicture"> Upload New Picture</Link>
                  </li>
                  <li>
                    <ul className="UserDetails">
                      <li className="info">{props.info.userdpname}</li>
                    </ul>
                  </li>
                  <li className="changeDisplayPic">
                    <h3 className="ChangePwd" onClick={resetPassword}>
                      Change Password
                    </h3>
                  </li>
                  <li style={{ paddingTop: 5 }}>
                    <Link className="ProductsLink" to="likedproduct">
                      Liked Products
                    </Link>
                  </li>
                  <li>
                    <Link className="ProductsLink" to="allorders">
                      Track Orders
                    </Link>
                  </li>
                  <li>
                    <Link className="ProductsLink" to="orderhistory">
                      Order History
                    </Link>
                  </li>
                  <li>
                    <Link className="ProductsLink" to="paymentmethod">
                      Payment Methods
                    </Link>
                  </li>
                </ul>
              </div>{" "}
              <label
                className="LogoutBtn"
                onClick={() => {
                  signOut(auth);
                }}
              >
                Logout
              </label>
            </li>
          </ul>
        </div>
      ) : (
        <Navigate to="/login" replace={true} />
      )}
    </div>
  );
};

export { Profile };
