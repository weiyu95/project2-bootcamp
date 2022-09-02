import React, { useState, useEffect } from "react";
import { database, storage } from "../firebase";
import { ref, getDownloadURL } from "firebase/storage";
import {
  push,
  ref as databaseRef,
  set,
  onChildAdded,
  onChildRemoved,
  update,
} from "firebase/database";
import "./cssfiles/Newsfeed.css";
import { User, Heart } from "react-iconly";
import sample from "./images/Gendou card.png";
import { Outlet, Link } from "react-router-dom";

const USERS_FOLDER_NAME = "users";
const ITEMS_FOLDER_NAME = "items";
const USER_CART_NAME = "cart";
const UPLOAD_IMAGES_FOLDER_NAME = "ItemStorage";

const Newsfeed = (props) => {
  const [newsfeedItems, setNewsfeedItems] = useState([]);
  const [itemsData, setItemsData] = useState([]);
  // const [imageUpload, setImageUpload] = useState({
  //   imageInputValue: "",
  //   imageInputFile: null,
  // });

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
        console.log(error);
      });
  }

  useEffect(() => {
    const newsfeedRef = databaseRef(database, ITEMS_FOLDER_NAME);
    onChildAdded(newsfeedRef, (data) => {
      setNewsfeedItems((prevState) => [
        ...prevState,
        { key: data.key, val: data.val() },
      ]);
    });
  }, []);

  useEffect(() => {
    const itemsRef = databaseRef(database, ITEMS_FOLDER_NAME);
    onChildAdded(itemsRef, (data) => {
      setItemsData((prev) => [...prev, { key: data.key, val: data.val() }]);
    });
  }, []);

  // const itemcard = () => {
  //   return (
  //     <div>
  //       <ul className="InstaCard">
  //         <li>
  //           <ul className="ItemTitleBanner">
  //             <li>
  //               {imageurl != null ? (
  //                 <img className="smallerpp" src={imageurl} alt="lolz" />
  //               ) : (
  //                 <div className="smallerpp">
  //                   <User
  //                     className="userNotLogin"
  //                     set="bold"
  //                     primaryColor="black"
  //                   />
  //                 </div>
  //               )}
  //             </li>
  //             <li style={{ marginTop: 5 }}>{props.info.userdpname}</li>
  //           </ul>
  //         </li>
  //         <li className="productpic">
  //           <img className="pic" src={sample} alt="opps" />
  //           <div className="likebtn">
  //             <Heart set="bold" primaryColor="blueviolet" />
  //           </div>
  //         </li>
  //         <li className="ItemTitle">Get in the Robot</li>
  //         <li className="ItemDescrip">useless</li>
  //         <li>
  //           <ul className="pricetable">
  //             <li>
  //               <button className="CartAdd">Add to cart</button>
  //             </li>
  //             <li style={{ marginTop: 5, marginRight: 160 }}>$46,200</li>
  //           </ul>
  //         </li>
  //       </ul>
  //     </div>
  //   );
  // };

  const handleAddToCart = (itemAddedToCart, event) => {
    event.preventDefault();
    const updates = {};
    updates[
      `/${USERS_FOLDER_NAME}/${props.info.userID}/${USER_CART_NAME}/${itemAddedToCart}`
    ] = "";
    console.log(itemAddedToCart);
    update(databaseRef(database), updates);
    // handleDelete(itemAddedToCart);
  };

  // newsfeed rendering function

  let newsfeedCards = (newsfeedItems) => {
    const card = newsfeedItems.map((item) => {
      let itemData = itemsData.find((element) => element.key === item.key);
      if (!itemData) {
        return <div>{console.log("there is no item Data")}</div>;
      }
      return (
        <div>
          <ul className="InstaCard">
            {console.log("Can this be read?")}
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
              <img className="pic" src={itemData.val.itemImage} alt="opps" />
              <div className="likebtn">
                <Heart set="bold" primaryColor="blueviolet" />
              </div>
            </li>
            <li className="ItemTitle">{itemData.val.itemName}</li>
            <li className="ItemDescrip">{itemData.val.itemDescription}</li>
            <li>
              <ul className="pricetable">
                <li>
                  <button
                    className="CartAdd"
                    onClick={(event) => handleAddToCart(item.key, event)}
                  >
                    Add to cart
                  </button>
                </li>
                <li style={{ marginTop: 5, marginRight: 160 }}>
                  {itemData.val.itemPrice}
                </li>
              </ul>
            </li>
          </ul>
        </div>
      );
    });
    return card;
  };

  // let newsfeedCards = newsfeedItems.map((item) => {
  //   let itemData = itemsData.find((element) => element.key === item.key);
  //   return (
  //     <div>
  //       <ul className="InstaCard">
  //         <li>
  //           <ul className="ItemTitleBanner">
  //             <li>
  //               {imageurl != null ? (
  //                 <img className="smallerpp" src={imageurl} alt="lolz" />
  //               ) : (
  //                 <div className="smallerpp">
  //                   <User
  //                     className="userNotLogin"
  //                     set="bold"
  //                     primaryColor="black"
  //                   />
  //                 </div>
  //               )}
  //             </li>
  //             <li style={{ marginTop: 5 }}>{props.info.userdpname}</li>
  //           </ul>
  //         </li>
  //         <li className="productpic">
  //           <img className="pic" src={itemData.val.itemImage} alt="opps" />
  //           <div className="likebtn">
  //             <Heart set="bold" primaryColor="blueviolet" />
  //           </div>
  //         </li>
  //         <li className="ItemTitle">{itemData.val.itemName}</li>
  //         <li className="ItemDescrip">{itemData.val.itemDescription}</li>
  //         <li>
  //           <ul className="pricetable">
  //             <li>
  //               <button
  //                 className="CartAdd"
  //                 onClick={(event) => handleAddToCart(item.key, event)}
  //               >
  //                 Add to cart
  //               </button>
  //             </li>
  //             <li style={{ marginTop: 5, marginRight: 160 }}>
  //               {itemData.val.itemPrice}
  //             </li>
  //           </ul>
  //         </li>
  //       </ul>
  //     </div>
  //   );
  // });

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
      <div>{newsfeedCards(newsfeedItems)}</div>
      {/* <div>{itemcard()}</div>
      <div>{itemcard()}</div>
      <div>{itemcard()}</div> */}
    </div>
  );
};
export { Newsfeed };
