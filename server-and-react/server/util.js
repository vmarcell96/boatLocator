const WebSocketClient = require('websocket').client;

exports.connectToCoordProvider = (url, connectedClients) => {
    //Connecting to python server to get boat data

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
                cl.emit('chat message', message.utf8Data)
            })
        });
    });

    coordProviderClient.connect(url);
    //
}