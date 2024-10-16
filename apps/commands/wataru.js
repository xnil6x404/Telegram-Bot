import axios from 'axios';

export const config = {
  name: 'wataru',
  aliases: [],
  author: 'Christian Hadestia',
  description: 'Interact with Wataru AI to generate a response based on a given prompt.',
  usage: ['<prompt>', 'reply to a message'],
  cooldown: 5, // Adjust if needed
  access: 'anyone', // Adjust if needed
  category: 'AI'
};

export const onCommand = async function({ message, bot, chatId, userId, args, log, usages }) {
  let prompt = args.join(' ');
  if (!prompt) {
    return usages();
  }

  if (message.reply_to_message && message.reply_to_message.text) {
    prompt = `"${message.reply_to_message.text}", ${prompt}`;
  }

  const headers = {
    "Cookie": "YOUR COOKIE",
    "Content-Type": "application/json",
    "Origin": "https://www.blackbox.ia",
    "Referer": "https://www.blackbox.ia/agent/IanYQ3mknU",
    "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36"
  };
  const config = {
    "messages": [{
      "id": "SVNaDhsdI_FlPHGFGlDyB",
      "content": `${prompt}`,
      "role": "user"
    }],
    "id": "SVNaDhsdI_FlPHGFGlDyB",
    "previewToken": null,
    "userId": null,
    "codeModelMode": true,
    "agentMode": {
      "mode": true,
      "id": "Wataru0irSTue",
      "name": "Wataru"
    },
    "trendingAgentMode": {},
    "isMicMode": false,
    "maxTokens": 1024,
    "isChromeExt": false,
    "githubToken": null,
    "clickedAnswer2": false,
    "clickedAnswer3": false,
    "clickedForceWebSearch": false,
    "visitFromDelta": false,
    "mobileClient": false,
    "withCredentials": true
  };

  await bot.sendChatAction(chatId, 'typing');

  await Promise.race([
    axios.post('https://www.blackbox.ai/api/chat', config, { headers }),
    new Promise((_, rej) => setTimeout(() => rej(`Request Timeout for prompt: "${prompt}"`), 600000))
  ]).then(async (response) => {
    const reply = (response.data).replace(/\**/g, '').replace(/^\$@\$.*?\$@\$/g, '');
    await bot.sendMessage(chatId, `${reply}`);
  }).catch(async (err) => {
    log.error(err);
    await bot.sendMessage(chatId, `An error occurred: ${err.message}`);
  });
};
