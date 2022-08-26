import React, { useState } from "react";
import { storage } from "../firebase";
import { ref, getDownloadURL } from "firebase/storage";
import "./cssfiles/Newsfeed.css";
import { User, Heart } from "react-iconly";
import sample from "./images/Gendou card.png";

import { Outlet, Link } from "react-router-dom";

const Newsfeed = (props) => {
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
      .catch((error) => {});
  }

  const itemcard = () => {
    return (
      <div>
        <ul className="InstaCard">
          <li>
            <ul className="ItemTitleBanner">
              <li>
                {imageurl != null ? (
                  <img className="smallerpp" src={imageurl} alt="lolz" />
                ) : (
                  <div className="smallerpp">
                    <User
                      className="userNotLogin"
                      set="bold"
                      primaryColor="black"
                    />
                  </div>
                )}
              </li>
              <li style={{ marginTop: 5 }}>{props.info.userdpname}</li>
            </ul>
          </li>
          <li className="productpic">
            <img className="pic" src={sample} alt="opps" />
            <div className="likebtn">
              <Heart set="bold" primaryColor="blueviolet" />
            </div>
          </li>
          <li className="ItemTitle">Get in the Robot</li>
          <li className="ItemDescrip">useless</li>
          <li>
            <ul className="pricetable">
              <li>
                <button className="CartAdd">Add to cart</button>
              </li>
              <li style={{ marginTop: 5, marginRight: 5 }}>$46,200</li>
            </ul>
          </li>
        </ul>
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
    </div>
  );
};

export { Newsfeed };
