const { BASE_URL, EMAIL_SEND_FROM } = require('../configs/index');

module.exports = function(email, name) {
  return {
    to: email,
    from: EMAIL_SEND_FROM,
    subject: 'Welcome to NodeStack',
    text: 'You account on NodeStack platform had been successfully created',
    html: `
    <h4>Hello, ${name}!</h4>
    <strong>You account on NodeStack platform had been successfully created.</strong>
    <p>Thanks for choosing us!</p>
    <hr />
    <a style="color: green;" href="${BASE_URL}">NodeStack: what's tech?</a>
    `
  }
}
