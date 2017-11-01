// Setup basic express server
var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = 3000;
var fs = require('fs');
var log_directory = 'logs';

function log_message(message) {
    // using "timestamp-author_id.json" pattern for a filename
    var filepath = __dirname + '/' + log_directory +'/' + message.timestamp + '-' + message.author_id + '.json';

    var json = JSON.stringify({
        "author": message.author_username,
        "recipient": message.recipient,
        "message_body": message.msg
    });

    // handle logs, bigger than 100b
    var size = Buffer.byteLength(json, 'utf8');
    if (size > 100) {
        console.log('Message too big to log(' + size + 'b).');
        return;
    }

    fs.writeFile(filepath, json, function (err) {
        if (err) {
            return console.error(err);
        }
    });
}

server.listen(port, function () {
    console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(path.join(__dirname, 'public')));

// Sockets
var clients = {};

io.on('connection', function (socket) {
    // emit logged users on initial connection
    socket.emit('update users', clients);

    var addedUser = false;
    var username;

    socket.on('add user', function (u) {
        if (addedUser) return;

        username = u;
        clients[username] = socket.id;
        addedUser = true;

        // update every connected client's active users list
        socket.emit('update users', clients);
        socket.broadcast.emit('update users', clients);
    });

    // Broadcast a message to all logged users
    socket.on('broadcast message', function (message) {
        message.author_username = username;
        message.timestamp = Math.round((new Date()).getTime() / 1000);
        message.author_id = socket.id;

        // log message
        log_message(message);

        socket.emit('new message', message);
        socket.broadcast.emit('new message', message);
    });

    // Send a message to a specific user
    socket.on('send message', function (message) {
        message.author_username = username;
        message.timestamp = Math.round((new Date()).getTime() / 1000);
        message.author_id = socket.id;

        // log message
        log_message(message);

        io.to(clients[message.recipient]).emit('new message', message);

        // Notify author message has been delivered to recipient.
        io.to(message.author_id).emit('seen', message);
    });

    socket.on('disconnect', function () {
        if (!addedUser) return;

        // remove disconnected client from list
        delete clients[username];

        // broadcast updated client list to all clients
        socket.broadcast.emit('update users', clients);
    });
});
