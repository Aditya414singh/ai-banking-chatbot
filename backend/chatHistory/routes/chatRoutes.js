
const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");

function validateStore(req, res, next) {
  const { userId, userMessage, botResponse } = req.body;

  if (!userId || !userMessage || !botResponse) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (
    typeof userId !== "string" ||
    typeof userMessage !== "string" ||
    typeof botResponse !== "string"
  ) {
    return res.status(400).json({ error: "Invalid field type" });
  }

  next();
}

router.post("/store", validateStore, chatController.storeInteraction);

router.get(
  "/history/:userId",
  (req, res, next) => {
    if (!req.params.userId) {
      return res.status(400).json({ error: "User ID missing" });
    }
    next();
  },
  chatController.getUserHistory
);

router.get("/all", (req, res) => {
  try {
    const ChatModel = require("../models/chatModel");
    const data = ChatModel.getAllInteractions();
    res.json({ success: true, count: data.length, data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.use('/api/chat', require('./chatHistory/routes/chatRoutes'));


module.exports = router;
