import { io } from "socket.io-client";

// apunta a tu servidor de back
const socket = io("http://localhost:4000", {
  autoConnect: false, 
});

export default socket;
