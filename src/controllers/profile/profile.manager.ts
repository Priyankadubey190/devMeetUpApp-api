import { IUserDocument } from "../../models/user.model";
import { ApiError } from "../../utils/apiError";
import httpStatus from "http-status";

export class ProfileManager {
  public getProfile = async (user: IUserDocument | undefined) => {
    if (!user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "User not found");
    }
    const { password, ...safeUser } = user.toObject();

    return safeUser;
  };

  public updateProfile = async (user: IUserDocument, updateData: any) => {
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }

    Object.keys(updateData).forEach((key) => {
      (user as any)[key] = updateData[key];
    });

    await user.save();

    return {
      message: `${user.firstName}, your profile updated successfully`,
      user,
    };
  };
}
