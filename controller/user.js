const { prisma } = require("../config/prisma");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function register(request, response) {
  const { name, email, password, balance } = request.body;

  const salt = bcrypt.genSaltSync(10);
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
}

async function login(request, response) {
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
}

async function balance(request, response) {
  const id = request.user_id;

  const user = await prisma.user.findUnique({ where: { id: parseInt(id) } });

  response.json({ balance: user.balance });
}

module.exports = {
  register,
  login,
  balance,
};
