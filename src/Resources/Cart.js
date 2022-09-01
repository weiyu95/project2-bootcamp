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
const ITEM_DELIVERY_STATUS_NAME = "deliveryStatus";
const ITEM_SALES_STATUS_NAME = "itemSalesStatus";

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
    // set(newOrderRef, itemOrdered);
    const updates = {};
    updates[
      `/${ITEMS_FOLDER_NAME}/${itemOrdered}/${ITEM_DELIVERY_STATUS_NAME}`
    ] = "Preparing shipment";
    updates[`/${ITEMS_FOLDER_NAME}/${itemOrdered}/${ITEM_SALES_STATUS_NAME}`] =
      "Unavailable";
    update(databaseRef(database), updates);
    handleDelete(itemOrdered);
  };

  const handleDelete = (itemDeleted) => {
    const updates = {};
    updates[
      `/${USERS_FOLDER_NAME}/${props.info.userID}/${USER_CART_NAME}/${itemDeleted}`
    ] = null;
    update(databaseRef(database), updates);
  };

  const renderCard = (userCart) => {
    const card = userCart.map((item) => {
      let itemData = itemsData.find((element) => element.key === item.key);
      if (!itemData){
        return <></>
      }
      return (
        <Card className="cardBox" key={itemData.key}>
          <Card.Img
            variant="top"
            className="cardImage"
            src={itemData.val.itemImage}
          />
          <Card.Body>
            <Card.Title>{itemData.val.itemName}</Card.Title>
            <Card.Subtitle>${itemData.val.itemPrice}</Card.Subtitle>
            <Card.Text style={{ fontSize: 15 }}>
              {itemData.val.itemDescription}
            </Card.Text>
            <Button
              className="btnBox"
              variant="primary"
              onClick={(event) => handleOrder(item.key, event)}
            >
              <img src={walletsvg} alt="Wallet svg" /> Order
            </Button>
            <Button
              className="btnBox"
              variant="primary"
              onClick={() => handleDelete(item.key)}
            >
              <img src={deletesvg} alt="Delete svg" /> Delete
            </Button>
          </Card.Body>
        </Card>
      );
    });
    return card;
  };

  return (
    <div>
      {props.info.userIsLoggedIn ? (
        <Container className="pageBody">
          <div className="pageTitleBar">
            <Link to="/newsfeed">
              <CaretLeft set="bold" primaryColor="#2FF522" />
            </Link>
            <label className="pageTitle">Cart</label>
          </div>
          <Row className="pageDivider">
            <img src={divider} alt="divider" />
          </Row>
          <div className="cardCenterViewBox">{renderCard(userCartItems)}</div>
          <div className="extraSpace"></div>
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
