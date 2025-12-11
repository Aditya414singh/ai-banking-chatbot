const ChatService = require("../services/chatService");

exports.storeInteraction = async (req, res) => {
  try {
    const userId = req.body.userId;
    const userMessage = req.body.userMessage;
    const botResponse = req.body.botResponse;

    if (!userId || !userMessage || !botResponse) {
      return res.status(400).json({ error: "Please provide userId, userMessage, and botResponse" });
    }

    const savedChat = await ChatService.saveChat(userId, userMessage, botResponse);

    if (!savedChat) {
      return res.status(500).json({ error: "Something went wrong while saving the chat" });
    }

    return res.status(201).json({ success: true, data: savedChat });
  } catch (err) {
    console.error("Error in storeInteraction:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.getUserHistory = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({ error: "UserId is required" });
    }

    const history = await ChatService.fetchUserHistory(userId);

    if (!history || history.length === 0) {
      return res.status(404).json({ success: true, history: [], message: "No chat history found" });
    }

    return res.status(200).json({ success: true, history });
  } catch (err) {
    console.error("Error in getUserHistory:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
