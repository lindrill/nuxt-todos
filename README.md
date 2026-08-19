# TinkerFlow

A full-stack task and todo management application built to help users organize tasks, track progress, and manage daily activities through a centralized dashboard.

<img width="5826" height="3417" alt="tinkerflow-dashboard-full-page" src="https://github.com/user-attachments/assets/d8fd8f5e-c6fa-4cbf-a46c-10f4fd55ed10" />
<img width="1905" height="922" alt="localhost_3000_ (9)" src="https://github.com/user-attachments/assets/5d3ec434-59c7-4719-9a8c-0023c3a62b3f" />


## 🚧 Project Status

**In Progress**

TinkerFlow is an ongoing personal full-stack project built to explore and demonstrate modern web development using Vue/Nuxt and Node.js.

The core task management functionality, dashboard, calendar, categories, and API integration are implemented. The project is still being refined, with ongoing bug fixes, UI improvements, and additional features planned.

## ✨ Features

* Task management
* Dashboard with task statistics
* Completed and pending task tracking
* Task completion percentage
* Calendar view with task indicators
* Upcoming tasks overview
* Task categories
* REST API integration

## 🛠️ Tech Stack

### Frontend

* **Vue 3**
* **Nuxt 4**
* **Quasar Framework**
* JavaScript
* HTML5
* CSS

### Backend

* **Node.js**
* **Express.js**
* **MongoDB**
* REST API

## 📁 Project Repositories

TinkerFlow is divided into separate frontend and backend repositories:

| Repository    | Description                                                  |
| ------------- | ------------------------------------------------------------ |
| `nuxt-todos`  | Frontend application built with Vue 3, Nuxt 4, and Quasar    |
| `vueapi-proj` | Backend REST API built with Node.js, Express.js, and MongoDB |


## 🚀 Getting Started

### Frontend

Clone the frontend repository:

```bash
git clone <https://github.com/lindrill/nuxt-todos.git>
cd nuxt-todos
npm install
```

Start the development server:

```bash
npm run dev
```

### Backend

Clone the backend repository:

```bash
git clone <https://github.com/lindrill/vueproj-api.git>
cd vueapi-proj
npm install
```

Start the backend using the appropriate script from `package.json`.

Make sure MongoDB is running and the required environment variables are configured.

## 🔐 Environment Variables

The backend requires environment variables for the MongoDB connection and server configuration.

Create a `.env` file in the backend project:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=your_port
```

Do not commit your `.env` file or any credentials to the repository.

## 🧩 What I Built

This project was developed as a hands-on full-stack application to practice and demonstrate:

* Building user interfaces with Vue 3 and Nuxt 4
* Component-based development with Quasar
* Creating dashboard and calendar interfaces
* Connecting a frontend application to a REST API
* Building backend services with Express.js
* Working with MongoDB
* Managing and displaying task data
* Structuring a frontend and backend as separate applications

## 🔮 Planned Improvements

As the project is still in development, some planned improvements include:

* Additional bug fixes and refinements
* Task priority levels and overdue indicators
* Recurring tasks
* Task reminders and notifications
* Drag-and-drop task organization
* Responsive UI
  
## 📌 Notes

This project is primarily a personal portfolio project and is actively being developed. Some features and UI elements may change as development continues.

## 📄 License

This project is for personal and portfolio development purposes.
