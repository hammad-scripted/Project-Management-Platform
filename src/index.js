import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import app from "./app.js";
import chalk from "chalk";
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(chalk.magenta(`Server is listening on ${PORT}...`));
});
