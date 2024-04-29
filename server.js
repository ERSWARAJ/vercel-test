const express = require("express");
const { Sequelize, DataTypes } = require("sequelize");
const app = express();
const PORT = 4000;

const sequelize = new Sequelize("verceldb", "default", "P4sjHvSUt9wQ", {
  host: "ep-super-shape-a4299p3q-pooler.us-east-1.aws.neon.tech",
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

async function syncDB() {
  try {
    await sequelize.authenticate();
    await User.sync({ alter: true });
    console.log("Database connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

async function insertUsers() {
  try {
    await User.bulkCreate([
      { name: "parmeet" },
      { name: "john" },
      { name: "alice" },
    ]);
    console.log("Users inserted successfully");
  } catch (error) {
    console.error("Error occurred while inserting users:", error);
  }
}

app.use(async (req, res, next) => {
  await syncDB();
  await insertUsers();
  next();
});

app.get("/", (req, res) => {
  res.status(200).send("Welcome to the API server");
});

app.get("/data", async (req, res) => {
  try {
    const data = await User.findAll();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error occurred while fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

module.exports = app;
