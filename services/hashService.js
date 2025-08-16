const bcrypt = require('bcryptjs');

async function hash(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

function verify(password, hash) {
  return bcrypt.compare(password, hash);
}

module.exports = {
  hash,
  verify
}