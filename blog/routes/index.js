const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    db.any('SELECT post_id, title, body, date_created FROM post')
        .then(posts => {
            res.render('index', { posts: posts })
        })
})

router.get('/newpost', (req, res) => {
    res.render('newpost')
})

router.post('/newpost', (req, res) => {
    const title = req.body.name
    const body = req.body.body

    db.none('INSERT INTO post(title, body) VALUES($1, $2)', [title, body])
        .then(() => {
            res.redirect('/')
        })
})

router.get('/edit/:id', (req, res) => {
    let id = req.params.id
    db.one('SELECT post_id, title, body FROM post WHERE post_id = $1', [id])
    .then ((post) => {
        res.render('edit', {post: post})
    })
    .catch(error => console.log(error))
})

router.post('/edit/:id', (req, res) => {
    let id = req.params.id
    let title = req.body.name
    let body = req.body.body

    db.none('UPDATE post SET title = $1, body = $2, date_updated = $3 WHERE post_id = $4', [title, body, 'now()', id])
    .then(() => {
        res.redirect('/')
    })
})

router.post('/delete/:id', (req, res) => {
    const id = req.params.id
    db.none('DELETE FROM post WHERE post_id = $1', [id])
    .then(() => {
        res.redirect('/')
    })
})


module.exports = router