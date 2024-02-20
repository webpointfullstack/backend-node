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

module.exports = checkAuth;
