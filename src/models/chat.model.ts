import { Schema, model, Document, Types, HydratedDocument } from "mongoose";

export interface IMessage {
  senderId: Types.ObjectId;
  text: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IChat extends Document {
  participants: Types.ObjectId[];
  messages: IMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export type IChatDocument = HydratedDocument<IChat>;

const messageSchema = new Schema<IMessage>(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export const chatSchema = new Schema<IChat>(
  {
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    messages: [messageSchema],
  },
  {
    timestamps: true,
  },
);

export const Chat = model<IChat>("Chat", chatSchema);
