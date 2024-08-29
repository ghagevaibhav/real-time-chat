export const enum SupportedMessage {
    AddChat = "ADD_CHAT",
    UpdateChat = "UPDATE_CHAT",
}

    export interface BasePayload {
        roomId: string;
    }

    export interface AddChatPayload extends BasePayload {
        message: string;
        name: string;
        upvotes: number;
        chatId: string;
    }

    export interface UpdateChatPayload extends BasePayload {
        chatId: string;
        upvotes: number;
    }

    export type OutgoingMessage =
        | {
              type: SupportedMessage.AddChat;
              payload: AddChatPayload;
          }
        | {
              type: SupportedMessage.UpdateChat;
              payload: UpdateChatPayload;
          };

