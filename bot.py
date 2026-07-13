import discord
from discord.ext import commands, tasks
import random
import asyncio
import os
from datetime import datetime, timedelta
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Initialize bot
intents = discord.Intents.default()
intents.message_content = True
intents.guilds = True
intents.members = True
bot = commands.Bot(command_prefix='!', intents=intents)

# Configuration from .env
ALLOWED_USER_ID = int(os.getenv('ALLOWED_USER_ID', '1173953184113360910'))
MAIN_BOT_TOKEN = os.getenv('DISCORD_TOKEN')

# Long message variations (formatted with line breaks)
MESSAGES = [
    """**🌿 TRADING GAG 2** 🌿

🔥 **WHAT I'M TRADING:**
• GAG 2 (Rare)
• Grow a Garden 2
• Raccoon
• Dragonfly
• Unicorn
• Ice Serpent
• Firefly

💫 **LOOKING FOR:**
• Good offers
• Overpays
• Neon pets
• Upgrades

📩 **DM ME YOUR OFFERS!**
*Best offer takes it*""",

    """**🦝 RACCOON + GAG 2 FOR TRADE** 🦝

⭐ **MY OFFER:**
• Rare Raccoon
• GAG 2
• Adds if needed

✨ **LF:**
• Unicorn
• Dragonfly
• Ice Serpent
• Good pets
• Overpays only

💎 **DM TO NEGOTIATE**
*Taking offers until reset*""",

    """**🐉 DRAGONFLY & UNICORN FOR TRADE** 🐉

🌟 **AVAILABLE:**
• Dragonfly (Rare)
• Unicorn
• Grow a Garden 2
• Firefly

🎯 **WANTED:**
• Neon pets
• Mega pets
• Good offers
• Overpays

📨 **COMMENT OR DM**
*Best offer wins!*""",

    """**🐍 ICE SERPENT + FIREFLY FOR SALE** 🔥

🌙 **WHAT I HAVE:**
• Ice Serpent (Rare)
• Firefly
• GAG 2
• Raccoon
• Garden 2

💫 **LOOKING FOR:**
• Good offers
• Upgrades
• Neon versions
• Overpays only

💬 **DM ME QUICK!**
*Limited time offer*""",

    """**🌸 GROW A GARDEN 2 FOR TRADE** 🌸

🌱 **MY OFFER:**
• Grow a Garden 2
• Raccoon
• Dragonfly
• GAG 2
• Firefly

⭐ **LF:**
• Unicorn
• Ice Serpent
• Good pets
• Overpays
• Fair offers

📩 **DM TO OFFER**
*Best offer takes it*""",

    """**🦄 UNICORN & DRAGONFLY FOR TRADE** 🦄

✨ **TRADING:**
• Unicorn (Rare)
• Dragonfly
• GAG 2
• Grow a Garden 2
• Ice Serpent

🔥 **LOOKING FOR:**
• Good offers
• Neon pets
• Overpays
• Mega versions

💎 **DM YOUR OFFER**
*All offers considered*""",

    """**💀 SELLING GAG 2 + ADDS** 💀

⭐ **WHAT I'M SELLING:**
• GAG 2 (Rare)
• Firefly
• Raccoon
• Dragonfly
• Garden 2

🎯 **LOOKING FOR:**
• Best offers
• Overpays
• Good pets
• Upgrades

📨 **DM TO NEGOTIATE**
*Quick sale!*""",

    """**🌟 MEGA TRADE - ALL PETS FOR SALE** 🌟

🔥 **TRADING EVERYTHING:**
• Grow a Garden 2
• GAG 2
• Raccoon
• Dragonfly
• Unicorn
• Ice Serpent
• Firefly
• More adds!

💫 **LF:**
• Huge overpays
• Mega pets
• Neon versions
• Good offers only

💬 **DM YOUR BEST OFFER**
*Best offer wins everything!*""",

    """**🎯 GARDEN 2 + RACCOON FOR TRADE** 🎯

🌿 **MY OFFER:**
• Grow a Garden 2
• Raccoon
• Dragonfly
• GAG 2

⭐ **WANTED:**
• Unicorn
• Ice Serpent
• Firefly
• Good offers
• Overpays

📩 **DM TO TRADE**
*Serious offers only*""",

    """**🔥 FIREFLY + ICE SERPENT FOR SALE** 🔥

🌙 **SELLING:**
• Firefly (Rare)
• Ice Serpent
• GAG 2
• Garden 2
• Raccoon

✨ **LOOKING FOR:**
• Best offers
• Overpays
• Good pets
• Upgrades

💎 **DM YOUR OFFER**
*Best offer wins*""",

    """**🦝 RACCOON FAMILY FOR TRADE** 🦝

⭐ **WHAT I HAVE:**
• Rare Raccoon
• Dragonfly
• Firefly
• GAG 2
• Grow a Garden 2

🎯 **LF:**
• Unicorn
• Ice Serpent
• Neon pets
• Good offers
• Overpays

📨 **DM ME NOW!**
*Don't miss out*""",

    """**🐉 DRAGONFLY + GARDEN 2 FOR TRADE** 🐉

✨ **TRADING:**
• Dragonfly (Rare)
• Grow a Garden 2
• Raccoon
• Firefly
• GAG 2

💫 **LOOKING FOR:**
• Good offers
• Overpays
• Unicorn
• Ice Serpent
• Upgrades

💬 **DM TO OFFER**
*All offers considered*""",

    """**🌸 UNICORN + FIREFLY FOR SALE** 🌸

⭐ **SELLING:**
• Unicorn (Rare)
• Firefly
• Dragonfly
• Raccoon
• Garden 2
• GAG 2

🔥 **LF:**
• Best offers
• Overpays
• Good pets
• Neon versions

📩 **DM YOUR OFFER**
*Quick sale!*""",

    """**💀 GAG 2 + ADDS FOR TRADE** 💀

🌙 **MY OFFER:**
• GAG 2 (Rare)
• Ice Serpent
• Firefly
• Dragonfly
• Raccoon

⭐ **WANTED:**
• Unicorn
• Grow a Garden 2
• Good offers
• Overpays
• Upgrades

💎 **DM TO NEGOTIATE**
*Best offer wins*""",

    """**🌟 EVERYTHING FOR TRADE - BEST OFFER** 🌟

🔥 **FULL INVENTORY:**
• Grow a Garden 2
• GAG 2
• Raccoon
• Dragonfly
• Unicorn
• Ice Serpent
• Firefly
• More!

💫 **LOOKING FOR:**
• Huge overpays
• Mega pets
• Neon versions
• Best offers only

📨 **DM YOUR BEST OFFER**
*Everything goes to best offer*""",

    """**🎯 RACCOON + UNICORN FOR TRADE** 🎯

⭐ **TRADING:**
• Raccoon (Rare)
• Unicorn
• Dragonfly
• GAG 2
• Garden 2

✨ **LF:**
• Ice Serpent
• Firefly
• Good offers
• Overpays
• Upgrades

💬 **DM ME!**
*Serious offers only*""",

    """**🐍 ICE SERPENT + GAG 2 FOR SALE** 🐍

🌙 **SELLING:**
• Ice Serpent (Rare)
• GAG 2
• Firefly
• Dragonfly
• Raccoon

🔥 **LOOKING FOR:**
• Best offers
• Overpays
• Good pets
• Unicorn
• Garden 2

📩 **DM YOUR OFFER**
*Best offer wins*""",

    """**🦄 RARE UNICORN FOR TRADE** 🦄

⭐ **MY OFFER:**
• Unicorn (Rare)
• Adds:
  - GAG 2
  - Dragonfly
  - Firefly
  - Raccoon

🎯 **LF:**
• Huge overpays
• Mega pets
• Neon versions
• Good offers

💎 **DM TO OFFER**
*Best offer takes all*""",

    """**🌿 GROW A GARDEN 2 MEGA TRADE** 🌿

✨ **TRADING:**
• Grow a Garden 2
• Raccoon
• Dragonfly
• Unicorn
• Ice Serpent
• Firefly
• GAG 2

💫 **LOOKING FOR:**
• Best offers
• Overpays only
• Neon pets
• Mega versions

📨 **DM YOUR OFFER**
*Everything for best offer*""",

    """**🔥 ALL PETS FOR SALE - QUICK SALE** 🔥

⭐ **SELLING EVERYTHING:**
• GAG 2
• Grow a Garden 2
• Raccoon
• Dragonfly
• Unicorn
• Ice Serpent
• Firefly
• All adds!

🎯 **LF:**
• Best offers
• Quick trades
• Overpays
• Good deals

💬 **DM NOW!**
*Don't miss out*""",

    """**🌸 GARDEN 2 + GAG 2 + PETS** 🌸

🌙 **TRADING:**
• Grow a Garden 2
• GAG 2
• Raccoon
• Dragonfly
• Firefly
• Ice Serpent

⭐ **WANTED:**
• Unicorn
• Good offers
• Overpays
• Neon pets
• Upgrades

📩 **DM TO OFFER**
*All offers considered*""",

    """**🌟 MEGA OFFER - ALL PETS** 🌟

🔥 **WHAT I HAVE:**
• Grow a Garden 2 (Rare)
• GAG 2 (Rare)
• Raccoon
• Dragonfly
• Unicorn
• Ice Serpent
• Firefly
• More adds!

💫 **LOOKING FOR:**
• Huge overpays
• Mega pets
• Neon versions
• Best offer only

💎 **DM YOUR OFFER**
*Everything to best offer*""",

    """**🎯 TRADING COMPLETE INVENTORY** 🎯

⭐ **EVERYTHING FOR TRADE:**
• GAG 2
• Grow a Garden 2
• Raccoon
• Dragonfly
• Unicorn
• Ice Serpent
• Firefly
• All pets!

✨ **LF:**
• Overpays
• Good offers
• Mega pets
• Neon versions
• Upgrades

📨 **DM TO NEGOTIATE**
*Best offer wins everything*""",

    """**🐉 DRAGONFLY + RACCOON + GAG 2** 🐉

🌙 **TRADING:**
• Dragonfly (Rare)
• Raccoon
• GAG 2
• Firefly
• Garden 2

🔥 **WANTED:**
• Unicorn
• Ice Serpent
• Good offers
• Overpays
• Neon pets

💬 **DM YOUR OFFER**
*Best offer takes it*""",

    """**🦝 RACCOON + FIREFLY + GARDEN 2** 🦝

⭐ **MY OFFER:**
• Raccoon (Rare)
• Firefly
• Grow a Garden 2
• GAG 2
• Dragonfly

🎯 **LF:**
• Unicorn
• Ice Serpent
• Good offers
• Overpays
• Upgrades

📩 **DM ME!**
*All offers welcome*""",

    """**💀 BEST OFFER GETS EVERYTHING** 💀

🔥 **SELLING ALL:**
• GAG 2
• Grow a Garden 2
• Raccoon
• Dragonfly
• Unicorn
• Ice Serpent
• Firefly
• All pets!

⭐ **LOOKING FOR:**
• Best offer
• Overpays
• Mega pets
• Neon versions

💎 **DM YOUR OFFER**
*Everything goes to best offer*""",

    """**🌸 UNICORN + ICE SERPENT FOR TRADE** 🌸

✨ **TRADING:**
• Unicorn (Rare)
• Ice Serpent (Rare)
• GAG 2
• Dragonfly
• Firefly

💫 **WANTED:**
• Good offers
• Overpays
• Neon pets
• Mega versions
• Upgrades

📨 **DM TO OFFER**
*Best offer wins*""",

    """**🌿 GARDEN 2 + ALL PETS FOR SALE** 🌿

⭐ **SELLING EVERYTHING:**
• Grow a Garden 2
• GAG 2
• Raccoon
• Dragonfly
• Unicorn
• Ice Serpent
• Firefly
• More!

🔥 **LF:**
• Best offers
• Overpays
• Quick trades
• Good deals

💬 **DM NOW!**
*Serious offers only*""",

    """**🌟 ULTIMATE TRADE - ALL PETS** 🌟

🌙 **TRADING:**
• GAG 2 (Rare)
• Grow a Garden 2 (Rare)
• Raccoon
• Dragonfly
• Unicorn
• Ice Serpent
• Firefly
• All adds!

💫 **LOOKING FOR:**
• Huge overpays
• Mega pets
• Neon versions
• Best offer only

💎 **DM YOUR OFFER**
*Everything to best offer*""",

    """**🎯 DRAGONFLY + UNICORN + GAG 2** 🎯

⭐ **WHAT I HAVE:**
• Dragonfly (Rare)
• Unicorn (Rare)
• GAG 2
• Raccoon
• Firefly
• Garden 2

✨ **WANTED:**
• Ice Serpent
• Good offers
• Overpays
• Neon pets
• Upgrades

📩 **DM TO OFFER**
*Best offer wins*""",

    """**🐍 ICE SERPENT + RACCOON + FIREFLY** 🐍

🔥 **TRADING:**
• Ice Serpent (Rare)
• Raccoon
• Firefly
• GAG 2
• Dragonfly
• Garden 2

⭐ **LF:**
• Unicorn
• Good offers
• Overpays
• Neon versions
• Upgrades

💬 **DM ME!**
*All offers considered*"""
]

# Store active bot instances
active_bots = {}

class TradeBot:
    def __init__(self, token, guild_id, channel_id=None):
        self.token = token
        self.guild_id = int(guild_id) if isinstance(guild_id, str) else guild_id
        self.channel_id = int(channel_id) if channel_id else None
        self.bot = commands.Bot(command_prefix='!', intents=intents)
        self.running = False
        self.send_task = None
        self.target_channel = None
        
        @self.bot.event
        async def on_ready():
            print(f"✅ Bot {self.bot.user.name} is ready!")
            
            # Find the target guild
            guild = self.bot.get_guild(self.guild_id)
            if guild:
                print(f"📍 Joined server: {guild.name}")
                
                # Find a channel to send messages (use first text channel if none specified)
                if not self.channel_id:
                    for channel in guild.text_channels:
                        if channel.permissions_for(guild.me).send_messages:
                            self.target_channel = channel
                            self.channel_id = channel.id
                            break
                else:
                    self.target_channel = self.bot.get_channel(self.channel_id)
                
                if self.target_channel:
                    print(f"📨 Will send messages to: #{self.target_channel.name}")
                    self.running = True
                    self.start_sending()
                else:
                    print(f"❌ No suitable channel found in {guild.name}")
            else:
                print(f"❌ Could not find guild with ID: {self.guild_id}")
        
        @self.bot.event
        async def on_message(message):
            if message.author == self.bot.user:
                return
            await self.bot.process_commands(message)
    
    def start_sending(self):
        """Start the message sending loop"""
        async def send_messages():
            while self.running:
                try:
                    # Wait 5 minutes (300 seconds)
                    await asyncio.sleep(300)
                    
                    if self.target_channel:
                        # Send random long message
                        message = random.choice(MESSAGES)
                        await self.target_channel.send(message)
                        print(f"📤 Sent message to #{self.target_channel.name}")
                    else:
                        print(f"❌ Target channel not found!")
                        await asyncio.sleep(60)
                        
                except Exception as e:
                    print(f"❌ Error sending message: {e}")
                    await asyncio.sleep(60)
        
        self.send_task = asyncio.create_task(send_messages())
    
    async def stop(self):
        """Stop the bot"""
        self.running = False
        if self.send_task:
            self.send_task.cancel()
        await self.bot.close()
        print(f"🛑 Bot stopped")

@bot.event
async def on_ready():
    print(f"🤖 Main bot is ready as {bot.user.name}")
    print(f"📍 In {len(bot.guilds)} guilds")
    print(f"✅ Bot is ready! Use !put <token> <serverid> to add a bot")
    print(f"🔒 Only user {ALLOWED_USER_ID} can use commands")
    print(f"📨 {len(MESSAGES)} message variations loaded")

@bot.command(name='put')
async def put_bot(ctx, token: str, guild_id: str):
    """Add a bot to a specific server
    Usage: !put <token> <serverid>"""
    
    # Check if user is allowed
    if ctx.author.id != ALLOWED_USER_ID:
        await ctx.send("❌ You are not authorized to use this command!")
        return
    
    # Check if token is already running
    if token in active_bots:
        await ctx.send("⚠️ This bot is already running!")
        return
    
    # Validate token format
    if len(token) < 50 or '.' not in token:
        await ctx.send("❌ Invalid token format!")
        return
    
    # Validate guild ID
    try:
        guild_id = int(guild_id)
    except ValueError:
        await ctx.send("❌ Invalid server ID! Please provide a valid number.")
        return
    
    await ctx.send(f"🔄 Starting bot with token {token[:10]}... This may take a moment.")
    await ctx.send(f"📍 Target server ID: {guild_id}")
    
    try:
        # Create and start the bot
        trade_bot = TradeBot(token, guild_id)
        await trade_bot.bot.start(token)
        active_bots[token] = trade_bot
        
        await ctx.send(f"✅ Bot started successfully! Token: {token[:10]}...")
        await ctx.send(f"📨 Will send messages every 5 minutes")
        await ctx.send(f"💬 Bot will find the first available text channel")
        
    except discord.LoginFailure:
        await ctx.send("❌ Login failed! Invalid token.")
    except discord.PrivilegedIntentsRequired:
        await ctx.send("❌ Privileged intents required! Enable them in Discord Developer Portal.")
    except Exception as e:
        await ctx.send(f"❌ Error: {str(e)[:100]}")
        
        # Special handling for common errors
        if "401" in str(e):
            await ctx.send("💡 Make sure the token is valid and the bot is invited to the server!")
        elif "404" in str(e):
            await ctx.send("💡 Server ID not found! Make sure the bot is invited to this server.")

@bot.command(name='stop')
async def stop_bot(ctx, token: str = None):
    """Stop a specific bot or all bots"""
    
    if ctx.author.id != ALLOWED_USER_ID:
        await ctx.send("❌ You are not authorized!")
        return
    
    if not token:
        # Stop all bots
        if not active_bots:
            await ctx.send("❌ No bots are running!")
            return
        
        await ctx.send(f"🛑 Stopping all {len(active_bots)} bot(s)...")
        for t, bot_instance in list(active_bots.items()):
            try:
                await bot_instance.stop()
                del active_bots[t]
                await ctx.send(f"✅ Stopped: {t[:10]}...")
            except Exception as e:
                await ctx.send(f"❌ Error: {str(e)[:50]}")
            await asyncio.sleep(1)
        
        await ctx.send("✅ All bots stopped!")
        return
    
    # Stop specific bot
    if token in active_bots:
        try:
            await active_bots[token].stop()
            del active_bots[token]
            await ctx.send(f"✅ Bot {token[:10]}... stopped!")
        except Exception as e:
            await ctx.send(f"❌ Error: {str(e)[:50]}")
    else:
        await ctx.send("❌ Bot not found!")

@bot.command(name='status')
async def status(ctx):
    """Check status of all bots"""
    
    if ctx.author.id != ALLOWED_USER_ID:
        await ctx.send("❌ You are not authorized!")
        return
    
    if not active_bots:
        await ctx.send("❌ No bots are currently running!")
        return
    
    status_msg = f"**🤖 Running Bots:** {len(active_bots)}\n\n"
    for token, bot_instance in active_bots.items():
        status_msg += f"• Token: `{token[:10]}...`\n"
        status_msg += f"  Server: `{bot_instance.guild_id}`\n"
        status_msg += f"  Status: {'🟢 Running' if bot_instance.running else '🔴 Stopped'}\n"
        status_msg += f"  Channel: {f'<#{bot_instance.channel_id}>' if bot_instance.channel_id else '❌ Not set'}\n\n"
    
    await ctx.send(status_msg)

@bot.command(name='help_bot')
async def help_command(ctx):
    """Show available commands"""
    
    help_text = """
**🤖 Bot Commands:**

`!put <token> <serverid>` - Start a new bot in the specified server
`!stop` - Stop all running bots
`!stop <token>` - Stop a specific bot
`!status` - Check status of all bots
`!help_bot` - Show this help message

**📌 Features:**
- Each bot sends long, formatted trade messages
- Messages sent every 5 minutes
- 30+ different message variations
- Bot finds first available text channel
- Only authorized user can use commands

**⚠️ Requirements:**
- Bot must be invited to the server before using !put
- Server ID must be valid
- Bot needs Send Messages permission
"""
    await ctx.send(help_text)

# Run the bot
if __name__ == "__main__":
    if not MAIN_BOT_TOKEN:
        print("❌ ERROR: DISCORD_TOKEN not found in .env file!")
        print("Please create a .env file with your bot token.")
        exit(1)
    
    try:
        bot.run(MAIN_BOT_TOKEN)
    except discord.LoginFailure:
        print("❌ Invalid main bot token! Please check your .env file.")
    except Exception as e:
        print(f"❌ Error: {e}")
