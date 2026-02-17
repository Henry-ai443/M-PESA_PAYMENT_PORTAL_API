function generateStkPassword(shortcode, passkey) {
  const timestamp = new Date()
    .toISOString()
    .replace(/[-:TZ.]/g, '')
    .slice(0, 14);

  const passwordStr = shortcode + passkey + timestamp;
  const password = Buffer.from(passwordStr).toString('base64');

  return { password, timestamp };
}

module.exports = { generateStkPassword };



fz