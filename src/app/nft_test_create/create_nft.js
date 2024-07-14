const fs = require('fs');
const Arweave = require('arweave');
const { Keypair, Connection, clusterApiUrl } = require('@solana/web3.js');
const { Metaplex, keypairIdentity, irysStorage } = require('@metaplex-foundation/js');
const bs58 = require('bs58');

async function uploadImageAndMetadataToArweave() {
    const arweave = Arweave.init({
        host: "arweave.net",
        port: 443,
        protocol: "https",
        timeout: 20000,
        logging: false,
    });

    // Carica immagine su Arweave
    const data = fs.readFileSync("arm.jpg");
    const transaction = await arweave.createTransaction({ data: data });
    transaction.addTag("Content-Type", "image/jpg");

    const arweaveWallet = JSON.parse(fs.readFileSync("arweave-wallet.json", "utf-8"));

    await arweave.transactions.sign(transaction, arweaveWallet);
    const response = await arweave.transactions.post(transaction);
    console.log(response);

    const imageId = transaction.id;
    const imageUrl = imageId ? `https://arweave.net/${imageId}` : undefined;
    console.log("imageUrl", imageUrl);

    // Carica metadati su Arweave
    const owner = Keypair.generate();

    const metadata = {
        name: "NFT name",
        symbol: "NFT symbol",
        description: "nft Description",
        seller_fee_basis_points: 500,
        external_url: "https://www.customnft.com/",
        attributes: [
            {
                trait_type: "NFT type",
                value: "Custom",
            },
        ],
        properties: {
            files: [
                {
                    uri: imageUrl,
                    type: "image/jpg",
                },
            ],
            category: "image",
            maxSupply: 0,
            creators: [
                {
                    address: owner.publicKey.toBase58(),
                    share: 100,
                },
            ],
        },
        image: imageUrl,
    };

    const metadataRequest = JSON.stringify(metadata);
    const metadataTransaction = await arweave.createTransaction({ data: metadataRequest });
    metadataTransaction.addTag("Content-Type", "application/json");

    await arweave.transactions.sign(metadataTransaction, arweaveWallet);
    console.log("metadata txid", metadataTransaction.id);

    const metadataResponse = await arweave.transactions.post(metadataTransaction);
    console.log(metadataResponse);

    const metadataId = metadataTransaction.id;
    const metadataUrl = metadataId ? `https://arweave.net/${metadataId}` : undefined;
    console.log("metadataUrl", metadataUrl);

    return metadataUrl;
}

async function createNFT() {
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
    const base58PrivateKey = '2rvynCA2S2HGKpi7aid43AsQMUDqN2o7SYP9ehKdHw3ixAheX3Xfpkj3sSmopiv13dA6BHopqRfNfpinsCpiypyK';
    const privateKey = bs58.decode(base58PrivateKey);
    const wallet = Keypair.fromSecretKey(privateKey);

    console.log('Usando il wallet:', wallet.publicKey.toBase58());

    const metadataUri = await uploadImageAndMetadataToArweave();

    // Inizializza Metaplex
    const metaplex = Metaplex.make(connection)
        .use(keypairIdentity(wallet))
        .use(irysStorage());

    const metadata = {
        name: 'Test NFT shirt5',
        symbol: 'SHIR5',
        uri: metadataUri,
        sellerFeeBasisPoints: 500,
        creators: [
            {
                address: wallet.publicKey,
                verified: true,
                share: 100,
            },
        ],
    };

    // Crea l'NFT
    const { nft } = await metaplex.nfts().create(metadata);
    console.log('NFT creato:', nft);
}

createNFT().catch(console.error);
