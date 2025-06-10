# Do Makina? Backend

This is the official repository for the Node.js backend of our application. Follow the instructions below to set up and run the project.

---

## Prerequisites

Before you begin, ensure you have the following installed on your system:

-   **Node.js** (LTS version recommended): [Download Node.js](https://nodejs.org/)
-   **npm** (Comes with Node.js): Verify installation with:
    ```bash
    node -v
    npm -v
    ```

---

## Setup Instructions

### 1. Clone the Repository

Clone the repository to your local machine and navigate to the project directory:

```bash
git clone https://github.com/DoMakina/backend.git
cd backend
```

---

### 2. Install Dependencies

Install all required dependencies using npm:

```bash
npm install
```

---

### 3. Configure Environment Variables

Create a `.env` file in the root directory to store environment-specific variables. Use the provided `.env.sample` file as a reference:

```bash
cp .env.sample .env
```

Edit the `.env` file to include your configuration values, such as `PORT`, database credentials, or API keys.

---

### 4. Available Scripts

The following npm scripts are available for use:

1. **Start the Application**:

    ```bash
    npm start
    ```

    Runs the application in production mode using `node src/index.js`.

2. **Run in Development Mode**:
    ```bash
    npm run dev
    ```
    Starts the application with `nodemon`, enabling live reloads whenever code changes.

3. **Apply pending migrations**:
    ```bash
    npm run migrate
    ```
   
4. **Compile typescript files & delete "dist"**:
    ```bash
    npm run build
    ```
---

## Project Structure

Below is the structure of the project for easier navigation:

```
.
├── src
│   ├── index.js       # Application entry point
│   ├── routes/        # Define API routes
│   ├── controllers/   # Controller logic
│   ├── models/        # Database models
|   ├── services/      # Business logic
│   ├── middlewares/   # Middleware logic
|   ├── cli/           # Command Line Script
│   ├── utils/         # Utility functions
│   └── config/        # Configuration files
├── .env               # Environment variable file
├── package.json       # Project metadata and dependencies
└── README.md          # Documentation
```

---

## License

This project is licensed under the [MIT License](LICENSE).

If you have questions or suggestions, please open an issue or contact the maintainer.

Happy coding! 🚀
