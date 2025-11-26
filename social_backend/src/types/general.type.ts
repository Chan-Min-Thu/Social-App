export interface TokenOptionType {
  httpOnly: boolean;
  secure: boolean;
  sameSite: boolean | "none" | "strict" | "lax" | undefined;
  maxAge: number;
  path: string;
}

export interface EmailData {
  email: string;
  subject: string;
  message: string;
}
