const express = require('express')
const session = require('express-session')
const mustacheExpress = require('mustache-express')
const app = express()

var bcrypt = require('bcryptjs')

const pgp = require('pg-promise')()

app.use(session({
    secret: 'sloppy joes',
    resave: false,
    saveUninitialized: false
}))

const connectionString = 'postgres://eakyoxvj:H8kIpNd95l1Y63tYGbH2VtPhYtMt_Hfd@kashin.db.elephantsql.com:5432/eakyoxvj'

global.db = pgp(connectionString)

app.engine('mustache', mustacheExpress())
app.set('views', './views')
app.set('view engine', 'mustache')

app.use(express.urlencoded())
app.use(express.static('css'))

const mainRouter = require('./routes/index.js')
const homeRouter = require('./routes/home.js')

app.use('/', mainRouter)
app.use('/home', authenticate, homeRouter)

function authenticate(req, res, next) {
    if (req.session) {
        if(req.session.userid) {
        next()
        } else {
            res.redirect('/login')
        }
    } else {
        res.redirect('/login')
    }
    
}

app.listen(3000, () => {
    console.log('Sharing is Caring . . .')
})