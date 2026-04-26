import { ConnectionRequest } from "../../models/connectionRequest.model";
import { User } from "../../models/user.model";

export const USER_SAFE_DATA =
  "firstName lastName photoUrl age gender about skills";

export class UserManager {
  public getReceivedRequests = async (loggedInUserId: string) => {
    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUserId,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);

    return connectionRequests;
  };

  public getConnections = async (loggedInUserId: string) => {
    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUserId, status: "accepted" },
        { fromUserId: loggedInUserId, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const data = connectionRequests.map((row: any) => {
      if (row.fromUserId._id.toString() === loggedInUserId.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    return data;
  };

  public getFeed = async (
    loggedInUserId: string,
    skip: number,
    limit: number,
  ) => {
    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUserId }, { toUserId: loggedInUserId }],
    }).select("fromUserId toUserId");

    const hideUsersFromFeed = new Set<string>();
    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });

    hideUsersFromFeed.add(loggedInUserId.toString());

    const users = await User.find({
      _id: { $nin: Array.from(hideUsersFromFeed) },
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    return users;
  };
}
