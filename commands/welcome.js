const { handleWelcome } = require('../lib/welcome');
const { isWelcomeOn, getWelcome } = require('../lib/index');
const { channelInfo } = require('../lib/messageConfig');
const { moses, commands, fakevCard } = require("../moses"); // keep this line
const fetch = require('node-fetch');

async function welcomeCommand(sock, chatId, message, match) {
    // Check if it's a group
    if (!chatId.endsWith('@g.us')) {
        await sock.sendMessage(chatId, { text: 'This command can only be used in groups.' }, { quoted: fakevCard });
        return;
    }

    // Extract match from message
    const text = message.message?.conversation || 
                message.message?.extendedTextMessage?.text || '';
    const matchText = text.split(' ').slice(1).join(' ');

    await handleWelcome(sock, chatId, message, matchText);
}

async function handleJoinEvent(sock, id, participants) {
    const isWelcomeEnabled = await isWelcomeOn(id);
    if (!isWelcomeEnabled) return;

    const customMessage = await getWelcome(id);
    const groupMetadata = await sock.groupMetadata(id);
    const groupName = groupMetadata.subject;
    const groupDesc = groupMetadata.desc || 'No description available';

    for (const participant of participants) {
        try {
            const participantString = typeof participant === 'string' ? participant : (participant.id || participant.toString());
            const user = participantString.split('@')[0];
            
            let displayName = user;
            try {
                const contact = await sock.getBusinessProfile(participantString);
                if (contact && contact.name) {
                    displayName = contact.name;
                } else {
                    const groupParticipants = groupMetadata.participants;
                    const userParticipant = groupParticipants.find(p => p.id === participantString);
                    if (userParticipant && userParticipant.name) {
                        displayName = userParticipant.name;
                    }
                }
            } catch {
                console.log('Could not fetch display name, using phone number');
            }
            
            let finalMessage;
            if (customMessage) {
                finalMessage = customMessage
                    .replace(/{user}/g, `@${displayName}`)
                    .replace(/{group}/g, groupName)
                    .replace(/{description}/g, groupDesc);
            } else {
                const now = new Date();
                const timeString = now.toLocaleString('en-US', {
                    month: '2-digit',
                    day: '2-digit', 
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true
                });
                
                finalMessage = `╭╼━≪•𝙽𝙴𝚆 𝙼𝙴𝙼𝙱𝙴𝚁•≫━╾╮
┃𝚆𝙴𝙻𝙲𝙾𝙼𝙴: @${displayName} 👋
┃Member count: #${groupMetadata.participants.length}
┃𝚃𝙸𝙼𝙴: ${timeString}⏰
╰━━━━━━━━━━━━━━━╯

*@${displayName}* Welcome to *${groupName}*! 🎉
*Group 𝙳𝙴𝚂𝙲𝚁𝙸𝙿𝚃𝙸𝙾𝙽*
${groupDesc}

> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ m-tech*`;
            }
            
            try {
                let profilePicUrl = `https://img.pyrocdn.com/dbKUgahg.png`;
                try {
                    const profilePic = await sock.profilePictureUrl(participantString, 'image');
                    if (profilePic) profilePicUrl = profilePic;
                } catch {
                    console.log('Could not fetch profile picture, using default');
                }
                
                const apiUrl = `https://api.some-random-api.com/welcome/img/2/gaming3?type=join&textcolor=green&username=${encodeURIComponent(displayName)}&guildName=${encodeURIComponent(groupName)}&memberCount=${groupMetadata.participants.length}&avatar=${encodeURIComponent(profilePicUrl)}`;
                
                const response = await fetch(apiUrl);
                if (response.ok) {
                    const imageBuffer = await response.buffer();
                    
                    await sock.sendMessage(id, {
                        image: imageBuffer,
                        caption: finalMessage,
                        mentions: [participantString],
                        ...channelInfo
                    }, { quoted: fakevCard });
                    continue;
                }
            } catch {
                console.log('Image generation failed, falling back to text');
            }
            
            await sock.sendMessage(id, {
                text: finalMessage,
                mentions: [participantString],
                ...channelInfo
            }, { quoted: fakevCard });
        } catch (error) {
            console.error('Error sending welcome message:', error);
            const participantString = typeof participant === 'string' ? participant : (participant.id || participant.toString());
            const user = participantString.split('@')[0];
            
            let fallbackMessage;
            if (customMessage) {
                fallbackMessage = customMessage
                    .replace(/{user}/g, `@${user}`)
                    .replace(/{group}/g, groupName)
                    .replace(/{description}/g, groupDesc);
            } else {
                fallbackMessage = `Welcome ${user} to the ${groupName}
╭───────────────────⊷
*┋* ⚜️: Firstly help yourself by reading 
*┋* The Group *${groupDesc}*
*┋* 😤: Type *.menu* to explore all xd cmds
*┋* ☠️: Click On The link 🖇️ Below, To 
*┋* create your own WhatsApp Xd Bot
*┋* 🔗: https://github.com/mrmosesclr/moses-xd/fork
╰───────────────────⊷
Do not forget To Give a Star to Our Repo💎
> *© ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴍᴀʀɪɴʏᴀᴍᴇ*`;
            }
            
            await sock.sendMessage(id, {
                text: fallbackMessage,
                mentions: [participantString],
                ...channelInfo
            }, { quoted: fakevCard });
        }
    }
}

module.exports = { welcomeCommand, handleJoinEvent };
