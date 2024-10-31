import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';

/**
 * Middleware function to check if the request is authenticated.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next function in the middleware chain.
 */
const checkAuth = asyncHandler(async (req, res, next) => {
  // Get the JWT token from the Authorization header
  const authHeader = req.headers.authorization || req.headers.Authorization;
 
  let jwt_token;

  // If the header is not present or does not start with 'Bearer', return 401 Unauthorized
  if (!authHeader?.startsWith('Bearer')) return res.sendStatus(401);

  // Split the header and get the token at position 1
  if (authHeader && authHeader.startsWith('Bearer')) {
    jwt_token = authHeader.split(' ')[1];

    // Verify the token using the secret key
    jwt.verify(
      jwt_token,
      process.env.JWT_ACCESS_SECRET_KEY,
      async (err, decoded) => {
        // If the token is invalid, return 403 Forbidden
        if (err) return res.sendStatus(403);

        // Get the user ID from the decoded token
        const userId = decoded.id;

        // Find the user by ID and select only the fields that are not password
        req.user = await User.findById(userId).select('-password');

        // Get the roles from the decoded token
        req.roles = decoded.roles;

        // Call the next function in the middleware chain
        next();
      }
    );
  }
});

export default checkAuth;

