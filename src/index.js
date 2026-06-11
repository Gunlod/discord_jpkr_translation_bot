require("dotenv").config();

const { Client, GatewayIntentBits, Events } = require("discord.js");
const deepl = require("deepl-node");

const {
  DISCORD_TOKEN,
  DEEPL_API_KEY,
  JAPANESE_CHANNEL_ID,
  KOREAN_CHANNEL_ID
} = process.env;

const requiredEnv = {
  DISCORD_TOKEN,
  DEEPL_API_KEY,
  JAPANESE_CHANNEL_ID,
  KOREAN_CHANNEL_ID
};

for (const [key, value] of Object.entries(requiredEnv)) {
  if (!value) {
    console.error(`Missing required environment variable: ${key}`);
    process.exit(1);
  }
}

const translator = new deepl.Translator(DEEPL_API_KEY);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const channelRoutes = new Map([
  [
    JAPANESE_CHANNEL_ID,
    {
      targetChannelId: KOREAN_CHANNEL_ID,
      sourceLang: "JA",
      targetLang: "KO"
    }
  ],
  [
    KOREAN_CHANNEL_ID,
    {
      targetChannelId: JAPANESE_CHANNEL_ID,
      sourceLang: "KO",
      targetLang: "JA"
    }
  ]
]);

function getSenderName(message) {
  return message.member?.displayName || message.author.username;
}

function buildForwardMessage(senderName, translatedText, attachments) {
  const attachmentUrls = attachments.map((attachment) => attachment.url);
  const translatedMessage = `${senderName}:\n${translatedText}`;

  if (attachmentUrls.length === 0) {
    return translatedMessage;
  }

  return `${translatedMessage}\n\n${attachmentUrls.join("\n")}`;
}

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Logged in as ${readyClient.user.tag}`);
});

client.on(Events.MessageCreate, async (message) => {
  try {
    if (message.author.bot) {
      return;
    }

    const route = channelRoutes.get(message.channelId);
    if (!route) {
      return;
    }

    const originalText = message.content.trim();
    if (!originalText) {
      return;
    }

    const result = await translator.translateText(
      originalText,
      route.sourceLang,
      route.targetLang
    );

    const targetChannel = await client.channels.fetch(route.targetChannelId);
    if (!targetChannel || !targetChannel.isTextBased()) {
      console.error(`Target channel is not available: ${route.targetChannelId}`);
      return;
    }

    const content = buildForwardMessage(
      getSenderName(message),
      result.text,
      Array.from(message.attachments.values())
    );

    await targetChannel.send({ content });
  } catch (error) {
    console.error("Failed to translate and forward message:", error);
  }
});

client.login(DISCORD_TOKEN);
