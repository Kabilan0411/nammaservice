require('dotenv').config();
const https = require('https');

const sendEmailViaBrevoAPI = (options, apiKey) => {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(options);

    const reqOptions = {
      hostname: 'api.brevo.com',
      port: 443,
      path: '/v3/smtp/email',
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json',
        'content-length': Buffer.byteLength(data)
      }
    };

    const req = https.request(reqOptions, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => {
        responseBody += chunk;
      });

      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve(JSON.parse(responseBody));
          } catch (e) {
            resolve(responseBody);
          }
        } else {
          reject(new Error(`Brevo API responded with status ${res.statusCode}: ${responseBody}`));
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.write(data);
    req.end();
  });
};

const runTest = async () => {
  const fromEmail = process.env.EMAIL_FROM;
  const apiKey = process.env.BREVO_API_KEY || process.env.SMTP_PASS;

  console.log("-----------------------------------------");
  console.log("EMAIL_FROM:", fromEmail);
  console.log("API KEY prefix:", apiKey ? apiKey.substring(0, 15) + "..." : "undefined");
  console.log("-----------------------------------------");

  if (!fromEmail || !apiKey) {
    console.error("Missing EMAIL_FROM or BREVO_API_KEY/SMTP_PASS in .env file.");
    process.exit(1);
  }

  const payload = {
    sender: { name: 'NammaService Test', email: fromEmail },
    to: [{ email: fromEmail }], // Send to yourself as a test
    subject: "Brevo API Key Test",
    textContent: "If you receive this email, your Brevo API key is working perfectly!"
  };

  try {
    const result = await sendEmailViaBrevoAPI(payload, apiKey);
    console.log("🎉 SUCCESS!", result);
  } catch (err) {
    console.error("❌ FAILED:", err.message);
  }
};

runTest();
