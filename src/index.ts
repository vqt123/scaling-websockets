import { Server, Socket } from "socket.io";

const io = new Server();
const connectedSockets: Socket[] = [];

io.on("connection", (socket) => {
  connectedSockets.push(socket);
  console.log("a user connected");
  socket.conn.on("close", () => {
    console.log("a user disconnected");
  });
});

io.listen(3000);
console.log("Server running on port 3000");

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const gameLoop = async () => {
  while (true) {
    connectedSockets.forEach((socket) => {
      socket.emit("game-state", { state: "game-state" });
    });

    await wait(1000);
  }
};

gameLoop();
