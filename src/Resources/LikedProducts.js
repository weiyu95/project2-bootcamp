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
import "./cssfiles/Liked.css";
//***imports from images folder***
import divider from "./images/NavBar Divider.svg";
import deletesvg from "./images/Delete.svg";
import cartsvg from "./images/Cart.svg";
//***imports from react-bootstrap***
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
//***imports from react-iconly***
import { CaretLeft } from "react-iconly";

const USERS_FOLDER_NAME = "users";
const USER_CART_NAME = `${USERS_FOLDER_NAME}/user/cart`;

const LikedProducts = ({ user }) => {
  const [userLikedItems, setUserLikedItems] = useState([]);

  useEffect(() => {
    const userRef = databaseRef(database, `${USERS_FOLDER_NAME}/user/liked`);
    onChildAdded(userRef, (data) => {
      setUserLikedItems((prevState) => [
        ...prevState,
        { key: data.key, val: data.val() },
      ]);
    });
  }, []);

  useEffect(() => {
    const userRef = databaseRef(database, `${USERS_FOLDER_NAME}/user/liked`);
    onChildRemoved(userRef, (data) => {
      setUserLikedItems((prev) => {
        return prev.filter((likedItems) => likedItems.key !== data.key);
      });
    });
  }, []);

  const handleAddToCart = (itemAddedToCart, event) => {
    event.preventDefault();
    const ordersListRef = databaseRef(database, USER_CART_NAME);
    const newOrderRef = push(ordersListRef);
    const index = userLikedItems.findIndex(
      (item) => item.key === itemAddedToCart
    );
    console.log(index);
    console.log(itemAddedToCart);
    set(newOrderRef, userLikedItems[index]);
    handleDelete(itemAddedToCart);
  };

  const handleDelete = (itemDeleted, event) => {
    event.preventDefault();
    const newArray = userLikedItems.filter(
      (likedItems) => likedItems.key !== itemDeleted
    );
    setUserLikedItems(newArray);
    const updates = {};
    updates[`/${USERS_FOLDER_NAME}/user/liked/${itemDeleted}`] = null;
    update(databaseRef(database), updates);
  };

  let likedCards = userLikedItems.map((item) => (
    <Card className="likedBox" key={item.key}>
      <Card.Img variant="top" src={item.val.imageLink} />
      <Card.Body>
        <Card.Title>{item.val.itemName}</Card.Title>
        <Card.Subtitle>
          ${item.val.itemPrice}
        </Card.Subtitle>
        <Card.Text style={{ fontSize: 15 }}>
          {item.val.itemDescription}
        </Card.Text>
        <Button
          className="likedButtonBox"
          variant="primary"
          onClick={(event) => handleAddToCart(item.key, event)}
        >
          <img src={cartsvg} alt="Cart svg" /> Add to Cart
        </Button>
        <Button
          className="likedButtonBox"
          variant="primary"
          onClick={(event) => handleDelete(item.key, event)}
        >
          <img src={deletesvg} alt="Delete svg" /> Delete
        </Button>
      </Card.Body>
    </Card>
  ));

  return (
    <Container className="likedPage">
      <Row className="likedTitleBar">
        <Link to="/newsfeed">
          <CaretLeft set="bold" primaryColor="#2FF522" />
        </Link>
        <label className="likedTitle">Liked Products</label>
      </Row>
      <Row className="likedDivider">
        <img src={divider} alt="divider" />
      </Row>
      <div className="likedCenterViewBox">{likedCards}</div>
    </Container>
  );
};

export { LikedProducts };

// what is displayed in Liked Products?
// - Items that user is interested but not buying at the moment (Display as Card object)
// what is displayed in each Liked Product Card object?
// - Seller Name, Item Image, Item Name, Item Price, Add to Cart buttion
