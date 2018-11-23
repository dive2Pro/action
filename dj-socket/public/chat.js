window.onload = function() {
    const socket = io()
    socket.on('connect', () => {
        console.log(' i am on line')
    })
}