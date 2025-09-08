export interface TokenOptionType {
  httpOnly: boolean;
  secure: boolean;
  sameSite: boolean | "none" | "strict" | "lax" | undefined;
  maxAge: number;
}
