import { useState } from "react";

import MyBuddies from "./MyBuddies";
import ChatBox from "./ChatBox";
import { ChatState } from "../context/ChatProvider";
import NewSearch from "./miscellaneous/NewSearch";
import { Box } from "@mui/material";
import wallpaper from "../assets/wallpaper3.jpg";

const Chatpage = () => {
  // chats are fetched again when the useEffect from chatbox and buddies
  const [fetchAgain, setFetchAgain] = useState(false);
  const { user } = ChatState();
  // console.log(user);
  return (
    <div style={{ width: "78%", margin: "auto" }}>
      {user && <NewSearch />}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          height: "70vh",
          padding: "10px",
          backgroundImage: `url(${wallpaper})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
          mt: 1,
          borderRadius: 2,
        }}
      >
        {user && <MyBuddies fetchAgain={fetchAgain} />}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
};

export default Chatpage;
