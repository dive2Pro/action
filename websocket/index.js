const express = require('express')
const WebSocket = require('ws')
const http = require('http')

const app = express()
app.use(express.static('public'))

const server = http.createServer(app)
const ws = new WebSocket.Server({server} )


let positions = {};
let total = 0
ws.on('connection', socket => {
    console.log('connection !')
    socket.id = ++total
    socket.send(JSON.stringify(positions));

    socket.on('message', msg => {
        try{
            const pos = JSON.parse(msg)
            positions[socket.id] = pos
            broadcast(JSON.stringify({
                type: 'position',
                pos: pos,
                id: socket.id
            }))
        }
        catch (e) {
            console.error(e)
        }
    })

    socket.on('close', () => {
        delete positions[socket.id]
        broadcast(JSON.stringify({
            type: 'disconnect',
            id: socket.id
        }))
    })

    function broadcast(msg) {
        ws.clients.forEach(client => {
            if( socket.id != client.id){
                console.log(client)
                client.send(msg)
            }
        })
    }
})

server.listen(3000)

