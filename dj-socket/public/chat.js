window.onload = function () {
    const socket = io()

    function queryEl(q) {
        return document.querySelector(q)
    }

    const loading = queryEl('#loading')
    const chat = queryEl('#chat')
    const form = queryEl('#form')
    const messageInput = queryEl("#input")
    const msgs = queryEl('#messages')
    const typing = queryEl('#typing')

    // dj
    const dj = queryEl('#dj')
    const s = queryEl("#s")
    const results = queryEl("#results")


    let name
    socket.on('connect', () => {
        loading.style.display = 'none'
        chat.style.display = 'block'
        const inputName = window.prompt("what's your name?")
        socket.emit('join', inputName, function () {
            name = inputName
            chat.style.visibility = 'visible'
        })
    })

    socket.on('broadcast', ({msg}) => {
        const li = document.createElement('li')
        li.textContent = msg
        li.className = 'confirmed broadcast'
        msgs.appendChild(li)
    })

    socket.on('msg', ({name, msg}) => {
        const li = document.createElement('li')
        li.textContent = `${name} : ${msg} `
        li.className = 'confirmed'
        msgs.appendChild(li)
    })
    socket.on('dj', () => {
        dj.style.display = 'block'
    })

    let timer
    socket.on('typing', (name) => {
        typing.style.visibility = 'visible'
        typing.textContent = `${name} is typing`
        if (timer) {
            clearTimeout(timer)
        }
        timer = setTimeout(() => {
            typing.style.visibility = 'hidden'
        }, 1000)
    })

    function notTyping() {
        typing.style.visibility = 'hidden'
    }

    messageInput.oninput = function () {
        socket.emit('typing')
    }

    messageInput.onblur = function () {
        notTyping()
    }

    form.onsubmit = function () {
        const value = messageInput.value
        if (!value.trim()) {
            return false
        }
        const li = document.createElement('li')
        li.textContent = `me: ${value}`
        li.className = 'me-say'
        socket.emit('message', value, function () {
            li.className = 'me-say confirmed'
        })
        msgs.appendChild(li)
        messageInput.value = ''
        messageInput.focus()
        return false
    }

    //
    dj.onsubmit = function () {
        const value = s.value
        if (!value.trim()) {
            return false
        }

        socket.emit('search', value)

        return false
    }

    results.onclick = function(ev) {
        const { dataset } = ev.target
        console.log(dataset)
    }
    socket.on('songs', songs => {
        results.innerHTML = ''
        songs.forEach(song => {
            const li = document.createElement('li')
            li.className = 'song'
            li.innerHTML = `
    <div>
        <span>${song.name} ~ ${song.producer}</span>
        <a data-id="${song.name}">Select</a>
    </div>
`
            results.appendChild(li)
        })
    })

    socket.on('selected', songUrl => {

    })

}
