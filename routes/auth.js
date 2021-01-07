const express = require('express');
const passport = require('passport');
const router = express.Router();

//auth with google

// get /auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile'] }))


// google auth callback

// get  GET/AUTH/GET/CALLBACK

router.get('/google/callback', passport.authenticate('google', {failureRedirect: '/'}), (req, res) => {
    res.redirect('/dashboard')
})

//logout user..
router.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
})


module.exports = router;