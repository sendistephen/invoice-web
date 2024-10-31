import { ADMIN, USER } from '../constants/index.js';

const ROLES = {
  User: USER,
  Admin: ADMIN,
};

/**
 * A middleware function that checks if the user has one of the allowed roles.
 * @param  {...string} allowedRoles - The roles that are allowed to perform the request.
 * @returns {(req: Request, res: Response, next: NextFunction) => void} - The middleware function.
 */
const checkRole = (...allowedRoles) => {
  // The middleware function that checks the role.
  return (req, res, next) => {
    // Check if the user exists and has roles
    if (!req?.user || !req?.roles) {
      // If the user does not exist or has no roles, return 401 Unauthorized
      res.status(401);
      throw new Error('You are not authorized');
    }

    // Check if the user has one of the allowed roles
    const roleFound = req.roles.some((role) => allowedRoles.includes(role));

    // If the user does not have one of the allowed roles, return 401 Unauthorized
    if (!roleFound) {
      res.status(401);
      throw new Error('You are not authorized to perform this request');
    }

    // If the user has one of the allowed roles, call the next function in the middleware chain
    next();
  };
};

const role = {
  ROLES,
  checkRole,
};

export default role;
