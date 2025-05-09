import { io } from "socket.io-client";

const socket = io("https://live-poll-battle-wrbv.onrender.com/");

export default socket;
