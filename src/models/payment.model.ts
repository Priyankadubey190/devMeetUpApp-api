import { Schema, model, Document, Types, HydratedDocument } from "mongoose";

interface IPaymentNotes {
  firstName?: string;
  lastName?: string;
  membershipType?: string;
}

export interface IPayment extends Document {
  userId: Types.ObjectId;
  paymentId?: string;
  orderId: string;
  status: string;
  amount: number;
  currency: string;
  receipt: string;
  notes: IPaymentNotes;
  createdAt: Date;
  updatedAt: Date;
}

export type IPaymentDocument = HydratedDocument<IPayment>;

export const paymentSchema = new Schema<IPayment>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    paymentId: {
      type: String,
    },
    orderId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    receipt: {
      type: String,
      required: true,
    },
    notes: {
      firstName: {
        type: String,
      },
      lastName: {
        type: String,
      },
      membershipType: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
  },
);

export const Payment = model<IPayment>("Payment", paymentSchema);
