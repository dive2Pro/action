var http = require('net')

var count = 0
var users = {}

function broadcast(nickname, msg) {
    for (let i in users) {
        if(nickname!== i) {
            users[i].write(msg + '\n');
        }
    }
}
var server = http.createServer(function(conn) {
    conn.setEncoding('utf8')
    console.log(' new connecting!')
    var nickname
    conn.write('welcome , here are ' + count + ' people are talking each other \n')
    conn.write('please enter your nickname: ')

    conn.on('data', function(data) {
        data = data.replace('\r\n', '')
        if(!nickname){
            if(users[data]) {
                conn.write(' nickname already in use. try again: ')
                return
            }  else {
                nickname = data
                users[nickname] = conn
                broadcast(data, ' welcome ' + data + ' to join use!! ')
            }
        } else {
            broadcast(nickname, nickname + ' : ' + data)
        }
    });

    count ++
    conn.on('close', function() {
        count --
        broadcast(nickname, nickname + ' is quit!')
        delete users[nickname]
    })
})

server.listen(3000, function() {
    console.log(' server listening on *: 3000')
})
