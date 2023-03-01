import axios from "axios";
import { useState, useEffect } from "react";
import { ChatState } from "../context/ChatProvider";
import { Box, Button, Stack, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import LoadingChat from "./LoadingChat";
import { getSender } from "../logic/chatLogic";
import GroupModal from "./miscellaneous/GroupModal";

const MyBuddies = ({ fetchAgain, setFetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { chosenChat, setChosenChat, user, chats, setChats } = ChatState();

  const fetchChats = async () => {
    

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/chat`,
        config
      );
      setChats(data);
      // console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  // chats are fetched again from my chatpage
  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userDetails")));
    fetchChats();
    // eslint-disable-next-line
  }, [fetchAgain]);

  return (
    <Box
      sx={{
        display: {
          xs: chosenChat ? "none" : "flex",
          md: "flex",
        },
        flexDirection: "column",
        alignItems: "center",
        padding: "3px",
        bgcolor: "white",
        width: {
          xs: "100%",
          md: "31%",
          borderRadius: "lg",
          borderWidth: "1px",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          fontSize: { xs: "28px", md: "25px" },
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          padding: "0 3px",
          paddingBottom: "3px",
        }}
      >
        Chatters
        <GroupModal>
          <Button id="basic-button" color="error" m={1} startIcon={<AddIcon />} variant="outlined">
            <Typography sx={{
              display: {
                md: "none", lg: "inline"
              }
            }}>Create Group</Typography>
            
          </Button>
        </GroupModal>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          padding: "3px",
          borderRadius: "lg",
          overflow: "hidden",
        }}
      >
        { chats ? (

          // change the outlook
          <Stack overflow="scroll">
            { chats.map((chat) => (
              <Box
                onClick={() => setChosenChat(chat)}
                bgcolor={chosenChat === chat ? "#a2d2ff" : "#e8e8e8"}
                sx={{
                  padding: "10px 3px",
                  borderRadius: "lg",
                  margin: "7px 7px 0 0",
                  
                }}
                key={chat._id}
              >
                <Typography>
                  {!chat.group
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Typography>
              </Box>
            ))}
          </Stack>
        ) : (
          <LoadingChat />
        )}
      </Box>
    </Box>
  );
};

export default MyBuddies;
