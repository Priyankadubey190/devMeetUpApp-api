import jwt from "jsonwebtoken";
import moment from "moment";
import config from "../../config/config";
import { IUser } from "../../models/user.model";

interface AuthTokens {
  access: {
    token: string;
    expires: Date;
  };
}

export class TokenManager {
  public generateToken = (userId: string, expires: moment.Moment): string => {
    const payload = {
      _id: userId,
      iat: moment().unix(),
      exp: expires.unix(),
    };

    return jwt.sign(payload, config.jwt.secret);
  };

  public generateAuthToken = (user: IUser): AuthTokens => {
    const accessTokenExpires = moment().add(
      config.jwt.accessExpirationMinutes,
      "minutes",
    );

    const accessToken = this.generateToken(
      String(user._id),
      accessTokenExpires,
    );

    return {
      access: {
        token: accessToken,
        expires: accessTokenExpires.toDate(),
      },
    };
  };

  public verifyToken = (token: string): any => {
    try {
      const decoded = jwt.verify(token, config.jwt.secret);
      return decoded;
    } catch (error) {
      throw new Error("Invalid token");
    }
  };
}
