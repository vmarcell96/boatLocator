
const express = require('express')
const app = express()
const PORT = 4000;
const http = require('http').Server(app);
const cors = require('cors');
const socketIO = require('socket.io')(http, {
    cors: {
        origin: "*",
    }
});
const bodyParser = require('body-parser')
const db = require('./queries')
const connectedClients = [];


socketIO.on('connection', (socket) => {
    console.log(`Id: ${socket.id} user just connected!`);
    socket.on('disconnect', (socket) => {
        console.log('Id: ${socket.id} user disconnected');
    });
});

socketIO.on('connection', (socket) => {
    connectedClients.push(socket);
    socket.on('chat message', (msg) => {
        socketIO.emit('chat message', msg);
    });
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});


app.use(cors());
app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)

const path = require("path");
app.use(express.static(path.join(__dirname, "..", "build")));
app.use(express.static("public"));


app.get('/getCoordinates/:listId', (req, res) => {
    connectToCoordProvider(req.params.listId);
});



app.get('/api/boatdata', db.getBoatData)
app.get('/api/boatdata/:id', db.getBoatDataById)
app.post('/api/boatdata', db.addBoatData)
app.put('/api/boatdata/:id', db.updateBoatData)
app.delete('/api/boatdata/:id', db.deleteBoatDataById)

app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, "..", "build", "index.html"));
});


http.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});


const connectToCoordProvider = (listId) => {
    //Connecting to python server to get boat data
    const WebSocketClient = require('websocket').client;

    var coordProviderClient = new WebSocketClient();

    coordProviderClient.on('connectFailed', function (error) {
        console.log('Connect Error: ' + error.toString());
    });

    coordProviderClient.on('connect', function (connection) {
        console.log('Connection established with Coordinate Provider Client!');

        connection.on('error', function (error) {
            console.log("Connection error: " + error.toString());
        });

        connection.on('close', function () {
            console.log('Connection closed with Coordinate Provider Client!');
        });

        connection.on('message', function (message) {
            console.log(message.utf8Data);
            connectedClients.forEach(cl => {
                cl.emit('message', message.utf8Data)
            })
        });
    });
    
    coordProviderClient.connect(`http://127.0.0.1:8000/ws/${listId}`);
    //
}










