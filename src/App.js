import React, { useDeferredValue, useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "./firebase";
import "./App.css";

import { Nav } from "./Resources/NavBar";
import { AllOrders } from "./Resources/AllOrders.js";
import { Cart } from "./Resources/Cart.js";
import { ChangePassword } from "./Resources/ChangePassword.js";
import { LikedProducts } from "./Resources/LikedProducts.js";
import { Login } from "./Resources/Login.js";
import { Newsfeed } from "./Resources/Newsfeed";
import { OrderHistory } from "./Resources/OrderHistory.js";
import { PaymentMethod } from "./Resources/PaymentMethod.js";
import { Profile } from "./Resources/Profile.js";
import { Search } from "./Resources/Search.js";
import { TrackOrderStatus } from "./Resources/TrackOrderStatus.js";
import { Upload } from "./Resources/Upload.js";
import { UploadPicture } from "./Resources/uploadpicture.js";
import { Orders } from "./Resources/Orders";
import { Sales } from "./Resources/Sales";

const App = () => {
  const [userInfo, setuserInfo] = useState({
    userIsLoggedIn: false,
    userID: "",
    userdpname: "",
    username: "",
  });

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setuserInfo({
          userIsLoggedIn: true,
          userID: user.uid,
          userdpname: user.email,
          username: () => {
            const index = user.email.indexOf("@");
            var userid = user.email.substring(0, index);
            return userid;
          },
        });
      } else {
        setuserInfo({
          userIsLoggedIn: false,
          userID: "",
          userdpname: "",
          username: "",
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
          <Route path="profile" element={<Profile info={userInfo} />} />
          <Route path="profile/uploadpicture" element={<UploadPicture />} />
          <Route path="profile/changepassword" element={<ChangePassword />} />
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
          <Route path="orders" element={<Orders />} />
          <Route path="sales" element={<Sales />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
