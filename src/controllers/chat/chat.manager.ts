import httpStatus from "http-status";
import { Chat } from "../../models/chat.model";
import { ApiError } from "../../utils/apiError";
import { Types } from "mongoose";

export class ChatManager {
  public getChat = async (userId: Types.ObjectId, targetUserId: string) => {
    if (!targetUserId) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Target User ID is required");
    }

    try {
      const targetId = new Types.ObjectId(targetUserId);

      let chat = await Chat.findOne({
        participants: { $all: [userId, targetId] },
      }).populate({
        path: "messages.senderId",
        select: "firstName lastName photoUrl",
      });

      if (!chat) {
        chat = new Chat({
          participants: [userId, targetId],
          messages: [],
        });

        await chat.save();
      }

      return chat;
    } catch (error: any) {
      if (error.name === "BSONError" || error.name === "CastError") {
        throw new ApiError(httpStatus.BAD_REQUEST, "Invalid User ID format");
      }
      throw error;
    }
  };
}
