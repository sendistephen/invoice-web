import rateLimit from 'express-rate-limit';

/**
 * Rate limiter for all API endpoints
 * Limit each IP address to 100 requests per 15 minutes
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window (here, per 15 minutes)
  message: {
    message:
      'Too many requests from this IP address, please try again after 15 minutes',
  },
  /**
   * Custom handler to log rate limit errors
   * @param {Request} req - The request object.
   * @param {Response} res - The response object.
   * @param {NextFunction} next - The next function in the middleware chain.
   * @param {Object} options - The options object with the error message and status code.
   */
  header: (req, res, next, options) => {
    systemLogs.error(
      `Too many requests: ${options.message.message}\t${req.method}\t${req.url}\t${req.headers.origin}`
    );
    res.status(options.statusCode).send(options.message);
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiter for login endpoint
 * Limit each IP address to 20 requests per 30 minutes
 */
export const loginLimiter = rateLimit({
  windowMs: 30 * 60 * 1000, // 30 minutes
  max: 20, // Limit each IP to 20 requests per window (here, per 30 minutes)
  message: {
    message:
      'Too many login attempts from this IP address, please try again after 30 minutes',
  },
  /**
   * Custom handler to log rate limit errors
   * @param {Request} req - The request object.
   * @param {Response} res - The response object.
   * @param {NextFunction} next - The next function in the middleware chain.
   * @param {Object} options - The options object with the error message and status code.
   */
  handler: (req, res, next, options) => {
    systemLogs.error(
      `Too many requests: ${options.message.message}\t${req.method}\t${req.url}\t${req.headers.origin}`
    );
    res.status(options.statusCode).send(options.message);
  },
  standardHeaders: true,
  legacyHeaders: false,
});
