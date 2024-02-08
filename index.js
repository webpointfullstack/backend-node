const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

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
  const { title, description, price, image } = request.body;

  products.push({
    id: "104",
    title: title,
    description: description,
    price: price,
    image: image,
  });
  response.json({ message: "Product added successfully" });
});

app.put("/products/:id", (request, response) => {
  const { id } = request.params;
  const { title, description, price, image } = request.body;

  const product = products.find((product) => product.id === id);

  product.title = title;
  product.description = description;
  product.price = price;
  product.image = image;

  response.json({ message: "Product updated successfully" });
});

app.delete("/products/:id", (request, response) => {
  const { id } = request.params;

  const productIndex = products.findIndex((product) => product.id === id);

  products.splice(productIndex, 1);

  response.json({ products: products });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
