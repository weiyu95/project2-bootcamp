import React, { useState } from "react";
import { push, ref as databaseRef, set } from "firebase/database";
import { database, storage } from "../firebase";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import { Outlet, Link, Navigate } from "react-router-dom";
import "./cssfiles/Upload.css";
//***imports from images folder***
import divider from "./images/NavBar Divider.svg";
//***imports from react-bootstrap***
// import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
//***imports from react-iconly***
import { CaretLeft } from "react-iconly";

const UPLOAD_IMAGES_FOLDER_NAME = "ItemStorage";
const ITEMS_FOLDER_NAME = "items";

const Upload = (props) => {
  const initialState = {
    itemName: "",
    itemPrice: 0,
    itemDescription: "",
    itemSalesStatus: "available",
    sellerUserId: props.info.userID,
  };

  const [newUpload, setNewUpload] = useState(initialState);
  console.log(props);

  const [imageUpload, setImageUpload] = useState({
    imageInputValue: "",
    imageInputFile: null,
  });

  const handleNewUpload = (event) => {
    const { name, value } = event.target;
    setNewUpload({
      ...newUpload,
      [name]: value,
    });
  };

  const handleImageUpload = (event) => {
    setImageUpload({
      imageInputValue: event.target.value,
      imageInputFile: event.target.files[0],
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("this is newupload");
    console.log(!newUpload);
    const fileRef = storageRef(
      storage,
      `${UPLOAD_IMAGES_FOLDER_NAME}/${props.info.userID}/${imageUpload.imageInputFile.name}`
    );

    uploadBytes(fileRef, imageUpload.imageInputFile).then(() => {
      getDownloadURL(fileRef).then((downloadUrl) => {
        const itemsListRef = databaseRef(database, ITEMS_FOLDER_NAME);
        const newItemRef = push(itemsListRef);
        set(newItemRef, {
          ...newUpload,
          itemImage: downloadUrl,
        });
        setNewUpload(initialState);
        setImageUpload({ imageInputValue: "", imageInputFile: null });
      });
    });
  };

  return (
    <div>
      {props.info.userIsLoggedIn ? (
        <Container className="uploadPage">
          <Row className="uploadTitleBar">
            <Link to="/newsfeed">
              <CaretLeft set="bold" primaryColor="#2FF522" />
            </Link>
            <label className="uploadTitle">Upload</label>
          </Row>
          <Row className="uploadDivider">
            <img src={divider} alt="divider" />
          </Row>
          <Row className="bodyBox">
            <label className="titleLabel">
              What do you want to sell today?
            </label>
            <Row className="inputBox">
              <form onSubmit={handleSubmit}>
                <label for="itemName" className="uploadLabel">
                  Item Name
                </label>
                <input
                  className="textBox"
                  type="text"
                  id="itemName"
                  name="itemName"
                  value={newUpload.itemName}
                  onChange={handleNewUpload}
                  required
                />

                <label for="itemPrice" className="uploadLabel">
                  Item Price
                </label>
                <div class="currency-wrap">
                  <span class="currency-code">$</span>
                  <input
                    className="textBox"
                    type="number"
                    id="itemPrice"
                    name="itemPrice"
                    min={1}
                    value={newUpload.itemPrice}
                    onChange={handleNewUpload}
                    required
                  />
                </div>

                <label for="itemImage" className="uploadLabel">
                  Item Image
                </label>
                <input
                  className="textBox"
                  type="file"
                  id="itemImage"
                  name="itemImage"
                  value={imageUpload.imageInputValue}
                  onChange={handleImageUpload}
                  required
                />

                <label for="itemName" className="uploadLabel">
                  Item Description
                </label>
                <textarea
                  id="itemDescription"
                  name="itemDescription"
                  rows="3"
                  value={newUpload.itemDescription}
                  onChange={handleNewUpload}
                  required
                />

                <Button className="buttonBox" type="submit">
                  Start Selling!
                </Button>
              </form>
            </Row>
          </Row>
        </Container>
      ) : (
        <Navigate to="/login" replace={true} />
      )}
    </div>
  );
};

export { Upload };
