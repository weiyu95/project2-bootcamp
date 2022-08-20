import React from "react";
import { Home, Search, Plus, Buy, User } from "react-iconly";
import { Outlet, Link, useLocation } from "react-router-dom";
import "./cssfiles/NavBar.css";

const Nav = (props) => {
  const location = useLocation();
  return (
    <>
      <Outlet />
      <div className="btmbar">
        <ul className="btmbar li">
          <li>
            <Link to="/newsfeed">
              <Home
                set="bold"
                primaryColor={
                  location.pathname === "/newsfeed" ? "black" : "#878D98"
                }
              />
            </Link>
          </li>
          <li>
            <Link to="/search">
              <Search
                set="Light-Outline"
                primaryColor={
                  location.pathname === "/search" ? "black" : "#878D98"
                }
              />
            </Link>
          </li>
          <li>
            <Link to="/upload">
              <Plus
                set="Light-Outline"
                primaryColor={
                  location.pathname === "/upload" ? "black" : "#878D98"
                }
              />
            </Link>
          </li>
          <li>
            <Link to="/cart">
              <Buy
                set="Light-Outline"
                primaryColor={
                  location.pathname === "/cart" ? "black" : "#878D98"
                }
              />
            </Link>
          </li>
          <li>
            {props.info.userIsLoggedIn ? (
              <Link to="/profile">
                <div className="profile">
                  <User
                    set="bold"
                    primaryColor={
                      location.pathname === "/profile" ? "black" : "#878D98"
                    }
                  />
                </div>
              </Link>
            ) : (
              <Link to="/login">
                {" "}
                <div className="profile">
                  <User
                    set="bold"
                    primaryColor={
                      location.pathname === "/login" ? "black" : "#878D98"
                    }
                  />
                </div>
              </Link>
            )}
          </li>
        </ul>
      </div>
    </>
  );
};

export { Nav };
