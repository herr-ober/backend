import * as argon2 from 'argon2'

/**
 * It takes a password as a string, and returns a promise that resolves to a string
 *
 * @param {string} password - The password to hash
 * @returns A promise that resolves to the hashed password
 */
export async function generateHash(password: string): Promise<string> {
  return argon2.hash(password)
}

/**
 * It takes a password hash and a password, and returns a boolean indicating whether the password
 * matches the hash
 *
 * @param {string} passwordHash - The hash that was generated by the hashPassword function
 * @param {string} password - The password to hash
 * @returns A promise that resolves to a boolean value
 */
export async function verifyPassword(
  passwordHash: string,
  password: string
): Promise<boolean> {
  return argon2.verify(passwordHash, password)
}