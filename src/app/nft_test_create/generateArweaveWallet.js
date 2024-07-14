const Arweave = require('arweave');
const fs = require('fs');
const path = require('path');

async function generateArweaveWallet() {
    const arweave = Arweave.init({
        host: 'arweave.net',
        port: 443,
        protocol: 'https'
    });

    const wallet = await arweave.wallets.generate();

    // Salva la chiave privata in un file JSON
    const walletPath = path.join(__dirname, 'arweave-wallet.json');
    fs.writeFileSync(walletPath, JSON.stringify(wallet), 'utf-8');

    console.log('Portafoglio Arweave generato e salvato in', walletPath);
}

generateArweaveWallet().catch(console.error);