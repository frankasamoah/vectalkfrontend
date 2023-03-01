import axios from "axios";
import { useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import { Link, useNavigate } from "react-router-dom";

import { LoadingButton } from "@mui/lab";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SearchIcon from "@mui/icons-material/Search";



import UserProfile from "./UserProfile";
import LoadingChat from "../LoadingChat";
import UserList from "./UserDetails/UserList";
import {
  Avatar,
  Button,
  Drawer,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";

const NewSearch = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const {
    setChosenChat,
    user,
    // notifications,
    // setNotifications,
    chats,
    setChats,
  } = ChatState();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const logoutHandler = () => {
    localStorage.removeItem("userDetails");
    navigate("/");
  };

  const handleSearch = async () => {
    if (!search) {
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
        `https://vectalkbackend.onrender.com/api/v1/user?search=${search}`,
        config
      );

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      console.log(error);
    }
  };

  const accessChat = async (userId) => {
    // console.log(userId);

    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        `https://vectalkbackend.onrender.com/api/v1/chat`,
        { userId },
        config
      );

      // update the chat if it's in the chat
      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setChosenChat(data);
      setLoadingChat(false);
      setIsDrawerOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Box
        sx={{
          // flexGrow: 1,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          bgcolor: "white",
          width: "100%",
          padding: "5px 10px 5px 10px",
          borderWidth: "5px",
          mt: 3,
        }}
      >
        <AppBar position="static" color="inherit">
          <Toolbar
            variant="dense"
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box onClick={() => setIsDrawerOpen(true)} color="inherit">
              <Stack
                direction="row"
                justifyContent="center"
                alignItems="center"
                spacing={1}
              >
                <SearchIcon cursor="pointer" />

                <Tooltip title="search user" placement="bottom-end" arrow>
                  <Typography
                    sx={{
                      display: {
                        xs: "none",
                        md: "block",
                      },
                    }}
                  >
                    Search User
                  </Typography>
                </Tooltip>
              </Stack>
            </Box>
            <Link
              to="/dashboard"
              style={{
                textDecoration: "none",
                color: "inherit",
              }}
            >
              {/* <Typography variant="h6" color="inherit" component="div">
                
              </Typography> */}
            </Link>
            <Stack direction="row" spacing={1}>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
              ></Menu>
              <Button
                id="basic-button"
                aria-controls={open ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
                m={1}
                endIcon={<KeyboardArrowDownIcon />}
                color="error"
              >
                {/* avatar */}
                <Avatar alt={user.name} src="/static/images/avatar/1.jpg" />
              </Button>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
              >
                <UserProfile user={user}>
                  <MenuItem>Profile</MenuItem>
                </UserProfile>
                <MenuItem onClick={logoutHandler}>Logout</MenuItem>
              </Menu>
            </Stack>
          </Toolbar>
        </AppBar>
      </Box>
      <Drawer
        anchor="left"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      >
        <Box p={2} width="350px" textAlign="center" role="presentation">
          <Box display="flex" paddingBottom={2} justifyContent="center">
            <TextField
              id="outlined-search"
              label="Search field"
              type="search"
              onChange={(e) => setSearch(e.target.value)}
              value={search}
            />
            <Button variant="outlined" color="error" onClick={handleSearch}>
              Go
            </Button>
          </Box>
          {loading ? (
            <LoadingChat />
          ) : (
            searchResult?.map((user) => (
              <UserList
                key={user._id}
                user={user}
                handleFunction={() => accessChat(user._id)}
              />
            ))
          )}
          {loadingChat && (
            <LoadingButton loading variant="outlined">
              Submit
            </LoadingButton>
          )}
        </Box>
      </Drawer>
    </>
  );
};

export default NewSearch;