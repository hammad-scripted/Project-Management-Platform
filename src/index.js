import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import dns from "node:dns/promises";
dns.setServers(["1.1.1.1"]);
import app from "./app.js";
import chalk from "chalk";
import connectToDb from "./db/connection.js";
const PORT = process.env.PORT || 3000;

connectToDb()
  .then((connection) => {
    console.log(chalk.bgBlack.yellow("Connected to DB Successfully"));
    app.listen(PORT, () => {
      console.log(
        chalk.bgMagentaBright.blackBright.bold(
          `Server is listening on ${PORT}...`,
        ),
      );
    });
  })
  .catch((error) => {
    console.log(chalk.red("Failed to connect to DB"), error);
    process.exit(1);
  });
