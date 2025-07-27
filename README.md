# Comprehensive Real-Time Event Management Platform API

This is a robust, production-ready RESTful API for an event management platform. The platform allows users to create, manage, and RSVP to events, participate in real-time event-specific chats, manage their profiles, and process payments for premium events.

## Technologies

-   **Node.js**: Backend server runtime.
-   **TypeScript**: For type-safe, maintainable code.
-   **MongoDB**: Database, with Mongoose for schema management.
-   **Express.js**: For routing and HTTP request handling.
-   **Socket.IO**: For real-time chat and RSVP notifications.
-   **JWT**: For secure user authentication.
-   **Stripe**: For payment processing.

## Getting Started

### Prerequisites

-   Node.js
-   MongoDB
-   Stripe Account

### Installation

1.  Clone the repository:
    ```sh
    git clone <repository-url>
    ```
2.  Install the dependencies:
    ```sh
    npm install
    ```
3.  Create a `.env` file and add the following environment variables:
    ```
    MONGO_URI=<your-mongodb-uri>
    JWT_SECRET=<your-jwt-secret>
    STRIPE_SECRET_KEY=<your-stripe-secret-key>
    ```
4.  Start the server:
    ```sh
    npm start
    ```

## API Endpoints

### User Routes

-   `POST /api/users/register`: Register a new user.
-   `POST /api/users/login`: Authenticate a user and return a JWT token.
-   `GET /api/users/profile`: Get the authenticated user’s profile.
-   `PUT /api/users/profile`: Update the authenticated user’s profile.

### Event Routes

-   `GET /api/events`: List all events (supports pagination and filters).
-   `GET /api/events/:id`: Get details of a specific event.
-   `POST /api/events`: Create a new event.
-   `PUT /api/events/:id`: Update an event.
-   `DELETE /api/events/:id`: Delete an event.

### RSVP Routes

-   `POST /api/events/:id/rsvp`: RSVP to an event.
-   `GET /api/events/:id/rsvps`: Get the list of RSVPs for an event.

### Payment Routes

-   `POST /api/payments/checkout`: Create a Stripe checkout session for a premium event.
-   `GET /api/payments/:userId`: Get payment history for the authenticated user.
