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
import { Orders } from "./Resources/Orders";
import { Sales } from "./Resources/Sales";

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
                userdpname: user.email.toString(),
              });
            }
          })
          .catch((error) => {
            console.error(error);
          });

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
          profilePicURL: "",
        });
      }
    });
  }, []);

  return (
    <div>
      <Routes>
        <Route path="/" element={<Nav info={userInfo} />}>
          <Route path="newsfeed" element={<Newsfeed info={userInfo} />} />
          <Route path="login" element={<Login info={userInfo} />} />
          <Route path="createaccount" element={<Create info={userInfo} />} />
          <Route path="profile" element={<Profile info={userInfo} />} />
          <Route
            path="profile/uploadpicture"
            element={<UploadPicture info={userInfo} setter={setuserInfo} />}
          />
          <Route
            path="profile/likedproduct"
            element={<LikedProducts info={userInfo} />}
          />
          <Route
            path="profile/allorders"
            element={<AllOrders info={userInfo} />}
          />
          <Route
            path="profile/allorders/trackorderstatus"
            element={<TrackOrderStatus info={userInfo} />}
          />
          <Route
            path="profile/orderhistory"
            element={<OrderHistory info={userInfo} />}
          />
          <Route path="profile/paymentmethod" element={<PaymentMethod />} />
          <Route path="search" element={<Search />} />
          <Route path="upload" element={<Upload info={userInfo} />} />
          <Route path="cart" element={<Cart info={userInfo} />} />
          <Route path="orders" element={<Orders info={userInfo} />} />
          <Route path="sales" element={<Sales info={userInfo} />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
