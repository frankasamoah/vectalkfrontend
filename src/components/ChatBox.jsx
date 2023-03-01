import "./messages.css";
import ActualChat from "./ActualChat";
import { ChatState } from "../context/ChatProvider";
import Box from '@mui/material/Box';

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const { chosenChat } = ChatState();

  return (
    
    <Box
    sx={{
      display: {
        xs: chosenChat ? "flex" : "none",
        md: "flex"
      },
      alignItems:"center",
      flexDirection:"column",
      width: {
        xs: "100%",
        md: "68%"
      },
      
      borderRadius:1,
      borderWidth:"1px"
      ,
      bgcolor: "white"
    }}
    >
    <ActualChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />

    </Box>
  );
};

export default ChatBox