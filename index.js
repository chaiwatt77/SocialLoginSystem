import express from 'express';
import passport from 'passport';
import session from 'express-session';
import FacebookStrategy from 'passport-facebook';
import GoogleStrategy from 'passport-google-oauth20';
import dotenv from 'dotenv';
dotenv.config()

const app = express();

app.use(session({
  secret: process.env.SECRET_KEY,
  resave: true,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_SECRET_KEY,
  callbackURL: 'http://localhost:3000/auth/facebook/callback'
}, (accessToken, refreshToken, profile, done) => {
  return done(null, profile);
}));

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:3000/auth/google/callback'
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

app.get('/logout/facebook', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Error logging out:', err);
      return res.redirect('/');
    }
    res.redirect('/');
  });
});


app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
  passport.authenticate('google', { successRedirect: '/', failureRedirect: '/login' })
);

app.get('/logout/google', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Error logging out:', err);
      return res.redirect('/');
    }
    res.redirect('/');
  });
});

app.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    let logoutButton;
    if (req.user.provider === 'facebook') {
      logoutButton = `
        <form action="/logout/facebook" method="get">
          <button type="submit">Logout from Facebook</button>
        </form>
      `;
    } else if (req.user.provider === 'google') {
      logoutButton = `
        <form action="/logout/google" method="get">
          <button type="submit">Logout from Google</button>
        </form>
      `;
    }

    res.send(`
      <h1>Hello, ${req.user.displayName}!</h1>
      ${logoutButton}
    `);
  } else {
    res.send(`
      <center>
        <h1>Social Logins</h1>
        <a href="/auth/facebook" style="text-decoration:none;color:black"> <button>Login with Facebook</button> </a>
        <br/>
        <a href="/auth/google" style="text-decoration:none;color:black"> <button>Login with Google</button> </a>
      </center>
    `);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
