import { Avatar, Typography } from "@mui/material";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";


const UserList = ({ user, handleFunction }) => {
  return (
    <List
      sx={{
        width: "100%",
        maxWidth: 360,
        cursor: "pointer",
        bgcolor: "background.paper",
        color: "primary.main",
        "&:hover": {
          bgcolor: "#E8E8E8",
          color: "white",
          width: "100%",
          display: "flex",
          alignItems: "center",
          padding: "2px 3px",
          borderRadius: "lg",
        },
      }}
      onClick={handleFunction}
    >
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar alt={user.name} src="/static/images/avatar/1.jpg" />
        </ListItemAvatar>
        <ListItemText
          primary={user.name}
          secondary={
            <>
              <Typography
                sx={{ display: "inline" }}
                component="span"
                variant="body2"
                color="text.primary"
              >
                {user.email}
              </Typography>
            </>
          }
        />
      </ListItem>
      <Divider variant="inset" component="li" />
    </List>
  );
};

export default UserList;
