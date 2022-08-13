import React from "react";
import { Outlet, Link } from "react-router-dom";

const TrackOrderStatus = () => {
  return <div>this is the ordertracking page</div>;
};

export { TrackOrderStatus };

// what is displayed in Track Order Status?
// - Individual order's delivery status
// - Item Image, Estimated Delivery Date, Tracking Number, Delivery Status (Vertical Stepper).