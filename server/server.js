const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const { Server } = require("socket.io");
const Document = require("./models/document");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
cors: {
origin: "http://localhost:3000",
methods: ["GET", "POST"],
},
});

mongoose.connect("mongodb://127.0.0.1:27017/realtime-docs", {
useNewUrlParser: true,
useUnifiedTopology: true,
});

// ✅ Add this function
async function findOrCreateDocument(id) {
if (!id) return;

const document = await Document.findById(id);
if (document) return document;

return await Document.create({ _id: id, data: "" });
}

io.on("connection", (socket) => {
socket.on("join-room", async (roomId) => {
socket.join(roomId);

const document = await findOrCreateDocument(roomId);
socket.emit("load-document", document.data);

// Broadcast updated user count
const userCount = io.sockets.adapter.rooms.get(roomId)?.size || 0;
io.to(roomId).emit("user-count", userCount);

socket.on("send-changes", ({ roomId, text }) => {
socket.to(roomId).emit("receive-changes", text);
});

socket.on("save-document", async (data) => {
await Document.findByIdAndUpdate(roomId, { data });
});

// 👇 Handle disconnection
socket.on("disconnect", () => {
setTimeout(() => {
const userCount = io.sockets.adapter.rooms.get(roomId)?.size || 0;
io.to(roomId).emit("user-count", userCount);
}, 500); // wait a bit to let socket leave the room
});
});
});

server.listen(5000, () => {
console.log("Server running at http://localhost:5000");
});
