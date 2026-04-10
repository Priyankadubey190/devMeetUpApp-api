import bcrypt from "bcrypt";
import { User } from "../../models/user.model";
import { ApiError } from "../../utils/apiError";
import httpStatus from "http-status";

export class AuthManager {
  public registerUser = async (body: any) => {
    const {
      firstName,
      lastName,
      age,
      gender,
      about,
      photoUrl,
      skills,
      role,
      emailId,
      password,
    } = body;

    const existingUser = await User.findOne({ emailId });

    if (existingUser) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      emailId,
      password: hashedPassword,
      age,
      gender,
      about,
      photoUrl,
      skills,
      role,
    });

    return user;
  };

  public loginWithEmailAndPassword = async (
    emailId: string,
    password: string,
  ) => {
    const user = await User.findOne({ emailId });

    if (!user) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        "Incorrect email or password",
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        "Incorrect email or password",
      );
    }

    return user;
  };
}
