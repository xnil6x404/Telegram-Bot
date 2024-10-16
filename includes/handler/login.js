import TelegramBot from 'node-telegram-bot-api';
import path from 'path';
import fs from 'fs';
import log from '../utility/log.js';

const configPath = path.join(process.cwd(), './config.json');
const configData = fs.readFileSync(configPath, 'utf-8');
const config = JSON.parse(configData);
global.config = config;

const { token, polling } = config;

if (!token) {
  log.error("Bot token is missing in the config file");
  process.exit(1);
}

const bot = new TelegramBot(token, { polling });

bot.getMe()
  .then((botInfo) => {
    log.info(`Bot started successfully as ${botInfo.username}`);
  })
  .catch((error) => {
    log.error("Invalid bot token provided. Please check the token in the config file.");
    log.error(`Error details: ${error.message}`);
    process.exit(1); // Exit the process since the token is invalid
  });

export default bot;
