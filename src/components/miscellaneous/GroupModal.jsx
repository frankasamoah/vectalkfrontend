import axios from "axios";

import Button from "@mui/material/Button";

import { useState } from "react";
import {  Stack } from "@mui/material";
import { ChatState } from "../../context/ChatProvider";
import UserList from "./UserDetails/UserList";
import UserBadge from "./UserDetails/UserBadge";

import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";


const GroupModal = ({ children }) => {
  const [open, setOpen] = useState(false);

  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, chats, setChats } = ChatState();

  // const handleOpen = () => setOpen(true);
  // const handleClose = () => setOpen(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  //////////////////////////////////////////////////////////////////////////////


  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/chat/group`,
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );
      setChats([data, ...chats]);
      handleClose();
    } catch (error) {
      console.log(error);
    }
  };

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      return;
    }

    setSelectedUsers([...selectedUsers, userToAdd]);
  };

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
      setSearchResult(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };

  

  /////////////////////////////////////////////////////////////////////////////


  return (
    <>
      <span onClick={handleClickOpen}>{children}</span>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create A Group</DialogTitle>
        <DialogContent>
          
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="group chat name"
            type="text"
            fullWidth
            variant="standard"
            onChange={(e) => setGroupChatName(e.target.value)}
          />
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
           
            {selectedUsers.map((u) => (
              <UserBadge
                key={u._id}
                user={u}
                handleFunction={() => handleDelete(u)}
              />
            ))}
          </Stack>
          <Stack spacing={2}>
            {loading ? (
              // <ChatLoading />
              <div>Loading...</div>
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((user) => (
                  <UserList
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                ))
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          
          <Button onClick={handleSubmit}>Create Group</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default GroupModal;
