const express = require('express')
const app = express()
const WSServer = require('express-ws')(app)
const aWss = WSServer.getWss()

const PORT = process.env.PORT || 5000

app.ws('/', (ws, req) => {
    console.log('CONNECTION IS OK!')
    
    ws.send('GOOD!')

    ws.on('message', (msg) => {
        const parsedMsg = JSON.parse(msg)

        switch (parsedMsg.method) {
            case "connection":
                connectionHandler(ws, msg)
                break;
        
            default:
                break;
        }
    })
})

app.listen(PORT, () => console.log('Server started on ' + PORT + ' port'))

const connectionHandler = (ws, msg) => {
    ws.id = msg.id
    broadcastConnection(ws, msg)
}

const broadcastConnection = (ws, msg) => {
    aWss.clients.forEach(client => {
        if (client.id === msg.id) {
            client.send(JSON.stringify(msg))
        }
    })
}