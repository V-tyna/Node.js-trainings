module.exports = function(messages) {
  return messages.map((message) => {
    return {
      message_id: message._id,
      date: new Date(message.date).toLocaleString(),
      user_name: message.user.name,
      user_id: message.user._id,
      content: message.content
    }
  })
}