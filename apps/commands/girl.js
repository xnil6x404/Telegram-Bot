export const config = {
  name: "girl",
  aliases: [],
  author: "Đức tài cuti vcl",
  description: "Fetch a random girl photo.",
  usage: [""],
  cooldown: 0,
  access: "anyone",
  category: "anime"
};

export const onCommand = async function({ message, bot, chatId, log }) {
  try {
    // Fetch data from the cosplayphoto API
    const response = await fetch(`${global.config.api}/api/girl`);
    const data = await response.json();

    // Extract the URL of the cosplay image
    const imageUrl = data.url;

    // Send the cosplay image as a photo to the chat
    await bot.sendPhoto(chatId, imageUrl);
  } catch (error) {
    log.error("Error executing command:", error);
    await bot.sendMessage(chatId, `An error occurred: ${error.message}`);
  }
};
