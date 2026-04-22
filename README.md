# Student Login System (MERN Stack)

A complete full-stack web application featuring a secure student registration, login, and dashboard system. 

## Features
- Modern UI.
- Secure Authentication with JWT (JSON Web Tokens).
- Passwords hashed using `bcryptjs`.
- Express REST API with basic CRUD for Students.
- Clean separation of Frontend (`client/`) and Backend (`server/`).

## Local Setup

### 1. Database Setup
Make sure you have MongoDB installed locally running at `mongodb://127.0.0.1:27017` or change the `MONGO_URI` in the `.env` file to your MongoDB Atlas connection string.

### 2. Backend Setup
1. Open a terminal and navigate to the server folder:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the server (starts on `http://localhost:5000`):
   ```bash
   npm run dev
   ```

### 3. Frontend Setup
The frontend uses standard HTML/CSS/JS, no build step is required! 
You can simply open `client/index.html` in your browser. Wait, since browsers might have `CORS` issues when fetching file protocols, the best way to serve the client locally is to use a VS Code extension like **Live Server** or serve the folder using a tool like `npx serve client`.

1. To use Live Server: Right-click `index.html` in VS Code -> "Open with Live Server".
2. Open your browser on the host provided (typically `http://127.0.0.1:5500/client/index.html`).

---

## Postman Testing Collection

You can test the API on Postman.

### 1. Register a new student
- **URL**: `POST http://localhost:5000/api/register`
- **Body** (JSON):
  ```json
  {
      "name": "Jane Doe",
      "email": "jane@example.com",
      "password": "mypassword123"
  }
  ```
- **Response**: Returns access token and user info.

### 2. Login
- **URL**: `POST http://localhost:5000/api/login`
- **Body** (JSON):
  ```json
  {
      "email": "jane@example.com",
      "password": "mypassword123"
  }
  ```
- **Response**: Returns access token.

### 3. Get All Students (Protected Route)
- **URL**: `GET http://localhost:5000/api/students`
- **Headers**:
  - `Authorization`: `Bearer <YOUR_TOKEN_HERE>`
- **Response**: List of all students.

### 4. Delete Student (Protected Route)
- **URL**: `DELETE http://localhost:5000/api/students/:id`
- **Headers**:
  - `Authorization`: `Bearer <YOUR_TOKEN_HERE>`
- **Response**: 200 OK.

---

## Deployment (Render.com)

### Backend Deployment
1. Push this whole repository to GitHub.
2. Log into Render and create a **New Web Service**.
3. Connect your GitHub repository and select it.
4. Set Root Directory to `server`.
5. Set Build Command: `npm install`.
6. Set Start Command: `node server.js`.
7. Add Environment Variables in Advanced settings:
   - `MONGO_URI` = your valid MongoDB Cloud Atlas URI
   - `JWT_SECRET` = your custom secret string
8. Deploy!

### Frontend Deployment (Netlify or Render)
You can deploy `client/` as a static side using **Render Static Site** or **Netlify**.
- **Important Configuration**: Before you deploy the frontend, you need to open `client/app.js` and change `const API_URL = 'http://localhost:5000/api';` to your **Deployed Backend URL**, e.g., `const API_URL = 'https://my-backend-app.onrender.com/api';`
- On Netlify, just drag and drop the `client/` folder and it will immediately go live.
