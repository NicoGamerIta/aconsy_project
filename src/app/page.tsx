"use client";

import { Connection, PublicKey } from '@solana/web3.js';
import { Metaplex, keypairIdentity, irysStorage, Nft, Sft } from '@metaplex-foundation/js';
import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import dynamic from 'next/dynamic';
import styles from '../styles/global.module.css';
import axios from 'axios';

const DynamicWalletMultiButton = dynamic(
  () => import('@solana/wallet-adapter-react-ui').then(mod => mod.WalletMultiButton),
  { ssr: false }
);

interface NFT {
  uri: string;
  name: string;
  symbol: string;
  image: string;
  description: string;
  public_address: string;
  verified: boolean;
  saved: boolean;
}

interface SearchResult {
  name?: string;
  symbol?: string;
  description?: string;
  image?: string;
}

export default function Home() {
  const { publicKey, wallet } = useWallet();
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [searchAddress, setSearchAddress] = useState('');
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [nftFound, setNftFound] = useState<boolean | null>(null);

  useEffect(() => {
    if (publicKey && wallet?.adapter) {
      fetchNFTs(publicKey, wallet.adapter);
    }
  }, [publicKey, wallet]);

  const fetchNFTs = async (publicKey: PublicKey, adapter: any) => {
    try {
      const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
      const metaplex = new Metaplex(connection)
        .use(irysStorage())
        .use(keypairIdentity(adapter));

      const allNFTs = await metaplex.nfts().findAllByOwner({ owner: publicKey });

      const nftsData = await Promise.all(
        allNFTs.map(async (nft) => {
          try {
            if ('mintAddress' in nft) {
              const nftData = await metaplex.nfts().load({ metadata: nft });

              const isNft = (nft: any): nft is Nft => 'address' in nft && 'mint' in nft;
              const isSft = (nft: any): nft is Sft => 'address' in nft && 'mint' in nft;

              if (isNft(nftData) || isSft(nftData)) {
                const address = (nftData as Nft).address || (nftData as Sft).address;
                const response = await axios.get(`http://localhost:3000/api/nft/${address.toBase58()}`)
                  .catch(() => ({ data: { verified: false, saved: false } }));

                const { verified, saved } = response.data;

                return {
                  uri: nftData.uri,
                  name: nftData.name,
                  symbol: nftData.symbol,
                  image: nftData.json?.image || '', // Assicurati di avere un campo image nei metadati JSON
                  description: nftData.json?.description || '',
                  verified,
                  saved,
                  public_address: address.toBase58(),
                };
              }
            }
          } catch (error) {
            console.error('Error loading NFT data:', error);
            return null;
          }
          return null;
        })
      );

      // Filtra i valori null che potrebbero essere stati restituiti
      setNfts(nftsData.filter((nft): nft is NFT => nft !== null));
    } catch (error) {
      console.error('Error fetching NFTs:', error);
    }
  };

  const handleSearch = async () => {
    console.log("Search button clicked");
    try {
      const response = await axios.get(`http://localhost:3000/api/nft/${searchAddress}`);
      console.log("Response received:", response);
      if (response.status === 200) {
        console.log("NFT found and verified:", response.data);
        setSearchResult(response.data);  
        setNftFound(true);
      } else {
        console.log("NFT not found in database.");
        setNftFound(false);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response && error.response.status === 404) {
        console.log("NFT not verified:", searchAddress);
        setNftFound(false);
      } else {
        console.error('Error searching NFT:', error);
      }
      setSearchResult(null);
    }
    // Cancella il contenuto della barra di ricerca
    setSearchAddress('');
  };

  const handleSave = async (nft: NFT) => {
    try {
      const response = await axios.post('http://localhost:3000/api/save', {
        public_address: nft.public_address
      });
      console.log("Save response received:", response);
      if (response.status === 200) {
        setNfts(nfts.map(n => n.public_address === nft.public_address ? { ...n, saved: true } : n));
      }
    } catch (error) {
      console.error('Error saving NFT:', error);
    }
  };

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <nav className={styles.nav}>
          <img src="/icona.png" alt="icon" className={styles.icon} />
          <div className={styles.navLinks}>
            <a href="/">Home</a>
            <a href="/myproduct">My Products</a>
            <a href="/how-it-works">How It Works</a>
            <a href="/companies">Companies</a>
            <a href="/about-us">About Us</a>
            <a href="/contact-us">Contact Us</a>
          </div>
          <div className={styles.connectWalletWrapper}>
            <DynamicWalletMultiButton
              className={styles.connectWallet}
              style={{
                backgroundColor: '#e67e22',
                color: '#fff',
                border: '2px solid white',
                padding: '10px 20px',
                fontSize: '16px',
                fontWeight: 'bold',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            />
          </div>
          <img src="/lang2.png" className={styles.lang}></img>
        </nav>
      </header>

      <section id="home" className={styles.hero}>
        <h1 className={styles.dis}>Discover Uniqueness in Your Style</h1>
        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="Check NFT Public Address"
            className={styles.searchInput}
            value={searchAddress}
            onChange={(e) => setSearchAddress(e.target.value)}
          />
          <button className={styles.searchButton} onClick={handleSearch}>Search</button>
        </div>
        {nftFound !== null && (
          <div className={styles.searchResult}>
            {nftFound ? (
              <>
                <h3>NFT Verified!</h3>
                <p>Name: {searchResult?.name}</p>
                <p>Symbol: {searchResult?.symbol}</p>
                <p>Description: {searchResult?.description}</p>
                {searchResult?.image && <img src={searchResult.image} alt="NFT Image" />}
              </>
            ) : (
              <h3>NFT Not Verified</h3>
            )}
          </div>
        )}
      </section>

      <section id="my-nfts" className={styles.myNfts}>
        <h2 className={styles.mynft}>My NFTs</h2>
        <div className={styles.mynftGrid}>
          {nfts.length > 0 ? (
            nfts.map((nft, index) => (
              <div key={index} className={styles.mynftCard}>
                <img src={nft.image} className={styles.nftImage}/>
                <p>{nft.name}</p>
                {nft.verified ? (
                  nft.saved ? (
                    <button className={styles.savedButton} disabled>Saved</button>
                  ) : (
                    <button className={styles.saveButton} onClick={() => handleSave(nft)}>Save</button>
                  )
                ) : (
                  <button className={styles.nvButton} disabled>Unverified</button>
                )}
              </div>
            ))
          ) : (
            <p>No NFTs found in your wallet.</p>
          )}
        </div>
      </section>

      <footer className={styles.footer}>
        <p>&copy; 2024 ACONSY. All rights reserved.</p>
      </footer>
    </main>
  );
}