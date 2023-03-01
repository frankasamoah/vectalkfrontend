import {
  Avatar,
  Button,
  IconButton,
 
} from "@mui/material";
import { useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

const UserProfile = ({ user, children }) => {
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
 
  const handleClose = () => setOpen(false);



  return (
    <>
      {children ? (
        <span onClick={handleClickOpen}>{children}</span>
      ) : (
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
      )}

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" textAlign="center">{user.name}</DialogTitle>
        <DialogContent sx={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <Avatar alt={user.name} src="/static/images/avatar/1.jpg"></Avatar>
          <DialogContentText id="alert-dialog-description">
            <b>Email</b>: {user.email}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserProfile;

