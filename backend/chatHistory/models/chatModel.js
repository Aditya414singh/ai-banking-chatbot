
let chatHistory = [];

class ChatModel {
  
  static saveInteraction(userId, userMessage, botResponse) {
    if (!userId || typeof userId !== "string") {
      throw new Error("Invalid or missing userId");
    }

    if (!userMessage || typeof userMessage !== "string") {
      throw new Error("Invalid or missing userMessage");
    }

    if (!botResponse || typeof botResponse !== "string") {
      throw new Error("Invalid or missing botResponse");
    }

    const interaction = {
      id: ChatModel.generateId(),
      userId: userId,
      userMessage: userMessage,
      botResponse: botResponse,
      timestamp: new Date(),
    };

    chatHistory.push(interaction);

    console.log(`Saved interaction for userId=${userId}, total interactions=${chatHistory.length}`);

    return interaction;
  }

  
  static getUserHistory(userId) {
    if (!userId || typeof userId !== "string") {
      throw new Error("userId is required and must be a string");
    }

    const userChats = chatHistory.filter((item) => item.userId === userId);

    console.log(`Fetched ${userChats.length} interactions for userId=${userId}`);

    return [...userChats]; 
  }

  
  static getAllInteractions() {
    return [...chatHistory];
  }

  
  static clearUserHistory(userId) {
    if (!userId) return 0;

    const initialLength = chatHistory.length;
    chatHistory = chatHistory.filter((item) => item.userId !== userId);
    const removedCount = initialLength - chatHistory.length;

    console.log(`Cleared ${removedCount} interactions for userId=${userId}`);

    return removedCount;
  }

  
  static clearAll() {
    chatHistory = [];
    console.log("Cleared all chat interactions");
  }

  
  static generateId() {
    return "id_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
  }
}

module.exports = ChatModel;
