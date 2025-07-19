// frontend/src/EditorPage.js
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useParams,useNavigate,useLocation } from "react-router-dom";

const socket = io("http://localhost:5000");

function EditorPage() {
const { roomId } = useParams();
const navigate=useNavigate();
const [text, setText] = useState("");
const [userCount, setUserCount] = useState(1);
const location = useLocation();
const queryParams = new URLSearchParams(location.search);
const userName = queryParams.get("name");
console.log("User joined:", userName);
useEffect(() => {
const interval = setInterval(() => {
socket.emit("save-document", text);
}, 2000); // Save every 2 seconds

return () => clearInterval(interval);
}, [text]);
useEffect(() => {
socket.emit("join-room", roomId);
socket.emit("get-document", roomId);

socket.once("load-document", (document) => {
setText(document);
});

socket.on("receive-changes", (newText) => {
setText(newText);
});
socket.on("user-count", (count) => {
setUserCount(count);
});


return () => {
socket.off("receive-changes");
socket.off("load-document");
socket.off("user-count");

};
}, [roomId]);

const handleChange = (e) => {
const newText = e.target.value;
setText(newText);
socket.emit("send-changes", { roomId, text: newText });
};
const handleLeave = () => {
socket.disconnect();
navigate("/");
};

return (
<div style={{ padding: "20px",fontSize: "15px", color: "black", backgroundColor: "#e5e8e8", height: "100vh" }}>
<h2>Room: {roomId}</h2>
<h3>{userName} joined</h3>
<p>👥 Users in this room: {userCount}</p>
<button
  onClick={handleLeave}
  style={{
    position: "absolute",
    top: "28px",
    right: "20px",
    padding: "8px 16px",
    fontSize: "16px",
    backgroundColor: "#ec7063",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  }}
>
  Leave Room
</button> 
  <textarea  
    rows={20}  
    cols={80}  
    value={text}  
    onChange={handleChange}  
    style={{ fontSize: "16px", padding: "10px",width: "99%" }}  
  />  
</div>

);
}

export default EditorPage;
