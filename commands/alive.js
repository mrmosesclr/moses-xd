const { moses, commands, fakevCard } = require("../moses");
const settings = require("../settings");

async function aliveCommand(sock, chatId) {
    try {
        const message = `──〔 𝙈𝙊𝙎𝙀𝙎-𝙓𝘿 〕───
> √        *_is Alive!_*

✨𝘽𝙤𝙩 𝙎𝙩𝙖𝙩𝙪𝙨: Active
🌎 𝙈𝙤𝙙𝙚: Public 
🚀 𝘼𝙡𝙞𝙫𝙚 𝙑𝙚𝙧𝙨𝙞𝙤𝙣: (${settings.version})
⏳ 𝙐𝙥𝙩𝙞𝙢𝙚: Running...

 s𝘦𝘳𝘷𝘦𝘳 𝘳𝘦𝘢𝘥𝘺 𝘧𝘰𝘳 𝘢𝘤𝘵𝘪𝘰𝘯!
> _*codeit.brandit.ownit*_`;

        await sock.sendMessage(chatId, {
            text: message,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '0029VbCJS1CC6ZvfXAlGYd1j@newsletter',
                    newsletterName: '𝗠𝗢𝗦𝗘𝗦-𝗫𝗗',
                    serverMessageId: -1
                }
            }
        }, { quoted: fakevCard });

    } catch (error) {
        console.error('Error in alive command:', error);
        await sock.sendMessage(chatId, { text: 'XD IS ALIVE AND RUNNING!' });
    }
}

module.exports = aliveCommand;
