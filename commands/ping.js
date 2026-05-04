const os = require('os');
const settings = require('../settings.js');
const { moses, commands, fakevCard } = require("../moses");

function formatTime(seconds) {
    const days = Math.floor(seconds / (24 * 60 * 60));
    seconds = seconds % (24 * 60 * 60);
    const hours = Math.floor(seconds / (60 * 60));
    seconds = seconds % (60 * 60);
    const minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);

    let time = '';
    if (days > 0) time += `${days}d `;
    if (hours > 0) time += `${hours}h `;
    if (minutes > 0) time += `${minutes}m `;
    if (seconds > 0 || time === '') time += `${seconds}s`;

    return time.trim();
}

async function pingCommand(sock, chatId, message) {
    try {
        const start = Date.now();
        await sock.sendMessage(chatId, { text: ' *𝙼𝚊𝚛𝚒𝚗𝚢𝚊𝚖𝚎-𝚃𝚎𝚌𝚑* ' }, { quoted: fakevCard });
        const end = Date.now();
        const ping = Math.round((end - start) / 2);

        const uptimeInSeconds = process.uptime();
        const uptimeFormatted = formatTime(uptimeInSeconds);

        const botInfo = `🤖 *𝚡𝚍* 𝚜𝚙𝚎𝚎𝚍: ${ping} ms`.trim();

        await sock.sendMessage(chatId, { text: botInfo }, { quoted: fakevCard });

    } catch (error) {
        console.error('Error in ping command:', error);
        await sock.sendMessage(chatId, { text: '❌ Failed to get bot status.' }, { quoted: fakevCard });
    }
}

module.exports = pingCommand;
