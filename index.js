import express from "express";
import { configDotenv } from "dotenv";
import router from "./routes/router.js";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import task from "./cron/task.js";
import redis from "redis";
import fetch from "node-fetch";
// task.start()

configDotenv();
const app = express();

app.use((error, req, res, next) => {
  console.log("Erreur " + error);
  res.status(500).json({
    message: "Une erreur est survenue. Veuillez réessayer plus tard.",
    error: error.message || error,
  });
});

const port = process.env.PORT;
const host = process.env.HOST;
app.listen(port, host, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});

const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

export const viewspath = path.join(__dirname, "views");
export default app;

app.use(express.static(path.join(__dirname, "public/files")));
app.use(morgan("dev"));
app.use(express.json());

export let redisClient;
(async () => {
  redisClient = redis.createClient({
    url: "redis://127.0.0.1:6379",
  });
  redisClient.on("error", (error) => console.error(`Redis error : ${error}`));
  await redisClient.connect();
  console.log("Connection à redis effectuée");
})();

app.use("/api", router);

import mysql from "mysql";
app.get("/involves", async (req, res, next) => {
  try {
    // const response = await fetch(
    //   "http://localhost:8000/api/involves_persons_all",
    //   {
    //     method: "GET",
    //     headers: {
    //       "Content-Type": "application/json",
    //     }
    //   }
    // );
    // if (response.ok) {
    //   const data = response.json();
    //   res.status(200).json({ data: data });
    // }
    const connection = mysql.createConnection({
      host: "op27573-002.eu.clouddb.ovh.net",
      user: "csaf_user",
      password: "UIvEg1wTRb6q24c",
      database: "csaf_preprod",
      port: 35710,
    });

    connection.connect();

    connection.query("SELECT * from involve_people", (err, rows, fields) => {
      if (err) throw err;
      res.json({ message: "ok", data: rows });
    });

    connection.end();
  } catch (err) {
    next(err);
  }
});
