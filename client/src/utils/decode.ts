import jwtDecode, { JwtPayload } from "jwt-decode";

interface Payload {
  email: string;
  Id: string;
  role: string;
}
interface DecodedToken extends JwtPayload {
  exp: number;
  iat: number;
  payload: Payload;
}

const decodeJwtToken = (jwtToken: string): DecodedToken | null => {
  try {
    // Validate token before decoding
    if (!jwtToken || typeof jwtToken !== 'string' || jwtToken.trim() === '') {
      return null;
    }
    
    // Check if token is a valid JWT format (should have 3 parts separated by dots)
    const parts = jwtToken.split('.');
    if (parts.length !== 3) {
      return null;
    }
    
    const decodedToken = jwtDecode<DecodedToken>(jwtToken);
    return decodedToken;
  } catch (error) {
    // Silently return null for invalid tokens instead of logging error
    // This prevents console spam when token is missing or invalid
    return null;
  }
};

export default decodeJwtToken;
