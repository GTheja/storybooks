const express = require('express');
const router = express.Router();
const { ensureAuth} = require('../middleware/auth');
const Story = require('../modles/Story');

// show add page

// get/stores/add
router.get('/add', ensureAuth, (req, res) => {
    res.render('stories/add');
})

router.post('/', ensureAuth, async (req, res) => {
   try {
       req.body.user = req.user.id
       await Story.create(req.body)
       res.redirect('/dashboard')
   } catch (err) {
       console.error(err);
       res.render('error/500')
   }
})
//show all stoires

router.get('/', ensureAuth, async (req, res) => {
    try {
        const stories = await Story.find({status: 'public'})
        .populate('user')
        .sort({createdAt: 'desc'})
        .lean()

        res.render('stories/index', {
            stories
        })
    } catch (err) {
        console.error(err)
        res.render('error/500')
        
    }
})


module.exports = router;