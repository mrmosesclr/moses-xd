const settings = require('../settings');
const fs = require('fs');
const path = require('path');

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
├❍ .lyrics
├❍ .groupinfo
├❍ .admins 
├❍ .vv
├❍ .trt 
├❍ .jid
├❍ .attp
├❍ groupinfo
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
├❍ .tag
├❍ .tagall
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
        const imagePath = path.join(__dirname, '../assets/bot_image.png');
        
        const buttons = [
            { buttonId: 'channel', buttonText: { displayText: '📢 Join Channel' }, type: 1 },
            { buttonId: 'owner', buttonText: { displayText: '📞 Owner' }, type: 1 },
            { buttonId: 'support', buttonText: { displayText: '🔗 Support' }, type: 1 }
        ];

        if (fs.existsSync(imagePath)) {
            const imageBuffer = fs.readFileSync(imagePath);
            
            await sock.sendMessage(chatId, {
                image: imageBuffer,
                caption: helpMessage,
                buttons: buttons,
                headerType: 1
            }, { quoted: message });
        } else {
            console.error('Bot image not found at:', imagePath);
            await sock.sendMessage(chatId, { 
                text: helpMessage,
                buttons: buttons,
                headerType: 1
            });
        }
    } catch (error) {
        console.error('Error in help command:', error);
        await sock.sendMessage(chatId, { text: helpMessage });
    }
}

module.exports = helpCommand;
