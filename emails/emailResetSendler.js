const { BASE_URL, EMAIL_SEND_FROM } = require('../configs/index');

module.exports = function(email, token) {
  return {
    to: email,
    from: EMAIL_SEND_FROM,
    subject: 'Restore access on NodeStack',
    text: 'Password reset confirmation',
    html: `
    <strong>From your email - ${email} was prompted to reset password.</strong>
    <p>If it wasn't you, please ignore this letter.</p>
    <a style="size: 1,5rem; color: darkblue;" href="${BASE_URL}/auth/accessRestoring/${token}">Link to restore access</a>
    <hr />
    <a style="color: green;" href="${BASE_URL}">NodeStack: what's tech?</a>
    `
  }
}