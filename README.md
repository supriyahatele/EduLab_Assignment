
# Task Management System 

This project is a backend API for a Task Management System designed with enhanced security features, including JWT-based authentication and role-based access control. The API allows registered users to manage tasks, with permissions varying based on user roles (admin, user).

## Features

- **User Registration and Authentication**
  - Users can register and log in to the system.
  - JWT-based authentication ensures secure access.
  - Role-based access control with roles like 'admin' and 'user'.

- **Task Management**
  - Create, update, delete, and retrieve tasks.
  - Task permissions are managed based on user roles.
  - Tasks can be filtered by priority, status.

- **Security**
  - Route guards ensure that only authorized users can access specific endpoints.
  - Input validation to prevent common security vulnerabilities.
  
- **Database Interaction**
  - Uses Mongoose for managing data with enforced data integrity.
  - Models are created for users, roles, and tasks.


## API Endpoints

### User Endpoints

- **Register User**
  - `POST /api/v1/users/register`
  - Registers a new user.

- **Login User**
  - `POST /api/v1/users/login`
  - Authenticates a user and provides a JWT.

### Task Endpoints

- **Create Task**
  - `POST /api/v1/tasks/createTask`
  - Creates a new task. Requires `admin` role.

- **Get All Tasks**
  - `GET /api/v1/tasks/getAllTasks`
  - Retrieves all tasks. Requires `admin` role.

- **Update Task**
  - `PATCH /api/v1/tasks/updateTask/:id`
  - Updates an existing task. Requires `admin` or `user` role.

- **Delete Task**
  - `DELETE /api/v1/tasks/deleteTask/:id`
  - Deletes a task. Requires `admin` role.

## Middleware

- **Auth Middleware**
  - Ensures the user is authenticated via JWT.

- **Authorization Middleware**
  - Restricts access to endpoints based on user roles.

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/supriyahatele/EduLab_Assignment.git
   cd  EduLab_Assignment
   npm install
   start the server with command : npm run server

  ## Project Structure
   ├── config
   ├── controllers
   │   ├── userController.js
   │   └── taskController.js
   ├── middlewares
   │   ├── auth.js
   │   └── authorization.js
   ├── models
   │   ├── userModel.js
   │   └── taskModel.js
   ├── routes
   │   ├── userRoute.js
   │   └── taskRoute.js
   ├── .env
   ├── .gitignore
   ├── index.js
   └── README.md

 

