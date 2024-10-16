import axios from 'axios';

export const config = {
  name: "cosplay",
  aliases: [],
  author: "Lance Cochangco",
  description: "Fetch and send a random cosplay video.",
  usage: [""],
  cooldown: 0,
  access: "anyone",
  category: "fun"
};

export const onCommand = async function({ message, bot, log }) {
  try {
    const chatId = message.chat.id;

    // Fetch random cosplay video from the provided API
    const response = await axios.get(`${global.config.api}/api/cosplay`);
    const { videoUrl } = response.data;

    // If a valid video URL is returned, send the video using bot.sendVideo
    if (videoUrl) {
      await bot.sendVideo(chatId, videoUrl, { caption: "Here's a random cosplay video for you!" });
    } else {
      await bot.sendMessage(chatId, "Sorry, I couldn't find any videos.");
    }
  } catch (error) {
    log.error("Error fetching or sending cosplay video:", error);
    await bot.sendMessage(chatId, `An error occurred while fetching the video: ${error.message}`);
  }
};
