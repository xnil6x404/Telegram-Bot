import fs from 'fs-extra';
import path from 'path';
import express from 'express';
import chalk from 'chalk';
import figlet from 'figlet';
import log from './includes/utility/log.js';
import { loadAll } from './includes/utility/utils.js';
import bot from './includes/handler/login.js';
import { listen } from './includes/listen.js';

const app = express();
const port = 8601;

global.bot = bot;
global.utils = loadAll;
global.client = {
  startTime: new Date(),
  commands: new Map(),
  events: new Map(),
  results: new Map(),
  replies: new Map(),
  cooldowns: new Map(),
  reactions: {},
};

// Convert figlet to async function with modern syntax
const generateFiglet = async (text) => {
  return new Promise((resolve, reject) => {
    figlet.text(text, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
};

try {
  // Using top-level await in ES2024
  const figletText = await generateFiglet('Wataru');
  console.log(chalk.blue(figletText));
  

  const loadErrors = await loadAll();

  if (loadErrors) {
    log.error('Errors occurred while loading commands or events:', loadErrors);
  }

  const totalUser = (await global.db.getAllUserIds()).length;
  const totalGroup = (await global.db.getAllGroupIds()).length;

  log.info(`Commands: ${global.client.commands.size}`);
  log.info(`Events: ${global.client.events.size}`);
  log.info(`Users: ${totalUser}`);
  log.info(`Groups: ${totalGroup}`);
  log.info(`Owner: ${global.config.owner}`);

  // Set up express server
  app.get('/', (req, res) => {
    res.send('Online!');
  });

  app.listen(port, () => {
    log.info(`Wataru is running on port ${port}`);
  });

  // Start listening for Telegram messages
  listen({ log, bot });
} catch (error) {
  log.error('Error during startup: ' + error);
}
