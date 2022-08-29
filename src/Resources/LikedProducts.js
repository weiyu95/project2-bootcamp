import React, { useState, useEffect } from "react";
import {
  onChildAdded,
  onChildRemoved,
  ref as databaseRef,
  update,
} from "firebase/database";
import { database } from "../firebase";
import { Outlet, Link, Navigate } from "react-router-dom";
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
const ITEMS_FOLDER_NAME = "items";
const USER_CART_NAME = "cart";
const USER_LIKED_NAME = "liked";

const LikedProducts = (props) => {
  const [userLikedItems, setUserLikedItems] = useState([]);
  const [itemsData, setItemsData] = useState([]);

  useEffect(() => {
    const likedRef = databaseRef(
      database,
      `${USERS_FOLDER_NAME}/${props.info.userID}/${USER_LIKED_NAME}`
    );
    onChildAdded(likedRef, (data) => {
      setUserLikedItems((prevState) => [...prevState, { key: data.key }]);
    });
  }, []);

  useEffect(() => {
    const itemsRef = databaseRef(database, ITEMS_FOLDER_NAME);
    onChildAdded(itemsRef, (data) => {
      setItemsData((prev) => [...prev, { key: data.key, val: data.val() }]);
    });
  }, []);

  useEffect(() => {
    const likedRef = databaseRef(
      database,
      `${USERS_FOLDER_NAME}/${props.info.userID}/${USER_LIKED_NAME}`
    );
    onChildRemoved(likedRef, (data) => {
      setUserLikedItems((prev) => {
        return prev.filter((likedItems) => likedItems.key !== data.key);
      });
    });
  }, []);

  const handleAddToCart = (itemAddedToCart, event) => {
    event.preventDefault();
    const updates = {};
    updates[
      `/${USERS_FOLDER_NAME}/${props.info.userID}/${USER_CART_NAME}/${itemAddedToCart}`
    ] = "";
    console.log(itemAddedToCart);
    update(databaseRef(database), updates);
    handleDelete(itemAddedToCart);
  };

  const handleDelete = (itemDeleted) => {
    const updates = {};
    updates[
      `/${USERS_FOLDER_NAME}/${props.info.userID}/${USER_LIKED_NAME}/${itemDeleted}`
    ] = null;
    update(databaseRef(database), updates);
  };

  let likedCards = userLikedItems.map((item) => {
    let itemData = itemsData.find((element) => element.key === item.key);
    return (
      <Card className="likedBox" key={itemData.key}>
        <Card.Img variant="top" className="likedImage" src={itemData.val.itemImage} />
        <Card.Body>
          <Card.Title>{itemData.val.itemName}</Card.Title>
          <Card.Subtitle>${itemData.val.itemPrice}</Card.Subtitle>
          <Card.Text style={{ fontSize: 15 }}>
            {itemData.val.itemDescription}
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
            onClick={() => handleDelete(item.key)}
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
        <Container className="likedPage">
          <Row className="likedTitleBar">
            <Link to="/profile">
              <CaretLeft set="bold" primaryColor="#2FF522" />
            </Link>
            <label className="likedTitle">Liked Products</label>
          </Row>
          <Row className="likedDivider">
            <img src={divider} alt="divider" />
          </Row>
          <div className="likedCenterViewBox">{likedCards}</div>
        </Container>
      ) : (
        <Navigate to="/login" replace={true} />
      )}
    </div>
  );
};

export { LikedProducts };

// what is displayed in Liked Products?
// - Items that user is interested but not buying at the moment (Display as Card object)
// what is displayed in each Liked Product Card object?
// - Seller Name, Item Image, Item Name, Item Price, Add to Cart buttion
