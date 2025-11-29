// fetchDocText.js
const fs = require("fs");
const { google } = require("googleapis");

const SERVICE_ACCOUNT_KEY_PATH = "./service-account-key.json";
const DOCUMENT_ID = "1Y91Da1ThwetA5qFwoX-3jlav27tCcWKkSNOSgOcp43U";

// simple delay helper
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

async function getAuthClient() {
  const keyFile = JSON.parse(fs.readFileSync(SERVICE_ACCOUNT_KEY_PATH, "utf8"));

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: keyFile.client_email,
      private_key: keyFile.private_key,
    },
    scopes: [
      "https://www.googleapis.com/auth/documents.readonly",
      "https://www.googleapis.com/auth/drive.readonly",
    ],
  });

  return await auth.getClient();
}

async function fetchGoogleDocText() {
  try {
    console.log("⏳ Waiting 10 seconds before fetching...");
    await delay(1000); // <<< WAIT HERE

    console.log("🚀 Starting fetch now...");

    const auth = await getAuthClient();
    const docs = google.docs({ version: "v1", auth });

    const res = await docs.documents.get({
      documentId: DOCUMENT_ID,
    });

    const body = res.data.body || {};
    const content = body.content || [];
    let fullText = "";

    for (const element of content) {
      if (!element.paragraph) continue;
      const { elements } = element.paragraph;
      if (!elements) continue;

      for (const e of elements) {
        if (e.textRun?.content) {
          fullText += e.textRun.content;
        }
      }
    }

    console.log("=== DOCUMENT TEXT ===\n");
    console.log(fullText);
    return fullText;

  } catch (err) {
    console.error("Error fetching doc:");
    if (err.response?.data) {
      console.error(JSON.stringify(err.response.data, null, 2));
    } else {
      console.error(err.message);
    }
  }
}

fetchGoogleDocText();
