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

//-------------------
// Buy
//-----------------
app.put('/:id/buy', (req, res) => {
  Product.findByIdAndUpdate(req.params.id, { $inc: { qty: -1 } }, (error, data) => {
    res.redirect('/')
  })
})

//--------------
// Index
//-----------------
app.get('/', (req, res) => {
  Product.find({}, (error, allProducts) => {
    res.render(
      'index.ejs',
      {
        products: allProducts
        ,currentUser: req.session.currentUser
      })
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
        description: "Here You Come Again is the nineteenth solo studio album by Dolly Parton. It was released on October 3, 1977, by RCA Victor. It was Parton's first album to be certified platinum by the Recording Industry Association of America, for shipping a million copies.",
        genre: 'Country',
        price: 25,
        qty: 4,
      },
      {
        title: 'As Long as You Are',
        artist: 'Future Islands',
        img: 'https://media.pitchfork.com/photos/5f7e50e31efa8e109cd44dcc/1:1/w_320/as%20long%20as%20you%20are_future%20islands.jpg',
        description: 'As Long as You Are is the sixth studio album by American synth-pop band Future Islands, released on October 9, 2020.',
        genre: 'Synthpop',
        price: 32,
        qty: 7,
      },
      {
        title: '1956-57 Studio Sessions',
        artist: 'Dizzy Gillespie',
        img: 'https://arkivjazz.com/content/images/thumbs/0073533_complete-1956-57-studio-sessions-spa_550.jpeg',
        description: 'Contains the complete original studio sessions Dizzy Gillespie made showcasing his wonderful big band of the mid-Fifties, which featured such talents as Quincy Jones, Lee Morgan, Joe Gordon, Melba Liston, Al Grey, Phil Woods, Benny Golson and Wynton Kelly.',
        genre: 'Jazz',
        price: 39,
        qty: 2,
      },
      {
        title: "You're the Man",
        artist: 'Marvin Gaye',
        img: 'https://upload.wikimedia.org/wikipedia/en/thumb/c/cd/Marvin_Gaye_-_You%27re_the_Man.png/220px-Marvin_Gaye_-_You%27re_the_Man.png',
        description: "You're the Man is a posthumous studio album by American singer Marvin Gaye, originally intended to be released in 1972 as the follow-up to What's Going On.",
        genre: 'Soul, Funk',
        price: 32,
        qty: 6,
      },
      {
        title: 'Channel Orange',
        artist: 'Frank Ocean',
        img: 'https://upload.wikimedia.org/wikipedia/en/thumb/2/28/Channel_ORANGE.jpg/220px-Channel_ORANGE.jpg',
        description: 'Channel Orange is the debut studio album by American R&B singer and songwriter Frank Ocean. It was released on July 10, 2012, by Def Jam Recordings.',
        genre: 'Neo Soul',
        price: 32,
        qty: 4,
      },
      {
        title: 'Always on My Mind',
        artist: 'Willie Nelson',
        img: 'https://upload.wikimedia.org/wikipedia/en/thumb/2/2a/Willie-Nelson-Always-on-My-Mind.jpg/220px-Willie-Nelson-Always-on-My-Mind.jpg',
        description: 'Always on My Mind is the twenty-seventh studio album by country singer Willie Nelson. It was the Billboard number one country album of the year for 1982, and stayed 253 weeks on the Billboard Top Country',
        genre: 'Country',
        price: 27,
        qty: 4,
      },
      {
        title: 'Big O',
        artist: 'Roy Orbison',
        img: 'https://upload.wikimedia.org/wikipedia/en/thumb/a/af/Big_O_-_Roy_Orbison.jpg/220px-Big_O_-_Roy_Orbison.jpg',
        description: "The Big O is the fifteenth music album recorded by Roy Orbison, and according to Marcel Riesco's official Roy Orbison discography, his second for London Records in the United Kingdom.",
        genre: 'Rock and Roll',
        price: 25,
        qty: 2,
      },
      {
        title: '3 Feet High and Rising',
        artist: 'De La Soul',
        img: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/5a/DeLaSoul3FeetHighandRisingalbumcover.jpg/220px-DeLaSoul3FeetHighandRisingalbumcover.jpg',
        description: '3 Feet High and Rising is the debut studio album by American hip hop group De La Soul, released on March 3, 1989 by Tommy Boy Records.',
        genre: 'Hip Hop',
        price: 32,
        qty: 3,
      },
      {
        title: 'RTJ4',
        artist: 'Run the Jewels',
        img: 'https://upload.wikimedia.org/wikipedia/en/thumb/a/af/Run_the_Jewels_-_RTJ4.png/220px-Run_the_Jewels_-_RTJ4.png',
        description: 'RTJ4 is the fourth studio album by American hip hop duo Run the Jewels. It was released digitally through their own Jewel Runners imprint via BMG Rights Management on June 3, 2020, two days earlier than scheduled, with physical editions released in September 2020.',
        genre: 'Hip Hop',
        price: 39,
        qty: 7,
      },
      {
        title: 'Jolene',
        artist: 'Dolly Parton',
        img: 'https://upload.wikimedia.org/wikipedia/en/thumb/a/ab/Jolene_%28Dolly_Parton_album_-_cover_art%29.jpg/220px-Jolene_%28Dolly_Parton_album_-_cover_art%29.jpg',
        description: 'Jolene is the thirteenth solo studio album by Dolly Parton. It was released on February 4, 1974, by RCA Victor. The title track, "Jolene", tells the tale of a housewife confronting a beautiful seductress who she believes is having an affair with her husband.',
        genre: 'Counrty',
        price: 29,
        qty: 4,
      },
      {
        title: 'Lemonade',
        artist: 'Beyoncé Knowles',
        img: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/53/Beyonce_-_Lemonade_%28Official_Album_Cover%29.png/220px-Beyonce_-_Lemonade_%28Official_Album_Cover%29.png',
        description: 'Lemonade is the sixth solo studio album by American singer Beyoncé. It was released on April 23, 2016 by Parkwood Entertainment and Columbia Records, accompanied by a sixty-five-minute film of the same title on HBO.',
        genre: 'R&B',
        price: 36,
        qty: 1,
      },
      {
        title: 'On the Water',
        artist: 'Future Islands',
        img: 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a5/OntheWateralbum.jpg/220px-OntheWateralbum.jpg',
        description: 'On the Water is the third album by synthpop band Future Islands. The album was released on 11 October 2011 on Thrill Jockey records. ',
        genre: 'Synthpop',
        price: 32,
        qty: 6,
      },
      {
        title: 'A Love Supreme',
        artist: 'John Coltrane',
        img: 'https://upload.wikimedia.org/wikipedia/en/thumb/9/9a/John_Coltrane_-_A_Love_Supreme.jpg/220px-John_Coltrane_-_A_Love_Supreme.jpg',
        description: 'A Love Supreme is an album by American jazz saxophonist John Coltrane. He recorded it in one session on December 9, 1964, at Van Gelder Studio in Englewood Cliffs, New Jersey, leading a quartet featuring pianist McCoy Tyner, bassist Jimmy Garrison, and drummer Elvin Jones. ',
        genre: 'Jazz',
        price: 42,
        qty: 2,
      },
      {
        title: 'Kind of Blue',
        artist: 'Miles Davis',
        img: 'https://upload.wikimedia.org/wikipedia/en/thumb/9/9c/MilesDavisKindofBlue.jpg/220px-MilesDavisKindofBlue.jpg',
        description: "Kind of Blue is a studio album by American jazz trumpeter Miles Davis. It was recorded on March 2 and April 22, 1959, at Columbia's 30th Street Studio in New York City, and released on August 17 of that year by Columbia Records.",
        genre: 'Jazz',
        price: 36,
        qty: 5,
      },
      {
        title: 'Wild is the Wind',
        artist: 'Nina Simone',
        img: 'https://upload.wikimedia.org/wikipedia/en/e/e7/Ninasimonewildisthewind.jpg',
        description: "Wild Is the Wind is the sixth studio album by American singer and pianist Nina Simone released by Philips Records in 1966. The album was compiled from several recordings that were left over from sessions for previous Philips albums. ",
        genre: 'Jazz Blues',
        price: 42,
        qty: 3,
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
if(req.session.currentUser){
  Product.findById(req.params.id, (error, foundProduct) => {
    res.render(
      'show.ejs',
      {
        products: foundProduct
        ,currentUser: req.session.currentUser
      })
  })
} else {
  res.redirect('/sessions/new')
  }
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
