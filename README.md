# Real-Time Event Management Platform API

This is a RESTful API for an event management platform that enables users to create events, RSVP to events, and chat within each event in real time.

## Technologies

-   **Node.js**: Backend server runtime.
-   **TypeScript**: For type-safe and maintainable code.
-   **MongoDB**: Database, with Mongoose for schema management.
-   **Express.js**: For routing and HTTP request handling.
-   **Socket.IO**: For real-time chat and RSVP notifications.
-   **JWT**: For secure user authentication.

## Architecture

The project follows clean architecture with the following layers:

-   **Entities**: Core data models (e.g., User, Event, RSVP).
-   **Use Cases**: Business logic (e.g., creating an event, sending a chat message).
-   **Controllers**: Handle HTTP requests and responses.
-   **Repositories**: Abstract database operations.

## Getting Started

### Prerequisites

-   Node.js
-   MongoDB

### Installation

1.  Clone the repository:
    ```sh
    git clone https://github.com/m0p0m/landing.git
    ```
2.  Install the dependencies:
    ```sh
    npm install
    ```
3.  Start the server:
    ```sh
    npm start
    ```

## API Endpoints

### Authentication

-   `POST /register`: Register a new user.
    -   **Request Body**: `{ "username": "testuser", "email": "test@example.com", "password": "password123" }`
-   `POST /login`: Authenticate a user and return a JWT token.
    -   **Request Body**: `{ "email": "test@example.com", "password": "password123" }`

### Events

-   `GET /events`: Fetch a list of all events.
-   `POST /events`: Create a new event (authenticated users only).
    -   **Headers**: `{ "Authorization": "Bearer <token>" }`
    -   **Request Body**: `{ "title": "My Event", "description": "A cool event", "date": "2024-12-31", "time": "18:00", "location": "My Place" }`

### RSVP

-   `POST /rsvp`: RSVP to an event (authenticated users only).
    -   **Headers**: `{ "Authorization": "Bearer <token>" }`
    -   **Request Body**: `{ "eventId": "<event-id>", "status": "going" }`

### Real-Time Features (Socket.IO)

-   **Chat**:
    -   Join an event's chat room: `socket.emit('joinEvent', '<event-id>')`
    -   Send a message: `socket.emit('chatMessage', { eventId: '<event-id>', message: 'Hello!' })`
-   **RSVP Notifications**:
    -   RSVPs trigger a real-time notification to all users in the event room.
