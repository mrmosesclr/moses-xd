// ============ HELPER FUNCTIONS ============

// Check if user is admin and group exists
async function ensureGroupAndAdmin(sock, chatId, senderId) {
    try {
        // Check if it's a group
        const chat = await sock.groupMetadata(chatId);
        if (!chat) {
            await sock.sendMessage(chatId, {
                text: '❌ This command only works in groups.'
            });
            return { ok: false };
        }

        // Check if sender is admin
        const participant = chat.participants.find(p => p.id === senderId);
        if (!participant || !participant.admin) {
            await sock.sendMessage(chatId, {
                text: '❌ You need to be a group admin to use this command.'
            });
            return { ok: false };
        }

        return { ok: true, metadata: chat };
    } catch (error) {
        console.error('ensureGroupAndAdmin error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ An error occurred while verifying your permissions.'
        });
        return { ok: false };
    }
}

// ============ INVITE COMMAND ============

async function groupInvite(sock, chatId, senderId, message) {
    try {
        const check = await ensureGroupAndAdmin(sock, chatId, senderId);
        if (!check.ok) return;

        // Get group metadata
        const groupMetadata = await sock.groupMetadata(chatId);
        
        // Check if bot is admin
        const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net';
        const botParticipant = groupMetadata.participants.find(p => p.id === botId);
        
        if (!botParticipant || !botParticipant.admin) {
            await sock.sendMessage(chatId, {
                text: '❌ I need to be an admin to generate invite links.'
            }, { quoted: message });
            return;
        }

        // Generate invite code
        const inviteCode = await sock.groupInviteCode(chatId);
        
        if (!inviteCode) {
            await sock.sendMessage(chatId, {
                text: '❌ Failed to generate the group invite link.'
            }, { quoted: message });
            return;
        }

        const inviteLink = `https://chat.whatsapp.com/${inviteCode}`;
        const groupName = groupMetadata.subject || 'Group';

        await sock.sendMessage(chatId, {
            text: `🔗 *${groupName} Invite Link*\n\n${inviteLink}\n\n📋 Share this link to invite new members.\n⏰ *Valid for:* 7 days\n🔄 *Note:* This link expires if a new one is generated`
        }, { quoted: message });

        console.log(`✅ Invite link generated for ${groupName} (${chatId}) by ${senderId}`);

    } catch (e) {
        console.error('Group invite error:', e);
        
        // Better error handling
        let errorMsg = '❌ Failed to get the group invite link. ';
        
        if (e.message && e.message.includes('not-authorized')) {
            errorMsg = '❌ I need to be an admin to generate invite links. Please make me an admin first.';
        } else if (e.message && e.message.includes('rate-overlimit')) {
            errorMsg = '❌ Rate limit exceeded. Please wait a few minutes and try again.';
        } else if (e.message && e.message.includes('invalid')) {
            errorMsg = '❌ This group may have been deleted or is invalid.';
        } else {
            errorMsg += 'Please try again later.';
        }
        
        await sock.sendMessage(chatId, {
            text: errorMsg
        }, { quoted: message });
    }
}

// ============ ADD COMMAND ============

async function groupAdd(sock, chatId, senderId, message, args) {
    try {
        const check = await ensureGroupAndAdmin(sock, chatId, senderId);
        if (!check.ok) return;

        const groupMetadata = await sock.groupMetadata(chatId);
        const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net';
        const botParticipant = groupMetadata.participants.find(p => p.id === botId);
        
        if (!botParticipant || !botParticipant.admin) {
            await sock.sendMessage(chatId, {
                text: '❌ I need to be an admin to add members.'
            }, { quoted: message });
            return;
        }

        if (!args || args.length === 0) {
            await sock.sendMessage(chatId, {
                text: '❌ Please provide phone numbers to add.\n\n*Usage:* `.add 1234567890 0987654321`\n\n*Note:* Include country code without + or spaces.'
            }, { quoted: message });
            return;
        }

        // Format numbers
        const numbers = args.map(num => {
            let clean = num.replace(/[^0-9]/g, '');
            if (!clean.endsWith('@s.whatsapp.net')) {
                if (clean.length === 10) {
                    clean = '91' + clean; // Change country code as needed
                }
                clean = clean + '@s.whatsapp.net';
            }
            return clean;
        });

        // Check existing participants
        const participants = groupMetadata.participants.map(p => p.id);
        const existing = numbers.filter(num => participants.includes(num));
        const toAdd = numbers.filter(num => !participants.includes(num));

        if (existing.length > 0) {
            await sock.sendMessage(chatId, {
                text: `⚠️ *Already in group:*\n${existing.map(n => `• ${n.split('@')[0]}`).join('\n')}`
            }, { quoted: message });
        }

        if (toAdd.length === 0) {
            await sock.sendMessage(chatId, {
                text: '❌ No new members to add.'
            }, { quoted: message });
            return;
        }

        await sock.sendMessage(chatId, {
            text: `⏳ Adding ${toAdd.length} member(s) to the group...`
        }, { quoted: message });

        // Add members in batches
        const batchSize = 5;
        let added = [];
        let failed = [];

        for (let i = 0; i < toAdd.length; i += batchSize) {
            const batch = toAdd.slice(i, i + batchSize);
            
            try {
                await sock.groupParticipantsUpdate(chatId, batch, "add");
                added.push(...batch);
            } catch (error) {
                console.error('Batch add error:', error);
                
                for (const participant of batch) {
                    try {
                        await sock.groupParticipantsUpdate(chatId, [participant], "add");
                        added.push(participant);
                    } catch (individualError) {
                        console.error('Individual add error:', individualError);
                        failed.push(participant);
                    }
                }
            }

            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        let resultMessage = '';
        
        if (added.length > 0) {
            resultMessage += `✅ *Successfully added:*\n${added.map(n => `• ${n.split('@')[0]}`).join('\n')}\n\n`;
        }

        if (failed.length > 0) {
            resultMessage += `❌ *Failed to add:*\n${failed.map(n => `• ${n.split('@')[0]}`).join('\n')}\n\n`;
        }

        resultMessage += `📊 *Summary:*\n• Added: ${added.length}\n• Failed: ${failed.length}`;

        await sock.sendMessage(chatId, {
            text: resultMessage
        }, { quoted: message });

        console.log(`✅ Added ${added.length} members to group ${chatId} by ${senderId}`);

    } catch (error) {
        console.error('Group add error:', error);
        
        let errorMessage = '❌ Failed to add members. ';
        
        if (error.message && error.message.includes('not-authorized')) {
            errorMessage += 'I need admin permissions to add members.';
        } else if (error.message && error.message.includes('rate-overlimit')) {
            errorMessage += 'Rate limit exceeded. Please try again later.';
        } else if (error.message && error.message.includes('participant')) {
            errorMessage += 'Some numbers may be invalid or not registered on WhatsApp.';
        } else {
            errorMessage += 'Please check the numbers and try again.';
        }
        
        await sock.sendMessage(chatId, {
            text: errorMessage
        }, { quoted: message });
    }
}

// ============ MESSAGE HANDLER ============

async function handleMessage(sock, message) {
    try {
        const chatId = message.key.remoteJid;
        const senderId = message.key.participant || message.key.remoteJid;
        const text = message.message?.conversation || 
                    message.message?.extendedTextMessage?.text || 
                    '';

        if (!text || !chatId) return;

        // Command parsing
        const prefix = '.';
        if (!text.startsWith(prefix)) return;

        const args = text.slice(prefix.length).trim().split(/\s+/);
        const command = args.shift().toLowerCase();

        // Handle commands
        switch (command) {
            case 'invite':
            case 'link':
                await groupInvite(sock, chatId, senderId, message);
                break;
                
            case 'add':
                await groupAdd(sock, chatId, senderId, message, args);
                break;
                
            default:
                // Unknown command
                break;
        }
    } catch (error) {
        console.error('Message handler error:', error);
        await sock.sendMessage(message.key.remoteJid, {
            text: '❌ An error occurred while processing your message.'
        });
    }
}

// ============ EXPORT ============

module.exports = {
    groupInvite,
    groupAdd,
    handleMessage,
    ensureGroupAndAdmin
};