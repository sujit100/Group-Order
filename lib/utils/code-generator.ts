/**
 * Generates a unique 6-character alphanumeric code for groups
 */
export function generateGroupCode(): string {
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed confusing characters like 0, O, I, 1
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
}
