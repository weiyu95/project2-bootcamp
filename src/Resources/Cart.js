import React, { useState, useEffect } from "react";
import { onChildAdded, ref as databaseRef } from "firebase/database";
import { database } from "../firebase";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Outlet, Link } from "react-router-dom";

const USERS_FOLDER_NAME = "users";

const Cart = ({ user }) => {
  const [userCartItems, setUserCartItems] = useState([]);

  useEffect(() => {
    const userRef = databaseRef(database, `${USERS_FOLDER_NAME}/${user}/cart`);
    onChildAdded(userRef, (data) => {
      setUserCartItems([...data, { key: data.key, val: data.val() }]);
    });
  });

  let cartCards = userCartItems.map((item) => (
    <Card style={{ width: "18rem" }} key={item.key}>
      <Card.Img variant="top" src={item.val.imageLink} />
      <Card.Body>
        <Card.Title>{item.val.itemName}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          {item.val.itemPrice}
        </Card.Subtitle>
        <Card.Text style={{ fontSize: 20 }}>
          {item.val.itemDescription}
        </Card.Text>
        <Button variant="primary">Place Order</Button>
        <Button variant="primary">Remove from Cart</Button>
      </Card.Body>
    </Card>
  ));

  return cartCards.reverse();
};

export { Cart };

// what to display in cart?
// - Items added by user with intention to buy (Display as Card objects)
// - Items added are retrieved from user object
// what is displayed in each Item Card?
// - Seller Name, Item Image, Item Name, Item Price, Item Quantity (Add & Minus option), Delete button
