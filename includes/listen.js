import command from './handler/command.js';
import reply from './handler/reply.js';
//import handleButton from './handler/button.js';
import event from './handler/event.js';
import { Database } from './handler/database.js';

const db = new Database();
global.db = db;

export const listen = async ({ bot, log }) => {
  await db.load(); // Load the database when starting

  bot.on('message', async (msg) => {
    const { chat: { id: chatId, type: chatType }, from: { id: userId, first_name: userName } } = msg;

    // Get or create the group in the database
    const group = db.getGroup(chatId);

    const object = {
      bot,
      msg,
      chatId,
      userId,
      log,
      db
    };

    // User ranking logic
    const newLevel = await db.rankUp(userId, userName);
    if (newLevel) {
      bot.sendMessage(chatId, `Congratulations ${newLevel.name}! You've reached level ${newLevel.level}!`);
    }

    // Check if the message is from a group
    if (chatType === 'group' || chatType === 'supergroup') {
      // Update last activity for the group
      await db.updateGroup(chatId, (group) => {
        group.lastActivity = new Date().toISOString();
      });

      // Check if only admin mode is enabled
      if (group.onlyadmin) {
        const chatMember = await bot.getChatMember(chatId, userId);
        if (!['creator', 'administrator'].includes(chatMember.status)) {
          // If the user is not an admin and only admin mode is on, ignore the message
          return;
        }
      }
    }
    command(object);
    reply(object);
    event(object);
  });

  // Optional: Periodically clean up inactive groups
  setInterval(async () => {
    const allGroupIds = db.getAllGroupIds();
    const now = new Date();
    for (const groupId of allGroupIds) {
      const group = db.getGroup(groupId);
      if (group.lastActivity) {
        const lastActivity = new Date(group.lastActivity);
        // Remove groups inactive for more than 30 days
        if ((now - lastActivity) > 30 * 24 * 60 * 60 * 1000) {
          await db.deleteGroup(groupId);
          log.system(`Removed inactive group: ${groupId}`);
        }
      }
    }
  }, 24 * 60 * 60 * 1000); // Run once a day

  // Save the database periodically
  setInterval(() => {
    db.save();
  }, 5 * 60 * 1000); // Save every 5 minutes
};