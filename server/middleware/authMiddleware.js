import jwt from 'jsonwebtoken';

export const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.status(403).json({ message: "Invalid or expired token" });
      req.user = user; // Attaches decoded JWT payload (e.g. user.id)
      next();
    });
  } else {
    return res.status(401).json({ message: "No authorization token provided" });
  }
};
