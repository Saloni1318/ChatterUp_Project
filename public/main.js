const socket = io.connect('https://chatterup-lrjo.onrender.com')

// elements
const userList = document.getElementById('users-list')
const welcomeBlock = document.getElementById('user-welcome')
const userCountBlock = document.getElementById('count')
const typingIndicator = document.getElementById('user-typing')
const messageInput = document.getElementById('message-input')
const sendButton = document.getElementById('send-message')
const messageList = document.getElementById('message-list')

// Predefined color palette
const colorPalette = [
    '#E78895', '#50C4ED', '#E1AFD1', '#4CAF50', '#00BCD4',
    '#F57D1F', '#FAEF5D', '#FFACAC', '#F5CCA0', '#DADDB1'
];

// Generate random index to select color from the palette
const randomIndex = Math.floor(Math.random() * colorPalette.length);
const randomColor = colorPalette[randomIndex];


// get username
let userName = prompt('Enter your name');

if (userName) {
    socket.emit("new_user_joined", userName);
    welcomeBlock.innerText = `Welcome, ${userName}`
    // also update count here
}

// listen for new user joined
socket.on('broadcast_user', (users) => {
  
    // load users
    userList.innerHTML = '';
    users.forEach(u => {
        newUserHTML(u.name)
    });
    // update count
    userCountBlock.innerText = users.length
})

// listen for user disconnected
socket.on('user_disconnected', (username) => {

})

// load existing users
socket.on('load_users', (users) => {
    // load users
    userList.innerHTML = '';
    users.forEach(u => {
        newUserHTML(u.name)
    });
    // update count
    userCountBlock.innerText = users.length
})

// Listen for typing indicator from server
socket.on('user_typing', (username) => {
    // Display typing indicator in UI
    typingIndicator.innerText = `${username} is typing...`;
});

// Listen for stop typing indicator from server
socket.on('user_stop_typing', () => {
    typingIndicator.innerText = '';
});

// Listen for receive_message event from server
socket.on('receive_message', (data) => {
    // Determine if the message is sent by the current user
    const isCurrentUser = data.username === userName;
    displayMessage(data.username, data.message, isCurrentUser);
});

// Listen for load_messages event from server
socket.on('load_messages', (messages) => {
    // Loop through the loaded messages and display them
    messages.forEach((message) => {
        displayMessage(message.username, message.message, false, message.timestamp);
    });
});


// Add event listener to send button
sendButton.addEventListener('click', function (e) {
    e.preventDefault();

    // Get the message content from the input field
    const message = messageInput.value.trim();

    // Check if the message is not empty
    if (message) {
        // Send the message to the server
        socket.emit('send_message', message);

        // Clear the input field after sending the message
        messageInput.value = '';
    }
});

// Function to display a message in the message list
function displayMessage(username, message, isCurrentUser, time) {
    let messageTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (time) {
        messageTime = new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    const messageElement = `
    <div class="message d-flex ${isCurrentUser ? 'justify-content-end' : 'justify-content-start'}">
        
        <div class="message p-2 m-2 rounded ${!isCurrentUser ? 'order-2' : ''}" style="background-color:${isCurrentUser ? 'rgba(0 123 255 / 29%)' : '#faebd7'} ; width: fit-content; max-width: 330px">
            <div class="message-content">
                <div class="message-header mb-2">
                    <strong class="mx-1">${username}</strong>
                    <span class="message-time text-muted mx-1">
                    ${messageTime}
                    </span>
                </div>
                <div class="message-text mx-1">${message}</div>
            </div>
        </div>

        <div class="avatar-container align-self-end mb-2" style="background-color: ${isCurrentUser ? randomColor : '#E78895'}; "> 
            ${username.substr(0, 2).toUpperCase()}
        </div>
    </div>
    `;

    // Append message element to the message list 
    messageList.insertAdjacentHTML('beforeend', messageElement);

    // Scroll to the bottom of the message list
    messageList.scrollTop = messageList.scrollHeight;
}

// Function to send typing event to the server
function startTyping() {
    console.log("typing")
    socket.emit('typing');
}

// Function to send stop typing event to the server
function stopTyping() {
    console.log("stop-typing")

    socket.emit('stop_typing');
}

// utils
function newUserHTML(name) {
    const newUserHTML = `
        <div class="d-flex align-items-center mb-2">
            <div class="mr-2 bg-success rounded-circle" style="width: 10px; height: 10px;"></div>
            <div>${name}</div>
        </div>
    `;
    userList.innerHTML += newUserHTML;
}



