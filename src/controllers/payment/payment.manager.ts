// import razorpayInstance from "../../utils/razorpay";
// import { Payment } from "../../models/payment.model";
// import { User } from "../../models/user.model";
// import { membershipAmount } from "../../utils/constants";
// import { validateWebhookSignature } from "razorpay/dist/utils/razorpay-utils";
// import { ApiError } from "../../utils/apiError";
// import httpStatus from "http-status";
// import config from "../../config/config";

// export class PaymentManager {
//   public createOrder = async (user: any, membershipType: string) => {
//     const amount =
//       membershipAmount[membershipType as keyof typeof membershipAmount];

//     const order = await razorpayInstance.orders.create({
//       amount: amount * 100,
//       currency: "INR",
//       receipt: `receipt_${Date.now()}`,
//       notes: {
//         firstName: user.firstName,
//         lastName: user.lastName,
//         emailId: user.emailId,
//         membershipType,
//       },
//     });

//     const payment = await Payment.create({
//       userId: user._id,
//       orderId: order.id,
//       status: order.status,
//       amount: order.amount,
//       currency: order.currency,
//       receipt: order.receipt,
//       notes: order.notes,
//     });

//     return { ...payment.toJSON(), keyId: config.razorpay.keyId };
//   };

//   public handleWebhook = async (body: any, signature: string) => {
//     const isValid = validateWebhookSignature(
//       JSON.stringify(body),
//       signature,
//       config.razorpay.webhookSecret,
//     );

//     if (!isValid) {
//       throw new ApiError(httpStatus.BAD_REQUEST, "Invalid webhook signature");
//     }

//     const paymentDetails = body.payload.payment.entity;
//     const payment = await Payment.findOne({ orderId: paymentDetails.order_id });

//     if (!payment) {
//       throw new ApiError(httpStatus.NOT_FOUND, "Payment record not found");
//     }

//     payment.status = paymentDetails.status;
//     await payment.save();

//     if (body.event === "payment.captured") {
//       const user = await User.findById(payment.userId);
//       if (user) {
//         user.isPremium = true;
//         user.membershipType = payment.notes.membershipType || "silver";
//         await user.save();
//       }
//     }

//     return { msg: "Webhook processed" };
//   };
// }
