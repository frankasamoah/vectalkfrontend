import { Avatar, Box, Tooltip } from "@mui/material";
import {
  sameSender,
  lastMessage,
  sameSenderSide,
  sameUser,
} from "../logic/chatLogic";
import { ChatState } from "../context/ChatProvider";
import { useRef } from "react";
import { useEffect } from "react";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView();
    }

    // messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [messages]);

  return (
    <>
      {messages.map((m, i) => (
        <div style={{ display: "flex" }} key={m._id}>
          {(sameSender(messages, m, i, user._id) ||
            lastMessage(messages, m, i, user._id)) && (
            <Tooltip title={m.sender.name} placement="bottom-start" arrow>
              <Avatar
                alt={m.sender.name}
                src="/static/images/avatar/1.jpg"
                sx={{
                  marginTop: "7x",
                  marginRight: 1,
                }}
              />
            </Tooltip>
          )}
          <Box
            style={{
              // change the colors
              backgroundColor: `${
                m.sender._id === user._id ? "#bee3f8" : "#b9f5d0"
              }`,
              borderRadius: "20px",
              padding: "5px 15px",
              maxWidth: "75%",
              marginLeft: sameSenderSide(messages, m, i, user._id),
              marginTop: sameUser(messages, m, i, user._id) ? 3 : 10,
            }}
          >
            {m.content}
          </Box>
        </div>
      ))}
      <div ref={messagesEndRef}></div>
    </>
  );
};

export default ScrollableChat;
