const fs = require('fs');
const path = require('path');
const uuid = require('uuid');

class MessagesService {
  constructor(text) {
    this.message = text;
    this.id = uuid.v4();
    this.date = new Date().toLocaleString();
  }

  static saveMessages(messages) {
    return new Promise((res, rej) => {
      fs.writeFile(
        path.join(__dirname, '../data/messages.json'),
        JSON.stringify(messages),
        (err) => {
          if (err) {
            rej(err);
          } else {
            res();
          }
        }
      );
    });
  }

  static getMessages() {
    return new Promise((res, rej) => {
      fs.readFile(
        path.join(__dirname, '../data/messages.json'),
        'utf-8',
        (err, content) => {
          if (err) {
            rej(err);
          } else {
            res(JSON.parse(content));
          }
        }
      );
    });
  }

  async addMessage() {
    const messages = await MessagesService.getMessages();
    const message = { message: this.message, id: this.id, date: this.date };
    messages.unshift(message);
    MessagesService.saveMessages(messages);
  }

}

module.exports = MessagesService;
