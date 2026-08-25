import jwt from 'jsonwebtoken';

/**
 * Generates a signed JWT for a given user id.
 * @param {string} id - Mongo document _id of the user.
 * @returns {string} signed JWT
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d',
  });
};

/**
 * Sets the JWT as an httpOnly cookie on the response and also returns
 * the token/user payload in the JSON body so SPA clients can store it
 * in memory if they prefer header-based auth.
 */
export const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);

  const expiresInDays = parseInt(process.env.JWT_EXPIRES_IN) || 30;
  const cookieOptions = {
    expires: new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  };

  res
    .status(statusCode)
    .cookie('token', token, cookieOptions)
    .json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        addresses: user.addresses,
      },
    });
};

export default generateToken;
