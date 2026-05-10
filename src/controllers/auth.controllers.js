import User from '../models/user.models.js';
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
    console.log(user);
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
