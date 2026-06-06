import { auth } from "@/auth";

/**
 * Retrieves the current logged-in user from the Auth.js session.
 * Returns null if the user is not authenticated.
 */
export async function getCurrentUser() {
  try {
    const session = await auth();
    return session?.user || null;
  } catch (error) {
    console.error("Error fetching current user session:", error);
    return null;
  }
}

/**
 * Enforces authentication. Retrieves the current logged-in user or
 * throws an Unauthorized error if the session is empty.
 */
export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized: Authentication required");
  }
  return user;
}
