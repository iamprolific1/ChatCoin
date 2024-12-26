import TelegramBot from "node-telegram-bot-api";
import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

const { TELEGRAM_BOT_TOKEN, PRIVATE_KEY, RPC_URL, CONTRACT_ADDRESS} = process.env;
// const TELEGRAM_BOT_TOKEN = process.env.
// initialize telegram bot
const bot = new TelegramBot(TELEGRAM_BOT_TOKEN as string, { polling: true });

// initialize Ether.js
const provider = new ethers.JsonRpcProvider(RPC_URL as string);
const wallet = new ethers.Wallet(PRIVATE_KEY as string, provider);

console.log("User Address: ", wallet.address)

// contract ABI
const ABI = [
    "function balanceOf(address account) public view returns(uint256)",
    "function transfer(address recipient, uint256 amount) public returns(bool)",
    "function mint(address recipient, uint256 amount) public",
    "function burn(uint256 amount) public"
];

// contract instance

const chatCoin = new ethers.Contract(CONTRACT_ADDRESS as string, ABI, wallet);

// bot.on('message', (msg)=> {
//     const chatId = msg.chat.id;
//     bot.sendMessage(chatId, '');
// })

// listen for new messages
bot.onText(/\/start/, (msg)=> {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "Welcome to the Chat Coin bot! Use /help to see available command.");
});

bot.onText(/\/help/, (msg)=> {
    const chatId = msg.chat.id;
    const commands = `
        Available Commands:
        /balance - Check your ChatCoin balance
        /transfer <address> <amount> - Transfer ChatCoins
        /mint <amount> - Mint new ChatCoins (Owner Only)
        /burn <amount> - Burn ChatCoins
    `;

    bot.sendMessage(chatId, commands);
});

bot.onText(/\/balance/, async (msg)=> {
    const chatId = msg.chat.id;
    const userAddress = wallet.address;
    

    try {
        const balance = await chatCoin.balanceOf(userAddress);
        bot.sendMessage(chatId, `Your balance is ${ethers.formatEther(balance)} ChatCoin.`);
    } catch (error: any) {
        bot.sendMessage(chatId, `Error fetching balance: ${error.message}`)
    }
});

bot.onText(/\/transfer (.+) (.+)/, async(msg, match: any)=> {
    const chatId = msg.chat.id;
    const recipientAddress = match[1];
    const amount = ethers.parseEther(match[2]);

    try {
        const tx = await chatCoin.transfer(recipientAddress, amount);
        await tx.wait();
        bot.sendMessage(chatId, `Successfully transferred ${match[2]} ChatCoin to ${recipientAddress}`);
    } catch (error: any) {
        bot.sendMessage(chatId, `Error during transfer: ${error.message}`);
    }
});

bot.onText(/\/mint (.+)/, async(msg, match: any)=> {
    const chatId = msg.chat.id;
    const amount = ethers.parseEther(match[1]);

    try {
        const tx = await chatCoin.mint(wallet.address, amount);
        await tx.wait();
        bot.sendMessage(chatId, `Successfully minted ${match[1]} ChatCoin`);
    } catch (error: any) {
        bot.sendMessage(chatId, `Error during minting: ${error.message}`);
    }
});

bot.onText(/\/burn (.+)/, async(msg, match: any)=> {
    const chatId = msg.chat.id;
    const amount = ethers.parseEther(match[1]);

    try {
        const tx = await chatCoin.burn(amount);
        await tx.wait();
        bot.sendMessage(chatId, `Successfully burned ${match[1]} ChatCoin`);
    } catch (error: any) {
        bot.sendMessage(chatId, `Error during burning: ${error.message}`);
    }
})


console.log("Bot is running...");