import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import crypto from "crypto";
import { Chat } from "../models/chat.model";
import { Types } from "mongoose";

interface JoinChatPayload {
  firstName: string;
  userId: string;
  targetUserId: string;
}

interface SendMessagePayload {
  firstName: string;
  lastName: string;
  userId: string;
  targetUserId: string;
  text: string;
}

class SocketManager {
  private io: Server;

  constructor(server: HttpServer) {
    this.io = new Server(server, {
      cors: {
        origin: "http://localhost:5173",
      },
    });

    this.initializeEventListeners();
  }

  private getSecretRoomId(userId: string, targetUserId: string): string {
    return crypto
      .createHash("sha256")
      .update([userId, targetUserId].sort().join("$"))
      .digest("hex");
  }

  private initializeEventListeners(): void {
    this.io.on("connection", (socket: Socket) => {
      console.log("A user connected:", socket.id);

      socket.on(
        "joinChat",
        ({ firstName, userId, targetUserId }: JoinChatPayload) => {
          const roomId = this.getSecretRoomId(userId, targetUserId);
          console.log(`${firstName} joined Room: ${roomId}`);
          socket.join(roomId);
        },
      );

      socket.on("sendMessage", async (payload: SendMessagePayload) => {
        const { firstName, lastName, userId, targetUserId, text } = payload;

        try {
          const roomId = this.getSecretRoomId(userId, targetUserId);
          console.log(`${firstName}: ${text}`);

          let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] },
          });

          if (!chat) {
            chat = new Chat({
              participants: [userId, targetUserId],
              messages: [],
            });
          }

          chat.messages.push({
            senderId: new Types.ObjectId(userId) as unknown as Types.ObjectId,
            text,
            createdAt: new Date(), // Good practice to include timestamps
          });

          await chat.save();

          this.io.to(roomId).emit("messageReceived", {
            firstName,
            lastName,
            text,
            senderId: userId,
          });
        } catch (err) {
          console.error("Socket Message Error:", err);
        }
      });

      socket.on("disconnect", () => {
        console.log("User disconnected");
      });
    });
  }
}

export const initializeSocket = (server: HttpServer): SocketManager => {
  return new SocketManager(server);
};
