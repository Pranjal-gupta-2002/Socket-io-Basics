import "./App.css";
import React, { useEffect, useMemo, useState } from "react";
import io from "socket.io-client";
import { Button, Container, Stack, TextField, Typography } from "@mui/material";

const App = () => {
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [roomName, setRoomName] = useState("");
  const [socketId, setSocketId] = useState("");
  const [messages, setMessages] = useState([]);
  console.log(messages);
  const socket = useMemo(() => io("http://localhost:3000"), []);
  const submitHandler = (e) => {
    e.preventDefault();
    socket.emit("message", { message, room });
    setMessage("");
    // setRoom("");
  };
  const joinRoomHandler = (e) => {
    e.preventDefault();
    socket.emit("join-room", roomName);
    setRoomName("")
  }
  useEffect(() => {
    socket.on("connect", () => {
      setSocketId(socket.id);
      console.log("connected", socket.id);
    });
    socket.on("welcome", (s) => {
      console.log(s);
    });
    socket.on("recieved-message", (data) => {
      console.log(data);
      setMessages((messages)=>[...messages, data]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);
  return (
    <Container>
      <Typography variant="h4" component={"div"} gutterBottom>
        {socketId}
      </Typography>
      <form onSubmit={joinRoomHandler}>
        <h5>Join Room</h5>
        <TextField
          id="outlined-basic"
          value={roomName}
          label="Room Name"
          variant="outlined"
          onChange={(e) => setRoomName(e.target.value)}
        />
        <Button variant="contained" type="submit">
         Join
        </Button>
      </form>
      <form onSubmit={submitHandler}>
        <TextField
          id="outlined-basic"
          value={message}
          label="Message"
          variant="outlined"
          onChange={(e) => setMessage(e.target.value)}
        />
        <TextField
          id="outlined-basic"
          value={room}
          label="Room"
          variant="outlined"
          onChange={(e) => setRoom(e.target.value)}
        />
        <Button variant="contained" type="submit">
          Send
        </Button>
      </form>
      <Stack>
        {messages.map((message, index) => (
          <Typography
            key={index}
            variant="h6"
            component={"div"}
            gutterBottom
          >{message}</Typography>
        ))}
      </Stack>
    </Container>
  );
};

export default App;
