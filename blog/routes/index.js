const express = require('express')
const router = express.Router()
var bcrypt = require('bcryptjs')

router.get('/', (req, res) => {
    db.any('SELECT post_id, title, body, date_created FROM post')
        .then(posts => {
            res.render('index', { posts: posts })
        })
})

router.get('/login' , (req, res) => {
    res.render('login')
})

router.post('/login', (req, res) => {
    const username = req.body.name
    const password = req.body.password

    db.one('SELECT user_id, username, password FROM users WHERE username = $1', [username])
    .then((user) => {
        bcrypt.compare(password, user.password, function (error, result) {
            if (result) {
                if(req.session) {
                    req.session.userid = user.user_id
                    res.redirect('/home')
                }
            } else {
                res.render('login', {message: 'Password Incorrect'})
            }
        })
    }).catch((error) => {
        res.render('login', {message: 'Username Not Found'})
    })
})

router.get('/register' , (req, res) => {
    res.render('register')
})

router.post('/register', (req, res) => {
    let username = req.body.name
    let password = req.body.password
    db.oneOrNone('SELECT username, password FROM users WHERE username = $1',[username])
    .then((user) => {
        if (user) {
             res.render('register', {message: 'User Already Exists'})
        } else {
            bcrypt.genSalt(10, function(error, salt) {
                bcrypt.hash(password, salt, function (error, hash) {
                    if (!error) {
                        db.none('INSERT INTO users(username, password) VALUES($1, $2)', [username, hash])
                    .then(() => {
                        res.redirect('/login')
                    })
                    }
                })
            })
        }
    }) .catch((error) => {
        console.log(error)
    })

})


module.exports = router