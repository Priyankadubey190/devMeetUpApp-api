import {
  ConnectionRequest,
  ConnectionStatus,
} from "../../models/connectionRequest.model";
import { User } from "../../models/user.model";
import { ApiError } from "../../utils/apiError";
import httpStatus from "http-status";

export class RequestManager {
  public sendConnectionRequest = async (
    fromUserId: string,
    toUserId: string,
    status: ConnectionStatus,
  ) => {
    if (fromUserId === toUserId) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "You cannot send a request to yourself",
      );
    }

    const toUser = await User.findById(toUserId);
    if (!toUser) {
      throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }

    const existingRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });

    if (existingRequest) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Connection request already exists",
      );
    }

    const connectionRequest = await ConnectionRequest.create({
      fromUserId,
      toUserId,
      status,
    });

    return { connectionRequest, toUserName: toUser.firstName };
  };

  public reviewConnectionRequest = async (
    loggedInUserId: string,
    requestId: string,
    status: string,
  ) => {
    const connectionRequest = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId: loggedInUserId,
      status: "interested",
    });

    if (!connectionRequest) {
      throw new ApiError(httpStatus.NOT_FOUND, "Connection request not found");
    }

    connectionRequest.status = status as ConnectionStatus;
    const data = await connectionRequest.save();

    return data;
  };
}
