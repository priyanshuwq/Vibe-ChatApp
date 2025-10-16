# Vibe Chat App - AI Agent Instructions

## Architecture Overview

This is a **monorepo MERN stack real-time chat application** with three directories:
- `backend/` - Express.js server with Socket.io (ES modules: `"type": "module"`)
- `frontend/` - React + Vite SPA with Zustand state management (ES modules)
- Root `package.json` - Orchestrates both with `concurrently`

**Critical**: Backend uses ES modules (`import/export`), not CommonJS.

## Development Workflow

```bash
# Install all dependencies (root + backend + frontend)
npm run install-all

# Run both servers concurrently (backend:5001, frontend:5173)
npm run dev

# Backend only: cd backend && npm run dev (nodemon auto-reload)
# Frontend only: cd frontend && npm run dev (Vite HMR)
```

**Environment Setup**: Backend requires `.env` in `backend/` directory:
```
MONGODB_URI=mongodb://...
JWT_SECRET=your_secret
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
PORT=5001
NODE_ENV=development
```

## State Management Architecture

### Zustand Stores (Frontend)
Three global stores in `frontend/src/store/`:

1. **`useAuthStore.js`** - Authentication + Socket.io connection lifecycle
   - Manages `authUser`, socket connection, `onlineUsers` array
   - `connectSocket()` called after login/signup, creates socket with `userId` query param
   - Socket connection tied to auth state: `logout()` → `disconnectSocket()`

2. **`useChatStore.js`** - Chat messages and user list
   - `subscribeToMessages()` listens to `"newMessage"` socket event
   - Must call `unsubscribeFromMessages()` on component unmount
   - Example: See `ChatContainer.jsx` useEffect cleanup

3. **`useThemeStore.js`** - Dark/light theme with localStorage persistence

**Pattern**: Stores expose methods, not just state. Call `getUsers()`, `sendMessage()` from components.

## Socket.io Real-Time Communication

### Backend (`backend/src/lib/socket.js`)
- Single `io` instance exported, shared with Express app
- `userSocketMap` object: `{ userId: socketId }` for online user tracking
- Key events:
  - `"getOnlineUsers"` - Emitted on connect/disconnect with array of user IDs
  - `"newMessage"` - Emitted to receiver's socketId when message sent

### Frontend (`frontend/src/store/useAuthStore.js`)
- Socket created in `connectSocket()` with `userId` query: `io(BASE_URL, { query: { userId } })`
- Listen to `"getOnlineUsers"` to update `onlineUsers` state
- See `useChatStore.js` for `"newMessage"` subscription pattern

**Critical**: Always pass `userId` in socket handshake query for online status tracking.

## Authentication Flow

1. **JWT in HTTP-only cookie** - `generateToken()` in `backend/src/lib/utils.js` sets `jwt` cookie
2. **Middleware** - `protectRoute` in `backend/src/middleware/auth.middleware.js` verifies token, attaches `req.user`
3. **Frontend** - `axiosInstance` in `frontend/src/lib/axios.js` sets `withCredentials: true` to send cookies
4. **Protected routes** - All `/api/messages/*` and profile updates require `protectRoute` middleware

**On app load**: Frontend calls `checkAuth()` → backend `/api/auth/check` validates JWT → returns user object or 401.

## Image/GIF Handling - Size Limits

**Backend enforces 5MB payload limit** to accommodate base64 encoding (see `backend/src/index.js`):
```javascript
app.use(express.json({ limit: "5mb" }));
```

### Frontend Compression Flow (`frontend/src/utils/imageCompression.js`)
1. **User uploads** → Read as base64
2. **Compress to 1.5MB** target (safety margin for 2MB backend validation limit)
3. **Scale dimensions** to max 800x800px if needed
4. **Reduce JPEG quality** iteratively until < 1.5MB
5. **Final check**: Reject if still > 1.8MB after compression

**GIF handling**: Fetch → Blob → Check size (max 1.5MB) → Compress if needed (see `MessageInput.jsx` `handleGifSelect`)

**Backend validation** (`backend/src/controllers/message.controller.js` `sendMessage`):
- Calculates base64 size: `(base64.length * 3) / 4`
- Returns 413 error if > 2MB actual file size
- Note: 5MB payload limit accounts for base64 encoding overhead (~33% increase)

**Cloudinary upload**: Images stored with `quality: "auto:low"`, `fetch_format: "auto"` transformations.

## API Routes Structure

### Auth (`/api/auth`)
- `POST /signup` - Create account, auto-login with JWT cookie
- `POST /login` - Authenticate, set JWT cookie
- `POST /logout` - Clear JWT cookie
- `PUT /update-profile` - Upload profile pic to Cloudinary (requires auth)
- `GET /check` - Validate JWT, return user object (requires auth)

### Messages (`/api/messages`)
- `GET /users` - Get all users except current (for sidebar)
- `GET /:id` - Get all messages between current user and `:id`
- `POST /send/:id` - Send message to `:id` (text/image, emits socket event)

**All message routes require `protectRoute` middleware.**

## Key Patterns & Conventions

### Component Patterns
- **Sidebar.jsx**: Calls `getUsers()` on mount, maps over `users` array
- **ChatContainer.jsx**: Subscribes to socket events on `selectedUser` change, cleanup in useEffect return
- **MessageInput.jsx**: Handles image compression before `sendMessage()` call

### Styling
- **Tailwind CSS** + **DaisyUI** components
- **Theme-aware**: Components check `theme` from `useThemeStore()` for dark/light classes
- Example: `${theme === "dark" ? "bg-[#1f1f1f]" : "bg-white"}`

### Error Handling
- Backend: Try-catch blocks, log to console, return 500 with `{ message: "..." }`
- Frontend: Axios errors caught, display with `react-hot-toast`
- Socket errors: No explicit error handling (rely on reconnection)

## Production Deployment

Backend serves frontend static files in production:
```javascript
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (req, res) => res.sendFile(...)); // SPA fallback
}
```

**Build process**: `npm run build` → Runs `cd frontend && vite build` → Outputs to `frontend/dist/`

## Common Gotchas

1. **Socket not connecting?** Check `userId` in query params, ensure `connectSocket()` called after auth
2. **Images failing?** Verify compression to < 1.5MB, check Cloudinary env vars
3. **Auth issues?** Ensure `withCredentials: true` on axios, check JWT_SECRET in .env
4. **CORS errors?** Backend CORS set to `http://localhost:5173` in dev (update for production)
5. **Messages not real-time?** Verify `subscribeToMessages()` called and cleanup on unmount
6. **PayloadTooLargeError?** Images exceed limit - increase backend limit or improve frontend compression

## Files to Reference

- **Socket setup**: `backend/src/lib/socket.js`, `frontend/src/store/useAuthStore.js`
- **Auth flow**: `backend/src/controllers/auth.controller.js`, `frontend/src/store/useAuthStore.js`
- **Message sending**: `backend/src/controllers/message.controller.js`, `frontend/src/components/MessageInput.jsx`
- **Image compression**: `frontend/src/utils/imageCompression.js`
- **Store patterns**: All stores in `frontend/src/store/`
