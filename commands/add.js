async function groupAdd(sock, chatId, senderId, message, args) {
    // Check if user is admin
    const check = await ensureGroupAndAdmin(sock, chatId, senderId);
    if (!check.ok) return;

    // Check if bot is admin
    try {
        const groupMetadata = await sock.groupMetadata(chatId);
        const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net';
        const botParticipant = groupMetadata.participants.find(p => p.id === botId);
        
        if (!botParticipant || !botParticipant.admin) {
            await sock.sendMessage(chatId, {
                text: '❌ I need to be an admin to add members.'
            }, { quoted: message });
            return;
        }

        // Check if numbers were provided
        if (!args || args.length === 0) {
            await sock.sendMessage(chatId, {
                text: '❌ Please provide phone numbers to add.\n\n*Usage:* `.add 1234567890 0987654321`\n\n*Note:* Include country code without + or spaces.'
            }, { quoted: message });
            return;
        }

        // Parse and format phone numbers
        const numbers = args.map(num => {
            // Remove any non-numeric characters
            let clean = num.replace(/[^0-9]/g, '');
            // Ensure proper format (add @s.whatsapp.net)
            if (!clean.endsWith('@s.whatsapp.net')) {
                // Ensure country code exists (default to 91 for India if not provided)
                if (clean.length === 10) {
                    clean = '91' + clean; // Change default country code as needed
                }
                clean = clean + '@s.whatsapp.net';
            }
            return clean;
        });

        // Check which numbers are already in group
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

        // Send initial status
        await sock.sendMessage(chatId, {
            text: `⏳ Adding ${toAdd.length} member(s) to the group...`
        }, { quoted: message });

        // Add members in batches (WhatsApp limits)
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
                
                // Try adding individually if batch fails
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

            // Small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        // Prepare result message
        let resultMessage = '';
        
        if (added.length > 0) {
            resultMessage += `✅ *Successfully added:*\n${added.map(n => `• ${n.split('@')[0]}`).join('\n')}\n\n`;
        }

        if (failed.length > 0) {
            resultMessage += `❌ *Failed to add:*\n${failed.map(n => `• ${n.split('@')[0]}`).join('\n')}\n\n`;
            
            // Categorize failures
            const invalidNumbers = [];
            const alreadyInGroup = [];
            const unknownErrors = [];

            for (const num of failed) {
                try {
                    // Check if the number exists on WhatsApp
                    const [result] = await sock.onWhatsApp(num);
                    if (!result || !result.exists) {
                        invalidNumbers.push(num);
                    } else if (participants.includes(num)) {
                        alreadyInGroup.push(num);
                    } else {
                        unknownErrors.push(num);
                    }
                } catch {
                    unknownErrors.push(num);
                }
            }

            if (invalidNumbers.length > 0) {
                resultMessage += `ℹ️ *Invalid numbers (not on WhatsApp):*\n${invalidNumbers.map(n => `• ${n.split('@')[0]}`).join('\n')}\n\n`;
            }
        }

        resultMessage += `📊 *Summary:*\n• Added: ${added.length}\n• Failed: ${failed.length}`;

        await sock.sendMessage(chatId, {
            text: resultMessage
        }, { quoted: message });

        console.log(`✅ Added ${added.length} members to group ${chatId} by ${senderId}`);

    } catch (error) {
        console.error('Group add error:', error);
        
        let errorMessage = '❌ Failed to add members. ';
        
        if (error.message.includes('not-authorized')) {
            errorMessage += 'I need admin permissions to add members.';
        } else if (error.message.includes('rate-overlimit')) {
            errorMessage += 'Rate limit exceeded. Please try again later.';
        } else if (error.message.includes('participant')) {
            errorMessage += 'Some numbers may be invalid or not registered on WhatsApp.';
        } else {
            errorMessage += 'Please check the numbers and try again.';
        }
        
        await sock.sendMessage(chatId, {
            text: errorMessage
        }, { quoted: message });
    }
}