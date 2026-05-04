const settings = require('../settings');
const fs = require('fs');
const path = require('path');
const { moses, commands, fakevCard } = require("../moses")

async function helpCommand(sock, chatId, message) {
    const helpMessage = `╭───────────────╶╶···◈
*┋*▧ *ᴏᴡɴᴇʀ*: ${settings.botOwner}
*┋*▧ *ᴠᴇʀsɪᴏɴ*: ${settings.version}
*┋*▧ *ᴍᴏᴅᴇ*: Public
*┋*▧ *ᴘʀᴇғɪx*: "."
╰───────────╶╶···◈

╭───「 *ɢᴇɴᴇʀᴀʟ*」──···◈
├❍ .menu
├❍ .ping
├❍ .alive
├❍ .owner
├❍ .weather
├❍ .groupinfo
├❍ .admins 
├❍ .vv
├❍ .trt 
├❍ .jid
├❍ .attp
├❍ .tts
╰───────────╶╶···◈

╭───「 *ᴀᴅᴍɪɴ*」───···◈
├❍ .promote
├❍ .demote
├❍ .kick
├❍ .tag 
├❍ .antilink
├❍ .ban 
├❍ .clear 
├❍ .unban 
├❍ .welcome 
├❍ .mute
├❍ .tagall 
├❍ .resetlink
├❍ .unmute
├❍ .chatbot
├❍ .goodbye
├❍ .warn
├❍ .setgdesc 
├❍ .setgname
├❍ .setgpp
╰───────────╶╶···◈ 

╭───「 *ᴏᴡɴᴇʀ*」──···◈ 
├❍ .mode
├❍ .autostatus
├❍ .clearsession
├❍ .settings
├❍ .autoread
├❍ .setpp
├❍ .autotyping 
├❍ .antidelete
├❍ .cleartmp
├❍ .autoreact
├❍ .update
├❍ .pmblocker
├❍ .anticall
├❍ .mention
╰───────────╶╶···◈

╭──「 *ɢɪᴛʜᴜʙ*」──···◈ 
├❍ .xd2
├❍ .github
├❍ .script
├❍ .repo
╰───────────╶╶···◈

╭────「 *ᴀɪ*」───···◈ 
├❍ .gpt <qstn>
├❍ .gemini <qstn>
├❍ .flux <prompt>
├❍ .sora
╰────────────╶···◈

╭──「 *ᴛᴇxᴛᴍᴀᴋᴇʀ*」──···◈ 
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
╰───────────╶╶···◈

╭─「 *ᴅᴏᴡɴʟᴏᴀᴅᴇʀ*」─···◈ 
├❍ .play
├❍ .tiktok 
├❍ .instagram
├❍ .song
├❍ .video
├❍ .facebook
├❍ .spotify
├❍ .lyrics
╰───────────╶╶···◈

╭─「 *ᴛᴏᴏʟs*」──···◈
├❍ .blur
├❍ .simage
├❍ .sticker
├❍ .removebg
├❍ .remini
├❍ .crop
├❍ .tgsticker
├❍ .meme
├❍ .take
├❍ .emojimix
├❍ .igs
├❍ .url
╰───────────╶╶···◈

╭─「 *ᴘɪᴇs*」──···◈
├❍ .pies
├❍ .japan
├❍ .hijab
├❍ .china
├❍ .indonesia
├❍ .korea
╰───────────╶╶···◈

╭─「 *ᴍᴜsɪᴄ*」──···◈
├❍ .heart
├❍ .horny
├❍ .circle
├❍ .lgbt
├❍ .lolice
├❍ .its-so-stupid
├❍ .namecard
├❍ .oogway
├❍ .tweet
├❍ .ytcomment
├❍ .comrade
├❍ .gay
├❍ .glass
├❍ .jail
├❍ .passed
├❍ .triggered 
╰───────────╶╶···◈

╭─「 *ᴀɴɪᴍᴇ*」──···◈
├❍ .neko
├❍ .waifu
├❍ .loli
├❍ .nom
├❍ .poke
├❍ .cry
├❍ .kiss
├❍ .pat
├❍ .hug
├❍ .wink
├❍ .facepalm
╰─────────────╶╶···◈

━━━━━━━━━━━━━━━━━━
> _*ᴍᴀᴅᴇ ʙʏ ᴍʀ ᴍᴏsᴇs ᴄʟʀ*_
━━━━━━━━━━━━━━━━━━`;

    try {
        const imageUrl = 'https://files.catbox.moe/bn3rpd.jpeg';

        await sock.sendMessage(chatId, {
            image: { url: imageUrl },
            caption: helpMessage,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363400421273052@newsletter',
                    newsletterName: '𝗠𝗢𝗦𝗘𝗦-𝗫𝗗',
                    serverMessageId: -1
                }
            }
        }, { quoted: fakevCard });

    } catch (error) {
        console.error('Error in help command:', error);
        await sock.sendMessage(chatId, { text: helpMessage });
    }
}

module.exports = helpCommand;
