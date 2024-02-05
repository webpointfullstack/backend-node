const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());

const products = [
  {
    id: "100",
    title: "Iphone 15",
    description: "This is iphone 15",
    price: "200000",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/IPhone_15_Pro_Vector.svg/186px-IPhone_15_Pro_Vector.svg.png",
  },
  {
    id: "101",
    title: "Iphone 14",
    description: "This is iphone 14",
    price: "200000",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/IPhone_15_Pro_Vector.svg/186px-IPhone_15_Pro_Vector.svg.png",
  },
  {
    id: "102",
    title: "Iphone 13",
    description: "This is iphone 13",
    price: "200000",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/IPhone_15_Pro_Vector.svg/186px-IPhone_15_Pro_Vector.svg.png",
  },
  {
    id: "103",
    title: "Iphone 12",
    description: "This is iphone 12",
    price: "200000",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/IPhone_15_Pro_Vector.svg/186px-IPhone_15_Pro_Vector.svg.png",
  },
];

app.get("/products", (request, response) => {
  response.json(products);
});

app.post("/products", (request, response) => {
  products.push({
    id: "104",
    title: "Iphone 10",
    description: "This is iphone 10",
    price: "20000",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/IPhone_15_Pro_Vector.svg/186px-IPhone_15_Pro_Vector.svg.png",
  });
  response.json({ message: "Product added successfully" });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
