const https = require('https');

const testCards = [
    { name: "Visa", pan: "4242424242424242", exp: "2912" },
    { name: "Mastercard", pan: "5454545454545454", exp: "2912" },
    { name: "Amex", pan: "378282246310005", exp: "2912" },
    { name: "Discover", pan: "6011000000000000", exp: "2912" }
];

async function verifyCard(card) {
    return new Promise((resolve, reject) => {
        const requestData = `<?xml version="1.0"?>
        <request>
            <store_id>monca14426</store_id>
            <api_token>xj2ILKq1pTli31Qf4gSi</api_token>
            <card_verification>
                <order_id>CardVal-${Date.now()}-${Math.floor(Math.random() * 1000)}</order_id>
                <pan>${card.pan}</pan>
                <expdate>${card.exp}</expdate>
                <crypt_type>7</crypt_type>
            </card_verification>
        </request>`;

        const options = {
            hostname: 'esqa.moneris.com',
            port: 443,
            path: '/gateway2/servlet/MpgRequest',
            method: 'POST',
            headers: {
                'Content-Type': 'application/xml',
                'Content-Length': Buffer.byteLength(requestData)
            }
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => resolve(body));
        });

        req.on('error', (e) => reject(e));
        req.write(requestData);
        req.end();
    });
}

async function runTests() {
    console.log("Starting Card Verification Tests...\n");
    for (const card of testCards) {
        console.log(`Testing ${card.name} (${card.pan})...`);
        try {
            const responseXml = await verifyCard(card);
            
            // Extract a few key fields using simple regex
            const responseCodeMatch = responseXml.match(/<ResponseCode>(.*?)<\/ResponseCode>/);
            const messageMatch = responseXml.match(/<Message>(.*?)<\/Message>/);
            const cardTypeMatch = responseXml.match(/<CardType>(.*?)<\/CardType>/);
            
            console.log(`  Response Code : ${responseCodeMatch ? responseCodeMatch[1] : 'N/A'}`);
            console.log(`  Message       : ${messageMatch ? messageMatch[1].trim() : 'N/A'}`);
            console.log(`  Card Type     : ${cardTypeMatch ? cardTypeMatch[1] : 'N/A'}\n`);
        } catch (err) {
            console.error(`  Failed: ${err.message}\n`);
        }
    }
}

runTests();
