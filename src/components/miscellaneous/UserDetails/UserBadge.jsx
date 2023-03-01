import {  Button, } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const UserBadge = ({ user, handleFunction, admin }) => {
 

  return (
    
      <Button variant="outlined" endIcon={<CloseIcon />} sx={{
        cursor:"pointer",
      }} onClick={handleFunction}>
        {user.name}
        {admin === user._id && <span> (Admin)</span>}
      </Button>
      
  )
};

export default UserBadge
