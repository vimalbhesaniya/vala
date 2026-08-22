import jwt, { type SignOptions } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { headers } from "next/headers";
import type { IUser } from "@/lib/db/models/User";

const JWT_SECRET = process.env.JWT_SECRET ?? "vala-dev-secret-change-in-production";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? "7d";

export interface JwtPayload {
  userId: string;
  email: string;
  role: IUser["role"];
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signToken(payload: JwtPayload): string {
  const options: SignOptions = {
    expiresIn: JWT_EXPIRES_IN as SignOptions["expiresIn"],
  };
  return jwt.sign(payload, JWT_SECRET, options);
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}

export async function getAuthUser(): Promise<JwtPayload | null> {
  const headersList = await headers();
  const auth = headersList.get("authorization");
  if (!auth?.startsWith("Bearer ")) return null;

  try {
    return verifyToken(auth.slice(7));
  } catch {
    return null;
  }
}

export async function requireAuth(roles?: IUser["role"][]): Promise<JwtPayload> {
  const user = await getAuthUser();
  if (!user) throw new Error("Unauthorized");
  if (roles && !roles.includes(user.role)) throw new Error("Forbidden");
  return user;
}

export function toPublicUser(user: IUser) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    avatar: user.avatar,
    createdAt: user.createdAt,
  };
}
