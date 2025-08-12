# Project Conventions

This document outlines the conventions used in this project to ensure consistency and maintainability.

## File Naming

All files should be named using **kebab-case**. For files that contain a specific type of class, a suffix should be added to the filename.

- **Controllers:** `*.controller.ts` (e.g., `user.controller.ts`)
- **Services:** `*.service.ts` (e.g., `user.service.ts`)
- **Models:** `*.model.ts` (e.g., `user.model.ts`)
- **Routes:** `*.route.ts` (e.g., `user.route.ts`)
- **Middlewares:** `*.middleware.ts` (e.g., `auth.middleware.ts`)
- **Configs:** `*.config.ts` (e.g., `database.config.ts`)
- **Jobs:** `*.job.ts` (e.g., `email.job.ts`)

## Project Structure

The project is structured into the following directories under `/src`:

- `/config`: Contains all application configuration files.
- `/controllers`: Contains Express controllers. Controllers should be as thin as possible, only responsible for handling the request and response cycle.
- `/services`: Contains the business logic of the application. All complex logic should reside in services.
- `/models`: Contains Mongoose models.
- `/routes`: Contains Express route definitions.
- `/middlewares`: Contains Express middlewares.
- `/sockets`: Contains Socket.IO related setup and event handlers.
- `/utils`: Contains utility functions.
- `/jobs`: Contains background job definitions for BullMQ.

## Coding Style

We use ESLint and Prettier to enforce a consistent coding style. Please make sure to run `npm run lint` before committing your changes. The configuration files for these tools are located in the root of the project (`.eslintrc.js` and `.prettierrc`).

## Commit Messages

Commit messages should follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification. This helps in generating automated changelogs and makes the commit history more readable.

Example:

```
feat(auth): add refresh token support
```

## API Design

The API should follow RESTful principles. Resource names should be plural and in kebab-case.

Example:

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get a single user
- `POST /api/users` - Create a new user
- `PUT /api/users/:id` - Update a user
- `DELETE /api/users/:id` - Delete a user
