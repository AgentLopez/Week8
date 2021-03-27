const express = require('express')
const router = express.Router()
const models = require('../models')
const pst = require('../models/pst')
const { Op } = require('sequelize')

router.get('/', (req, res) => {
    models.pst.findAll({})
        .then(posts => {
            res.render('xindex', { posts: posts })
        })
})

router.get('/post', (req, res) => {
    res.render('xcreate')
})

router.post('/post', (req, res) => {
    const title = req.body.title
    const body = req.body.body
    const category = req.body.category

    let post = models.pst.build({
        title: title,
        body: body,
        category: category
    })

    post.save().then((savedPost) => {
        res.redirect('/x/')
    })
})

router.get('/delete/:id', (req, res) => {
    let id = req.params.id

    models.pst.destroy({
        where: {
            id: id
        }
    }).then(deletedPost => {
        res.redirect('/x/')
    })
})

router.get('/comment/:id', (req, res) => {
    let id = req.params.id
    models.pst.findByPk(id, {
        include: [
            {
                model: models.cmt,
                as: 'cmts'
            }]
    })
    .then(all => {
    res.render('xcomment', {all: all})
    })
    .catch(error => console.log(error)
        // models.pst.findByPk(id)
        // .then(all => {
        //     console.log(all)
        // res.render('comment', {all: all})
        // })
    )
}
)

router.post('/comment/:id', (req, res) => {
    let id = req.params.id
    let subject = req.body.subject
    let comment = req.body.comment
    let userid = req.session.userid

    let newcomment = models.cmt.build({
        subject: subject,
        comment: comment,
        pst_id: id,
        user_id: userid
    })

    newcomment.save().then(savedCmt => {
        res.redirect('/x/')
    })

})

router.get('/delete-comment/:id', (req, res) => {
    let id = req.params.id

    models.cmt.destroy({
        where: {
            id: id
        }
    }).then(deleted => {
        res.redirect('/x/')
    })
})

router.get('/category/:category', (req, res) => {
    let category = req.params.category

    models.pst.findAll({
        where: {
            category: category
        }
    }).then(posts => {
        res.render('xindex', { posts: posts })
    })
})

router.get('/edit/:id', (req, res) => {
    let id = req.params.id

    models.pst.findAll({
        where: {
            id: id
        }
    }).then(post => {
        res.render('xedit', { post: post })
    })

})

router.post('/edit/:id', (req, res) => {
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
        res.redirect('/x/')
    })

})

module.exports = router