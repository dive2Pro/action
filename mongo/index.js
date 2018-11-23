const app = require('express')()
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const expressSession = require('express-session')
const mongodb = require('mongodb')
const MongoClient = require('mongodb').MongoClient
const dbName = 'demo-1'

let clientInstance
let db
MongoClient.connect('mongodb://localhost:27017/', (err, client) => {
    if (err) {
        throw err
    }
    clientInstance = client
    db = client.db(dbName)
    console.log('connected to mongodb!')

    const users = db.collection('documents');

    function indexCollection(collection) {
        collection.createIndex({
            users: 1,
            email: 1
        }, null, (err, result) => {
            if (err) {
                throw err
            }
            collection.createIndex({
                users: 1,
                password: 1
            }, null, (err, result) => {
                if (err) {
                    throw err
                }
                console.log('ensured indexes!')
                startApp()
            })
        })
    }

    indexCollection(users)

    function startApp() {
        app.set('view engine', 'pug')
        app.use(bodyParser())
        app.use(cookieParser('my secret'))
        app.use(expressSession({
            secret: 'my-ss'
        }))

        app.use((req, res, next) => {
            if(req.session.logged_in) {
                res.locals.authenticated =  true
                users.findOne({_id: mongodb.ObjectId(req.session.logged_in) }, (err, doc) => {
                    if(err) {
                        next(err)
                    } else if(!doc){
                        res.locals.authenticated =  false
                        next()
                    }  else  {
                        res.locals.me = doc
                        next()
                    }
                })
            } else {
                res.locals.authenticated =  false
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
            users.findOne({
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
            users.insertOne(req.body.user, (err, doc) => {
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

})



