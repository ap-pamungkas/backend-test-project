import jwt from 'jsonwebtoken';

/*
  Authentication guard middleware
  params:
    req: request object
    res: response object
    next: next middleware function
*/

export function authGuard(req, res, next) {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
}