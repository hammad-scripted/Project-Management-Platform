import User from '../models/user.model.js';
import ApiError from './../utils/api-error.js';
import ApiResponse from './../utils/api-response.js';
import asyncHandler from './../utils/async-handler.js';
import { sendEmail } from '../utils/mail.js';
import { emailVerificationTemplate } from '../utils/mail.js';

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError('Failed to generate access and refresh tokens', 500);
  }
};
export const registerUser = asyncHandler(async (req, res, next) => {
  const { username, email, password, role } = req.body;

  //*   Check if the user already exists

  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    throw new ApiError('User with this email or username already exists', 400);
  } else {
    //*   Create a new user
    const user = await User.create({
      username,
      email,
      password,
      isEmailVerified: false,
    });
    const { unhashedToken, hashedToken, tokenExpiry } =
      user.generateTemporaryToken();
    user.emailVerificationToken = hashedToken;
    user.emailVerificationTokenExpiry = tokenExpiry;
    await user.save({ validateBeforeSave: false });

    await sendEmail({
      to: user.email,
      subject: 'Email Verification',
      mailgenContent: emailVerificationTemplate({
        username: user.username,
        verificationUrl: `${req.protocol}://${req.get(
          'host',
        )}/api/v1/users/verify-email/${unhashedToken}`,
      }),
    });

    const createdUser = await User.findById(user._id).select(
      '-password -refreshToken -emailVerificationToken -emailVerificationTokenExpiry',
    );
    if (!createdUser) {
      throw new ApiError('User created but failed to retrieve user data', 500);
    }
    return res.status(201).json(
      new ApiResponse(
        201,
        {
          user: createdUser,
        },
        'User registered successfully and verification email sent!',
      ),
    );
  }
});

export const login = asyncHandler(async (req, res) => {
  const { email, password, username } = req.body;
  if (!email || !password || !username) {
    throw new ApiError('Please provide email, password and username', 400);
  }

  const user = await User.findOne({ $or: [{ email }, { username }] });
  if (!user) {
    throw new ApiError('User not found', 404);
  }

  const isPasswordValid = await user.isPasswordMatch(password);
  if (!isPasswordValid) {
    throw new ApiError('Invalid password', 401);
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id,
  );
  console.log(user);
  const loggedInUser = await User.findById(user._id).select(
    '-password -refreshToken -emailVerificationToken -emailVerificationTokenExpiry',
  );
  if (!loggedInUser) {
    throw new ApiError('User logged in but failed to retrieve user data', 500);
  }

  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie('refreshToken', refreshToken, options)
    .cookie('accessToken', accessToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
        },
        'User logged in successfully',
      ),
    );
});
