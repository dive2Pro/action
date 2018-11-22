const request = require('superagent')


module.exports = function search(query, cb) {
    if(query == 'hyc') {
        cb(new Error('Hyc'))
    }
    request.get('https://api.github.com/search/users')
        .query({q: query})
        .end((err, res) => {
            if(!err && res.body) {
                cb(null, res.body.items)
            } else {
                cb(new Error('Bad twitter response', err))
            }
        })
}


