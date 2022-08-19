import React, { useState } from "react";
import { storage } from "../firebase";
import { ref, getDownloadURL } from "firebase/storage";
import "./cssfiles/Newsfeed.css";
import { User } from "react-iconly";
import sample from "./images/Gendou card.png";

import { Outlet, Link } from "react-router-dom";

const Newsfeed = (props) => {
  const [imageurl, setimageurl] = useState(null);
  const storageRef = ref(storage);
  const profilePicFolderRef = ref(storageRef, "ProfilePictures");

  if (props.info.profilePicURL !== "") {
    const imagesRef = ref(profilePicFolderRef, props.info.profilePicURL);
    getDownloadURL(imagesRef)
      .then((url) => {
        setimageurl(url);
      })
      .catch((error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case "storage/object-not-found":
            window.alert("File doesn't exist"); // File doesn't exist
            break;
          case "storage/unauthorized":
            window.alert("User doesn't have permission to access the object"); // User doesn't have permission to access the object
            break;
          case "storage/canceled":
            window.alert("User canceled the upload"); // User canceled the upload
            break;
          case "storage/unknown":
            window.alert("Unknown error occurred, inspect the server response"); // Unknown error occurred, inspect the server response
            break;
          default:
            window.alert("critical error");
            break;
        }
      });
  }
  const itemcard = () => {
    return (
      <div>
        <img src={sample} alt="oops" />
      </div>
    );
  };
  return (
    <div>
      <ul className="TitleCard">
        <li>
          {imageurl != null ? (
            <img className="smallpp" src={imageurl} alt="lolz" />
          ) : (
            <div className="smallpp">
              <User className="userNotLogin" set="bold" primaryColor="black" />
            </div>
          )}
        </li>
        <li>
          <h2 className="Banner">
            {props.info.userIsLoggedIn ? `Welcome back!` : "Welcome"}
          </h2>
          <h2 className="Banner2">
            {props.info.userIsLoggedIn && `${props.info.userdpname}`}
          </h2>
        </li>
      </ul>
      <div>{itemcard()}</div>
      <div>{itemcard()}</div>
      <div>{itemcard()}</div>
      <div>{itemcard()}</div>
    </div>
  );
};

export { Newsfeed };
