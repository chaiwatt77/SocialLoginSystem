import express from 'express';
import passport from 'passport';
import session from 'express-session';
import FacebookStrategy from 'passport-facebook';
import dotenv from 'dotenv';
dotenv.config()

const app = express();

app.use(session({
  secret: 'your-secret-key',
  resave: true,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new FacebookStrategy({
  clientID: process.env.APP_ID,
  clientSecret: process.env.SECRET_KEY,
  callbackURL: 'http://localhost:3000/auth/facebook/callback'
}, (accessToken, refreshToken, profile, done) => {
  return done(null, profile);
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/', failureRedirect: '/login' })
);

app.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    res.send(`<h1>Hello, ${req.user.displayName}!</h1>`);
  } else {
    res.send('<center> <h1>Facebook Login</h1> <a href="/auth/facebook" style="text-decoration:none;color:black"> <button>Login with Facebook</button> </a> </center>');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
