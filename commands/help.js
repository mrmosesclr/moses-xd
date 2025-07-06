const settings = require('../settings');
const fs = require('fs');
const path = require('path');

async function helpCommand(sock, chatId, message) {
    const helpMessage = `
*╭━[ᴍᴀʀɪɴʏᴀᴍᴇ sᴛᴜᴅɪᴏs]━╮*
*┋*▧ *ᴏᴡɴᴇʀ*: ${settings.botOwner}
*┋*▧ *ᴠᴇʀsɪᴏɴ*: ${settings.version}
*┋*▧ *ᴍᴏᴅᴇ*: *Public*
*┋*▧ *ᴘʀᴇғɪx*: "."
╰───────────╶╶╶·····◈
         𝐆𝐄𝐍𝐄𝐑𝐀𝐋
╭─────────────╶·····◈
├❍ .menu
├❍ .xd
├❍ .ping
├❍ .alive
├❍ .tts
├❍ .owner
├❍ .joke
├❍ .quote
├❍ .fact
├❍ .weather
├❍ .news
├❍ .attp
├❍ .lyrics
├❍ .8ball
├❍ .groupinfo
├❍ .admins 
├❍ .vv
╰──────────╶╶···◈

> 「 *ɪᴍᴀɢᴇ-sᴛɪᴄᴋᴇʀ*」
╭────────────···◈
├❍ .blur 
├❍ .simage 
├❍ .sticker
├❍ .tgsticker 
├❍ .meme
├❍ .take 
├❍ .emojimix
╰──────────╶╶···◈

> 「 *ᴀᴅᴍɪɴ*」
╭────────────···◈
├❍ .ban
├❍ .promote
├❍ .demote
├❍ .mute
├❍ .unmute
├❍ .delete
├❍ .kick
├❍ .warnings
├❍ .warn
├❍ .antilink
├❍ .antibadword
├❍ .clear
├❍ .tag
├❍ .tagall
├❍ .chatbot
├❍ .resetlink
╰──────────╶╶···◈

> 「 *ᴏᴡɴᴇʀ*」:
╭────────────···◈ 
├❍ .mode
├❍ .autostatus
├❍ .clearsession
├❍ .antidelete
├❍ .cleartmp
├❍ .setpp
├❍ .autoreact
╰──────────╶╶···◈

> 「 *ɢɪᴛʜᴜʙ*」
╭────────────···◈ 
├❍ .xd2
├❍ .github
├❍ .script
├❍ .repo
╰──────────╶╶···◈

> 「 *ᴀɪ*」
╭────────────···◈ 
├❍ .gpt <qstn>
├❍ .gemini <qstn>
├❍ .imagine <prompt>
├❍ .flux <prompt>
╰──────────╶╶···◈

> 「 *ғᴜɴ*」
╭────────────···◈ 
├❍ .compliment
├❍ .insult
├❍ .flirt 
├❍ .character
├❍ .wasted
├❍ .ship
├❍ .simp
├❍ .stupid
├❍ .tictactoe 
├❍ .hangman
├❍ .guess
├❍ .shayari
├❍ .trivia
├❍ .answer
├❍ .truth
├❍ .dare
├❍ .roseday
├❍ .goodnight 
╰──────────╶╶···◈

> 「 *ᴛᴇxᴛᴍᴀᴋᴇʀ*」
╭────────────···◈ 
├❍ .metallic
├❍ .ice 
├❍ .snow 
├❍ .impressive
├❍ .matrix
├❍ .light
├❍ .neon 
├❍ .devil 
├❍ .purple
├❍ .thunder
├❍ .leaves 
├❍ .1917
├❍ .arena 
├❍ .hacker 
├❍ .sand 
├❍ .blackpink
├❍ .glitch 
├❍ .fire 
├❍ .water
╰──────────╶╶···◈

> 「 *ᴅᴏᴡɴʟᴏᴀᴅᴇʀ*」
╭────────────···◈ 
├❍ .play
├❍ .song
├❍ .mp3
├❍ .audio
├❍ .instagram
├❍ .mp4
├❍ .facebook
├❍ .tiktok
├❍ .video
╰──────────╶╶···◈
> _*ᴍᴀᴅᴇ ʙʏ ᴍʀ ᴍᴏsᴇs ᴄʟʀ*_
`;

    try {
        const imagePath = path.join(__dirname, '../assets/bot_image.jpg');
        
        if (fs.existsSync(imagePath)) {
            const imageBuffer = fs.readFileSync(imagePath);
            
            await sock.sendMessage(chatId, {
                image: imageBuffer,
                caption: helpMessage,
                contextInfo: {
                    forwardingScore: 1,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363203551855118@newsletter',
                        newsletterName: '𝗠𝗢𝗦𝗘𝗦-𝗫𝗗',
                        serverMessageId: -1
                    }
                }
            },{ quoted: message });
        } else {
            console.error('Bot image not found at:', imagePath);
            await sock.sendMessage(chatId, { 
                text: helpMessage,
                contextInfo: {
                    forwardingScore: 1,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363203551855118@newsletter',
                        newsletterName: '𝗠𝗢𝗦𝗘𝗦-𝗫𝗗',
                        serverMessageId: -1
                    } 
                }
            });
        }
    } catch (error) {
        console.error('Error in help command:', error);
        await sock.sendMessage(chatId, { text: helpMessage });
    }
}

module.exports = helpCommand;
