const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const mongoDB = require('./data/database');
const passport = require('passport');
const session = require('express-session');
const GitHubStrategy = require('passport-github2').Strategy;
const cors = require('cors');

const port = process.env.PORT || 3000;
const app = express();

app
   .use(bodyParser.json())
   .use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
   }))
   .use(passport.initialize())
   .use((req, res, next) => {
    res.setHeader("Accss-Controll-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Z-Key, Autorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "POST, GET, PUT, PATCH, OPTIONS, DELETE"
    );
    next();
   })
   .use(cors({ methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']}))
   .use(cors({ origin: '*'}))
   .use("/", require("./routes/index.js"));

passport.use(new GitHubStrategy( {
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.callbackURL
},
function(accessToken, refreshToken, profile, done) {
    return done(null, profile);
}  
));

passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser(() => {
    done(null, user);
});

app.get('/', (req, res) => {
    res.send(req.session.user !== undefined ? `Logged in as ${req.session.user.displayName}` : "Logged Out")
});
// app.get('/', (req, res) => {
//     res.send(req.session.user !== undefined ? `Logged in as ${req.session.user.firstName} ${req.session.user.lastName}` : "Logged Out");
// });

app.get('/github/callback', passport.authenticate('github', {
    failureRedirect: '/api-docs', session: false}
    ), (req, res) => {
        req.session.user = req.user;
        res.redirect('/');
    });

mongoDB.initDb((err, mongoDB) => {
    if (err) {
        console.log(err);
    } else {
        app.listen(port);
        console.log(`app started on Port ${port}`);
    }
});
