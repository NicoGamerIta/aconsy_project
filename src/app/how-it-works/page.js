"use client";

import styles from "../../styles/global.module.css";
import dynamic from 'next/dynamic';

const DynamicWalletMultiButton = dynamic(
    () => import('@solana/wallet-adapter-react-ui').then(mod => mod.WalletMultiButton),
    { ssr: false }
  );

export default function HowItWorks() {
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

      </section>

      <footer className={styles.footer}>
        <p>&copy; 2024 ACONSY. All rights reserved.</p>
      </footer>
    </main>
  );
}