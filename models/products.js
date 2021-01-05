const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: String,
  img: String,
  description: String,
  genre: String,
  price: {type: Number, min: 0},
  qty: {type: Number, min: 0},
})

const Product = mongoose.model('Product', productSchema)

module.exports = Product;
