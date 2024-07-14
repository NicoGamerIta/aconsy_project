// src/app/howorks.jsx
"use client";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import styles from "./page.module.css"; // Assicurati di avere questo file di stile

export default function HowItWorks() {
  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <nav className={styles.nav}>
          <img src="/icona.png" alt="icon" className={styles.icon} />
          <div className={styles.navLinks}>
            <a href="/">Home</a>
            <a href="/howorks">How It Works</a>
            <a href="/companies">Companies</a>
            <a href="/about-us">About Us</a>
            <a href="/contact-us">Contact Us</a>
          </div>
          <div className={styles.connectWalletWrapper}>
            <WalletMultiButton
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
        </nav>
      </header>

      <section>
        <h1>How It Works</h1>
        <p>Explanation of how it works...</p>
      </section>

      <footer className={styles.footer}>
        <p>&copy; 2024 Uniqueness in Your Style. All rights reserved.</p>
      </footer>
    </main>
  );
}