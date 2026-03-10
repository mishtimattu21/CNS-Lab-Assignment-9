require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// database
const db = require("./app/models");
const Role = db.role;

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

// routes
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;

// Connect to Supabase (PostgreSQL), then start server
db.sequelize.sync()
  .then(() => {
    // Ensure default roles exist (user, moderator, admin)
    return db.role.findAndCountAll().then(({ count }) => {
      if (count === 0) {
        return initial();
      }
    });
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}.`);
    });
  })
  .catch((err) => {
    console.error("\n*** Database connection failed ***");
    console.error("Error:", err.message);
    console.error("\nMake sure DATABASE_URL is set in .env (Supabase: Project Settings → Database → Connection string).");
    console.error("  - Or set DB_HOST, DB_USER, DB_PASSWORD, DB_NAME for PostgreSQL.\n");
    process.exit(1);
  });

// force: true will drop the table if it already exists
// db.sequelize.sync({force: true}).then(() => {
//   console.log('Drop and Resync Database with { force: true }');
//   initial();
// });

function initial() {
  return Promise.all([
    Role.findOrCreate({ where: { id: 1 }, defaults: { name: "user" } }),
    Role.findOrCreate({ where: { id: 2 }, defaults: { name: "moderator" } }),
    Role.findOrCreate({ where: { id: 3 }, defaults: { name: "admin" } }),
  ]);
}