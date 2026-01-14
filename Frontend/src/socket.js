import { io } from "socket.io-client";

export const socket = io("https://flux-chat.onrender.com", {
  transports: ["websocket"],
});
