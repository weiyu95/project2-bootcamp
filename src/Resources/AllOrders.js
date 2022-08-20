import React, { useState, useEffect } from "react";
import {
  push,
  onChildAdded,
  ref as databaseRef,
  update,
  set,
  onChildChanged,
} from "firebase/database";
import { database } from "../firebase";
import { Outlet, Link } from "react-router-dom";
import "./cssfiles/AllOrders.css";
//***imports from images folder***
import divider from "./images/NavBar Divider.svg";
import infosquaresvg from "./images/InfoSquare.svg";
//***imports from react-bootstrap***
import "bootstrap/dist/css/bootstrap.min.css";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
// import Col from "react-bootstrap/Col";
// import Nav from "react-bootstrap/Nav";
//***imports from react-iconly***
import { CaretLeft } from "react-iconly";

const USERS_FOLDER_NAME = "users";
const USER_ORDERS_NAME = `${USERS_FOLDER_NAME}/user/orders`;

const AllOrders = ({ user }) => {
  const [userOrderItems, setUserOrderItems] = useState([]);

  useEffect(() => {
    const userRef = databaseRef(database, `${USERS_FOLDER_NAME}/user/orders`);
    onChildAdded(userRef, (data) => {
      setUserOrderItems((prevState) => [
        ...prevState,
        { key: data.key, val: data.val() },
      ]);
    });
  }, []);

  //When order status changed to completed, move the completed orders to Orders History page and update All Orders Page.
  useEffect(() => {
    const userRef = databaseRef(database, `${USERS_FOLDER_NAME}/user/orders`);
    onChildChanged(userRef, (data) => {
      setUserOrderItems((prev) => {
        return prev.filter((cartItems) => cartItems.key !== data.key);
      });
    });
  }, []);
  
  const handleTrackOrder = (itemOrdered, event) => {
    event.preventDefault();
    const ordersListRef = databaseRef(database, USER_ORDERS_NAME);
    const newOrderRef = push(ordersListRef);
    const index = userOrderItems.findIndex((item) => item.key === itemOrdered);
    console.log(index);
    console.log(itemOrdered);
    set(newOrderRef, userOrderItems[index]);
  };

  let orderCards = userOrderItems.map((item) => (
    <Card className="allOrdersBox" key={item.key}>
      <Card.Img variant="top" src={item.val.imageLink} />
      <Card.Body>
        <Card.Title>{item.val.itemName}</Card.Title>
        <Card.Subtitle>${item.val.itemPrice}</Card.Subtitle>
        <Card.Text style={{ fontSize: 15 }}>
          {item.val.itemDescription}
        </Card.Text>
        <Button
          className="allOrdersButtonBox"
          variant="primary"
          onClick={(event) => handleTrackOrder(item.key, event)}
        >
          <img src={infosquaresvg} alt="InfoSquare svg" /> Track Order
        </Button>
      </Card.Body>
    </Card>
  ));

  return (
    <Container className="allOrdersPage">
      <Row className="allOrdersTitleBar">
        <Link to="/Profile">
          <CaretLeft set="bold" primaryColor="#2FF522" />
        </Link>
        <label className="allOrdersTitle">All Orders</label>
      </Row>
      <Row className="allOrdersDivider">
        <img src={divider} alt="divider" />
      </Row>
      <div className="allOrdersTabContainer">
        <Link to="/Orders">
          <Button
            className="allOrdersTabBox"
            variant="primary"
          >
            Orders
          </Button>
        </Link>
        <Link to="/Sales">
          <Button
            className="allOrdersTabBox"
            variant="primary"
          >
            Sales
          </Button>
        </Link>
      </div>

      <div className="allOrdersCenterViewBox">{orderCards}</div>
    </Container>
  );
};

export { AllOrders };

// what to be displayed in all orders?
// - Orders placed (display as Card objects)
// what is displayed in each order Card?
// - Seller Name, Item Image, Item Name, Item Price, Item Quantity, Order Total, Delivery Status (Link to Track Order Status)
