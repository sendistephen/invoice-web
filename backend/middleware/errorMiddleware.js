/**
 * Middleware function to handle errors.
 * This function sends a JSON response with the error message and stack trace.
 * In production mode, the stack trace is hidden for security reasons.
 * @param {Error} err - The error object.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next function in the middleware chain.
 */
const errorHandler = (err, req, res, next) => {
  // If a status code is set on the response, use it; otherwise, default to 500 (Internal Server Error)
  const statusCode = res.statusCode ? res.statusCode : 500;

  // Send a JSON response with the success status, error message, and stack trace (if not in production)
  return res.status(statusCode).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

/**
 * Middleware function to handle 404 Not Found errors.
 * This function creates an error object with a message indicating that the route does not exist.
 * It then sets the response status to 404 and passes the error to the next middleware.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next function in the middleware chain.
 */
const notFound = (req, res, next) => {
  // Create a new error object with a message indicating the requested route does not exist
  const error = new Error(`That route does not exist - ${req.originalUrl}`);

  // Set the response status to 404 (Not Found)
  res.status(404);

  // Pass the error to the next middleware function in the chain
  next(error);
};

export { errorHandler, notFound };
