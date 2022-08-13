import React, { useDeferredValue, useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import "./App.css";

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
        setuserInfo({
          userIsLoggedIn: true,
          userID: user.uid,
          userdpname: user.email,
        });
      } else {
        setuserInfo({
          userIsLoggedIn: false,
          userID: "",
          userdpname: "",
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
            element={<UploadPicture info={userInfo} />}
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
