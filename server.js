const express = require("express");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const db = require("./db");

const app = express();
const PORT = 3000;

// Middleware
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: "secret123",
    resave: false,
    saveUninitialized: false,
  })
);

// Middleware to protect routes
function isAuthenticated(req, res, next) {
  if (req.session.user) return next();
  res.redirect("/login");
}

// Routes
app.get("/", (req, res) => res.redirect("/login"));

// Login
app.get("/login", (req, res) => res.render("login"));
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
    if (!user) return res.send("❌ Invalid credentials");

    bcrypt.compare(password, user.password, (err, match) => {
      if (!match) return res.send("❌ Invalid credentials");

      req.session.user = user;
      res.redirect("/dashboard");
    });
  });
});

// Dashboard
app.get("/dashboard", isAuthenticated, (req, res) => {
  res.render("dashboard", { user: req.session.user });
});

// CRUD for Employees
app.get("/employees", isAuthenticated, (req, res) => {
  db.all("SELECT * FROM employees", (err, rows) => {
    res.render("employees", { employees: rows });
  });
});

app.get("/employees/add", isAuthenticated, (req, res) => {
  res.render("addEmployee");
});

app.post("/employees/add", isAuthenticated, (req, res) => {
  const { name, position, department, salary } = req.body;
  db.run(
    "INSERT INTO employees (name, position, department, salary) VALUES (?, ?, ?, ?)",
    [name, position, department, salary],
    () => res.redirect("/employees")
  );
});

app.get("/employees/edit/:id", isAuthenticated, (req, res) => {
  db.get("SELECT * FROM employees WHERE id = ?", [req.params.id], (err, row) => {
    res.render("editEmployee", { employee: row });
  });
});

app.post("/employees/edit/:id", isAuthenticated, (req, res) => {
  const { name, position, department, salary } = req.body;
  db.run(
    "UPDATE employees SET name=?, position=?, department=?, salary=? WHERE id=?",
    [name, position, department, salary, req.params.id],
    () => res.redirect("/employees")
  );
});

app.get("/employees/delete/:id", isAuthenticated, (req, res) => {
  db.run("DELETE FROM employees WHERE id=?", [req.params.id], () =>
    res.redirect("/employees")
  );
});

// Logout
app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});

// Start server
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
