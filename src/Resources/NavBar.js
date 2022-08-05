import React from "react";
import { Home, Search, Plus, Buy, User } from "react-iconly";
import { Outlet, Link } from "react-router-dom";
import "./NavBar.css";

const Nav = () => {
  return (
    <>
      <Outlet />
      <div className="navbar">
        <ul className="navbar li">
          <li>
            <Link to="/newsfeed">
              <Home set="bold" primaryColor="black" />
            </Link>
          </li>
          <li>
            <Link to="/search">
              <Search set="Light-Outline" primaryColor="#878D98" />
            </Link>
          </li>
          <li>
            <Link to="/upload">
              <Plus set="Light-Outline" primaryColor="#878D98" />
            </Link>
          </li>
          <li>
            <Link to="/cart">
              <Buy set="Light-Outline" primaryColor="#878D98" />
            </Link>
          </li>
          <li>
            <Link to="/profile">
              <div className="profile">
                <User set="bold" primaryColor="#878D98" />
              </div>
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
};

export { Nav };
