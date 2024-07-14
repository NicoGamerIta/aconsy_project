"use client";

import styles from "../../styles/global.module.css";
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import axios from 'axios';

const DynamicWalletMultiButton = dynamic(
  () => import('@solana/wallet-adapter-react-ui').then(mod => mod.WalletMultiButton),
  { ssr: false }
);

interface NFT {
  public_address: string;
  name_nft: string;
  simbol: string;
  image: string;
  description: string;
}

export default function MyProduct() {
  const [savedNFTs, setSavedNFTs] = useState<NFT[]>([]);

  useEffect(() => {
    fetchSavedNFTs();
  }, []);

  const fetchSavedNFTs = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/saved');
      console.log('Fetched saved NFTs:', response.data); // Debugging log
      setSavedNFTs(response.data);
    } catch (error) {
      console.error('Error fetching saved NFTs:', error);
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

      <section id="my-products" className={styles.myProducts}>
        <h1 className={styles.dis2}>My Saved NFTs</h1>
        <div className={styles.nftGrid}>
          {savedNFTs.length > 0 ? (
            savedNFTs.map((nft, index) => (
              <div key={index} className={styles.nftCard}>
                <img src={nft.image} className={styles.nftImage} />
                <div className={styles.nftInfo}>
                  <h3>{nft.name_nft}</h3>
                  <p><strong>Symbol:</strong> {nft.simbol}</p>
                  <p><strong>Description:</strong> {nft.description}</p>
                </div>
              </div>
            ))
          ) : (
            <p>No saved NFTs found.</p>
          )}
        </div>
      </section>

      <footer className={styles.footer}>
        <p>&copy; 2024 ACONSY. All rights reserved.</p>
      </footer>
    </main>
  );
}