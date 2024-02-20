async function getAllProducts(request, response) {
  const products = await prisma.product.findMany();

  response.json({ products: products });
}

async function getProductByID(request, response) {
  const { id } = request.params;

  const product = await prisma.product.findUnique({
    where: { id: parseInt(id) },
  });

  response.json({ product: product });
}

async function createProduct(request, response) {
  const { title, description, price } = request.body;
  const image = request.file;

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
}

async function updateProduct(request, response) {
  const { id } = request.params;
  const { title, description, price, image } = request.body;

  const product = await prisma.product.update({
    where: { id: parseInt(id) },
    data: {
      title: title,
      description: description,
      price: price,
      image: image,
    },
  });

  response.json({
    message: "Product updated successfully",
    product: product,
  });
}

async function deleteProduct(request, response) {
  const { id } = request.params;

  await prisma.product.delete({ where: { id: parseInt(id) } });

  response.json({ products: products });
}

module.exports = {
  getAllProducts,
  getProductByID,
  createProduct,
  updateProduct,
  deleteProduct,
};
