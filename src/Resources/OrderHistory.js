import React, { useState, useEffect } from "react";
import { Outlet, Link } from "react-router-dom";
import { onChildAdded, ref as databaseRef } from "firebase/database";
import { database } from "../firebase";
import "./cssfiles/OrderHistory.css";
//***imports from images folder***
import divider from "./images/NavBar Divider.svg";
//***imports from react-bootstrap***
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
//***imports from react-iconly***
import { CaretLeft } from "react-iconly";

const USERS_FOLDER_NAME = "users";
const USER_ORDER_HISTORY_NAME = "orderHistory";
const ITEMS_FOLDER_NAME = "items";

const OrderHistory = (props) => {
  const [userOrderedHistory, setUserOrderedHistory] = useState([]);
  const [itemsData, setItemsData] = useState([]);

  useEffect(() => {
    const orderRef = databaseRef(
      database,
      `${USERS_FOLDER_NAME}/${props.info.userID}/${USER_ORDER_HISTORY_NAME}`
    );
    onChildAdded(orderRef, (data) => {
      setUserOrderedHistory((prevState) => [
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

  const renderCard = (userOrdered) => {
    const card = userOrdered.map((item) => {
      let itemData = itemsData.find((element) => element.key === item.val.key);
      if (!itemData) {
        return <></>;
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
            <div className="deliveryStatus">
              Order Status: {itemData.val.deliveryStatus}
            </div>
          </Card.Body>
        </Card>
      );
    });
    return card;
  };

  return (
    <Container className="pageBody">
      <Row className="pageTitleBar">
        <Link to="/profile">
          <CaretLeft set="bold" primaryColor="#2FF522" />
        </Link>
        <label className="orderHistoryTitle">Order History</label>
      </Row>
      <Row className="pageDivider">
        <img src={divider} alt="divider" />
      </Row>
      <div className="cardCenterViewBox">{renderCard(userOrderedHistory)}</div>
      <div className="extraSpace"></div>
    </Container>
  );
};

export { OrderHistory };

// what is displayed in Order History?
// - Past purchases (Displayed as Card object)
// what is displayed in each Past purchase card?
// - Seller Name, Item Image, Item Name, Item Price, Item Quantity, Order Total, Delivery Status
