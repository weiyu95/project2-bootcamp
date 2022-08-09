import React from "react";
import { Link, Navigate } from "react-router-dom";
import { User, CaretLeft } from "react-iconly";
import { auth } from "/home/hajiwee/RAbootcamp/bootcamp/projects/project2-bootcamp/src/firebase";
import { signOut } from "firebase/auth";
import "./cssfiles/Profile.css";
import divider from "./images/NavBar Divider.svg";

const Profile = (props) => {
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
                    <div className="CircleBorder">
                      <User
                        className="userNotLogin"
                        set="bold"
                        primaryColor="black"
                      />
                    </div>
                  </li>
                  <li className="changeDisplayPic">
                    <Link to="uploadpicture"> Upload New Picture</Link>
                  </li>
                  <li>
                    <ul className="UserDetails">
                      <li className="label">UserName :</li>
                      <li className="info">{props.info.username}</li>
                    </ul>
                  </li>
                  <li>
                    <ul className="UserDetails">
                      <li className="label">Password :</li>
                      <li className="info">**********</li>
                    </ul>
                  </li>
                  <li className="changeDisplayPic">
                    <Link to="changepassword"> Change Password</Link>
                  </li>
                  <li>
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
