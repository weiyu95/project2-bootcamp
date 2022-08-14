import React, { useState, useEffect } from "react";
import {
  push,
  onChildAdded,
  onChildRemoved,
  ref as databaseRef,
  update,
  set,
  onChildChanged,
} from "firebase/database";
import { database } from "../firebase";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Outlet, Link } from "react-router-dom";

const USERS_FOLDER_NAME = "users";
const USER_ORDERS_NAME = `${USERS_FOLDER_NAME}/user/orders`;

const Cart = ({ user }) => {
  const [userCartItems, setUserCartItems] = useState([]);

  useEffect(() => {
    const userRef = databaseRef(database, `${USERS_FOLDER_NAME}/user/cart`);
    onChildAdded(userRef, (data) => {
      setUserCartItems((prevState) => [
        ...prevState,
        { key: data.key, val: data.val() },
      ]);
    });
    onChildRemoved(userRef, (data) => {
      console.log(`${data.val().itemName} removed.`);
      //onChildRemoved & onChildChange could not get userCartItems.
      console.log(`current cart: ${userCartItems}`); 
    });
  }, []);

  // useEffect(() => {
  //   const userRef = databaseRef(database, `${USERS_FOLDER_NAME}/user/cart`);
  //   onChildChanged(userRef, (data) => {
  //     console.log(`data fetched by onchildchanged: ${data}`);
  //     console.log(`before adding new cart: ${userCartItems}`);
  //     setUserCartItems((prevState) => [
  //       ...prevState,
  //       { key: data.key, val: data.val() },
  //     ]);
  //   });
  //   console.log(userCartItems);
  // })

  // useEffect(() => {
  //   const userRef = databaseRef(database, `${USERS_FOLDER_NAME}/user/cart`);
  //   onChildRemoved(userRef, (data) => {
  //     console.log(`data: ${data}`)
  //     const newArray = userCartItems.filter(
  //       (cartItems) => cartItems.key !== data
  //     );
  //     console.log(`New array: ${newArray}`);
  //     setUserCartItems(newArray);
  //     console.log(`New user cart: ${userCartItems}`);
  //   });
  // }, []);

  console.log(`logging user cart outside useEffect: ${userCartItems}`);

  const handleOrder = (itemOrdered) => {
    const ordersListRef = databaseRef(database, USER_ORDERS_NAME);
    const newOrderRef = push(ordersListRef);
    const index = userCartItems.findIndex((item) => item.key === itemOrdered);
    console.log(index);
    console.log(itemOrdered);
    set(newOrderRef, userCartItems[index]);
    handleDelete(itemOrdered);
  };

  const handleDelete = (itemDeleted) => {
    const newArray = userCartItems.filter((cartItems) => cartItems.key !== itemDeleted)
    setUserCartItems(newArray);
    const updates = {};
    updates[`/${USERS_FOLDER_NAME}/user/cart/${itemDeleted}`] = null;
    update(databaseRef(database), updates);
  };

  let cartCards = userCartItems.map((item) => (
    <Card style={{ width: "18rem", position: "center" }} key={item.key}>
      <Card.Img variant="top" src={item.val.imageLink} />
      <Card.Body>
        <Card.Title>{item.val.itemName}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          ${item.val.itemPrice}
        </Card.Subtitle>
        <Card.Text style={{ fontSize: 20 }}>
          {item.val.itemDescription}
        </Card.Text>
        <Button variant="primary" onClick={() => handleOrder(item.key)}>
          Order
        </Button>
        <Button variant="primary" onClick={() => handleDelete(item.key)}>
          Remove
        </Button>
      </Card.Body>
    </Card>
  ));

  return cartCards;
};

export { Cart };

// what to display in cart?
// - Items added by user with intention to buy (Display as Card objects)
// - Items added are retrieved from user object
// what is displayed in each Item Card?
// - Seller Name, Item Image, Item Name, Item Price, Item Quantity (Add & Minus option), Delete button
