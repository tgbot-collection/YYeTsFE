export function randomString(len: number = 16) {
  const $chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefhijlmnoprstuvwxyz1234567890";
  const maxPos = $chars.length;
  let code = "";
  for (let i = 0; i < len; i++) {
    code += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return code;
}
