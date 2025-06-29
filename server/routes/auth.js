import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Start Google OAuth login
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// Callback after Google has authenticated the user
router.get('/google/callback', passport.authenticate('google', {
  failureRedirect: '/login',
  session: false,
}), (req, res) => {
  // Create JWT and redirect with token
  const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

  // ✅ Redirect to correct frontend address
  res.redirect(`http://localhost:8080/?token=${token}`);
});

// Optional: Route to check if user is logged in
router.get('/me', (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
});

// Optional: Logout
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

export default router;
