// app.js
import express from 'express';
import passport from 'passport';
import session from 'express-session';
import FacebookStrategy from 'passport-facebook';
import dotenv from 'dotenv';
dotenv.config()

const app = express();

// Configure Express to use sessions
app.use(session({
  secret: 'your-secret-key',
  resave: true,
  saveUninitialized: true
}));

// Initialize Passport and restore authentication state, if any, from the session
app.use(passport.initialize());
app.use(passport.session());

// Configure the Facebook strategy for Passport
passport.use(new FacebookStrategy({
  clientID: process.env.APP_ID,
  clientSecret: process.env.SECRET_KEY,
  callbackURL: 'http://localhost:3000/auth/facebook/callback'
}, (accessToken, refreshToken, profile, done) => {
  // This is a dummy implementation. You would typically save the user to your database here.
  return done(null, profile);
}));

// Serialize user object to the session
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize user object from the session
passport.deserializeUser((user, done) => {
  done(null, user);
});

// Define a route for Facebook authentication
app.get('/auth/facebook', passport.authenticate('facebook'));

// Define a route for Facebook callback
app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/', failureRedirect: '/login' })
);

// Define a route to display user information after login
app.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    res.send(`<h1>Hello, ${req.user.displayName}!</h1>`);
  } else {
    res.send('<center> <h1>Facebook Login</h1> <a href="/auth/facebook" style="text-decoration:none;color:black"> <button>Login with Facebook</button> </a> </center>');
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
