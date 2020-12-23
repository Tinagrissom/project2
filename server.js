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

app.get('/', (req, res) => {
  Product.find({}, (error, allProducts) => {
    res.render(
      'index.ejs',
      {
        products: allProducts
      }
    )
  })
})

app.get('/seed', (req, res) => {
  Product.create(
    [
      {
        title: 'Here You Come Again',
        artist: 'Dolly Parton',
        img: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/47/Hereyoucomeagain.jpg/220px-Hereyoucomeagain.jpg',
        genre: 'Country',
        price: 25,
        qty: 4,
      },
      {
        title: 'As Long as You Are',
        artist: 'Future Islands',
        img: 'https://media.pitchfork.com/photos/5f7e50e31efa8e109cd44dcc/1:1/w_320/as%20long%20as%20you%20are_future%20islands.jpg',
        genre: 'Synthpop',
        price: 32,
        qty: 7,
      },
      {
        title: 'The Complete 1956-57 Studio Sessions',
        artist: 'Dizzy Gillespie',
        img: 'https://arkivjazz.com/content/images/thumbs/0073533_complete-1956-57-studio-sessions-spa_550.jpeg',
        genre: 'Jazz',
        price: 39,
        qty: 2,
      },
      {
        title: "You're the Man",
        artist: 'Marvin Gaye',
        img: 'https://upload.wikimedia.org/wikipedia/en/thumb/c/cd/Marvin_Gaye_-_You%27re_the_Man.png/220px-Marvin_Gaye_-_You%27re_the_Man.png',
        genre: 'Soul, Funk',
        price: 32,
        qty: 6,
      },
      {
        title: 'Channel Orange',
        artist: 'Frank Ocean',
        img: 'https://upload.wikimedia.org/wikipedia/en/thumb/2/28/Channel_ORANGE.jpg/220px-Channel_ORANGE.jpg',
        genre: 'Neo Soul',
        price: 32,
        qty: 4,
      }
    ],
    (error, data) => {
      res.redirect('/')
    }
  )
})

app.put('/:id', (req, res) => {
  Product.findByIdAndUpdate(req.params.id, req.body, {new:true},
  (error, updated) => {
    res.redirect('/')
  })
})

app.get('/:id/edit', (req, res) => {
  Product.findById(req.params.id, (error, foundProduct) => {
    res.render(
      'edit.ejs',
      {
        products: foundProduct
      }
    )
  })
})

app.get('/:id', (req, res) => {
  Product.findById(req.params.id, (error, foundProduct) => {
    res.render(
      'show.ejs',
      {
        products: foundProduct
      }
    )
  })
})

app.delete('/:id', (req, res) => {
  Product.findByIdAndRemove(req.params.id, (error, data) => {
    res.redirect('/')
  })
})


app.listen(PORT, () => {
  console.log('Listening on port: ', PORT)
})
