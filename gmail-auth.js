const fs = require("fs");
const { google } = require("googleapis");

const SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"];

// ✅ Load credentials
const credentials = JSON.parse(fs.readFileSync("credentials.json"));
const { client_secret, client_id, redirect_uris } =
  credentials.installed;

// ✅ OAuth client
const oAuth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  redirect_uris[0]
);

// ✅ Load token
const token = JSON.parse(fs.readFileSync("token.json"));
oAuth2Client.setCredentials(token);

// ✅ Gmail instance
const gmail = google.gmail({ version: "v1", auth: oAuth2Client });

// 🔥 MAIN FUNCTION
async function getEmails() {
  try {
    const res = await gmail.users.messages.list({
      userId: "me",
      maxResults: 5,
    });

    const messages = res.data.messages;

    if (!messages) {
      console.log("No messages found.");
      return;
    }

    for (let msg of messages) {
      const msgData = await gmail.users.messages.get({
        userId: "me",
        id: msg.id,
      });

      const snippet = msgData.data.snippet.toLowerCase();

      console.log("📩 Email:", snippet);

      // 🔥 Detect keywords
      if (snippet.includes("interview")) {
        console.log("🟡 INTERVIEW DETECTED");
      } else if (snippet.includes("offer")) {
        console.log("🟢 OFFER DETECTED");
      } else if (snippet.includes("rejected")) {
        console.log("🔴 REJECTED DETECTED");
      }
    }
  } catch (err) {
    console.error("Error fetching emails:", err);
  }
}

module.exports = { getEmails };