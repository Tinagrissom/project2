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
        ours: 22,
        qty: 4,
      },
      {
        title: 'As Long as You Are',
        artist: 'Future Islands',
        img: 'https://media.pitchfork.com/photos/5f7e50e31efa8e109cd44dcc/1:1/w_320/as%20long%20as%20you%20are_future%20islands.jpg',
        description: 'As Long as You Are is the sixth studio album by American synth-pop band Future Islands, released on October 9, 2020.',
        genre: 'Synthpop',
        price: 32,
        ours: 28,
        qty: 7,
      },
      {
        title: '1956-57 Studio Sessions',
        artist: 'Dizzy Gillespie',
        img: 'https://arkivjazz.com/content/images/thumbs/0073533_complete-1956-57-studio-sessions-spa_550.jpeg',
        description: 'Contains the complete original studio sessions Dizzy Gillespie made showcasing his wonderful big band of the mid-Fifties, which featured such talents as Quincy Jones, Lee Morgan, Joe Gordon, Melba Liston, Al Grey, Phil Woods, Benny Golson and Wynton Kelly.',
        genre: 'Jazz',
        price: 39,
        ours: 37,
        qty: 2,
      },
      {
        title: "You're the Man",
        artist: 'Marvin Gaye',
        img: 'https://upload.wikimedia.org/wikipedia/en/thumb/c/cd/Marvin_Gaye_-_You%27re_the_Man.png/220px-Marvin_Gaye_-_You%27re_the_Man.png',
        description: "You're the Man is a posthumous studio album by American singer Marvin Gaye, originally intended to be released in 1972 as the follow-up to What's Going On.",
        genre: 'Soul, Funk',
        price: 32,
        ours: 28,
        qty: 6,
      },
      {
        title: 'Channel Orange',
        artist: 'Frank Ocean',
        img: 'https://upload.wikimedia.org/wikipedia/en/thumb/2/28/Channel_ORANGE.jpg/220px-Channel_ORANGE.jpg',
        description: 'Channel Orange is the debut studio album by American R&B singer and songwriter Frank Ocean. It was released on July 10, 2012, by Def Jam Recordings.',
        genre: 'Neo Soul',
        price: 32,
        ours: 29,
        qty: 4,
      },
      {
        title: 'Always on My Mind',
        artist: 'Willie Nelson',
        img: 'https://upload.wikimedia.org/wikipedia/en/thumb/2/2a/Willie-Nelson-Always-on-My-Mind.jpg/220px-Willie-Nelson-Always-on-My-Mind.jpg',
        description: 'Always on My Mind is the twenty-seventh studio album by country singer Willie Nelson. It was the Billboard number one country album of the year for 1982, and stayed 253 weeks on the Billboard Top Country',
        genre: 'Country',
        price: 27,
        ours: 25,
        qty: 4,
      },
      {
        title: 'Big O',
        artist: 'Roy Orbison',
        img: 'https://upload.wikimedia.org/wikipedia/en/thumb/a/af/Big_O_-_Roy_Orbison.jpg/220px-Big_O_-_Roy_Orbison.jpg',
        description: "The Big O is the fifteenth music album recorded by Roy Orbison, and according to Marcel Riesco's official Roy Orbison discography, his second for London Records in the United Kingdom.",
        genre: 'Rock and Roll',
        price: 25,
        ours: 22,
        qty: 2,
      },
      {
        title: '3 Feet High and Rising',
        artist: 'De La Soul',
        img: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/5a/DeLaSoul3FeetHighandRisingalbumcover.jpg/220px-DeLaSoul3FeetHighandRisingalbumcover.jpg',
        description: '3 Feet High and Rising is the debut studio album by American hip hop group De La Soul, released on March 3, 1989 by Tommy Boy Records.',
        genre: 'Hip Hop',
        price: 32,
        ours: 28,
        qty: 3,
      },
      {
        title: 'RTJ4',
        artist: 'Run the Jewels',
        img: 'https://upload.wikimedia.org/wikipedia/en/thumb/a/af/Run_the_Jewels_-_RTJ4.png/220px-Run_the_Jewels_-_RTJ4.png',
        description: 'RTJ4 is the fourth studio album by American hip hop duo Run the Jewels. It was released digitally through their own Jewel Runners imprint via BMG Rights Management on June 3, 2020, two days earlier than scheduled, with physical editions released in September 2020.',
        genre: 'Hip Hop',
        price: 39,
        ours: 36,
        qty: 7,
      },
      {
        title: 'Jolene',
        artist: 'Dolly Parton',
        img: 'https://upload.wikimedia.org/wikipedia/en/thumb/a/ab/Jolene_%28Dolly_Parton_album_-_cover_art%29.jpg/220px-Jolene_%28Dolly_Parton_album_-_cover_art%29.jpg',
        description: 'Jolene is the thirteenth solo studio album by Dolly Parton. It was released on February 4, 1974, by RCA Victor. The title track, "Jolene", tells the tale of a housewife confronting a beautiful seductress who she believes is having an affair with her husband.',
        genre: 'Counrty',
        price: 29,
        ours: 27,
        qty: 4,
      },
      {
        title: 'Lemonade',
        artist: 'Beyoncé Knowles',
        img: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/53/Beyonce_-_Lemonade_%28Official_Album_Cover%29.png/220px-Beyonce_-_Lemonade_%28Official_Album_Cover%29.png',
        description: 'Lemonade is the sixth solo studio album by American singer Beyoncé. It was released on April 23, 2016 by Parkwood Entertainment and Columbia Records, accompanied by a sixty-five-minute film of the same title on HBO.',
        genre: 'R&B',
        price: 36,
        ours: 34,
        qty: 1,
      },
      {
        title: 'On the Water',
        artist: 'Future Islands',
        img: 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a5/OntheWateralbum.jpg/220px-OntheWateralbum.jpg',
        description: 'On the Water is the third album by synthpop band Future Islands. The album was released on 11 October 2011 on Thrill Jockey records. ',
        genre: 'Synthpop',
        price: 32,
        ours: 28,
        qty: 6,
      },
      {
        title: 'A Love Supreme',
        artist: 'John Coltrane',
        img: 'https://upload.wikimedia.org/wikipedia/en/thumb/9/9a/John_Coltrane_-_A_Love_Supreme.jpg/220px-John_Coltrane_-_A_Love_Supreme.jpg',
        description: 'A Love Supreme is an album by American jazz saxophonist John Coltrane. He recorded it in one session on December 9, 1964, at Van Gelder Studio in Englewood Cliffs, New Jersey, leading a quartet featuring pianist McCoy Tyner, bassist Jimmy Garrison, and drummer Elvin Jones. ',
        genre: 'Jazz',
        price: 42,
        ours: 39,
        qty: 2,
      },
      {
        title: 'Kind of Blue',
        artist: 'Miles Davis',
        img: 'https://upload.wikimedia.org/wikipedia/en/thumb/9/9c/MilesDavisKindofBlue.jpg/220px-MilesDavisKindofBlue.jpg',
        description: "Kind of Blue is a studio album by American jazz trumpeter Miles Davis. It was recorded on March 2 and April 22, 1959, at Columbia's 30th Street Studio in New York City, and released on August 17 of that year by Columbia Records.",
        genre: 'Jazz',
        price: 36,
        ours: 32,
        qty: 5,
      },
      {
        title: 'The Wall',
        artist: 'Pink Floyd',
        img: 'https://cdn.pastemagazine.com/www/blogs/lists/assets_c/2012/05/pink-floyd-the-wall-cd-cover-19812-thumb-250x250-67332.jpeg',
        description: "The legacy of Pink Floyd was not cemented with just The Dark Side of the Moon. The Wall is one of the greatest concept albums of all time. It tells the tale of Pink, a troubled young man raised by an overprotective mother, who is trying to break down the wall in his mind that has been constructed by the authoritative figures in his life.",
        genre: 'Rock & Roll',
        price: 27,
        ours: 25,
        qty: 3,
      },
      {
        title: 'Bee Gees',
        artist: 'Saturday Night Fever',
        img: 'https://cdn.pastemagazine.com/www/articles/2018/08/21/sat-night-fever.jpg',
        description: "Saturday Night Fever is the soundtrack album from the 1977 film Saturday Night Fever starring John Travolta. The soundtrack was released on November 15, 1977.",
        genre: 'Disco',
        price: 32,
        ours: 28,
        qty: 2,
      },
      {
        title: 'Legend',
        artist: 'Bob Marley',
        img: 'https://cdn.pastemagazine.com/www/articles/2018/08/21/bob-marley-legend.jpg',
        description: "Bob Marley was a populist hero if ever there was one, and songs like “Get Up, Stand Up,” with its simple, unaffected refrain, spoke in generalities about the need to assert oneself in the face of tyranny and oppression. ",
        genre: 'Reggae',
        price: 36,
        ours: 32,
        qty: 5,
      },
      {
        title: '21',
        artist: 'Adele',
        img: 'https://cdn.pastemagazine.com/www/blogs/lists/assets_c/2011/11/adele21-thumb-250x250-60125.jpg',
        description: "British alt-soul prodigy Adele Adkins’ debut, 19, was stunning in spots, earning both a watchful eye from critics and a should-have-been-huger hit single, “Chasing Pavements,” that perfectly demonstrates what makes her offbeat charm so appealing: a panache for gigantic hooks strung together in melismatic webs of old-school vigor; an instrumentally-dense arrangement equally referencing big-band and indie-rock; and most importantly—that voice. ",
        genre: 'Alt-Soul',
        price: 28,
        ours: 25,
        qty: 1,
      },
      {
        title: 'Rumours',
        artist: 'Fleetwood Mac',
        img: 'https://cdn.pastemagazine.com/www/blogs/lists/assets_c/2012/05/220px-FMacRumours-thumb-250x250-67340.png',
        description: "By 1977, hitmaking couple Lindsey Buckingham and Stevie Nicks had lost each other in a psychotropic haze. On Fleetwood Mac’s Rumours, that haze is thick enough to suck the air out of the room.",
        genre: 'Rock & Roll',
        price: 35,
        ours: 32,
        qty: 2,
      },
      {
        title: 'Hotel California',
        artist: 'Eagles',
        img: 'https://cdn.pastemagazine.com/www/articles/2018/08/21/eagles-hotel-ca.jpg',
        description: "Incredibly, the Eagles first greatest-hits collection came out 10 months before the release of Hotel California, and now both reside among the best-selling albums ever. ",
        genre: 'Rock & Roll',
        price: 28,
        ours: 25,
        qty: 3,
      },
      {
        title: 'In Evening Air',
        artist: 'Future Islands',
        img: 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a7/InEveningAir.jpg/220px-InEveningAir.jpg',
        description: "In Evening Air is the second album by synthpop band Future Islands. The album was released on 4 May 2010 on Thrill Jockey records. It is titled after a poem of the same name by Theodore Roethke from his final collection, The Far Field.",
        genre: 'Synthpop',
        price: 28,
        ours: 25,
        qty: 3,
      },
      {
        title: 'After the Gold Rush',
        artist: 'Neil Young',
        img: 'https://upload.wikimedia.org/wikipedia/en/thumb/2/2d/After_the_Gold_Rush.jpg/220px-After_the_Gold_Rush.jpg',
        description: "Gold Rush consists mainly of country folk music, along with the rocking Southern Man,[6] inspired by the Dean Stockwell-Herb Bermann screenplay After the Gold Rush.",
        genre: 'Folk Rock',
        price: 42,
        ours: 38,
        qty: 3,
      },
      {
        title: 'Blood on the Tracks',
        artist: 'Bob Dylan',
        img: 'https://upload.wikimedia.org/wikipedia/en/thumb/f/fa/Bob_Dylan_-_Blood_on_the_Tracks.jpg/220px-Bob_Dylan_-_Blood_on_the_Tracks.jpg',
        description: "Blood on the Tracks is the fifteenth studio album by American singer-songwriter Bob Dylan, released on January 20, 1975[1][2] by Columbia Records. The album marked Dylan's return to Columbia Records after a two-album stint with Asylum Records. ",
        genre: 'Folk Rock',
        price: 38,
        ours: 32,
        qty: 1,
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
