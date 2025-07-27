# Enhanced Real-Time Event Management Platform API

This is a robust, production-ready RESTful API for an event management platform that enables users to create, manage, and RSVP to events, participate in real-time event-specific chats, manage their profiles, process payments for premium events, and receive notifications.

## Technologies

-   **Node.js**: Backend server runtime.
-   **TypeScript**: For type-safe, maintainable code.
-   **MongoDB**: Database, with Mongoose for schema management.
-   **Express.js**: For routing and HTTP request handling.
-   **Socket.IO**: For real-time chat and RSVP notifications.
-   **JWT**: For secure user authentication.
-   **Stripe**: For payment processing.
-   **Nodemailer**: For email notifications.

## Getting Started

### Prerequisites

-   Node.js
-   MongoDB
-   Stripe Account
-   Gmail Account (for Nodemailer)

### Installation

1.  Clone the repository:
    ```sh
    git clone https://github.com/m0p0m/landing.git
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
    EMAIL_USER=<your-gmail-address>
    EMAIL_PASS=<your-gmail-password>
    ```
4.  Start the server:
    ```sh
    npm start
    ```

## API Endpoints

All routes are prefixed with `/api`.

### User Routes (`/users`)

-   `POST /register`: Register a new user.
-   `POST /login`: Authenticate a user and return a JWT token.
-   `GET /profile`: Get the authenticated user’s profile.
-   `PUT /profile`: Update the authenticated user’s profile.
-   `POST /password-reset`: Request a password reset.

### Event Routes (`/events`)

-   `GET /`: List all events (supports pagination and filters).
-   `GET /search`: Search for events.
-   `GET /:id`: Get details of a specific event.
-   `POST /`: Create a new event.
-   `PUT /:id`: Update an event.
-   `DELETE /:id`: Delete an event.

### RSVP Routes (`/events/:id/rsvps`)

-   `POST /`: RSVP to an event.
-   `GET /`: Get the list of RSVPs for an event.

### Payment Routes (`/payments`)

-   `POST /checkout`: Create a Stripe checkout session for a premium event.
-   `GET /history`: Get payment history for the authenticated user.

### Chat Routes (`/events/:id/messages`)

-   `GET /`: Get chat history for an event.
