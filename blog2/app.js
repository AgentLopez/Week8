const express = require('express')
const session = require('express-session')
const app = express()
const models = require('./models')
const pst = require('./models/pst')
const { Op } = require('sequelize')
var bcrypt = require('bcryptjs')

const PORT = process.env.PORT || 8080

app.use(session({
    secret: 'shhhhh its secret',
    resave: false,
    saveUninitialized: true

}))

const mustacheExpress = require('mustache-express')
app.engine('mustache', mustacheExpress())
app.set('views', './views')
app.set('view engine', 'mustache')

app.use(express.urlencoded())

const xRouter = require('./routes/x.js')

app.use('/x', authen, xRouter)

function authen(req, res, next) {
    if (req.session) {
        if (req.session.userid) {
            next()
        } else {
            res.redirect('login')
        }
    } else {
        res.redirect('./login')
    }
}

app.get('/register', (req, res) => {
    res.render('register')
})

app.post('/register', (req, res) => {
    let username = req.body.name
    let password = req.body.password

    models.usr.findAll({
        where: {
            username: {
                [Op.iLike]: username
            }
        }
    }).then((user) => {
        if (user.length == 0) {
            bcrypt.genSalt(10, function (error, salt) {
                bcrypt.hash(password, salt, function (error, hash) {
                    if (!error) {
                        let newUser = models.usr.build({
                            username: username,
                            password: hash
                        })
                        newUser.save().then(saved => {
                            res.redirect('/login')
                        })
                    }

                })

            })
        } else {
            res.render('register', {message: 'User Already Exists'})
        }

    })

})

app.get('/login', (req, res) => {
    res.render('login')
})

app.post('/login', (req, res) => {
    const username = req.body.name
    const password = req.body.password

    models.usr.findOne({
        where: {
            username: {
                [Op.iLike]: username
            }
        }
    }).then((user) => {
            bcrypt.compare(password, user.password, function (error, result) {
                if (result) {
                    if(req.session) {
                        req.session.userid = user.id
                        res.redirect('/x/')
                    }
                } else {
                    res.render('login', {message: 'Password Incorrect'})
                }
            })       
    }) .catch ((error) => {
        res.render('login', {message: 'Username Not Found'})
    })   
})

app.get('/', (req, res) => {
    models.pst.findAll({})
        .then(posts => {
            res.render('index', { posts: posts })
        })
})



app.get('/category/:category', (req, res) => {
    let category = req.params.category

    models.pst.findAll({
        where: {
            category: category
        }
    }).then(posts => {
        res.render('index', { posts: posts })
    })
})




app.listen(PORT, () => {
    console.log('Freeeeeeeeedom.....')
})