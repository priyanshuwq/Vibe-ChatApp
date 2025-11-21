# VibeChat

Secure, real-time chat where each user can only access their own conversations, built with the MERN stack and featuring direct messaging, image sharing, GIF support, and a modern responsive UI.

## Features

- User authentication (signup, login) with JWT and httpOnly cookies  
- Real-time one-on-one messaging via Socket.io  
- Online/offline user presence  
- Image messages with client-side compression and Cloudinary storage  
- GIF support via an in-app GIF picker  
- Light/dark theme toggle with persistence (Tailwind + DaisyUI)  
- Typing and loading feedback (skeleton loaders, smooth animations)  
- Mobile-first, fully responsive layout  
 - Access control on conversations so a user can only see their own chats  


## Installation

### Prerequisites

- Node.js (LTS recommended)
- npm
- MongoDB instance (local or Atlas)
- Cloudinary account (for image storage)
- GitHub personal access token (for GitHub contribution stats on the Settings page)

### 1. Clone the repository

```bash
git clone https://github.com/priyanshuwq/Vibe-ChatApp.git
cd Vibe-ChatApp
```

### 2. Install dependencies

From the project root:

```bash
npm run install-all
```

This installs packages for:

- `backend/`
- `frontend/`
- root tooling

If that script is unavailable, you can install manually:

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 3. Configure environment variables

#### Backend

Create `backend/.env` and set:

```bash
MONGODB_URI=your-mongodb-connection-string
PORT=5001

JWT_SECRET=your-jwt-secret

CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

CLIENT_URL=http://localhost:5173
NODE_ENV=development

GITHUB_API_TOKEN=your-github-personal-access-token
```

Use `backend/.env.example` as a reference.

#### Frontend

If you later add environment variables for the frontend, follow Vite's convention (`VITE_...`) and create `frontend/.env`.  
Currently, the frontend reads the backend base URL from `import.meta.env.MODE` and does not require extra keys for local development.

### 4. Run the app in development

From the project root:

```bash
npm run dev
```

This starts:

- Backend: `http://localhost:5001`
- Frontend: `http://localhost:5173`

Open the frontend URL in your browser and sign up / log in to start using VibeChat.

## Production build

From the project root:

```bash
npm run build
npm start
```

- `npm run build` installs dependencies and builds the frontend into `frontend/dist`  
- `npm start` starts the backend server and serves the built frontend as static files

The backend then exposes:

- API under `/api/*`  
- Frontend SPA for all other routes (catch-all in `backend/src/index.js`)

## Tech Stack

### Frontend

- React + Vite  
- Tailwind CSS + DaisyUI  
- Zustand (state management)  
- Socket.io-client  
- Axios  
- Framer Motion  

### Backend

- Node.js + Express  
- MongoDB + Mongoose  
- Socket.io  
- Cloudinary  
- JWT authentication  

<div align = "center">
  If you found this useful, consider giving it a ⭐

Made with ❤️ Priyanshu
</div>




