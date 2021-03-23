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
    const user_id = req.session.userid
    db.none('INSERT INTO post(title, body, user_id) VALUES($1, $2, $3)', [title, body, user_id])
        .then(() => {
            res.redirect('/')
        })
})

router.get('/edit/:id', (req, res) => {
    let id = req.params.id
    db.one('SELECT post_id, title, body FROM post WHERE post_id = $1', [id])
        .then((post) => {
            res.render('edit', { post: post })
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

router.get('/details/:post_id', (req, res) => {
    let post_id = req.params.post_id
    db.any('SELECT post.title, post.body, post.date_created, comments.comment_title, comments.comment_body, comments.comment_created FROM comments INNER JOIN post ON comments.$1 = comments.$2', [post_id, post_id])
        .then((all) => {
            console.log(all)
            res.render('details', { all: all })
        })

})

router.post('/comment/:post_id', (req, res) => {
    let title = req.body.title
    let body = req.body.body
    let post_id = parseInt(req.params.post_id)
    let user_id = parseInt(req.session.userid)
    db.none('INSERT INTO comments (comment_title, comment_body, user_id, post_id) VALUES ($1,$2,$3,$4)', [title, body, user_id, post_id])
        .then(() => {
            res.redirect(`/home/details/${post_id}`)
        })

})

module.exports = router