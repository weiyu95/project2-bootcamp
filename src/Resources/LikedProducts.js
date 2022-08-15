import React, { useState, useEffect } from "react";
import {
  push,
  onChildAdded,
  onChildRemoved,
  ref as databaseRef,
  update,
  set,
} from "firebase/database";
import { database } from "../firebase";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import divider from "./images/NavBar Divider.svg";
import { Outlet, Link } from "react-router-dom";

const USERS_FOLDER_NAME = "users";
const USER_CART_NAME = `${USERS_FOLDER_NAME}/user/cart`;

const LikedProducts = ({user}) => {
   const [userLikedItems, setUserLikedItems] = useState([]);

   useEffect(() => {
     const userRef = databaseRef(database, `${USERS_FOLDER_NAME}/user/liked`);
     onChildAdded(userRef, (data) => {
       setUserLikedItems((prevState) => [
         ...prevState,
         { key: data.key, val: data.val() },
       ]);
     });
     onChildRemoved(userRef, (data) => {
       console.log(`${data.val().itemName} removed.`);
       //onChildRemoved & onChildChange could not get userCartItems.
       console.log(`current cart: ${userLikedItems}`);
     });
   }, []);

   const handleAddToCart = (itemAddedToCart) => {
     const ordersListRef = databaseRef(database, USER_CART_NAME);
     const newOrderRef = push(ordersListRef);
     const index = userLikedItems.findIndex((item) => item.key === itemAddedToCart);
     console.log(index);
     console.log(itemAddedToCart);
     set(newOrderRef, userLikedItems[index]);
     handleDelete(itemAddedToCart);
   };

   const handleDelete = (itemDeleted) => {
     const newArray = userLikedItems.filter(
       (likedItems) => likedItems.key !== itemDeleted
     );
     setUserLikedItems(newArray);
     const updates = {};
     updates[`/${USERS_FOLDER_NAME}/user/liked/${itemDeleted}`] = null;
     update(databaseRef(database), updates);
   };

   let likedCards = userLikedItems.map((item) => (
     <Card border="danger" style={{ width: "18rem" }} key={item.key}>
       <Card.Img variant="top" src={item.val.imageLink} />
       <Card.Body>
         <Card.Title>{item.val.itemName}</Card.Title>
         <Card.Subtitle className="mb-2 text-muted">
           ${item.val.itemPrice}
         </Card.Subtitle>
         <Card.Text style={{ fontSize: 12 }}>
           {item.val.itemDescription}
         </Card.Text>
         <Button variant="primary" onClick={() => handleAddToCart(item.key)}>
           Add to Cart
         </Button>
         <Button variant="primary" onClick={() => handleDelete(item.key)}>
           Remove
         </Button>
       </Card.Body>
     </Card>
   ));

   return (
     <div>
       <label className="title">Liked</label>
       <img className="divider" src={divider} alt="divider" />
       {likedCards}
     </div>
   );
};

export { LikedProducts };

// what is displayed in Liked Products?
// - Items that user is interested but not buying at the moment (Display as Card object)
// what is displayed in each Liked Product Card object?
// - Seller Name, Item Image, Item Name, Item Price, Add to Cart buttion