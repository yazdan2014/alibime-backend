// config.js
module.exports = {
  secret: "supersecret",
  secret_temp: "usersecret",
  token_expires_in: 43200, // expires in 12 hours
  token_expires_in_temp: 60 * 5, // expires in 60 second
  verify_codeexpires_in: 300, // expires in 5 minute,
  upload_file_max_size: 1000 * 1024, // 500 kB
};
