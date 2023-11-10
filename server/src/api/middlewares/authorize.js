import HttpException from "../exceptions/http-exception";

export const authorize = async (req, res, next, allowedRoles) => {
    console.log('req.user.role:', req.user.role);
    console.log('allowedRoles:', allowedRoles);
    try {
        if (allowedRoles.includes(req.user.role)) {
            next();
        }
        else {
            throw new HttpException(400, "Not authorized!")
        }
    } catch (err) {
        next(err);
    }
}