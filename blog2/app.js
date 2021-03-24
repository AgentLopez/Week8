const express = require('express')
const app = express()
const models = require('./models')
const pst = require('./models/pst')
const { Op } = require('sequelize')

const mustacheExpress = require('mustache-express')
app.engine('mustache', mustacheExpress())
app.set('views', './views')
app.set('view engine', 'mustache')

app.use(express.urlencoded())

app.get('/', (req, res) => {
    models.pst.findAll({})
        .then(posts => {
            res.render('index', {posts: posts})
        })
})

app.get('/post', (req, res) => {
    res.render('create')
})

app.post('/post', (req, res) => {
    const title = req.body.title
    const body = req.body.body
    const category = req.body.category

    let post = models.pst.build({
        title: title,
        body: body,
        category: category
    })

    post.save().then((savedPost) => {
        res.redirect('/')
    })
})

app.get('/delete/:id', (req, res) => {
    let id = req.params.id

    models.pst.destroy({
        where: {
            id: id
        }
    }).then(deletedPost => {
        res.redirect('/')
    })
})

app.get('/category/:category', (req, res) => {
    let category = req.params.category

    models.pst.findAll({
        where: {
            category: category     
        }
    }).then(posts => {
        res.render('index', {posts: posts})
    })
})

app.get('/edit/:id', (req, res) => {
    let id = req.params.id
    
    models.pst.findAll({
        where: {
            id: id     
        }
    }).then(post => {
        res.render('edit', {post: post})
    })

})

app.post('/edit/:id', (req, res) => {
    let id = req.params.id
    const title = req.body.title
    const body = req.body.body
    const category = req.body.category
    
    models.pst.update({
        title: title,
        body: body,
        category: category
    }, {
        where: {
            id: id     
        }
    }).then(post => {
        res.redirect('/')
    })

})

app.listen(3000, () => {
    console.log('Freeeeeeeeedom.....')
})