import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

// Clear all chat messages between two users
export const clearChat = async (req, res) => {
  try {
    const { receiverId } = req.params;
    const senderId = req.user._id;

    // Delete all messages where the sender & receiver match both ways
    await Message.deleteMany({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    });

    res.status(200).json({ message: "Chat cleared successfully ✅" });
  } catch (error) {
    console.error("Error clearing chat:", error);
    res.status(500).json({ message: "Failed to clear chat ❌" });
  }
};

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    // Get last message timestamp for each user
    const usersWithLastMessage = await Promise.all(
      filteredUsers.map(async (user) => {
        // Get last message between logged-in user and this user
        const lastMessage = await Message.findOne({
          $or: [
            { senderId: loggedInUserId, receiverId: user._id },
            { senderId: user._id, receiverId: loggedInUserId },
          ],
        })
          .sort({ createdAt: -1 })
          .limit(1);

        return {
          ...user.toObject(),
          lastMessageTime: lastMessage ? lastMessage.createdAt : null,
        };
      })
    );

    // Sort by last message time (most recent first)
    usersWithLastMessage.sort((a, b) => {
      if (!a.lastMessageTime && !b.lastMessageTime) return 0;
      if (!a.lastMessageTime) return 1;
      if (!b.lastMessageTime) return -1;
      return new Date(b.lastMessageTime) - new Date(a.lastMessageTime);
    });

    res.status(200).json(usersWithLastMessage);
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    // Validate file size if image is present
    if (image) {
      // Calculate approximate size from base64 string
      const base64Length = image.length;
      const sizeInBytes = (base64Length * 3) / 4;
      const sizeInKB = sizeInBytes / 1024;
      const sizeInMB = sizeInKB / 1024;

      // Reject if larger than 2MB (more realistic for compressed images)
      if (sizeInMB > 2) {
        return res.status(413).json({
          error: "File too large",
          message: "Image must be less than 2MB",
          size: `${sizeInMB.toFixed(2)}MB`,
        });
      }
    }

    let imageUrl;
    if (image) {
      // Upload base64 image to cloudinary with optimizations
      const uploadResponse = await cloudinary.uploader.upload(image, {
        resource_type: "auto",
        folder: "chat-images",
        transformation: [
          {
            quality: "auto:low",
            fetch_format: "auto",
          },
        ],
      });
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete a specific message
export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user._id;

    // Find the message
    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    // Only allow sender to delete their own message
    if (message.senderId.toString() !== userId.toString()) {
      return res.status(403).json({ error: "You can only delete your own messages" });
    }

    // Delete the message from database
    await Message.findByIdAndDelete(messageId);

    // Notify the receiver via socket
    const receiverSocketId = getReceiverSocketId(message.receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("messageDeleted", { messageId });
    }

    res.status(200).json({ message: "Message deleted successfully", messageId });
  } catch (error) {
    console.log("Error in deleteMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
