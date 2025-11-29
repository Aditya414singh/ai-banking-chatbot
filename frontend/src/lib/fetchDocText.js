// fetchDocText.js
import fs from "fs";
import { google } from "googleapis";

// Path to your service account key
const SERVICE_ACCOUNT_KEY_PATH = "./service-account-key.json";

// Google Doc ID
const DOCUMENT_ID = "1Y91Da1ThwetA5qFwoX-3jlav27tCcWKkSNOSgOcp43U";

// A small delay helper (optional)
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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

export async function fetchGoogleDocText() {
  try {
    console.log("⏳ Waiting before fetching...");
    await delay(1000);

    console.log("🚀 Fetching Google Doc contents...");

    const auth = await getAuthClient();
    const docs = google.docs({ version: "v1", auth });

    const response = await docs.documents.get({
      documentId: DOCUMENT_ID,
    });

    const body = response.data.body || {};
    const content = body.content || [];
    let text = "";

    for (const element of content) {
      if (!element.paragraph) continue;

      for (const e of element.paragraph.elements || []) {
        if (e.textRun?.content) {
          text += e.textRun.content;
        }
      }
    }

    console.log("=== DOCUMENT TEXT ===\n");
    console.log(text);

    return text;

  } catch (error) {
    console.error("❌ Error while fetching Google Doc:");
    console.error(error.response?.data || error.message);
  }
}

// If you want automatic testing, uncomment:
// fetchGoogleDocText();
