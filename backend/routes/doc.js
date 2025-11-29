import express from "express";
import fs from "fs";
import { google } from "googleapis";

const router = express.Router();

const SERVICE_ACCOUNT_KEY_PATH = "./routes/service-account-key.json";
const DOCUMENT_ID = "1Y91Da1ThwetA5qFwoX-3jlav27tCcWKkSNOSgOcp43U";

async function getAuthClient() {
  const keyData = JSON.parse(fs.readFileSync(SERVICE_ACCOUNT_KEY_PATH, "utf8"));

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: keyData.client_email,
      private_key: keyData.private_key,
    },
    scopes: [
      "https://www.googleapis.com/auth/documents.readonly",
      "https://www.googleapis.com/auth/drive.readonly",
    ],
  });

  return auth.getClient();
}

router.get("/google-doc", async (req, res) => {
  try {
    const auth = await getAuthClient();
    const docs = google.docs({ version: "v1", auth });

    const response = await docs.documents.get({
      documentId: DOCUMENT_ID,
    });

    const body = response.data.body;
    let text = "";

    body.content?.forEach((element) => {
      element.paragraph?.elements?.forEach((e) => {
        if (e.textRun?.content) text += e.textRun.content;
      });
    });
     console.log("Fetched document text:", text);
    return res.json({ text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch doc" });
  }
});

export default router;
