# Pharos Auto Bot

[![Version](https://img.shields.io/badge/version-v1.0.0-blue)](https://github.com/Kazuha787/Pharos-Auto-Bot)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

**Pharos Auto Bot** is a robust, modular automation framework built in **Node.js** for interacting with the [Pharos Testnet](https://pharos.network). It handles day-to-day tasks like check-ins, faucet claims, social verifications, and on-chain operations with ease and precision.

Perfect for testers, point farmers, and developers who want to automate repetitive tasks securely and efficiently.

---

## Features

- **Multi-Account Support**  
  Process unlimited accounts in parallel using `pk.txt`.

- **Proxy Integration**  
  Optional proxy support via `proxy.txt` for IP rotation and privacy.

- **Modular Architecture**  
  Clearly separated services and utilities for clean, scalable code.

- **Task Automation**  
  Automates:
  - Daily check-ins
  - Native/Token (USDC, USDT) faucet claims
  - Social tasks (Follow on X, Retweet, Comment, Join Discord)
  - On-chain actions (Self-transfers, Token swaps, Add liquidity)

- **Multi-Threaded Execution**  
  Efficient task handling using asynchronous JavaScript threading.

- **Configurable Settings**  
  Modify task preferences, delays, threads, and API keys via `config.js`.

- **Cross-Platform Compatibility**  
  Supports Windows, macOS, and Linux (Termux-friendly too).

---

## File Structure

```bash
Pharos-Auto-Bot/
├── src/
│   ├── index.js              # Main script entry point
│   ├── config.js             # Configuration settings
│   ├── utils/
│   │   ├── helpers.js        # Utility functions (Axios, proxy parsing, etc.)
│   │   ├── logger.js         # Logging setup
│   │   └── wallet.js         # Wallet creation and address utilities
│   ├── services/
│   │   ├── auth.js           # Authentication service
│   │   ├── checkin.js        # Daily check-in service
│   │   ├── faucet.js         # Faucet claim service
│   │   ├── social.js         # Social task service
│   │   ├── transfer.js       # Self-transfer service
│   │   ├── swap.js           # Swap service
│   │   └── liquidity.js      # Liquidity addition service
├── pk.txt                    # Private keys (one per line)
├── proxy.txt                 # Proxy list (optional)
├── package.json              # Project dependencies and scripts
├── node_modules/             # Installed dependencies
├── README.md                 # This file
└── LICENSE                   # MIT License
```
## ⚙️ Requirements

Before using the bot, make sure you have:

- [Node.js](https://nodejs.org/) v16+
- Git installed
- A valid Pharos Testnet account → [pharos.network](https://pharos.network/)
- Optional: Proxy list for stealth mode
- Terminal confidence (a little hacker energy helps)

---

## 🧠 Installation & Setup

```bash
# 1. Clone the repo
git clone https://github.com/Kazuha787/Pharos-Auto-Bot.git
cd Pharos-Auto-Bot
```
# 2. Install dependencies
```
npm install
```
# 3. Configure your settings
```
nano config.js 
```
# or use any code editor

# 4. Run the bot
```
node main.js
```
---

## 🤝 Community Support

Need help, updates, or want to show off your setup?

Join the official Telegram group for support, discussion, and announcements:  
**[→ Telegram: @Offical_Im_kazuha](https://t.me/Offical_Im_kazuha)**

Whether you're facing issues, contributing improvements, or just vibing — everyone's welcome.

Have a feature request or found a bug?  
→ Open an [Issue](https://github.com/Kazuha787/Pharos-Auto-Bot/issues) or submit a [Pull Request](https://github.com/Kazuha787/Pharos-Auto-Bot/pulls).

---

## 🧾 License

This project is licensed under the **MIT License**.

You’re free to use, modify, and distribute it as long as the original copyright and license
notice are included in copies or substantial portions of the software.

> See full license details in the [LICENSE](LICENSE) file.

---

## 🌱 Contributing

Contributions are **highly appreciated**!

If you'd like to contribute to **Pharos Auto Bot**, here's how:

1. **Fork** the repository
2. **Create a new branch**  
   ```bash
   git checkout -b feature/your-feature-name
