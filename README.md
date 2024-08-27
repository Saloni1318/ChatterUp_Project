# ChatterUp - Real-time chat app
ChatterUp is an interactive real-time chat application, facilitating seamless communication and interaction between users. This application is built using Node.js, ExpressJS, Socket.io, and MongoDB to provide a robust and engaging chat experience.

## Features

- **Socket-Based Architecture:** It utilizes the power of WebSockets through the Socket.io library, enabling real-time, bidirectional communication between users.
- **User Onboarding:** When a user joins for the first time, they will be prompted to provide their name, and a warm welcome message will be displayed in the header with their name.
- **Chat History & User Count:** Newly joined users will have access to the chat history, enabling them to catch up on previous conversations. Users will also receive real-time information about how many others have already joined the chat.
- **Broadcasting Messages and Database Storage:** Messages sent by users will be broadcasted to all connected users in real-time. Simultaneously, these messages will be securely stored in the database for future reference and retrieval.

- **User Typing Indicators:** As users type messages, a 'typing...' indicator will be displayed to all connected users, indicating which user is currently typing. The indicator will disappear once the user finishes typing or clicks outside the input box.

- **Notification of New User Joins:** When a new user joins the application, their name will be added to the notification panel, marked with an online symbol (a green dot). All connected users will be notified of this addition, fostering a sense of community.

- **Notification of User Disconnections:** Whenever a user leaves the application, the notification panel will be updated to reflect the remaining connected users, and the name of the disconnected user will be removed.