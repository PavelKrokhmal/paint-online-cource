const express = require('express')
const app = express()
const cors = require('cors')
const WSServer = require('express-ws')(app)
const aWss = WSServer.getWss()
const fs = require('fs')
const path = require('path')

const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.ws('/', (ws, req) => {
    console.log('CONNECTION IS OK!')

    ws.on('message', (msg) => {
        const parsedMsg = JSON.parse(msg)

        switch (parsedMsg.method) {
            case "connection":
                connectionHandler(ws, parsedMsg)
                break
            case 'draw':
                broadcastConnection(ws, parsedMsg)
                break
        
            default:
                break
        }
    })
})

app.post('/image', (req, res) => {
    try {
        const data = req.body.img.replace('data:image/png;base64', '')
        fs.writeFileSync(path.resolve(__dirname, 'files', `${req.query.id}.jpg`), data, 'base64')
        return res.status(200).json({message: 'Uploaded!'})
    } catch (e) {
        console.log(e)
        return res.status(500).json({message: e.message})
    }
})

app.get('/image', (req, res) => {
    try {
        const file = fs.readFileSync(path.resolve(__dirname, 'files', `${req.query.id}.jpg`))
        const data = 'data:image/png;base64,' + file.toString('base64')
        res.json(data)
    } catch (e) {
        console.log(e)
        return res.status(500).json({message: e.message})
    }
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