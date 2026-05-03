import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

const myUsername = process.env.NAME;
const email = process.env.EMAIL;
console.log(myUsername);
console.log(email);
