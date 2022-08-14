import "./App.css";

import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth, database } from "./firebase";
import { ref, get, child, set } from "firebase/database";

import { Nav } from "./Resources/NavBar";
import { AllOrders } from "./Resources/AllOrders.js";
import { Cart } from "./Resources/Cart.js";
import { LikedProducts } from "./Resources/LikedProducts.js";
import { Login } from "./Resources/Login.js";
import { Create } from "./Resources/CreateUseraccount.js";
import { Newsfeed } from "./Resources/Newsfeed";
import { OrderHistory } from "./Resources/OrderHistory.js";
import { PaymentMethod } from "./Resources/PaymentMethod.js";
import { Profile } from "./Resources/Profile.js";
import { Search } from "./Resources/Search.js";
import { TrackOrderStatus } from "./Resources/TrackOrderStatus.js";
import { Upload } from "./Resources/Upload.js";
import { UploadPicture } from "./Resources/uploadpicture.js";

const App = () => {
  const [userInfo, setuserInfo] = useState({
    userIsLoggedIn: false,
    userID: "",
    userdpname: "",
    profilePicURL: "",
  });

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const dbref = ref(database, "users");
        get(child(dbref, user.uid))
          .then((snapshot) => {
            if (snapshot.exists()) {
              setuserInfo({
                userIsLoggedIn: true,
                userID: user.uid,
                userdpname: user.email,
                profilePicURL: snapshot.val().profilePicURL,
              });
            } else {
              setuserInfo({
                userIsLoggedIn: true,
                userID: user.uid,
                userdpname: user.email,
                profilePicURL: "",
              });
              const newUser = child(dbref, user.uid);
              set(newUser, {
                cart: "",
                liked: "",
                orderHistory: "",
                profilePicURL: "",
              });
            }
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        setuserInfo({
          userIsLoggedIn: false,
          userID: "",
          userdpname: "",
          profilePicURL: "",
        });
      }
    });
  }, []);

  return (
    <div>
      <Routes>
        <Route path="/" element={<Nav info={userInfo} />}>
          <Route path="newsfeed" element={<Newsfeed />} />
          <Route path="login" element={<Login info={userInfo} />} />
          <Route path="createaccount" element={<Create info={userInfo} />} />
          <Route path="profile" element={<Profile info={userInfo} />} />
          <Route
            path="profile/uploadpicture"
            element={<UploadPicture info={userInfo} setter={setuserInfo} />}
          />
          <Route path="profile/likedproduct" element={<LikedProducts />} />
          <Route path="profile/allorders" element={<AllOrders />} />
          <Route
            path="profile/allorders/trackorderstatus"
            element={<TrackOrderStatus />}
          />
          <Route path="profile/orderhistory" element={<OrderHistory />} />
          <Route path="profile/paymentmethod" element={<PaymentMethod />} />
          <Route path="search" element={<Search />} />
          <Route path="upload" element={<Upload />} />
          <Route path="cart" element={<Cart />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
