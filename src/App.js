import React from "react";
import { Routes, Route } from "react-router-dom";
import logo from "./logo.png";
import "./App.css";

import { Nav } from "./Resources/NavBar";
import { AllOrders } from "./Resources/AllOrders.js";
import { Cart } from "./Resources/Cart.js";
import { ChangePassword } from "./Resources/changepassword.js";
import { LikedProducts } from "./Resources/likedproducts.js";
import { Login } from "./Resources/login.js";
import { Newsfeed } from "./Resources/newsfeed";
import { OrderHistory } from "./Resources/OrderHistory.js";
import { PaymentMethod } from "./Resources/PaymentMethod.js";
import { Profile } from "./Resources/profile.js";
import { Search } from "./Resources/Search.js";
import { TrackOrderStatus } from "./Resources/TrackOrderStatus.js";
import { Upload } from "./Resources/Upload.js";

class App extends React.Component {
  render() {
    return (
      <div>
        <Routes>
          <Route path="/" element={<Nav />} />
          <Route path="newsfeed" element={<Newsfeed />} />
          <Route path="login" element={<Login />} />
          <Route path="profile" element={<Profile />} />
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
        </Routes>
      </div>
    );
  }
}

export default App;
