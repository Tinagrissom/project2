//------------------
//DEPENDENCIES
//----------------
const express = require('express')
const methodOverride = require('method-override')
const mongoose = require('mongoose')
const app = express()
const Product = require('./models/products.js')
//setting db as our connection
const db = mongoose.connection
require('dotenv').config()

//-----------
//PORT
//------------
//makes it so we can access on Horoku or at port 3003 locally
const PORT = process.env.PORT || 3003

const MONGODB_URI = process.env.MONGODB_URI

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
})

db.on('error', (err) => console.log(err.message + ' is Mongod not running?'));
db.on('connected', () => console.log('mongo connected: ', MONGODB_URI));
db.on('disconnected', () => console.log('mongo disconnected'));

app.use(express.static('public'))

app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(methodOverride('_method'))

app.get('/homepage', (req, res) => {
  Product.find({}, (error, allProducts) => {
    res.render(
      'index.ejs',
      {
        products: allProducts
      }
    )
  })
})

app.get('/homepage/seed', (req, res) => {
  Product.create(
    [
      {
        title: 'Here You Come Again',
        artist: 'Dolly Parton',
        img: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/47/Hereyoucomeagain.jpg/220px-Hereyoucomeagain.jpg',
        genre: 'Country',
        price: 25,
        qty: 4,
      }
    ],
    (error, data) => {
      res.redirect('/homepage')
    }
  )
})


app.listen(PORT, () => {
  console.log('Listening on port: ', PORT)
})
