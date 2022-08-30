import React, { useState, useEffect } from "react";
import {
  onChildAdded,
  onChildRemoved,
  ref as databaseRef,
  update,
} from "firebase/database";
import { database } from "../firebase";
import { Outlet, Link } from "react-router-dom";
import "./cssfiles/Orders.css";
//***imports from images folder***
import divider from "./images/NavBar Divider.svg";
import walletsvg from "./images/Wallet.svg";
//***imports from react-bootstrap***
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
//***imports from react-iconly***
import { CaretLeft } from "react-iconly";

const USERS_FOLDER_NAME = "users";
const USER_ORDERS_NAME = "orders";
const USER_ORDER_HISTORY_NAME = "orderHistory";
const ITEMS_FOLDER_NAME = "items";
const ITEM_DELIVERY_STATUS_NAME = "deliveryStatus";

const Orders = (props) => {
  const [userOrderedItems, setUserOrderedItems] = useState([]);
  const [itemsData, setItemsData] = useState([]);

  useEffect(() => {
    const orderRef = databaseRef(
      database,
      `${USERS_FOLDER_NAME}/${props.info.userID}/${USER_ORDERS_NAME}`
    );
    onChildAdded(orderRef, (data) => {
      setUserOrderedItems((prevState) => [
        ...prevState,
        { key: data.key, val: data.val() },
      ]);
    });
  }, []);
  console.log("User Orders");
  console.log(userOrderedItems);

  useEffect(() => {
    const itemsRef = databaseRef(database, ITEMS_FOLDER_NAME);
    onChildAdded(itemsRef, (data) => {
      setItemsData((prev) => [...prev, { key: data.key, val: data.val() }]);
    });
  }, []);

  useEffect(() => {
    const orderRef = databaseRef(
      database,
      `${USERS_FOLDER_NAME}/${props.info.userID}/${USER_ORDERS_NAME}`
    );
    onChildRemoved(orderRef, (data) => {
      setUserOrderedItems((prev) => {
        return prev.filter((orderedItems) => orderedItems.key !== data.key);
      });
    });
  }, []);

  const handleOrderComplete = (itemReceived, event) => {
    event.preventDefault();
    const index = userOrderedItems.findIndex(
      (item) => item.key === itemReceived
    );
    console.log(index);
    console.log(userOrderedItems[0].val);
    const updates = {};
    updates[
      `/${ITEMS_FOLDER_NAME}/${itemReceived}/${ITEM_DELIVERY_STATUS_NAME}`
    ] = "Completed";
    updates[
      `/${USERS_FOLDER_NAME}/${props.info.userID}/${USER_ORDER_HISTORY_NAME}/${itemReceived}`
    ] = userOrderedItems[index].val;
    update(databaseRef(database), updates);
  };

  const renderCard = (userOrdered) => {
    const card = userOrdered.map((item) => {
      let itemData = itemsData.find((element) => element.key === item.val.key);
      if (!itemData) {
        return <></>;
      }
      return (
        <Card className="orderBox" key={itemData.key}>
          <Card.Img
            variant="top"
            className="orderImage"
            src={itemData.val.itemImage}
          />
          <Card.Body>
            <Card.Title>{itemData.val.itemName}</Card.Title>
            <Card.Subtitle>${itemData.val.itemPrice}</Card.Subtitle>
            <Card.Text style={{ fontSize: 15 }}>
              {itemData.val.itemDescription}
            </Card.Text>
            <div className="orderStatus">
              Order Status: {itemData.val.deliveryStatus}
            </div>
            <Button
              className="orderButtonBox"
              variant="primary"
              onClick={(event) => handleOrderComplete(item.key, event)}
            >
              <img src={walletsvg} alt="Wallet svg" /> Order Received
            </Button>
          </Card.Body>
        </Card>
      );
    });
    return card;
  };

  return (
    <Container className="orderPage">
      <Row className="orderTitleBar">
        <Link to="/profile/allorders">
          <CaretLeft set="bold" primaryColor="#2FF522" />
        </Link>
        <label className="orderTitle">Orders</label>
      </Row>
      <Row className="cartDivider">
        <img src={divider} alt="divider" />
      </Row>
      <div className="cartCenterViewBox">{renderCard(userOrderedItems)}</div>
      <div className="extraSpace"></div>
    </Container>
  );
};

export { Orders };

// what to display in cart?
// - Items added by user with intention to buy (Display as Card objects)
// - Items added are retrieved from user object
// what is displayed in each Item Card?
// - Seller Name, Item Image, Item Name, Item Price, Item Quantity (Add & Minus option), Delete button
