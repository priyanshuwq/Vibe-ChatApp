import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"], // ✅ Change this to your client URL in prod
    methods: ["GET", "POST"],
  },
});

const userSocketMap = {}; // {userId: socketId}

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
    console.log(`User ${userId} connected with socket ID: ${socket.id}`);
  }

  // ✅ Only send IDs of online users
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // 🔹 Handle sending & receiving messages
  socket.on("sendMessage", (data) => {
    const { senderId, receiverId, message } = data;

    const receiverSocketId = userSocketMap[receiverId];
    const senderSocketId = userSocketMap[senderId];

    // Send to receiver (if online)
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receiveMessage", {
        senderId,
        message,
        createdAt: new Date(),
      });
    }

    // ✅ Also send back to sender instantly
    if (senderSocketId) {
      io.to(senderSocketId).emit("receiveMessage", {
        senderId,
        message,
        createdAt: new Date(),
      });
    }
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
