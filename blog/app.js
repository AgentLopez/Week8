const express = require('express')
const mustacheExpress = require('mustache-express')
const app = express()


const pgp = require('pg-promise')()

const connectionString = 'postgres://postgres:WIN15ready@localhost:5432/blog'

global.db = pgp(connectionString)

app.engine('mustache', mustacheExpress())
app.set('views', './views')
app.set('view engine', 'mustache')

app.use(express.urlencoded())
app.use(express.static('css'))

const mainRouter = require('./routes/index.js')


app.use('/', mainRouter)



app.listen(3000, () => {
    console.log('Sharing is Caring . . .')
})