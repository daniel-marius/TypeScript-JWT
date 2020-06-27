import jwt from "jsonwebtoken";
import * as jf from "joiful";
import { Request, Response } from "express";

import User, { IUser } from "../models/User";
import { SignUp, SignIn, Profile } from "../utils/validation";
import { convertArrayToObject } from "../utils/arrayToObject";

interface JWTSignParams {
  _id: string;
}

interface JWTOtherParams {
  expiresIn: string;
}

// @desc Register new user
// @route POST /api/signup
// @access Public
export const signup = async (req: Request, res: Response) => {
  const { username, email, password }: IUser = req.body;

  try {
    // Check if email exists
    const emailExists: IUser | null = await User.findOne({ email }).exec();

    if (emailExists) {
      return res.status(400).json({
        success: false,
        error: "Email already exists!"
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Internal Server Error!"
    });
  }

  // Create new user
  const user: IUser = new User({
    username,
    email,
    password
  });

  // Hash the password
  user.password = await user.encryptPassword(user.password);

  // Check if user credentials exist
  const signUp = new SignUp();
  signUp.username = user.username;
  signUp.email = user.email;
  signUp.password = user.password;

  const { error } = jf.validate(signUp);

  if (error) {
    return res.status(400).json({
      success: false,
      error: error.details[0].message
    });
  }

  try {
    const newUser: IUser | null = await user.save();

    return res.status(201).json({
      success: true,
      data: newUser
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      // const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        error: error.errors
      });
    } else {
      return res.status(500).json({
        success: false,
        error: "Internal Server Error!"
      });
    }
  }
};

// @desc User signin with jwt
// @route POST /api/signin
// @access Public
export const signin = async (req: Request, res: Response) => {
  const { email, password }: IUser = req.body;

  // Check if user credentials exist
  const signIn = new SignIn();
  signIn.email = email;
  signIn.password = password;

  const { error } = jf.validate(signIn);

  if (error) {
    return res.status(400).json({
      success: false,
      error: error.details[0].message
    });
  }

  try {
    // Check if user credentials are correct
    const user: IUser | null = await User.findOne({ email }).exec();

    if (!user) {
      return res.status(400).json({
        success: false,
        error: "Wrong Email or Password!"
      });
    }

    const correctPassword: boolean = await user.validatePassword(password);

    if (!correctPassword) {
      return res.status(400).json({
        success: false,
        error: "Invalid Password!"
      });
    }

    // Create and sign a valid token
    const signParams: JWTSignParams = { _id: String(user._id) }; // more params can be added
    const jwtSecret: string = process.env.JWT_SECRET || "secret_token";
    const otherParams: JWTOtherParams = { expiresIn: "1h" };
    const token: string = jwt.sign(signParams, jwtSecret, otherParams);

    return res.status(200).json({
      success: true,
      data: token
    });

    // res.header("auth-token").send(token);
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Internal Server Error!"
    });
  }
};

// @desc Get user by id
// @route GET /api/profile/:userId
// @access Protected route by jwt
export const profile = async (req: Request, res: Response) => {
  const { userId } = req.params;

  // Check if userId exists
  const userProfile = new Profile();
  userProfile.userId = userId;

  const { error } = jf.validate(userProfile);

  if (error) {
    return res.status(404).json({
      success: false,
      error: error.details[0].message
    });
  }

  try {
    const user: IUser | null = await User.findById({ _id: userId })
      .select("_id username email")
      .exec();

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User does not exist!"
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        error: error.message
      });
    } else {
      return res.status(500).json({
        success: false,
        error: "Internal Server Error!"
      });
    }
  }
};

// @desc Update user by id
// @route PATCH /api/profile/update/:userId
// @access Public
export const updateProfile = async (req: Request, res: Response) => {
  const { userId } = req.params;

  // Check if userId exists
  const userProfile = new Profile();
  userProfile.userId = userId;

  const { error } = jf.validate(userProfile);

  if (error) {
    return res.status(404).json({
      success: false,
      error: error.details[0].message
    });
  }

  // Convert request body to JavaScript Object
  const updatedBody = convertArrayToObject(Object.entries(req.body));
  // const updatedBody = convertArrayToObject2(req.body);

  try {
    const updatedUser: IUser | null = await User.updateOne(
      { _id: userId },
      { $set: updatedBody }
    ).exec();

    return res.status(200).json({
      success: true,
      data: updatedUser
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        error: error.message
      });
    } else {
      return res.status(500).json({
        success: false,
        error: "Internal Server Error!"
      });
    }
  }
};

// @desc Delete user by id
// @route DELETE /api/profile/delete/:userId
// @access Public
export const deleteProfile = async (req: Request, res: Response) => {
  const { userId } = req.params;

  // Check if userId exists
  const userProfile = new Profile();
  userProfile.userId = userId;

  const { error } = jf.validate(userProfile);

  if (error) {
    return res.status(404).json({
      success: false,
      error: error.details[0].message
    });
  }

  try {
    const deletedUser = await User.deleteOne({ _id: userId }).exec();

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        error: "User does not exist!"
      });
    }

    return res.status(200).json({
      success: true,
      data: deletedUser
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        error: error.message
      });
    } else {
      return res.status(500).json({
        success: false,
        error: "Internal Server Error!"
      });
    }
  }
};
