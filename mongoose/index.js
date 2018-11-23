const app = require('express')()
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const expressSession = require('express-session')
const mongoose = require('mongoose')
const {Schema} = mongoose

const dbName = 'demo-1'
mongoose.connect('mongodb://localhost:27017/' + dbName)
    .then(() => {
        startApp()
    })
    .catch((err) => {
        console.error('MongoDB connection error', err)
    })


const User = mongoose.model('Documents', new Schema({
    first: String,
    last: String,
    email: {type: String, unique: true},
    password: {type: String, index: true}
}))




function startApp() {
    app.set('view engine', 'pug')
    app.use(bodyParser())
    app.use(cookieParser('my secret'))
    app.use(expressSession({
        secret: 'my-ss'
    }))

    app.use((req, res, next) => {
        if (req.session.logged_in) {
            res.locals.authenticated = true
            User.findById(req.session.logged_in, (err, doc) => {
                if (err) {
                    next(err)
                } else {
                    res.locals.me = doc
                    next()
                }
            })
        } else {
            res.locals.authenticated = false
            next()
        }
    })
    app.get('/', (req, res) => {
        res.render('index')
    })
    app.get('/login/:signupEmail?', (req, res) => {
        res.render('login', {signupEmail: req.params.signupEmail})
    })

    app.post('/login', (req, res, next) => {
        User.findOne({
            email: req.body.user.email,
            password: req.body.user.password
        }, (err, doc) => {
            if (err) {
                next(err)
            } else if (!doc) {
                next('not found')
            } else {
                req.session.logged_in = doc._id.toString()
                res.redirect('/')
            }
        })
    })
    app.get('/logout', (req, res) => {
        req.session.logged_in = null
        res.redirect("/")
    })

    app.get('/signup', (req, res) => {
        res.render('signup')
    })

    app.post('/signup', (req, res, next) => {
        const user = new User(
            req.body.user, (err, doc) => {
                if (err) {
                    return next(err)
                }
                res.redirect('/login/' + doc.ops[0].email)
            })
    })

    app.listen(3000, () => {
        console.log('listening: 3000')
    })
}




