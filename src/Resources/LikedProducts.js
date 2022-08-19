import React from "react";
import { Outlet, Link } from "react-router-dom";

const LikedProducts = () => {
  return <div>this is for the liked products page</div>;
};

export { LikedProducts };

// what is displayed in Liked Products?
// - Items that user is interested but not buying at the moment (Display as Card object)
// what is displayed in each Liked Product Card object?
// - Seller Name, Item Image, Item Name, Item Price, Add to Cart buttion