const express = require('express')
const app = express()
const WSServer = require('express-ws')(app)

const PORT = process.env.PORT || 5000

app.ws('/', (ws, req) => {
    console.log('CONNECTION IS OK!')
    
    ws.send('GOOD!')

    ws.on('message', (msg) => {
        console.log(msg)
    })
})

app.listen(PORT, () => console.log('Server started on ' + PORT + ' port'))