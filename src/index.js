import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

import dns from 'node:dns/promises';
dns.setServers(['1.1.1.1']);

import chalk from 'chalk';
import connectToDb from './db/connection.js';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Import AFTER dotenv loads
    const { default: app } = await import('./app.js');

    await connectToDb();

    console.log(chalk.bgBlack.yellow('Connected to DB Successfully'));

    app.listen(PORT, () => {
      console.log(
        chalk.bgMagentaBright.blackBright.bold(
          `Server is listening on ${PORT}...`,
        ),
      );
    });
  } catch (error) {
    console.log(chalk.red('Failed to connect to DB'), error);
    process.exit(1);
  }
};

startServer();
