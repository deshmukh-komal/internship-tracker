const fs = require("fs");
const { google } = require("googleapis");
const db = require("./db");

// ================= AUTH =================
const credentials = JSON.parse(fs.readFileSync("credentials.json"));

const { client_secret, client_id, redirect_uris } =
  credentials.installed;

const oAuth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  redirect_uris[0]
);

const token = JSON.parse(fs.readFileSync("token.json"));
oAuth2Client.setCredentials(token);

// ================= GMAIL =================
const gmail = google.gmail({ version: "v1", auth: oAuth2Client });

// ================= MAIN FUNCTION =================
async function getEmails() {
  try {
    const res = await gmail.users.messages.list({
      userId: "me",
      maxResults: 20, // 🔥 increased
    });

    const messages = res.data.messages;

    if (!messages) {
      console.log("No messages found.");
      return null;
    }

    for (let msg of messages) {
      const msgData = await gmail.users.messages.get({
        userId: "me",
        id: msg.id,
      });

      // ================= GET EMAIL TEXT =================
      const snippet = msgData.data.snippet.toLowerCase();

      const subjectHeader = msgData.data.payload.headers.find(
        (h) => h.name === "Subject"
      );

      const subject = subjectHeader
        ? subjectHeader.value.toLowerCase()
        : "";

      const text = snippet + " " + subject;

      console.log("📩 Checking:", text);

      let statusName = null;
      let companyName = null;

      // ================= STATUS DETECTION =================
      if (
        text.includes("interview") ||
        text.includes("shortlisted") ||
        text.includes("assessment")
      ) {
        statusName = "Interview";
      } else if (
        text.includes("offer") ||
        text.includes("selected") ||
        text.includes("congratulations")
      ) {
        statusName = "Offer";
      } else if (
        text.includes("reject") ||
        text.includes("not selected") ||
        text.includes("regret")
      ) {
        statusName = "Rejected";
      }

      // ================= COMPANY DETECTION =================
      if (text.includes("amazon")) companyName = "Amazon";
      else if (text.includes("tcs")) companyName = "TCS";
      else if (text.includes("infosys")) companyName = "Infosys";

      // ================= SKIP IF NO MATCH =================
      if (!statusName || !companyName) continue;

      console.log(`🎯 Detected: ${companyName} → ${statusName}`);

      // ================= UPDATE DATABASE =================
      return new Promise((resolve) => {
        db.query(
          "SELECT company_id FROM companies WHERE company_name LIKE ?",
          [`%${companyName}%`],
          (err, companyResult) => {
            if (err || companyResult.length === 0) {
              console.log("❌ Company not found");
              return resolve(null);
            }

            const companyId = companyResult[0].company_id;

            db.query(
              "SELECT status_id FROM status WHERE status_name=?",
              [statusName],
              (err, statusResult) => {
                if (err || statusResult.length === 0) {
                  console.log("❌ Status not found");
                  return resolve(null);
                }

                const statusId = statusResult[0].status_id;

                db.query(
                  "UPDATE applications SET status_id=? WHERE company_id=? ORDER BY id DESC LIMIT 1",
                  [statusId, companyId],
                  (err) => {
                    if (err) {
                      console.log("❌ Update error:", err);
                      return resolve(null);
                    }

                    console.log(`✅ ${companyName} updated to ${statusName}`);
                  resolve({
                  status: statusName,
                  company: companyName,
                  messageId: msg.id
                  });
                    
                  }
                );
              }
            );
          }
        );
      });
    }

    console.log("⚠️ No relevant email found");
    return null;

  } catch (err) {
    console.error("Error fetching emails:", err);
    return null;
  }
}

// ================= EXPORT =================
module.exports = { getEmails };