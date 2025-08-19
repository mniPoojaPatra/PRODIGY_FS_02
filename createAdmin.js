const bcrypt = require("bcryptjs");
const db = require("./db");

const username = "admin";
const password = "admin123"; // you can change later
const role = "admin";

bcrypt.hash(password, 10, (err, hash) => {
  if (err) throw err;

  db.run(
    "INSERT OR IGNORE INTO users (username, password, role) VALUES (?, ?, ?)",
    [username, hash, role],
    (err) => {
      if (err) console.error("❌ Error creating admin:", err.message);
      else console.log("✅ Admin user created (username: admin, password: admin123)");
      process.exit();
    }
  );
});
