const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const prisma = require("./prisma");

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// Verify JWT token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// Hash password
const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

// Compare password
const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

// Auth middleware
const authMiddleware = async (request, h) => {
  try {
    const token = request.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return h
        .response({
          isError: true,
          message: "Token tidak ditemukan",
        })
        .code(401)
        .takeover();
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return h
        .response({
          isError: true,
          message: "Token tidak valid",
        })
        .code(401)
        .takeover();
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return h
        .response({
          isError: true,
          message: "User tidak ditemukan",
        })
        .code(401)
        .takeover();
    }

    request.auth = { user };
    return h.continue;
  } catch (error) {
    return h
      .response({
        isError: true,
        message: "Unauthorized",
      })
      .code(401)
      .takeover();
  }
};

// Admin middleware
const adminMiddleware = async (request, h) => {
  if (request.auth.user.role !== "ADMIN") {
    return h
      .response({
        isError: true,
        message: "Akses ditolak. Hanya admin yang diizinkan.",
      })
      .code(403)
      .takeover();
  }
  return h.continue;
};

module.exports = {
  generateToken,
  verifyToken,
  hashPassword,
  comparePassword,
  authMiddleware,
  adminMiddleware,
};
