const axios = require('axios');

async function imageCommand(sock, chatId, message) {
    try {
        const text = message.message?.conversation ||
                     message.message?.extendedTextMessage?.text;

        const prompt = text.split(' ').slice(1).join(' ').trim();

        if (!prompt) {
            return await sock.sendMessage(chatId, {
                text: "What image do you want me to generate?"
            });
        }

        // Send loading message
        await sock.sendMessage(chatId, {
            text: "_Please wait, your image is being generated..._"
        });

        // Generate image using EpicRealism AI
        const response = await axios.get(
            `https://apis.davidcyril.name.ng/epicrealism?prompt=${encodeURIComponent(prompt)}`
        );

        const data = response.data;

        if (!data || !data.success || !data.result) {
            return await sock.sendMessage(chatId, {
                text: "Failed to generate the image. Please try again later."
            });
        }

        const imageUrl = data.result;

        // Send generated image
        await sock.sendMessage(chatId, {
            image: { url: imageUrl },
            caption: `🖼️ *Generated Image*\n\n📝 Prompt: ${prompt}`
        }, { quoted: message });

    } catch (error) {
        console.error('Error in image command:', error);

        await sock.sendMessage(chatId, {
            text: "Image generation failed. Please try again later."
        });
    }
}

module.exports = imageCommand;

/*Powered by Mr Moses*
*Credits to M - Tech*`