const axios = require('axios');

async function aiCommand(sock, chatId, message) {
    try {
        const text = message.message?.conversation ||
                     message.message?.extendedTextMessage?.text;

        if (!text) {
            return await sock.sendMessage(chatId, {
                text: "Please provide a question after .gpt or .xlite\n\nExample: .gpt explain quantum computing"
            }, {
                quoted: message
            });
        }

        // Get the command and query
        const parts = text.split(' ');
        const command = parts[0].toLowerCase();
        const query = parts.slice(1).join(' ').trim();

        if (!query) {
            return await sock.sendMessage(chatId, {
                text: "Please provide a question after .gpt or .xlite"
            }, {
                quoted: message
            });
        }

        try {
            // Show processing reaction
            await sock.sendMessage(chatId, {
                react: {
                    text: '✅',
                    key: message.key
                }
            });

            // =========================
            // GPT-5
            // =========================
            if (command === '.gpt') {

                const response = await axios.get(
                    `https://apis.davidcyril.name.ng/ai/gpt-5?prompt=${encodeURIComponent(query)}`
                );

                const data = response.data;

                if (data && data.success && data.data) {

                    await sock.sendMessage(chatId, {
                        text: data.data
                    }, {
                        quoted: message
                    });

                } else if (data && data.result) {

                    await sock.sendMessage(chatId, {
                        text: data.result
                    }, {
                        quoted: message
                    });

                } else {
                    throw new Error('Invalid GPT-5 API response');
                }

            // =========================
            // GEMINI 3.1 FLASH LITE
            // =========================
            } else if (command === '.xlite') {

                const response = await axios.get(
                    `https://apis.davidcyril.name.ng/ai/gemini-3.1-flash-lite?prompt=${encodeURIComponent(query)}`
                );

                const data = response.data;

                if (data && data.success && data.data) {

                    await sock.sendMessage(chatId, {
                        text: data.data
                    }, {
                        quoted: message
                    });

                } else {
                    throw new Error('Invalid Gemini API response');
                }
            }

        } catch (error) {
            console.error('API Error:', error);

            await sock.sendMessage(chatId, {
                text: "❌ Failed to get response. Please try again later.",
                contextInfo: {
                    mentionedJid: [
                        message.key.participant || message.key.remoteJid
                    ],
                    quotedMessage: message.message
                }
            }, {
                quoted: message
            });
        }

    } catch (error) {
        console.error('AI Command Error:', error);

        await sock.sendMessage(chatId, {
            text: "❌ An error occurred. Please try again later.",
            contextInfo: {
                mentionedJid: [
                    message.key.participant || message.key.remoteJid
                ],
                quotedMessage: message.message
            }
        }, {
            quoted: message
        });
    }
}

module.exports = aiCommand;