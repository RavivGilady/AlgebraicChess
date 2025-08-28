const fs = require("fs");
const path = require("path");
const net = require("net");
const dotenv = require("dotenv");

const service = process.argv[2];
if (!service) {
  console.error("❌ Usage: node waitForKafka.js <service-dir>");
  process.exit(1);
}

// Load .env from the specific service folder
const envPath = path.join(__dirname, "..", service, ".env");
if (!fs.existsSync(envPath)) {
  console.error(`❌ .env file not found for service '${service}'`);
  process.exit(1);
}
dotenv.config({ path: envPath });

const brokers = process.env.KAFKA_BROKERS;
if (!brokers) {
  console.error("❌ KAFKA_BROKERS not set in .env");
  process.exit(1);
}

const brokerList = brokers.split(",").map((b) => {
  const [host, port] = b.trim().split(":");
  return { host, port: parseInt(port) };
});

const timeout = 10000;
const maxRetries = 10;

function waitForBroker({ host, port }) {
  return new Promise((resolve, reject) => {
    const socket = net.createConnection(port, host);
    let done = false;

    const fail = () => {
      if (!done) {
        done = true;
        socket.destroy();
        reject();
      }
    };

    socket.setTimeout(timeout);
    socket.on("connect", () => {
      done = true;
      socket.end();
      resolve();
    });
    socket.on("error", fail);
    socket.on("timeout", fail);
  });
}

(async () => {
  for (let i = 0; i < maxRetries; i++) {
    console.log(`🔍 Attempt ${i + 1} to reach Kafka brokers...`);
    for (const broker of brokerList) {
      try {
        await waitForBroker(broker);
        console.log(`✅ Kafka is reachable at ${broker.host}:${broker.port}`);
        process.exit(0);
      } catch (_) {
        // try next
      }
    }
    await new Promise((res) => setTimeout(res, 2000));
  }
  console.error(
    `❌ All Kafka brokers unreachable after ${maxRetries} attempts.`
  );
  process.exit(1);
})();
