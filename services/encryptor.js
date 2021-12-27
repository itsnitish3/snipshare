const crypto = require("crypto");
const algorithm = "aes-192-cbc"; //algorithm to use
const iv = Buffer.from("a8a800d326b8c85fe0a16d7476a9c47b6", "hex");

const service = {};
service.encryptor = (text, password) => {
  const key = crypto.scryptSync(password, "salt", 24); //create key
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  const encrypted = cipher.update(text, "utf8", "hex") + cipher.final("hex"); // encrypted text
  return encrypted;
};
service.decryptor = (encrypted, password) => {
  const key = crypto.scryptSync(password, "salt", 24); //create key
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  var decrypted =
    decipher.update(encrypted, "hex", "utf8") + decipher.final("utf8"); //deciphered text
  return decrypted;
};
module.exports = service;
