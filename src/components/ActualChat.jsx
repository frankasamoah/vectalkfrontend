import axios from "axios";
import { useEffect, useRef, useState } from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import UserProfile from "./miscellaneous/UserProfile";

import "./messages.css";

import { getSender, senderDetails } from "../logic/chatLogic";
import ScrollableChat from "./ScrollableChat";

import io from "socket.io-client";

import { ChatState } from "../context/ChatProvider";
import { Box,  IconButton, TextField, Typography } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import GroupProfile from "./miscellaneous/GroupProfile";

//& //////////////////////////////////////////////////////////////////////////////////////////////////
const ActualChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnection, setSocketConnection] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const ENDPOINT = "https://vectalkbackend.onrender.com";

  const socket = useRef();
  //  let chosenChatMatch;
  const chosenChatMatch = useRef();

  const { chosenChat, setChosenChat, user, notifications, setNotifications } =
    ChatState();

  const fetchMessages = async () => {
    if (!chosenChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `https://vectalkbackend.onrender.com/api/v1/message/${chosenChat._id}`,
        config
      );
      // console.log(data);
      setMessages(data);
      setLoading(false);

      socket.current.emit("join chat", chosenChat._id);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    socket.current = io(ENDPOINT);
    socket.current.emit("setup", user);
    socket.current.on("connected", () => setSocketConnection(true));
    socket.current.on("typing", () => setIsTyping(true));
    socket.current.on("stop typing", () => setIsTyping(false));

    // eslint-disable-next-line
  }, []);

  const sendMessage = async (event) => {
    
    if (event.key === "Enter" && newMessage) {
      socket.current.emit("stop typing", chosenChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          `https://vectalkbackend.onrender.com/api/v1/message`,
          {
            content: newMessage,
            chatId: chosenChat,
          },
          config
        );
        socket.current.emit("new message", data);

        setMessages([...messages, data]);
        // console.log(data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    fetchMessages();

    // it's a way to compare to
    // see if we have to send the message or as a notification
    // chosenChatMatch = chosenChat
    chosenChatMatch.current = chosenChat;
    // eslint-disable-next-line
  }, [chosenChat]);

  // console.log(notifications, "__________")

  useEffect(() => {
    socket.current.on("message received", (newMessageReceived) => {
      if (
        // !chosenChatMatch || // if chat is not selected or doesn't match current chat
        // chosenChatMatch._id !== newMessageReceived.chat._id
        chosenChatMatch.current ||
        chosenChatMatch.current._id !== newMessageReceived.chat._id
      ) {
        if (!notifications.includes(newMessageReceived)) {
          setNotifications([newMessageReceived, ...notifications]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageReceived]);
      }
    });
  });

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnection) return;

    if (!typing) {
      setTyping(true);
      socket.current.emit("typing", chosenChat._id);
    }
    // when to stop typing
    let lastTypingTime = new Date().getTime();
    let lengthOfTime = 3000;
    setTimeout(() => {
      let timeNow = new Date().getTime();
      let timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= lengthOfTime && typing) {
        socket.current.emit("stop typing", chosenChat._id);
        setTyping(false);
      }
    }, lengthOfTime);
  };

  return (
    <>
      {chosenChat ? (
        <>
          <Typography
            sx={{
              display: "flex",
              fontSize: { xs: "28px", md: "27px" },
              width: "100%",
              justifyContent: { xs: "space-between" },
              alignItems: "center",
              padding: "2px 5px",
              paddingBottom: 3,
            }}
          >
            <IconButton
              onClick={() => setChosenChat("")}
              sx={{
                display: { xs: "flex", md: "none" },
              }}
            >
              <ArrowBackIosIcon />
            </IconButton>
           
            {!chosenChat.group ? (
              <>
                {getSender(user, chosenChat.users)}
                <UserProfile user={senderDetails(user, chosenChat.users)} />
              </>
            ) : (
              <>
                {chosenChat.chatName.toUpperCase()}
                <GroupProfile
                  fetchMessages={fetchMessages}
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                />
              </>
            )}
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              p: 3,
              bgcolor: "#FFF3F4",
              width: "85%",
              height: "100%",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            {loading ? (
              <LoadingButton
                loading
                loadingIndicator="Loading…"
                // variant="outlined"
                size="large"
              >
                Fetcing
              </LoadingButton>
            ) : (
              <div className="scroll-messages">
                <ScrollableChat messages={messages} />
              </div>
            )}

            <Box onKeyDown={sendMessage}>
              {isTyping ? (
                <div style={{ marginBottom: "15px" }}>typing....</div>
              ) : (
                <></>
              )}
              <TextField
                id="message"
                label="Enter message..."
                type="text"
                fullWidth
                variant="outlined"
                value={newMessage}
                onChange={typingHandler}
              sx={{mt: 5}}/>
             
            </Box>
          </Box>
        </>
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Typography
            sx={{
              paddingBottom: 3,
              fontSize: 25,
            }}
          >
            Select user to start chatting
          </Typography>
        </Box>
      )}
    </>
  );
};

export default ActualChat;
