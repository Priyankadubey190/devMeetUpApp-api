import { IUserDocument } from "../../models/user.model";

export class ConnectionManager {
  public sendConnectionRequest = async (user: IUserDocument) => {
    return `${user.firstName} send the connection request`;
  };
}
