// Initialize variables
var $usernameInput = $('#usernameInput');
var $recipientInput = $('#recipientInput');
var $activeUsers = $('#active-users');
var $messagesList = $('#messages');
var $msgInput = $('#messageInput');
var $div_username = $('#username');
var $loginField = $('#login-field');
var $chatField = $('#main-window');

// Prompt for setting a username
var username;
var connected = false;
$usernameInput.val('');

var socket = io();

function setUsername() {
    var username = $usernameInput.val().trim();
    $usernameInput.val('');

    // If username's provided, show main window
    if (username) {
        $div_username.append(
            $('<p>').append(username)
        );
        $loginField.fadeOut();
        $loginField.off('click');
        $recipientInput.val('');
        $msgInput.val('');
        $chatField.show(200);

        socket.emit('add user', username);
    }
}

function updateActiveUsers(clients) {
    $activeUsers.empty();
    for (username in clients) {
        $activeUsers.append(
            $('<li>').append(username));
    }
}

function addMessage(message) {
    $messagesList.append(
        $('<li>')
            .append(message.author_username + ': ' + message.msg)
            .attr("id", message.timestamp + '-' + message.author_id)
    );
}

function sendMsg() {
    recipient = $recipientInput.val().trim();
    msg = $msgInput.val();

    if (recipient.length < 1 || msg.length < 1) return;

    message = {
        "recipient": recipient,
        "msg": msg
    };
    socket.emit('send message', message);

    // Clear input fields
    $recipientInput.val('');
    $msgInput.val('');
}

// Broadcast a message to all active users
function broadcastMsg() {
    msg = $msgInput.val();

    if (msg.length < 1) return;

    message = {
        "recipient": "",
        "msg": msg
    };

    socket.emit('broadcast message', message);

    // Clear input fields
    $recipientInput.val('');
    $msgInput.val('');

}


// Socket events

socket.on('update users', function(username) {
    updateActiveUsers(username);
});

socket.on('new message', function (message) {
    // append message to #messages
    addMessage(message);

    // notify server that the message is received
    socket.emit('seen', message);
});

// Server replies, that a message has been delivered successfully to recipient
socket.on('seen', function(message) {
    addMessage(message);
});

