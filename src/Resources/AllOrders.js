import React from "react";
import { Outlet, Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";

const createData = (sellerId, shippingDate, orderStatus) => {
  return { sellerId, shippingDate, orderStatus };
};

const orders = [
  createData(1, "20/07/2022", "Ready for shipment"),
  createData(2, "22/07/2022", "QC inspection"),
  createData(3, "25/07/2022", "In Production"),
  createData(4, "30/07/2022", "In Production"),
  createData(5, "01/08/2022", "Preparing Material"),
];

const AllOrders = () => {
  return (
    <div>
      {orders.map((order) => (
        <Card style={{ width: "18rem" }} key={order.sellerId}>
          <Card.Img variant="top" src="holder.js/100px180?text=Image cap" />
          <Card.Body>
            <Card.Title>Card Title</Card.Title>
            <Card.Text>
              Some quick example text to build on the card title and make up the
              bulk of the card's content.
            </Card.Text>
          </Card.Body>
          <ListGroup className="list-group-flush">
            <ListGroup.Item>Cras justo odio</ListGroup.Item>
            <ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
            <ListGroup.Item>Vestibulum at eros</ListGroup.Item>
          </ListGroup>
          <Card.Body>
            <Card.Link href="#">Card Link</Card.Link>
            <Card.Link href="#">Another Link</Card.Link>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};

export { AllOrders };

// what to be displayed in all orders?
// - Orders placed (display as Card objects)
// what is displayed in each order Card?
// - Seller Name, Item Image, Item Name, Item Price, Item Quantity, Order Total, Delivery Status (Link to Track Order Status)
