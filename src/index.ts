import { Server, Socket } from "socket.io";
import { createChatroom } from "./chatroom";

const io = new Server();
const chatroom = createChatroom();
const socketToUsername = new Map<string, string>();

interface Message {
  action: UserAction;
  username: string;
  chatMessage?: string;
}

enum UserAction {
  Register = "register",
  Chat = "chat",
  Leave = "leave",
  GetAllChats = "get-all-chats",
}

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("message", (message: Message) => {
    console.log(message);

    if (message.action == UserAction.Register) {
      const username = message.username;
      if (!username) {
        console.error("Username not provided");
        return;
      }
      if (chatroom.hasUser(username)) {
        socket.emit("register-failed", "Username already taken");
        return;
      }

      socketToUsername.set(socket.id, username);
      const userList = chatroom.addUser(username);
      io.emit("user-joined", { username, userList });
    } else {
      const username = socketToUsername.get(socket.id);
      if (!username) {
        console.error("User not registered");
        return;
      }
      if (message.action === UserAction.GetAllChats) {
        const messages = chatroom.getAllMessages();
        io.emit("chat-messages", messages);
      } else if (message.action === UserAction.Chat) {
        const chatMessage = chatroom.createMessage(
          username,
          message.chatMessage!
        );
        io.emit("chat-message", chatMessage);
      } else if (message.action === UserAction.Leave) {
        socketToUsername.delete(socket.id);
        const userList = chatroom.removeUser(username);
        io.emit("user-left", { username, userList });
      } else {
        console.error("Invalid message action", message.action);
      }
    }
  });

  socket.conn.on("close", () => {
    const username = socketToUsername.get(socket.id);
    if (!username) return;

    socketToUsername.delete(socket.id);
    const userList = chatroom.removeUser(username);
    io.emit("user-left", { username, userList });
    console.log("user left", username);
  });
});

io.listen(3000);
console.log("Server running on port 3000");
