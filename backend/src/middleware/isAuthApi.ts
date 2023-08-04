import { Request, Response, NextFunction } from "express";

import AppError from "../errors/AppError";
import ListSettingByValueService from "../services/SettingServices/ListSettingByValueService";

const isAuthApi = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError("ERR_SESSION_EXPIRED", 401);
  }

  const [, token] = authHeader.split(" ");
  const newToken: string = (typeof token === "undefined" ? req.headers.authorization : token) || "";
  try {
    const getToken = await ListSettingByValueService(newToken);
    if (!getToken) {
      throw new AppError("ERR_SESSION_EXPIRED", 401);
    }

    if (getToken.value !== newToken) {
      throw new AppError("ERR_SESSION_EXPIRED", 401);
    }
  } catch (err) {
    console.log(err);
    throw new AppError(
      "Invalid token. We'll try to assign a new one on next request",
      403
    );
  }

  return next();
};

export default isAuthApi;
