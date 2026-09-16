"use server";

export async function verifyAdminPasswordAction(inputPass: string): Promise<boolean> {
  const serverAdminPass = process.env.ADMIN_PASSWORD || process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin123";
  if (!inputPass) return false;
  return inputPass.trim() === serverAdminPass.trim();
}
