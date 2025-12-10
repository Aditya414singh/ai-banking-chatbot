const Chat = require("../models/chatSchema");

class ChatService {
  static async saveChat(userId, userMessage, botResponse) {
    if (!userId || !userMessage || !botResponse) {
      throw new Error("All fields are required");
    }

    const saved = await Chat.create({ userId, userMessage, botResponse });
    return saved;
  }

  static async fetchUserHistory(userId) {
    if (!userId) throw new Error("UserId is required");
    const history = await Chat.find({ userId }).sort({ timestamp: 1 });
    return history;
  }

  static async clearHistory(userId) {
    if (!userId) throw new Error("UserId required");
    const result = await Chat.deleteMany({ userId });
    return result.deletedCount;
  }

  static async clearAll() {
    await Chat.deleteMany({});
    return true;
  }
}

module.exports = ChatService;
