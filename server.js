const express = require("express");
const cors = require("cors");
const db = require("./db");
const { getEmails } = require("./gmail"); // ✅ correct import

const app = express();

app.use(cors());
app.use(express.json());

/* ================= LOGIN ================= */
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE username=? AND password=?",
    [username, password],
    (err, result) => {
      if (err) return res.json({ success: false });
      res.json({ success: result.length > 0 });
    }
  );
});

/* ================= SIGNUP ================= */
app.post("/signup", (req, res) => {
  const { username, email, phone, password } = req.body;

  db.query(
    "INSERT INTO users (username, email, phone, password) VALUES (?, ?, ?, ?)",
    [username, email, phone, password],
    (err) => {
      if (err) return res.json({ success: false });
      res.json({ success: true });
    }
  );
});

/* ================= GET ================= */
app.get("/applications", (req, res) => {
  const sql = `
    SELECT 
      a.id,
      c.company_name AS company,
      r.role_name AS role,
      s.status_name AS status,
      a.deadline,
      a.notes
    FROM applications a
    LEFT JOIN companies c ON a.company_id = c.company_id
    LEFT JOIN roles r ON a.role_id = r.role_id
    LEFT JOIN status s ON a.status_id = s.status_id
    ORDER BY a.id DESC
  `;

  db.query(sql, (err, result) => {
    if (err) return res.send(err);
    res.json(result);
  });
});

/* ================= ADD ================= */
app.post("/applications", (req, res) => {
  const { company, role, status, deadline, notes } = req.body;

  const comp = company.trim();
  const rl = role.trim();
  const st = status.trim();

  db.query(
    "SELECT company_id FROM companies WHERE LOWER(company_name)=LOWER(?)",
    [comp],
    (err, compResult) => {
      if (compResult.length > 0) {
        insertRole(compResult[0].company_id);
      } else {
        db.query(
          "INSERT INTO companies (company_name) VALUES (?)",
          [comp],
          (err, compInsert) => {
            insertRole(compInsert.insertId);
          }
        );
      }
    }
  );

  function insertRole(companyId) {
    db.query(
      "SELECT role_id FROM roles WHERE LOWER(role_name)=LOWER(?)",
      [rl],
      (err, roleResult) => {
        if (roleResult.length > 0) {
          insertApp(companyId, roleResult[0].role_id);
        } else {
          db.query(
            "INSERT INTO roles (role_name) VALUES (?)",
            [rl],
            (err, roleInsert) => {
              insertApp(companyId, roleInsert.insertId);
            }
          );
        }
      }
    );
  }

  function insertApp(companyId, roleId) {
    db.query(
      "SELECT status_id FROM status WHERE LOWER(status_name)=LOWER(?)",
      [st],
      (err, statusResult) => {
        const statusId = statusResult[0].status_id;

        db.query(
          `INSERT INTO applications (company_id, role_id, status_id, deadline, notes)
           VALUES (?, ?, ?, ?, ?)`,
          [companyId, roleId, statusId, deadline, notes],
          () => {
            res.json({ message: "Added ✅" });
          }
        );
      }
    );
  }
});

/* ================= DELETE ================= */
app.delete("/applications/:id", (req, res) => {
  db.query("DELETE FROM applications WHERE id=?", [req.params.id]);
  res.json({ message: "Deleted" });
});

/* ================= UPDATE ================= */
app.put("/applications/:id", (req, res) => {
  const { status, deadline, notes } = req.body;

  db.query(
    "SELECT status_id FROM status WHERE LOWER(status_name)=LOWER(?)",
    [status],
    (err, result) => {
      const statusId = result[0].status_id;

      db.query(
        "UPDATE applications SET status_id=?, deadline=?, notes=? WHERE id=?",
        [statusId, deadline, notes, req.params.id],
        () => res.json({ message: "Updated" })
      );
    }
  );
});

/* ================= 🤖 EMAIL AUTOMATION ================= */
setInterval(async () => {
  const result = await getEmails(); // ✅ FIXED

  if (result) {
    console.log("📩 Auto Update:", result);

    db.query(
      `UPDATE applications 
       SET status_id = (
         SELECT status_id FROM status WHERE LOWER(status_name)=LOWER(?)
       )
       WHERE company_id = (
         SELECT company_id FROM companies WHERE LOWER(company_name)=LOWER(?)
       )`,
      [result.status, result.company]
    );
  }
}, 15000);

/* ================= MANUAL CHECK ================= */
app.get("/check-emails", async (req, res) => {
  const result = await getEmails();

  if (result) {
    res.json({
      message: "Email processed ✅",
      detected_status: result.status,
      company: result.company,
      messageId: result.messageId
    });
  } else {
    res.json({
      message: "No relevant email ❌",
      detected_status: null
    });
  }
});
/* ================= START ================= */
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000 🚀");
});