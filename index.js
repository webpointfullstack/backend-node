const express = require("express");
const cors = require("cors");
const { prisma } = require("./prisma");
const multer = require("multer");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./storage/");
  },
  filename: function (req, file, cb) {
    cb(null, "unique_" + file.originalname);
  },
});

const upload = multer({ storage: storage });

const app = express();

app.use(cors());
app.use(express.json());

app.use("/storage", express.static("storage"));

// const products = [
//   {
//     id: "100",
//     title: "Iphone 15",
//     description: "This is iphone 15",
//     price: "200000",
//     image:
//       "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/IPhone_15_Pro_Vector.svg/186px-IPhone_15_Pro_Vector.svg.png",
//   },
//   {
//     id: "101",
//     title: "Iphone 14",
//     description: "This is iphone 14",
//     price: "200000",
//     image:
//       "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/IPhone_15_Pro_Vector.svg/186px-IPhone_15_Pro_Vector.svg.png",
//   },
//   {
//     id: "102",
//     title: "Iphone 13",
//     description: "This is iphone 13",
//     price: "200000",
//     image:
//       "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/IPhone_15_Pro_Vector.svg/186px-IPhone_15_Pro_Vector.svg.png",
//   },
//   {
//     id: "103",
//     title: "Iphone 12",
//     description: "This is iphone 12",
//     price: "200000",
//     image:
//       "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/IPhone_15_Pro_Vector.svg/186px-IPhone_15_Pro_Vector.svg.png",
//   },
// ];

async function checkAuth(request, response, next) {
  const token = request.headers.authorization;

  if (!token) {
    response.json({ message: "Not Logged in" });
    return;
  }

  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY);
    request.user_id = decoded.id;
    next();
  } catch (error) {
    response.json({ message: "Invalid Token" });
  }
}

app.get("/products", async (request, response) => {
  const products = await prisma.product.findMany();

  response.json({ products: products });
});

app.get("/products/:id", async (request, response) => {
  const { id } = request.params;

  const product = await prisma.product.findUnique({
    where: { id: parseInt(id) },
  });

  response.json({ product: product });
});

app.post("/products", async (request, response) => {
  const { title, description, price } = request.body;
  const image = request.file;

  // products.push({
  //   id: "104",
  //   title: title,
  //   description: description,
  //   price: price,
  //   image: image,
  // });

  if (price < 0) {
    response.json({ message: "Price needs to be greater than 0" });
    return;
  }

  const product = await prisma.product.create({
    data: {
      title: title,
      description: description,
      price: price,
      image: "image.path",
    },
  });

  response.json({ message: "Product added successfully", product: product });
});

app.put("/products/:id", upload.single("image"), async (request, response) => {
  const { id } = request.params;
  const { title, description, price, image } = request.body;

  // const product = products.find((product) => product.id === id);

  // product.title = title;
  // product.description = description;
  // product.price = price;
  // product.image = image;

  const product = await prisma.product.update({
    where: { id: parseInt(id) },
    data: {
      title: title,
      description: description,
      price: price,
      image: image,
    },
  });

  response.json({ message: "Product updated successfully", product: product });
});

app.delete("/products/:id", async (request, response) => {
  const { id } = request.params;

  await prisma.product.delete({ where: { id: parseInt(id) } });

  response.json({ products: products });
});

app.post("/register", async (request, response) => {
  const { name, email, password, balance } = request.body;

  const salt = await bcrypt.genSaltSync(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await prisma.user.create({
    data: {
      name: name,
      email: email,
      password: hashedPassword,
      balance: balance,
    },
  });

  const jwtToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY);

  response.json({ message: "Success", token: jwtToken });
});

app.post("/login", async (request, response) => {
  const { email, password } = request.body;

  const userExists = await prisma.user.findUnique({
    where: {
      email: email,
    },
    include: {
      favourites: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!userExists) {
    response.json({ message: "User does not exist" });
    return;
  }

  const isPasswordValid = await bcrypt.compare(password, userExists.password);

  if (!isPasswordValid) {
    response.json({ message: "Incorrect Password" });
    return;
  }

  const jwtToken = jwt.sign({ id: userExists.id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1h",
  });

  response.json({ message: "Success", token: jwtToken, user: userExists });
});

// app.post("/verify", async (request, response) => {
//   const { token } = request.body;

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
//     response.json({ message: "Success", user: decoded });
//   } catch (error) {
//     response.json({ message: "Invalid Token" });
//   }
// });

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

app.get("/balance", checkAuth, async (request, response) => {
  const id = request.user_id;

  const user = await prisma.user.findUnique({ where: { id: parseInt(id) } });

  response.json({ balance: user.balance });
});

app.post("/favorites", checkAuth, async (request, response) => {
  const id = request.user_id;

  const { product_id } = request.body;

  const favourite = await prisma.favourites.create({
    data: {
      product_id: product_id,
      user_id: id,
    },
  });

  response.json({
    message: "Product added to favourites",
    favourite: favourite,
  });
});
