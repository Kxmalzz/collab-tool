import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidV4 } from "uuid";

function Home() {
  const [roomId, setRoomId] = useState("");
  const [generatedRoomId, setGeneratedRoomId] = useState("");
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  const handleJoin = () => {
    if (roomId.trim() && userName.trim()) {
      // Passing name via query string (optional)
      navigate(`/editor/${roomId}?name=${encodeURIComponent(userName)}`);
    } else {
      alert("Please enter both Room ID and Name.");
    }
  };

  const handleCreate = () => {
    if (!userName.trim()) {
      alert("Please enter your name before creating a room.");
      return;
    }
    const newRoomId = uuidV4();
    setGeneratedRoomId(newRoomId);
    setRoomId(newRoomId);
    navigate(`/editor/${newRoomId}?name=${encodeURIComponent(userName)}`);
  };

  return (
     <div style={{ padding: "50px",color:"whitesmoke", textAlign: "center",backgroundImage:`url("/images/j1.webp")` ,height:"100vh"}}>
      <h1>📝 Real-Time Collaboration Tool</h1>
      <input
        type="text"
        placeholder="Enter Your Name"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        style={{ padding: "10px", width: "300px", fontSize: "16px", marginBottom: "10px" }}
      />
      <br />

   <div style={{ padding: "5px", textAlign: "center" }}>
      <input
        type="text"
        placeholder="Enter Room ID (e.g. abc123)"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        style={{ padding: "10px", width: "300px", fontSize: "16px" }}
      />
      <br /><br />
      <button
        onClick={handleJoin}
        style={{
          padding: "10px 30px",
          fontSize: "16px",
          marginRight: "10px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "5px"
        }}
      >

        Join Room
      </button>

      <button
        onClick={handleCreate}
        style={{
          padding: "10px 30px",
          fontSize: "16px",
          backgroundColor: "#2196F3",
          color: "white",
          border: "none",
          borderRadius: "5px"
        }}
      >
        ➕ Create Room
      </button>
    </div>

      {generatedRoomId && (
        <div style={{ marginTop: "20px", fontSize: "16px", color: "#28a745" }}>
          ✅ Room Created: <strong>{generatedRoomId}</strong>
          <br />
          Share this ID with others to collaborate!
        </div>
      )}
    </div>
  );
}

export default Home;