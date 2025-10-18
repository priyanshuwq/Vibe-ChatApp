# Vibe Chat - AI Coding Agent Instructions

## Architecture Overview

**Monorepo Structure**: Root contains concurrently-managed frontend (React/Vite) and backend (Express/Node.js) with separate `package.json` files.

**Real-time Communication**: Socket.io bidirectional messaging between client (`frontend/src/store/useAuthStore.js`) and server (`backend/src/lib/socket.js`). Socket connection lifecycle tied to authentication state - connects on login, disconnects on logout.

**State Management**: Zustand stores handle all client state:
- `useAuthStore`: Auth, socket connection, online users
- `useChatStore`: Messages, selected user, message subscriptions
- `useThemeStore`: Dark/light theme persistence

**Authentication Flow**: JWT-based auth with httpOnly cookies. Token generated in `backend/src/lib/utils.js::generateToken()`, validated via `backend/src/middleware/auth.middleware.js::protectRoute()`. Frontend checks auth on mount and route changes.

## Critical Development Workflows

### Starting Development
```bash
# Install all dependencies (root + frontend + backend)
npm run install-all

# Start both servers concurrently
npm run dev
# Backend: http://localhost:5001
# Frontend: http://localhost:5173
```

### Production Build
```bash
npm run build        # Installs deps, builds frontend to frontend/dist
npm start            # Runs backend, serves frontend/dist as static files
```

**SPA Catch-all**: In production, `backend/src/index.js` serves React app for all non-API routes after API routes are registered.

## Project-Specific Conventions

### Module Type Mismatch (Critical)
- **Root**: `"type": "commonjs"` in `package.json`
- **Backend**: `"type": "module"` - uses ES6 imports (`import`/`export`)
- **Frontend**: `"type": "module"` - uses ES6 imports
- Never mix require/module.exports in backend/frontend code

### Image Handling Pipeline
1. **Client-side compression** (`frontend/src/utils/imageCompression.js`):
   - Resizes to max 600x600px
   - Compresses to JPEG at 75% quality
   - Target: <800KB base64
2. **Server validation** (`backend/src/controllers/message.controller.js::sendMessage()`):
   - Rejects images >2MB after base64 decoding
   - Uploads to Cloudinary with `quality: auto:low`
3. **Always** compress images before sending to prevent payload size errors

### Socket.io Patterns
**Connection Management** (`backend/src/lib/socket.js`):
```javascript
const userSocketMap = {}; // {userId: socketId} - tracks online users
io.emit("getOnlineUsers", Object.keys(userSocketMap)); // Broadcast on connect/disconnect
```

**Message Flow**:
- Client sends via HTTP POST to `/api/messages/send/:receiverId`
- Server saves to DB, emits `newMessage` event to receiver's socket
- Client subscribes in `useChatStore.subscribeToMessages()` when chat is open

### API Configuration
- **Development**: Backend on `:5001`, frontend on `:5173` with CORS
- **Production**: Single server serves API at `/api/*` and frontend SPA
- `frontend/src/lib/axios.js` configures base URL based on `import.meta.env.MODE`

## Integration Points

### Cloudinary Media Storage
- Config: `backend/src/lib/cloudinary.js` (requires 3 env vars)
- Used for: Profile pictures (`auth.controller.js::updateProfile`) and message images (`message.controller.js::sendMessage`)
- Folder structure: `chat-images/` for messages

### MongoDB Collections
- `users`: `fullName`, `email`, `password` (bcrypt hashed), `profilePic` (Cloudinary URL), `isAdmin`
- `messages`: `senderId`, `receiverId`, `text`, `image` (Cloudinary URL), `timestamps`
- No message deletion implemented - README mentions "48-hour auto-delete" but `backend/src/lib/cleanup.js` is empty (feature not implemented)

### Environment Variables Required
**Backend** (`.env` in `backend/`):
```
PORT=5001
MONGODB_URI=mongodb://...
JWT_SECRET=your-secret
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
NODE_ENV=development|production
```

## Common Pitfalls

1. **Socket connection requires authenticated user**: Check `useAuthStore.authUser` exists before calling `connectSocket()`
2. **Route protection**: All `/api/messages/*` and `/api/auth/update-profile` routes use `protectRoute` middleware
3. **CORS in production**: Update `backend/src/lib/socket.js` and `backend/src/index.js` CORS origins for deployment
4. **Message subscription cleanup**: Always call `useChatStore.unsubscribeFromMessages()` when unmounting chat to prevent memory leaks
5. **Theme persistence**: Uses `localStorage` and `data-theme` attribute on `<html>` - DaisyUI + Tailwind combo requires both

## Key Files for Feature Development

- **Add API route**: `backend/src/routes/*.route.js` → controller in `backend/src/controllers/`
- **Add page**: `frontend/src/pages/*.jsx` → register in `frontend/src/App.jsx` Routes
- **Socket events**: Define in `backend/src/lib/socket.js`, subscribe in Zustand stores
- **UI components**: `frontend/src/components/` - use Tailwind + DaisyUI classes, respect theme state
