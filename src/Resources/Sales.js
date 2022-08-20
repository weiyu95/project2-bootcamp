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
import { Outlet, Link } from "react-router-dom";
import "./cssfiles/Cart.css";
//***imports from images folder***
import divider from "./images/NavBar Divider.svg";
import deletesvg from "./images/Delete.svg";
import walletsvg from "./images/Wallet.svg";
//***imports from react-bootstrap***
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
//***imports from react-iconly***
import { CaretLeft } from "react-iconly";

const USERS_FOLDER_NAME = "users";
const USER_ORDERS_NAME = `${USERS_FOLDER_NAME}/user/orders`;

const Sales = ({ user }) => {
  const [userCartItems, setUserCartItems] = useState([]);

  useEffect(() => {
    const userRef = databaseRef(database, `${USERS_FOLDER_NAME}/user/cart`);
    onChildAdded(userRef, (data) => {
      setUserCartItems((prevState) => [
        ...prevState,
        { key: data.key, val: data.val() },
      ]);
    });
  }, []);

  useEffect(() => {
    const userRef = databaseRef(database, `${USERS_FOLDER_NAME}/user/cart`);
    onChildRemoved(userRef, (data) => {
      setUserCartItems((prev) => {
        return prev.filter((cartItems) => cartItems.key !== data.key);
      });
    });
  }, []);

  console.log("logging user cart outside useEffect:");
  console.log(userCartItems);

  const handleOrder = (itemOrdered, event) => {
    event.preventDefault();
    const ordersListRef = databaseRef(database, USER_ORDERS_NAME);
    const newOrderRef = push(ordersListRef);
    const index = userCartItems.findIndex((item) => item.key === itemOrdered);
    console.log(index);
    console.log(itemOrdered);
    set(newOrderRef, userCartItems[index]);
    handleDelete(itemOrdered);
  };

  const handleDelete = (itemDeleted, event) => {
    event.preventDefault();
    const updates = {};
    updates[`/${USERS_FOLDER_NAME}/user/cart/${itemDeleted}`] = null;
    update(databaseRef(database), updates);
  };

  let cartCards = userCartItems.map((item) => (
    <Card className="cartBox" key={item.key}>
      <Card.Img variant="top" src={item.val.imageLink} />
      <Card.Body>
        <Card.Title>{item.val.itemName}</Card.Title>
        <Card.Subtitle>${item.val.itemPrice}</Card.Subtitle>
        <Card.Text style={{ fontSize: 15 }}>
          {item.val.itemDescription}
        </Card.Text>
        <Button
          className="buttonBox"
          variant="primary"
          onClick={(event) => handleOrder(item.key, event)}
        >
          <img src={walletsvg} alt="Wallet svg" /> Order
        </Button>
        <Button
          className="buttonBox"
          variant="primary"
          onClick={(event) => handleDelete(item.key, event)}
        >
          <img src={deletesvg} alt="Delete svg" /> Delete
        </Button>
      </Card.Body>
    </Card>
  ));

  return (
    <Container className="cartPage">
      This is Sales Page
      <Row className="cartTitleBar">
        <Link to="/profile/allorders">
          <CaretLeft set="bold" primaryColor="#2FF522" />
        </Link>
        <label className="cartTitle">Sales</label>
      </Row>
      <Row className="cartDivider">
        <img src={divider} alt="divider" />
      </Row>
      <div className="cartCenterViewBox">{cartCards}</div>
    </Container>
  );
};

export { Sales };

// what to display in cart?
// - Items added by user with intention to buy (Display as Card objects)
// - Items added are retrieved from user object
// what is displayed in each Item Card?
// - Seller Name, Item Image, Item Name, Item Price, Item Quantity (Add & Minus option), Delete button
