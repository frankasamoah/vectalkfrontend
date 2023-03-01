import { createContext, useContext, useEffect, useState } from "react";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [chosenChat, setChosenChat] = useState();
  const [user, setUser] = useState();
  const [notifications, setNotifications] = useState([]);
  const [chats, setChats] = useState([]);


  useEffect(() => {
    const userDetails = JSON.parse(localStorage.getItem("userDetails"));
    setUser(userDetails);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ChatContext.Provider
      value={{
        chosenChat,
        setChosenChat,
        user,
        setUser,
        notifications,
        setNotifications,
        chats,
        setChats,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;