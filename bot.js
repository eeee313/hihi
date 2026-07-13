const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const fetch = (...a) => import('node-fetch').then(({ default: f }) => f(...a));

// ─────────────────────────────────────
// CONFIGURATION
// ─────────────────────────────────────
const BOT_TOKEN = process.env.BOT_TOKEN;
const ALLOWED_USER_ID = "1173953184113360910";
const TARGET_CHANNEL_ID = "1525885187249143969";

// ─────────────────────────────────────
// DATA STORAGE
// ─────────────────────────────────────
const TOKENS_FILE = "./tokens.json";
const ACTIVE_FILE = "./active.json";

function loadTokens() {
    if (!fs.existsSync(TOKENS_FILE)) {
        fs.writeFileSync(TOKENS_FILE, JSON.stringify({ tokens: [] }, null, 2));
    }
    return JSON.parse(fs.readFileSync(TOKENS_FILE));
}

function saveTokens(data) {
    fs.writeFileSync(TOKENS_FILE, JSON.stringify(data, null, 2));
}

function loadActive() {
    if (!fs.existsSync(ACTIVE_FILE)) {
        fs.writeFileSync(ACTIVE_FILE, JSON.stringify({ active: {} }, null, 2));
    }
    return JSON.parse(fs.readFileSync(ACTIVE_FILE));
}

function saveActive(data) {
    fs.writeFileSync(ACTIVE_FILE, JSON.stringify(data, null, 2));
}

// ─────────────────────────────────────
// MESSAGE VARIATIONS
// ─────────────────────────────────────
const MESSAGES = [
    "**🌿 TRADING GAG 2** 🌿\n\n🔥 **WHAT I'M TRADING:**\n• GAG 2 (Rare)\n• Grow a Garden 2\n• Raccoon\n• Dragonfly\n• Unicorn\n• Ice Serpent\n• Firefly\n\n💫 **LOOKING FOR:**\n• Good offers\n• Overpays\n• Neon pets\n• Upgrades\n\n📩 **DM ME YOUR OFFERS!**\n*Best offer takes it*",

    "**🦝 RACCOON + GAG 2 FOR TRADE** 🦝\n\n⭐ **MY OFFER:**\n• Rare Raccoon\n• GAG 2\n• Adds if needed\n\n✨ **LF:**\n• Unicorn\n• Dragonfly\n• Ice Serpent\n• Good pets\n• Overpays only\n\n💎 **DM TO NEGOTIATE**\n*Taking offers until reset*",

    "**🐉 DRAGONFLY & UNICORN FOR TRADE** 🐉\n\n🌟 **AVAILABLE:**\n• Dragonfly (Rare)\n• Unicorn\n• Grow a Garden 2\n• Firefly\n\n🎯 **WANTED:**\n• Neon pets\n• Mega pets\n• Good offers\n• Overpays\n\n📨 **COMMENT OR DM**\n*Best offer wins!*",

    "**🐍 ICE SERPENT + FIREFLY FOR SALE** 🔥\n\n🌙 **WHAT I HAVE:**\n• Ice Serpent (Rare)\n• Firefly\n• GAG 2\n• Raccoon\n• Garden 2\n\n💫 **LOOKING FOR:**\n• Good offers\n• Upgrades\n• Neon versions\n• Overpays only\n\n💬 **DM ME QUICK!**\n*Limited time offer*",

    "**🌸 GROW A GARDEN 2 FOR TRADE** 🌸\n\n🌱 **MY OFFER:**\n• Grow a Garden 2\n• Raccoon\n• Dragonfly\n• GAG 2\n• Firefly\n\n⭐ **LF:**\n• Unicorn\n• Ice Serpent\n• Good pets\n• Overpays\n• Fair offers\n\n📩 **DM TO OFFER**\n*Best offer takes it*",

    "**🦄 UNICORN & DRAGONFLY FOR TRADE** 🦄\n\n✨ **TRADING:**\n• Unicorn (Rare)\n• Dragonfly\n• GAG 2\n• Grow a Garden 2\n• Ice Serpent\n\n🔥 **LOOKING FOR:**\n• Good offers\n• Neon pets\n• Overpays\n• Mega versions\n\n💎 **DM YOUR OFFER**\n*All offers considered*",

    "**💀 SELLING GAG 2 + ADDS** 💀\n\n⭐ **WHAT I'M SELLING:**\n• GAG 2 (Rare)\n• Firefly\n• Raccoon\n• Dragonfly\n• Garden 2\n\n🎯 **LOOKING FOR:**\n• Best offers\n• Overpays\n• Good pets\n• Upgrades\n\n📨 **DM TO NEGOTIATE**\n*Quick sale!*",

    "**🌟 MEGA TRADE - ALL PETS FOR SALE** 🌟\n\n🔥 **TRADING EVERYTHING:**\n• Grow a Garden 2\n• GAG 2\n• Raccoon\n• Dragonfly\n• Unicorn\n• Ice Serpent\n• Firefly\n• More adds!\n\n💫 **LF:**\n• Huge overpays\n• Mega pets\n• Neon versions\n• Good offers only\n\n💬 **DM YOUR BEST OFFER**\n*Best offer wins everything!*",

    "**🎯 GARDEN 2 + RACCOON FOR TRADE** 🎯\n\n🌿 **MY OFFER:**\n• Grow a Garden 2\n• Raccoon\n• Dragonfly\n• GAG 2\n\n⭐ **WANTED:**\n• Unicorn\n• Ice Serpent\n• Firefly\n• Good offers\n• Overpays\n\n📩 **DM TO TRADE**\n*Serious offers only*",

    "**🔥 FIREFLY + ICE SERPENT FOR SALE** 🔥\n\n🌙 **SELLING:**\n• Firefly (Rare)\n• Ice Serpent\n• GAG 2\n• Garden 2\n• Raccoon\n\n✨ **LOOKING FOR:**\n• Best offers\n• Overpays\n• Good pets\n• Upgrades\n\n💎 **DM YOUR OFFER**\n*Best offer wins*",

    "**🦝 RACCOON FAMILY FOR TRADE** 🦝\n\n⭐ **WHAT I HAVE:**\n• Rare Raccoon\n• Dragonfly\n• Firefly\n• GAG 2\n• Grow a Garden 2\n\n🎯 **LF:**\n• Unicorn\n• Ice Serpent\n• Neon pets\n• Good offers\n• Overpays\n\n📨 **DM ME NOW!**\n*Don't miss out*",

    "**🐉 DRAGONFLY + GARDEN 2 FOR TRADE** 🐉\n\n✨ **TRADING:**\n• Dragonfly (Rare)\n• Grow a Garden 2\n• Raccoon\n• Firefly\n• GAG 2\n\n💫 **LOOKING FOR:**\n• Good offers\n• Overpays\n• Unicorn\n• Ice Serpent\n• Upgrades\n\n💬 **DM TO OFFER**\n*All offers considered*",

    "**🌸 UNICORN + FIREFLY FOR SALE** 🌸\n\n⭐ **SELLING:**\n• Unicorn (Rare)\n• Firefly\n• Dragonfly\n• Raccoon\n• Garden 2\n• GAG 2\n\n🔥 **LF:**\n• Best offers\n• Overpays\n• Good pets\n• Neon versions\n\n📩 **DM YOUR OFFER**\n*Quick sale!*",

    "**💀 GAG 2 + ADDS FOR TRADE** 💀\n\n🌙 **MY OFFER:**\n• GAG 2 (Rare)\n• Ice Serpent\n• Firefly\n• Dragonfly\n• Raccoon\n\n⭐ **WANTED:**\n• Unicorn\n• Grow a Garden 2\n• Good offers\n• Overpays\n• Upgrades\n\n💎 **DM TO NEGOTIATE**\n*Best offer wins*",

    "**🌟 EVERYTHING FOR TRADE - BEST OFFER** 🌟\n\n🔥 **FULL INVENTORY:**\n• Grow a Garden 2\n• GAG 2\n• Raccoon\n• Dragonfly\n• Unicorn\n• Ice Serpent\n• Firefly\n• More!\n\n💫 **LOOKING FOR:**\n• Huge overpays\n• Mega pets\n• Neon versions\n• Best offers only\n\n📨 **DM YOUR BEST OFFER**\n*Everything goes to best offer*",

    "**🎯 RACCOON + UNICORN FOR TRADE** 🎯\n\n⭐ **TRADING:**\n• Raccoon (Rare)\n• Unicorn\n• Dragonfly\n• GAG 2\n• Garden 2\n\n✨ **LF:**\n• Ice Serpent\n• Firefly\n• Good offers\n• Overpays\n• Upgrades\n\n💬 **DM ME!**\n*Serious offers only*",

    "**🐍 ICE SERPENT + GAG 2 FOR SALE** 🐍\n\n🌙 **SELLING:**\n• Ice Serpent (Rare)\n• GAG 2\n• Firefly\n• Dragonfly\n• Raccoon\n\n🔥 **LOOKING FOR:**\n• Best offers\n• Overpays\n• Good pets\n• Unicorn\n• Garden 2\n\n📩 **DM YOUR OFFER**\n*Best offer wins*",

    "**🦄 RARE UNICORN FOR TRADE** 🦄\n\n⭐ **MY OFFER:**\n• Unicorn (Rare)\n• Adds:\n  - GAG 2\n  - Dragonfly\n  - Firefly\n  - Raccoon\n\n🎯 **LF:**\n• Huge overpays\n• Mega pets\n• Neon versions\n• Good offers\n\n💎 **DM TO OFFER**\n*Best offer takes all*",

    "**🌿 GROW A GARDEN 2 MEGA TRADE** 🌿\n\n✨ **TRADING:**\n• Grow a Garden 2\n• Raccoon\n• Dragonfly\n• Unicorn\n• Ice Serpent\n• Firefly\n• GAG 2\n\n💫 **LOOKING FOR:**\n• Best offers\n• Overpays only\n• Neon pets\n• Mega versions\n\n📨 **DM YOUR OFFER**\n*Everything for best offer*",

    "**🔥 ALL PETS FOR SALE - QUICK SALE** 🔥\n\n⭐ **SELLING EVERYTHING:**\n• GAG 2\n• Grow a Garden 2\n• Raccoon\n• Dragonfly\n• Unicorn\n• Ice Serpent\n• Firefly\n• All adds!\n\n🎯 **LF:**\n• Best offers\n• Quick trades\n• Overpays\n• Good deals\n\n💬 **DM NOW!**\n*Don't miss out*",

    "**🌸 GARDEN 2 + GAG 2 + PETS** 🌸\n\n🌙 **TRADING:**\n• Grow a Garden 2\n• GAG 2\n• Raccoon\n• Dragonfly\n• Firefly\n• Ice Serpent\n\n⭐ **WANTED:**\n• Unicorn\n• Good offers\n• Overpays\n• Neon pets\n• Upgrades\n\n📩 **DM TO OFFER**\n*All offers considered*",

    "**🌟 MEGA OFFER - ALL PETS** 🌟\n\n🔥 **WHAT I HAVE:**\n• Grow a Garden 2 (Rare)\n• GAG 2 (Rare)\n• Raccoon\n• Dragonfly\n• Unicorn\n• Ice Serpent\n• Firefly\n• More adds!\n\n💫 **LOOKING FOR:**\n• Huge overpays\n• Mega pets\n• Neon versions\n• Best offer only\n\n💎 **DM YOUR OFFER**\n*Everything to best offer*",

    "**🎯 TRADING COMPLETE INVENTORY** 🎯\n\n⭐ **EVERYTHING FOR TRADE:**\n• GAG 2\n• Grow a Garden 2\n• Raccoon\n• Dragonfly\n• Unicorn\n• Ice Serpent\n• Firefly\n• All pets!\n\n✨ **LF:**\n• Overpays\n• Good offers\n• Mega pets\n• Neon versions\n• Upgrades\n\n📨 **DM TO NEGOTIATE**\n*Best offer wins everything*",

    "**🐉 DRAGONFLY + RACCOON + GAG 2** 🐉\n\n🌙 **TRADING:**\n• Dragonfly (Rare)\n• Raccoon\n• GAG 2\n• Firefly\n• Garden 2\n\n🔥 **WANTED:**\n• Unicorn\n• Ice Serpent\n• Good offers\n• Overpays\n• Neon pets\n\n💬 **DM YOUR OFFER**\n*Best offer takes it*",

    "**🦝 RACCOON + FIREFLY + GARDEN 2** 🦝\n\n⭐ **MY OFFER:**\n• Raccoon (Rare)\n• Firefly\n• Grow a Garden 2\n• GAG 2\n• Dragonfly\n\n🎯 **LF:**\n• Unicorn\n• Ice Serpent\n• Good offers\n• Overpays\n• Upgrades\n\n📩 **DM ME!**\n*All offers welcome*",

    "**💀 BEST OFFER GETS EVERYTHING** 💀\n\n🔥 **SELLING ALL:**\n• GAG 2\n• Grow a Garden 2\n• Raccoon\n• Dragonfly\n• Unicorn\n• Ice Serpent\n• Firefly\n• All pets!\n\n⭐ **LOOKING FOR:**\n• Best offer\n• Overpays\n• Mega pets\n• Neon versions\n\n💎 **DM YOUR OFFER**\n*Everything goes to best offer*",

    "**🌸 UNICORN + ICE SERPENT FOR TRADE** 🌸\n\n✨ **TRADING:**\n• Unicorn (Rare)\n• Ice Serpent (Rare)\n• GAG 2\n• Dragonfly\n• Firefly\n\n💫 **WANTED:**\n• Good offers\n• Overpays\n• Neon pets\n• Mega versions\n• Upgrades\n\n📨 **DM TO OFFER**\n*Best offer wins*",

    "**🌿 GARDEN 2 + ALL PETS FOR SALE** 🌿\n\n⭐ **SELLING EVERYTHING:**\n• Grow a Garden 2\n• GAG 2\n• Raccoon\n• Dragonfly\n• Unicorn\n• Ice Serpent\n• Firefly\n• More!\n\n🔥 **LF:**\n• Best offers\n• Overpays\n• Quick trades\n• Good deals\n\n💬 **DM NOW!**\n*Serious offers only*",

    "**🌟 ULTIMATE TRADE - ALL PETS** 🌟\n\n🌙 **TRADING:**\n• GAG 2 (Rare)\n• Grow a Garden 2 (Rare)\n• Raccoon\n• Dragonfly\n• Unicorn\n• Ice Serpent\n• Firefly\n• All adds!\n\n💫 **LOOKING FOR:**\n• Huge overpays\n• Mega pets\n• Neon versions\n• Best offer only\n\n💎 **DM YOUR OFFER**\n*Everything to best offer*",

    "**🎯 DRAGONFLY + UNICORN + GAG 2** 🎯\n\n⭐ **WHAT I HAVE:**\n• Dragonfly (Rare)\n• Unicorn (Rare)\n• GAG 2\n• Raccoon\n• Firefly\n• Garden 2\n\n✨ **WANTED:**\n• Ice Serpent\n• Good offers\n• Overpays\n• Neon pets\n• Upgrades\n\n📩 **DM TO OFFER**\n*Best offer wins*",

    "**🐍 ICE SERPENT + RACCOON + FIREFLY** 🐍\n\n🔥 **TRADING:**\n• Ice Serpent (Rare)\n• Raccoon\n• Firefly\n• GAG 2\n• Dragonfly\n• Garden 2\n\n⭐ **LF:**\n• Unicorn\n• Good offers\n• Overpays\n• Neon versions\n• Upgrades\n\n💬 **DM ME!**\n*All offers considered*",

    "**🌟 COMPLETE PET COLLECTION FOR TRADE** 🌟\n\n🔥 **EVERYTHING FOR TRADE:**\n• GAG 2 (Rare)\n• Grow a Garden 2 (Legendary)\n• Raccoon (Ultra Rare)\n• Dragonfly (Rare)\n• Unicorn (Mythical)\n• Ice Serpent (Limited)\n• Firefly (Seasonal)\n• Plus random adds!\n\n💫 **LOOKING FOR:**\n• Mega Overpays\n• Neon Versions\n• Rare Pets\n• Best Offers\n• Quick Trades\n\n📨 **DM ME YOUR BEST OFFER!**\n*Serious traders only*"
];

// ─────────────────────────────────────
// TOKEN MANAGEMENT
// ─────────────────────────────────────
const activeBots = {};

function getUniqueTokens(tokens) {
    const unique = [];
    const seen = new Set();
    for (const token of tokens) {
        if (!seen.has(token)) {
            seen.add(token);
            unique.push(token);
        }
    }
    return unique;
}

async function sendMessageWithToken(token, channelId, message) {
    try {
        const res = await fetch(`https://discord.com/api/v9/channels/${channelId}/messages`, {
            method: 'POST',
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            body: JSON.stringify({ content: message })
        });
        const data = await res.json();
        if (!res.ok) {
            return { ok: false, error: data.message || JSON.stringify(data) };
        }
        return { ok: true, id: data.id };
    } catch (e) {
        return { ok: false, error: e.message };
    }
}

async function joinServerWithToken(token, serverId) {
    try {
        // First try the correct endpoint for user tokens
        const res = await fetch(`https://discord.com/api/v9/guilds/${serverId}/members/@me`, {
            method: 'PUT',
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });
        
        console.log(`Join server response status: ${res.status}`);
        
        if (res.status === 201 || res.status === 204) {
            return true;
        }
        
        // If that fails, try the alternative endpoint
        const res2 = await fetch(`https://discord.com/api/v9/guilds/${serverId}/members`, {
            method: 'PUT',
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            body: JSON.stringify({
                access_token: token
            })
        });
        
        console.log(`Alternative join response status: ${res2.status}`);
        return res2.ok;
    } catch (e) {
        console.error(`Join error: ${e.message}`);
        return false;
    }
}

function startTokenJob(token, serverId) {
    if (activeBots[token]) {
        clearTimeout(activeBots[token].timer);
        delete activeBots[token];
    }

    const fire = async () => {
        const message = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
        const result = await sendMessageWithToken(token, TARGET_CHANNEL_ID, message);
        
        if (result.ok) {
            console.log(`✅ Sent message with token ${token.substring(0, 10)}...`);
        } else {
            console.log(`❌ Failed to send with token ${token.substring(0, 10)}...: ${result.error}`);
        }

        const minInterval = 5 * 60000;
        const maxInterval = 20 * 60000;
        const interval = Math.floor(Math.random() * (maxInterval - minInterval + 1)) + minInterval;
        
        activeBots[token].timer = setTimeout(fire, interval);
    };

    activeBots[token] = { serverId, timer: null };
    fire();
}

// ─────────────────────────────────────
// SLASH COMMANDS
// ─────────────────────────────────────
const commands = [
    new SlashCommandBuilder()
        .setName('put')
        .setDescription('Start a token in a server')
        .addStringOption(option => option.setName('token').setDescription('Discord user token').setRequired(true))
        .addStringOption(option => option.setName('serverid').setDescription('Server ID to join').setRequired(true)),
    
    new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stop a specific token')
        .addStringOption(option => option.setName('token').setDescription('Token to stop').setRequired(true)),
    
    new SlashCommandBuilder()
        .setName('stopall')
        .setDescription('Stop all tokens'),
    
    new SlashCommandBuilder()
        .setName('list')
        .setDescription('List all active tokens')
];

// ─────────────────────────────────────
// DISCORD BOT
// ─────────────────────────────────────
const client = new Client({ 
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] 
});

client.once('ready', async () => {
    console.log(`✅ Main bot ready: ${client.user.tag}`);
    console.log(`📍 Monitoring channel: ${TARGET_CHANNEL_ID}`);
    
    // Register slash commands
    const rest = new REST({ version: '10' }).setToken(BOT_TOKEN);
    try {
        await rest.put(Routes.applicationCommands(client.user.id), { body: commands.map(cmd => cmd.toJSON()) });
        console.log('✅ Slash commands registered');
    } catch (error) {
        console.error('❌ Failed to register slash commands:', error);
    }
    
    // Load and start any previously active tokens
    const activeData = loadActive();
    for (const [token, data] of Object.entries(activeData.active)) {
        console.log(`🔄 Restarting token: ${token.substring(0, 10)}...`);
        startTokenJob(token, data.serverId);
    }
    
    console.log(`📨 Loaded ${MESSAGES.length} message variations`);
});

// Slash command handlers
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;
    if (interaction.user.id !== ALLOWED_USER_ID) {
        await interaction.reply({ content: '❌ You are not authorized to use this command!', ephemeral: true });
        return;
    }

    const { commandName } = interaction;

    if (commandName === 'put') {
        const token = interaction.options.getString('token');
        const serverId = interaction.options.getString('serverid');

        if (!token.includes('.') || token.length < 50) {
            await interaction.reply({ content: '❌ Invalid token format!', ephemeral: true });
            return;
        }

        if (activeBots[token]) {
            await interaction.reply({ content: '⚠️ This token is already running!', ephemeral: true });
            return;
        }

        await interaction.reply({ content: `🔄 Starting bot with token ${token.substring(0, 10)}... Please wait.`, ephemeral: true });

        try {
            const joined = await joinServerWithToken(token, serverId);
            if (!joined) {
                await interaction.editReply({ content: '⚠️ Could not join server. Make sure the token is valid and the bot is invited.' });
                return;
            }

            startTokenJob(token, serverId);
            
            const activeData = loadActive();
            activeData.active[token] = { serverId, startedAt: new Date().toISOString() };
            saveActive(activeData);

            const tokensData = loadTokens();
            if (!tokensData.tokens.includes(token)) {
                tokensData.tokens.push(token);
                saveTokens(tokensData);
            }

            const testMessage = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
            const testResult = await sendMessageWithToken(token, TARGET_CHANNEL_ID, testMessage);
            
            if (testResult.ok) {
                await interaction.editReply({ content: `✅ Bot started successfully!\n📍 Server ID: ${serverId}\n📨 Will send messages every 5-20 minutes` });
            } else {
                await interaction.editReply({ content: `⚠️ Token started but test message failed: ${testResult.error}` });
            }

        } catch (error) {
            await interaction.editReply({ content: `❌ Error: ${error.message}` });
        }
    }

    if (commandName === 'stop') {
        const token = interaction.options.getString('token');
        
        if (activeBots[token]) {
            clearTimeout(activeBots[token].timer);
            delete activeBots[token];
            
            const activeData = loadActive();
            delete activeData.active[token];
            saveActive(activeData);
            
            await interaction.reply({ content: `🛑 Stopped bot with token ${token.substring(0, 10)}...`, ephemeral: true });
        } else {
            await interaction.reply({ content: '❌ Token not found in active bots.', ephemeral: true });
        }
    }

    if (commandName === 'stopall') {
        const count = Object.keys(activeBots).length;
        for (const token of Object.keys(activeBots)) {
            clearTimeout(activeBots[token].timer);
            delete activeBots[token];
        }
        
        saveActive({ active: {} });
        await interaction.reply({ content: `🛑 Stopped all ${count} active bot(s).`, ephemeral: true });
    }

    if (commandName === 'list') {
        const activeData = loadActive();
        const tokens = Object.keys(activeData.active);
        
        if (tokens.length === 0) {
            await interaction.reply({ content: '❌ No active bots running.', ephemeral: true });
            return;
        }
        
        let response = `**🤖 Active Bots:** ${tokens.length}\n\n`;
        for (const [token, data] of Object.entries(activeData.active)) {
            response += `• Token: \`${token.substring(0, 15)}...\`\n`;
            response += `  Server: \`${data.serverId}\`\n`;
            response += `  Started: ${new Date(data.startedAt).toLocaleString()}\n\n`;
        }
        
        await interaction.reply({ content: response, ephemeral: true });
    }
});

// Login
if (!BOT_TOKEN) {
    console.error('❌ BOT_TOKEN environment variable not set!');
    process.exit(1);
}

client.login(BOT_TOKEN);

console.log('🤖 Bot is starting...');
console.log(`🔒 Owner ID: ${ALLOWED_USER_ID}`);
console.log(`📢 Target Channel: ${TARGET_CHANNEL_ID}`);
