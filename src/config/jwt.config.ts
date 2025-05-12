export const jwtConfig = {
    secret: process.env.JWT_SECRET || 'jwtsecretkey',
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  };