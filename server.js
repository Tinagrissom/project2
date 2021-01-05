//------------------
//DEPENDENCIES
//----------------
const express = require('express')
const methodOverride = require('method-override')
const mongoose = require('mongoose')
const session = require('express-session')
const Product = require('./models/products.js')


//-------------
// Configuration
//--------------------------
require('dotenv').config()
const app = express()
//setting db as our connection
const db = mongoose.connection
//makes it so we can access on Horoku or at port 3003 locally
const PORT = process.env.PORT || 3003
const MONGODB_URI = process.env.MONGODB_URI

//--------------
// Middleware
//----------------
app.use(express.static('public'))
app.use(methodOverride('_method'))
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
)


//--------------
// Database
//---------------
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
})

db.on('error', (err) => console.log(err.message + ' is Mongod not running?'));
db.on('connected', () => console.log('mongo connected: ', MONGODB_URI));
db.on('disconnected', () => console.log('mongo disconnected'));

//--------------
// Controllers
//---------------
const userController = require('./controllers/users_controllers.js')
app.use('/users', userController)
const sessionsController = require('./controllers/sessions_controllers.js')
app.use('/sessions', sessionsController)

const isAuthenticated = (req, res, next) => {
  if(req.session.currentUser){
    return next()
  } else {
    res.redirect('/sessions/new')
  }
}

//--------------
// Index
//-----------------
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

//--------
// New
//--------
app.get('/new', (req, res) => {
  res.render('new.ejs')
})

//-------
// Edit
//-----------
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

//----------------
// Create
//-----------------
app.post('/', (req, res) => {
  Product.create(req.body, (error, createdProduct) => {
    res.redirect('/')
  })
})

//--------------
// Seed Route
//-----------------
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
        title: '1956-57 Studio Sessions',
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
      },
      {
        title: 'Always on My Mind',
        artist: 'Willie Nelson',
        img: 'https://upload.wikimedia.org/wikipedia/en/thumb/2/2a/Willie-Nelson-Always-on-My-Mind.jpg/220px-Willie-Nelson-Always-on-My-Mind.jpg',
        genre: 'Country',
        price: 27,
        qty: 4,
      },
      {
        title: 'Big O',
        artist: 'Roy Orbison',
        img: 'https://upload.wikimedia.org/wikipedia/en/thumb/a/af/Big_O_-_Roy_Orbison.jpg/220px-Big_O_-_Roy_Orbison.jpg',
        genre: 'Rock and Roll',
        price: 25,
        qty: 2,
      },
      {
        title: '3 Feet High and Rising',
        artist: 'De La Soul',
        img: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/5a/DeLaSoul3FeetHighandRisingalbumcover.jpg/220px-DeLaSoul3FeetHighandRisingalbumcover.jpg',
        genre: 'Hip Hop',
        price: 32,
        qty: 3,
      },
      {
        title: 'Jolene',
        artist: 'Dolly Parton',
        img: 'https://upload.wikimedia.org/wikipedia/en/thumb/a/ab/Jolene_%28Dolly_Parton_album_-_cover_art%29.jpg/220px-Jolene_%28Dolly_Parton_album_-_cover_art%29.jpg',
        genre: 'Counrty',
        price: 29,
        qty: 4,
      },
      {
        title: 'On the Water',
        artist: 'Future Islands',
        img: 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a5/OntheWateralbum.jpg/220px-OntheWateralbum.jpg',
        genre: 'Synthpop',
        price: 32,
        qty: 6,
      },
      {
        title: 'A Love Supreme',
        artist: 'John Coltrane',
        img: 'https://upload.wikimedia.org/wikipedia/en/thumb/9/9a/John_Coltrane_-_A_Love_Supreme.jpg/220px-John_Coltrane_-_A_Love_Supreme.jpg',
        genre: 'Jazz',
        price: 42,
        qty: 2,
      }
    ],
    (error, data) => {
      res.redirect('/')
    }
  )
})

//-----------------
// Update
//-----------------
app.put('/:id', (req, res) => {
  Product.findByIdAndUpdate(req.params.id, req.body, {new:true},
  (error, updated) => {
    res.redirect('/')
  })
})


//------------
// Show
//----------------
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

//-------------
// Delete
//-------------
app.delete('/:id', (req, res) => {
  Product.findByIdAndRemove(req.params.id, (error, data) => {
    res.redirect('/')
  })
})


app.listen(PORT, () => {
  console.log('Listening on port: ', PORT)
})
