const { Kafka } = require('kafkajs');
const logger = require('../utils/logger');
const moveIdToBotPlayer = new Map();

function assignMoveIdToBotPlayer(moveId, player) {
    moveIdToBotPlayer.set(moveId, player);
}
const kafka = new Kafka({
    clientId: 'game-server',
    brokers: ['localhost:9092'],
});
async function startBotMovesConsumer() {


    const consumer = kafka.consumer({ groupId: 'bot-move-consumers' });

    await consumer.connect();
    await consumer.subscribe({ topic: 'bot.move.result', fromBeginning: false });

    await consumer.run({
        eachMessage: async ({ message }) => {
            try {
                const { moveId, move } = JSON.parse(message.value);

                const botPlayer = moveIdToBotPlayer.get(moveId);
                if (botPlayer) {
                    moveIdToBotPlayer.delete(moveId); // One-time use
                    botPlayer.handleMoveFromBroker( move );
                } else {
                    logger.warn(`[BotPlayManager] Unknown moveId received: ${moveId}`);
                }
            } catch (err) {
                logger.error('[BotPlayManager] Failed to handle message:', err.message);
            }
        },
    });
}



const producer = kafka.producer();
let isConnected = false;


async function sendMoveRequest({ moveId, fen, elo}) {
    if (!isConnected) {
        await producer.connect();
        isConnected = true;
    }

    await producer.send({
        topic: 'bot.move.request',
        messages: [
            {
                key: moveId,
                value: JSON.stringify({ moveId, fen, elo}),
            },
        ],
    });
}

module.exports = {
    assignMoveIdToBotPlayer,
    startBotMovesConsumer,
    sendMoveRequest
};