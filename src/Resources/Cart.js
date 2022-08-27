import React, { useState, useEffect } from "react";
import {
  push,
  onChildAdded,
  onChildRemoved,
  ref as databaseRef,
  update,
  set,
  get,
  equalTo,
  onValue,
  DataSnapshot,
} from "firebase/database";
import { database } from "../firebase";
import { Outlet, Link, Navigate } from "react-router-dom";
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
const ITEMS_FOLDER_NAME = "items";
const USER_CART_NAME = "cart";
const USER_ORDERS_NAME = "orders";
const Cart = (props) => {
  const [userCartItems, setUserCartItems] = useState([]);
  const [itemsData, setItemsData] = useState([]);

  useEffect(() => {
    const cartRef = databaseRef(
      database,
      `${USERS_FOLDER_NAME}/${props.info.userID}/${USER_CART_NAME}`
    );
    onChildAdded(cartRef, (data) => {
      setUserCartItems((prevState) => [...prevState, { key: data.key }]);
    });
  }, []);

  useEffect(() => {
    const itemsRef = databaseRef(database, ITEMS_FOLDER_NAME);
    onChildAdded(itemsRef, (data) => {
      setItemsData((prev) => [...prev, { key: data.key, val: data.val() }]);
    });
  }, []);

  useEffect(() => {
    const cartRef = databaseRef(
      database,
      `${USERS_FOLDER_NAME}/${props.info.userID}/${USER_CART_NAME}`
    );
    onChildRemoved(cartRef, (data) => {
      setUserCartItems((prev) => {
        return prev.filter((cartItems) => cartItems.key !== data.key);
      });
    });
  }, []);

  console.log("logging user cart outside useEffect:");
  console.log(userCartItems);

  const handleOrder = (itemOrdered, event) => {
    event.preventDefault();
    const ordersListRef = databaseRef(
      database,
      `${USERS_FOLDER_NAME}/${props.info.userID}/${USER_ORDERS_NAME}`
    );
    const newOrderRef = push(ordersListRef);
    const index = userCartItems.findIndex((item) => item.key === itemOrdered);
    console.log(index);
    console.log(itemOrdered);
    set(newOrderRef, userCartItems[index]);
    handleDelete(itemOrdered);
  };

  const handleDelete = (itemDeleted, event) => {
    const updates = {};
    updates[
      `/${USERS_FOLDER_NAME}/${props.info.userID}/${USER_CART_NAME}/${itemDeleted}`
    ] = null;
    update(databaseRef(database), updates);
  };

  let cartCards = userCartItems.map((item) => {
    let itemData = itemsData.find((element) => element.key === item.key);
    return (
      <Card className="cartBox" key={itemData.key}>
        <Card.Img
          variant="top"
          className="cartImage"
          src={itemData.val.itemImage}
        />
        <Card.Body>
          <Card.Title>{itemData.val.itemName}</Card.Title>
          <Card.Subtitle>${itemData.val.itemPrice}</Card.Subtitle>
          <Card.Text style={{ fontSize: 15 }}>
            {itemData.val.itemDescription}
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
    );
  });

  return (
    <div>
      {props.info.userIsLoggedIn ? (
        <Container className="cartPage">
          <Row className="cartTitleBar">
            <Link to="/newsfeed">
              <CaretLeft set="bold" primaryColor="#2FF522" />
            </Link>
            <label className="cartTitle">Cart</label>
          </Row>
          <Row className="cartDivider">
            <img src={divider} alt="divider" />
          </Row>
          <div className="cartCenterViewBox">{cartCards}</div>
        </Container>
      ) : (
        <Navigate to="/login" replace={true} />
      )}
    </div>
  );
};

export { Cart };

// what to display in cart?
// - Items added by user with intention to buy (Display as Card objects)
// - Items added are retrieved from user object
// what is displayed in each Item Card?
// - Seller Name, Item Image, Item Name, Item Price, Item Quantity (Add & Minus option), Delete button
