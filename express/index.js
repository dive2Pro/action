const express = require('express')
const errorHandler = require('errorhandler')
const app = express();

const search = require('./search')


app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('view options', { layout: false })

app.get('/', (req, res) => {
    res.render('index')
})

app.get('/search', (req, res, next) => {
    search(req.query.q, (err, tweetes) => {
        if(err) {
            next(err)
        } else {
            res.render('search', {
                results: tweetes,
                search: req.query.q
            })
        }
    })
})

if(app.get('env') === 'development'){
    app.use(errorHandler())
}

app.listen(3000)
