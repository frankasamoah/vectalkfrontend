// same sender margin
export const sameSenderSide = (messages, m, i, userId) => {
  // console.log(i === messages.length - 1);

  if (
    i < messages?.length - 1 &&
    messages[i + 1].sender?._id === m.sender?._id &&
    messages[i].sender?._id !== userId
  )
    return 33;
  else if (
    (i < messages?.length - 1 &&
      messages[i + 1].sender?._id !== m.sender?._id &&
      messages[i].sender?._id !== userId) ||
    (i === messages?.length - 1 && messages[i].sender?._id !== userId)
  )
    return 0;
  else return "auto";
};

export const sameSender = (messages, m, i, userId) => {
  return (
    i < messages?.length - 1 &&
    (messages[i + 1].sender?._id !== m.sender?._id ||
      messages[i + 1].sender?._id === undefined) &&
    messages[i].sender?._id !== userId
  );
};

// last message
export const lastMessage = (messages, i, userId) => {
  return (
    i === messages?.length - 1 &&
    messages[messages.length - 1].sender?._id !== userId &&
    messages[messages.length - 1].sender?._id
  );
};

// same user?
export const sameUser = (messages, m, i) => {
  return i > 0 && messages[i - 1].sender?._id === m.sender?._id;
};

export const getSender = (loggedUser, users) => {
  return users[0]?._id === loggedUser?._id ? users[1]?.name : users[0]?.name;
};

// getSenderFull
export const senderDetails = (loggedUser, users) => {
  return users[0]?._id === loggedUser?._id ? users[1] : users[0];
};
