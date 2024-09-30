export enum SupportedMessage {
    JoinRoom = "JOIN_ROOM",
    SendMessage = "SEND_MESSAGE",
    UpvoteMessage = "UPVOTE_MESSAGE",
  }
  
  export type OutgoingMessage = {
    type: SupportedMessage.JoinRoom;
    payload: {
      name: string;
      userId: string;
      roomId: string;
    };
  } | {
    type: SupportedMessage.SendMessage;
    payload: {
      userId: string;
      roomId: string;
      message: string;
    };
  } | {
    type: SupportedMessage.UpvoteMessage;
    payload: {
      userId: string;
      roomId: string;
      chatId: string;
    };
  };