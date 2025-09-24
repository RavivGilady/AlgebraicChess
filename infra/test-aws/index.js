const {
  SecretsManagerClient,
  GetSecretValueCommand,
} = require("@aws-sdk/client-secrets-manager");

const SECRET_ID = process.env.SECRET_ID; // e.g., "my/service/jwt"
const AWS_REGION = process.env.AWS_REGION; // e.g., "eu-central-1"

if (!SECRET_ID || !AWS_REGION) {
  console.error("❌ SECRET_ID and AWS_REGION env vars are required");
  process.exit(1);
}

async function main() {
  try {
    const client = new SecretsManagerClient({ region: AWS_REGION });
    const res = await client.send(
      new GetSecretValueCommand({ SecretId: SECRET_ID })
    );

    if (!res.SecretString || res.SecretString === "null") {
      console.error("❌ Secret is empty or unreadable");
      process.exit(1);
    }

    console.log("✅ Secret fetched successfully:");
    const parsed = JSON.parse(res.SecretString);
    console.log(`the parsed is: ${JSON.stringify(parsed.RESUME_JWT_SECRET)}`);
  } catch (err) {
    console.error("❌ Failed to fetch secret:", err.message);
    process.exit(1);
  }
}

main();
