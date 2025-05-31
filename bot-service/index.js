require('dotenv').config();
const { startConsumer } = require('./kafka/consumer');

startConsumer()
  .then(() => console.log('Bot service is listening for move requests'))
  .catch((err) => {
    console.error('Failed to start bot service:', err.message);
    process.exit(1);
  });
