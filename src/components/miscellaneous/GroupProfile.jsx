import axios from "axios";

import Button from "@mui/material/Button";


import VisibilityIcon from "@mui/icons-material/Visibility";
import { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
 
  IconButton,
  
  Stack,
  TextField,
} from "@mui/material";
import { ChatState } from "../../context/ChatProvider";
import UserBadge from "./UserDetails/UserBadge";
import LoadingButton from "@mui/lab/LoadingButton";
import UserList from "./UserDetails/UserList";


export default function GroupProfile({
  fetchAgain,
  setFetchAgain,
  fetchMessages,
}) {
  const [open, setOpen] = useState(false);

  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  // const [renameloading, setRenameLoading] = useState(false);

  const { chosenChat, setChosenChat, user } = ChatState();
  
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/user?search=${search}`,
        config
      );
      // console.log(data);
      setLoading(false);
      setSearchResult(data);
      
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleRename = async () => {
    if (!groupChatName) return;

    try {
      // setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/chat/rename`,
        {
          chatId: chosenChat._id,
          chatName: groupChatName,
        },
        config
      );

      console.log(data._id);
      // setSelectedChat("");
      setChosenChat(data);
      setFetchAgain(!fetchAgain);
      handleClose()
    } catch (error) {
      console.log(error);
      // setRenameLoading(false);
    }
    setGroupChatName("");
  };

  const handleAddUser = async (user1) => {
    if (chosenChat.users.find((u) => u._id === user1._id)) {
      return;
    }

    if (chosenChat.groupAdmin._id !== user._id) {
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/chat/addgroup`,
        {
          chatId: chosenChat._id,
          userId: user1._id,
        },
        config
      );

      setChosenChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
      handleClose()
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
    setGroupChatName("");
  };

  const handleRemove = async (user1) => {
    if (chosenChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/chat/removegroup`,
        {
          chatId: chosenChat._id,
          userId: user1._id,
        },
        config
      );

      user1._id === user._id ? setChosenChat() : setChosenChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
      handleClose()
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
    setGroupChatName("");
  };

  

  return (
    <>
      <IconButton
        aria-label="Example"
        onClick={handleClickOpen}
        sx={{
          display: {
            xs: "flex",
          },
        }}
      >
        <VisibilityIcon />
      </IconButton>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle textAlign="center">{chosenChat.chatName}</DialogTitle>
        <DialogContent>
          <Stack direction="row" spacing={2}>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="change group name"
              type="text"
              fullWidth
              variant="standard"
              onChange={(e) => setGroupChatName(e.target.value)}
            />
            <Button variant="text" onClick={handleRename}>
              Update
            </Button>
          </Stack>
          <TextField
            autoFocus
            margin="dense"
            id="users"
            label="users"
            type="text"
            fullWidth
            variant="standard"
            onChange={(e) => handleSearch(e.target.value)}
          />
          <Stack direction="row" spacing={2}>
            {chosenChat.users.map((u) => (
              <UserBadge
                key={u._id}
                user={u}
                handleFunction={() => handleRemove(u)}
              />
            ))}
          </Stack>
          <Stack spacing={2}>
            {loading ? (
              // <ChatLoading />
              <LoadingButton loading variant="outlined">
              Loading
            </LoadingButton>
            ) : (
              searchResult?.slice(0, 4).map((user) => (
                <UserList
                  key={user._id}
                  user={user}
                  handleFunction={() => handleAddUser(user)}
                />
              ))
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={() => handleRemove(user)}
            color="error"
          >
            Leave Group
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
