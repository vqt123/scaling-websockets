type ChatMessage = {
  sender: string;
  message: string;
  timestamp: string;
};

type Chatroom = {
  users: Set<string>;
  messages: ChatMessage[];
};

export const createChatroom = () => {
  const chatroom: Chatroom = {
    users: new Set(),
    messages: [],
  };

  const addUser = (username: string): string[] => {
    chatroom.users.add(username);
    return Array.from(chatroom.users);
  };

  const removeUser = (username: string): string[] => {
    chatroom.users.delete(username);
    return Array.from(chatroom.users);
  };

  const createMessage = (username: string, message: string): ChatMessage => ({
    sender: username,
    message,
    timestamp: new Date().toISOString(),
  });

  const getAllMessages = (): ChatMessage[] => chatroom.messages;

  const getUserList = (): string[] => Array.from(chatroom.users);

  const getUserCount = (): number => chatroom.users.size;

  const hasUser = (username: string): boolean => chatroom.users.has(username);

  return {
    addUser,
    removeUser,
    createMessage,
    getUserList,
    getUserCount,
    hasUser,
    getAllMessages,
  };
};
