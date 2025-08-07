// index.js
const AWS   = require('aws-sdk');
const axios = require('axios');

const secrets = new AWS.SecretsManager();
const SECRET_ID = process.env.PINATA_SECRET_ID; 
// e.g. "cleanNFT/PinataKeys"

async function getPinataKeys() {
  const { SecretString, SecretBinary } = 
          await secrets.getSecretValue({ SecretId: SECRET_ID }).promise();
  const raw = SecretString 
            ? SecretString 
            : Buffer.from(SecretBinary, 'base64').toString();
  const { PINATA_API_KEY, PINATA_SECRET_KEY } = JSON.parse(raw);
  return { apiKey: PINATA_API_KEY, secretKey: PINATA_SECRET_KEY };
}

exports.handler = async (event) => {
  try {
    // 1) Read metadata from event or use default test payload
    const metadata = event.metadata || {
      name: "Recycling Badge",
      description: "Awarded for recycling action",
      image: "ipfs://<IMAGE_CID>",
      attributes: [
        { trait_type: "Weight",   value: "5kg"              },
        { trait_type: "Location", value: "Central Park"     },
        { trait_type: "Date",     value: new Date().toISOString().split('T')[0] }
      ]
    };

    // 2) Retrieve Pinata credentials
    const { apiKey, secretKey } = await getPinataKeys();

    
    // 3) Pin JSON to IPFS
    const { data } = await axios.post(
      'https://api.pinata.cloud/pinning/pinJSONToIPFS',
      metadata,
      {
        headers: {
          pinata_api_key:        apiKey,
          pinata_secret_api_key: secretKey
        }
      }
    );

    console.log("Pinned metadata CID:", data.IpfsHash);
    return { statusCode: 200, body: JSON.stringify({ cid: data.IpfsHash }) };

  } catch (err) {
    console.error("Error in pinning metadata:", err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
