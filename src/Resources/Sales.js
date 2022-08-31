import React, { useState, useEffect } from "react";
import {
  onChildAdded,
  onChildRemoved,
  ref as databaseRef,
  update,
} from "firebase/database";
import { database } from "../firebase";
import { Outlet, Link } from "react-router-dom";
import "./cssfiles/Sales.css";
//***imports from images folder***
import divider from "./images/NavBar Divider.svg";
//***imports from react-bootstrap***
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
//***imports from react-iconly***
import { CaretLeft } from "react-iconly";

const USERS_FOLDER_NAME = "users";
const ITEMS_FOLDER_NAME = "items";
const USER_SALES_NAME = "sales";
const ITEM_DELIVERY_STATUS_NAME = "deliveryStatus";

const Sales = (props) => {
  const [userSalesItems, setUserCartItems] = useState([]);
  const [itemsData, setItemsData] = useState([]);
  const [selectStatus, setSelectStatus] = useState("Prepaing Shipment");

  useEffect(() => {
    const salesRef = databaseRef(
      database,
      `${USERS_FOLDER_NAME}/${props.info.userID}/${USER_SALES_NAME}`
    );
    onChildAdded(salesRef, (data) => {
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
    const salesRef = databaseRef(
      database,
      `${USERS_FOLDER_NAME}/${props.info.userID}/${USER_SALES_NAME}`
    );
    onChildRemoved(salesRef, (data) => {
      setUserCartItems((prev) => {
        return prev.filter((salesItems) => salesItems.key !== data.key);
      });
    });
  }, []);

  const handleSelect = (event) => {
    setSelectStatus(event.target.value);
  };

  const handleDeliveryStatus = (event, itemSold) => {
    event.preventDefault();
    const updates = {};
    updates[
      `/${ITEMS_FOLDER_NAME}/${itemSold}/${ITEM_DELIVERY_STATUS_NAME}`
    ] = selectStatus;
    update(databaseRef(database), updates);
    console.log(itemSold);
    console.log(selectStatus);
  };

  const renderCard = (userCart) => {
    const card = userCart.map((item) => {
      let itemData = itemsData.find((element) => element.key === item.key);
      console.log(itemsData);
      if (!itemData) {
        return <></>;
      }
      return (
        <Card className="salesBox" key={itemData.key}>
          <Card.Img
            variant="top"
            className="salesImage"
            src={itemData.val.itemImage}
          />
          <Card.Body>
            <Card.Title>{itemData.val.itemName}</Card.Title>
            <Card.Subtitle>${itemData.val.itemPrice}</Card.Subtitle>
            <Card.Text style={{ fontSize: 15 }}>
              {itemData.val.itemDescription}
            </Card.Text>
            {itemData.val.deliveryStatus === "Delivered" ? (
              <div className="salesStatus">
                Order Status: {itemData.val.deliveryStatus}
              </div>
            ) : (
              <form onSubmit={(event) => handleDeliveryStatus(event, item.key)}>
                <label>
                  Delivery Status:
                  <select
                    value={selectStatus}
                    className="salesButtonBox"
                    onChange={handleSelect}
                  >
                    <option value="Preparing Shipment">
                      Preparing Shipment
                    </option>
                    <option value="Collected by Logistic Partner">
                      Collected by Logistic Partner
                    </option>
                    <option value="Out for Delivery">Out for Delivery</option>
                  </select>
                </label>
                <input
                  type="submit"
                  value="Submit"
                  className="salesButtonBox"
                />
              </form>
            )}
          </Card.Body>
        </Card>
      );
    });
    return card;
  };

  return (
    <Container className="cartPage">
      <Row className="cartTitleBar">
        <Link to="/profile/allorders">
          <CaretLeft set="bold" primaryColor="#2FF522" />
        </Link>
        <label className="cartTitle">Sales</label>
      </Row>
      <Row className="cartDivider">
        <img src={divider} alt="divider" />
      </Row>
      <div className="cartCenterViewBox">{renderCard(userSalesItems)}</div>
      <div className="extraSpace"></div>
    </Container>
  );
};

export { Sales };

// what to display in cart?
// - Items added by user with intention to buy (Display as Card objects)
// - Items added are retrieved from user object
// what is displayed in each Item Card?
// - Seller Name, Item Image, Item Name, Item Price, Item Quantity (Add & Minus option), Delete button
