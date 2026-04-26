import { Schema, model, Document, Types } from "mongoose";

export type ConnectionStatus =
  | "ignored"
  | "interested"
  | "accepted"
  | "rejected";

export interface IConnectionRequest extends Document {
  fromUserId: Types.ObjectId;
  toUserId: Types.ObjectId;
  status: ConnectionStatus;
  createdAt: Date;
  updatedAt: Date;
}

const connectionRequestSchema = new Schema<IConnectionRequest>(
  {
    fromUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    toUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["ignored", "interested", "accepted", "rejected"],
    },
  },
  { timestamps: true },
);

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

export const ConnectionRequest = model<IConnectionRequest>(
  "ConnectionRequest",
  connectionRequestSchema,
);
