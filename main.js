import chalk from "chalk";
import fs from "fs/promises";
import inquirer from "inquirer";
import ora from "ora";
import { swapPharostousdc, swapUsdcToPharos } from "./src/Swap/Swap.js";
import addLp from "./src/AddLP/addLp.js";
import login from "./src/Login/login.js";
import autocheckin from "./src/Login/Autocheckin.js";
import {
  verifyTaskSOCIAL,
  verifyTaskOnchain,
} from "./src/Login/autoVerifyTask.js";
import sendToFriend from "./src/SendToFriend/send.js";
import { generatedWallet } from "./Createwallet.js";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ASCII Banner
const asciiBannerLines = [
  "██████╗     ██╗  ██╗     █████╗     ██████╗      ██████╗     ███████╗",
  "██╔══██╗    ██║  ██║    ██╔══██╗    ██╔══██╗    ██╔═══██╗    ██╔════╝",
  "██████╔╝    ███████║    ███████║    ██████╔╝    ██║   ██║    ███████╗",
  "██╔═══╝     ██╔══██║    ██╔══██║    ██╔══██╗    ██║   ██║    ╚════██║",
  "██║         ██║  ██║    ██║  ██║    ██║  ██║    ╚██████╔╝    ███████║",
  "╚═╝         ╚═╝  ╚═╝    ╚═╝  ╚═╝    ╚═╝  ╚═╝     ╚═════╝     ╚══════╝",
  "",
  "       Pharos Testnet Bot v3.0 - Created By Kazuha787       ",
  "                  LETS FUCK THIS TESTNET                   ",
];

const displayBanner = () => {
  console.log("\n\n\n");
  asciiBannerLines.forEach((line) => console.log(chalk.cyan.bold(line)));
  console.log("\n\n");
};

const loadWallets = async () => {
  const spinner = ora(chalk.blue("Loading wallets...")).start();
  try {
    const wallets = (await fs.readFile("wallet.txt", "utf-8"))
      .replace(/\r/g, "")
      .split("\n")
      .filter(Boolean);
    if (wallets.length === 0) {
      spinner.fail(chalk.red("No wallets found. Generating new wallets..."));
      const result = await generatedWallet();
      spinner.succeed(chalk.green(`Wallets generated: ${result}`));
      spinner.info("Please run the script again.");
      return null;
    }
    spinner.succeed(chalk.green("Wallets loaded successfully."));
    return wallets;
  } catch (error) {
    spinner.fail(chalk.red(`Error loading wallets: ${error.message}`));
    return null;
  }
};

const mainMenu = async () => {
  const { action } = await inquirer.prompt([
    {
      type: "list",
      name: "action",
      message: chalk.blue("Select an action:"),
      choices: [
        "Check Balance",
        "Swap Tokens",
        "Add Liquidity",
        "Send Tokens to Friend",
        "Exit",
      ],
    },
  ]);
  return action;
};

const promptSwapDetails = async () => {
  const { amount, times } = await inquirer.prompt([
    {
      type: "input",
      name: "amount",
      message: chalk.blue("Enter the amount to swap:"),
      validate: (input) =>
        !isNaN(input) && Number(input) > 0
          ? true
          : "Please enter a valid number greater than 0",
    },
    {
      type: "input",
      name: "times",
      message: chalk.blue("How many times to swap?"),
      validate: (input) =>
        !isNaN(input) && Number(input) > 0
          ? true
          : "Please enter a valid number greater than 0",
    },
  ]);
  return { amount: Number(amount), times: Number(times) };
};

const promptLiquidityDetails = async () => {
  const { amount, times } = await inquirer.prompt([
    {
      type: "input",
      name: "amount",
      message: chalk.blue("Enter the amount for liquidity:"),
      validate: (input) =>
        !isNaN(input) && Number(input) > 0
          ? true
          : "Please enter a valid number greater than 0",
    },
    {
      type: "input",
      name: "times",
      message: chalk.blue("How many times to add liquidity?"),
      validate: (input) =>
        !isNaN(input) && Number(input) > 0
          ? true
          : "Please enter a valid number greater than 0",
    },
  ]);
  return { amount: Number(amount), times: Number(times) };
};

const promptSendDetails = async () => {
  const { amount, times, recipient } = await inquirer.prompt([
    {
      type: "input",
      name: "amount",
      message: chalk.blue("Enter the amount to send:"),
      validate: (input) =>
        !isNaN(input) && Number(input) > 0
          ? true
          : "Please enter a valid number greater than 0",
    },
    {
      type: "input",
      name: "times",
      message: chalk.blue("How many times to send tokens?"),
      validate: (input) =>
        !isNaN(input) && Number(input) > 0
          ? true
          : "Please enter a valid number greater than 0",
    },
    {
      type: "input",
      name: "recipient",
      message: chalk.blue("Enter the recipient address:"),
      validate: (input) => (input ? true : "Please enter a recipient address"),
    },
  ]);
  return { amount: Number(amount), times: Number(times), recipient };
};

const executeSwap = async (wallet, amount, times, jwt, address) => {
  // Gas settings for faster transactions
  const gasSettings = {
    maxPriorityFeePerGas: "2000000000", // 2 Gwei
    maxFeePerGas: "100000000000", // 100 Gwei
  };

  for (let i = 0; i < times; i++) {
    const spinner = ora(
      chalk.blue(`Swapping ${i + 1}/${times} for wallet ${address}...`)
    ).start();
    try {
      // Pass gas settings to swap functions
      const swap1 = await swapPharostousdc(wallet, jwt, amount, gasSettings);
      const swap2 = await swapUsdcToPharos(wallet, amount, gasSettings);
      const swap2Message = swap2 ? swap2.message : "USDC to Pharos failed";
      spinner.succeed(
        chalk.green(
          `Swap ${i + 1}/${times}: Pharos to USDC: ${swap1.message}, USDC to Pharos: ${swap2Message}`
        )
      );
      if (swap1.txHash) {
        const verifySpinner = ora(chalk.blue("Verifying onchain task...")).start();
        await verifyTaskOnchain(jwt, address, swap1.txHash, null, null);
        verifySpinner.succeed(chalk.green("Onchain task verified."));
      }
      await delay(5000); // Reduced delay to 5 seconds for faster execution
    } catch (error) {
      spinner.fail(chalk.red(`Swap ${i + 1}/${times} failed: ${error.message}`));
      if (error.message.includes("cu limit exceeded")) {
        spinner.warn(chalk.yellow("Rate limit exceeded. Waiting longer..."));
        await delay(30000);
      }
    }
  }
};

const executeAddLiquidity = async (wallet, amount, times, jwt, address) => {
  // Gas settings for faster transactions
  const gasSettings = {
    maxPriorityFeePerGas: "2000000000", // 2 Gwei
    maxFeePerGas: "100000000000", // 100 Gwei
  };

  for (let i = 0; i < times; i++) {
    const spinner = ora(
      chalk.blue(`Adding liquidity ${i + 1}/${times} for wallet ${address}...`)
    ).start();
    try {
      // Pass gas settings to addLp
      const result = await addLp(wallet, amount, gasSettings);
      spinner.succeed(chalk.green(`Add Liquidity ${i + 1}/${times}: ${result.message}`));
      if (result.txHash) {
        const verifySpinner = ora(chalk.blue("Verifying onchain task...")).start();
        await verifyTaskOnchain(jwt, address, null, result.txHash, null);
        verifySpinner.succeed(chalk.green("Onchain task verified."));
      }
      await delay(5000); // Reduced delay to 5 seconds
    } catch (error) {
      spinner.fail(chalk.red(`Add Liquidity ${i + 1}/${times} failed: ${error.message}`));
      if (error.message.includes("cu limit exceeded")) {
        spinner.warn(chalk.yellow("Rate limit exceeded. Waiting longer..."));
        await delay(30000);
      }
    }
  }
};

const executeSendToFriend = async (wallet, amount, times, recipient, jwt, address) => {
  // Gas settings for faster transactions
  const gasSettings = {
    maxPriorityFeePerGas: "2000000000", // 2 Gwei
    maxFeePerGas: "100000000000", // 100 Gwei
  };

  for (let i = 0; i < times; i++) {
    const spinner = ora(
      chalk.blue(`Sending tokens ${i + 1}/${times} for wallet ${address}...`)
    ).start();
    try {
      // Pass gas settings to sendToFriend
      const result = await sendToFriend(wallet, amount, recipient, gasSettings);
      spinner.succeed(chalk.green(`Send to Friend ${i + 1}/${times}: ${result.message}`));
      if (result.txHash) {
        const verifySpinner = ora(chalk.blue("Verifying onchain task...")).start();
        await verifyTaskOnchain(jwt, address, null, null, result.txHash);
        verifySpinner.succeed(chalk.green("Onchain task verified."));
      }
      await delay(5000); // Reduced delay to 5 seconds
    } catch (error) {
      spinner.fail(chalk.red(`Send to Friend ${i + 1}/${times} failed: ${error.message}`));
      if (error.message.includes("cu limit exceeded")) {
        spinner.warn(chalk.yellow("Rate limit exceeded. Waiting longer..."));
        await delay(30000);
      }
    }
  }
};

const checkBalance = async (address) => {
  const spinner = ora(chalk.blue(`Fetching balance for wallet ${address}...`)).start();
  try {
    const balances = await getBalances(address);
    spinner.succeed(
      chalk.green(
        `Wallet ${address}\nPharos balance: ${balances.pharos}\nUSDC balance: ${balances.usdc}`
      )
    );
  } catch (error) {
    spinner.fail(chalk.red(`Failed to fetch balance: ${error.message}`));
  }
};

// Placeholder balance function (replace with actual implementation)
const getBalances = async (address) => {
  // Replace with actual balance-fetching logic (e.g., from contract or API)
  return {
    pharos: 216.130785737670596822, // Placeholder value
    usdc: 10325.938396911950185811, // Placeholder value
  };
};

(async () => {
  displayBanner();
  const wallets = await loadWallets();
  if (!wallets) return;

  while (true) {
    const action = await mainMenu();

    if (action === "Exit") {
      console.log(chalk.yellow("Exiting..."));
      break;
    }

    for (const wallet of wallets) {
      const spinner = ora(chalk.blue(`Logging in for wallet ${wallet}...`)).start();
      try {
        const { message, jwt, address } = await login(wallet);
        if (!message || !jwt) {
          spinner.fail(chalk.red("Login failed for wallet, skipping..."));
          continue;
        }
        spinner.succeed(chalk.green(`${message}\nWallet: ${address}`));

        const checkinSpinner = ora(chalk.blue("Performing autocheckin...")).start();
        const checkinResult = await autocheckin(jwt, address);
        checkinSpinner.succeed(chalk.green(checkinResult));

        const socialSpinner = ora(chalk.blue("Verifying social task...")).start();
        const socialResult = await verifyTaskSOCIAL(jwt, address);
        socialSpinner.succeed(chalk.green(socialResult));

        if (action === "Check Balance") {
          await checkBalance(address);
        } else if (action === "Swap Tokens") {
          const { amount, times } = await promptSwapDetails();
          await executeSwap(wallet, amount, times, jwt, address);
          // Explicitly avoid balance check after swap
        } else if (action === "Add Liquidity") {
          const { amount, times } = await promptLiquidityDetails();
          await executeAddLiquidity(wallet, amount, times, jwt, address);
        } else if (action === "Send Tokens to Friend") {
          const { amount, times, recipient } = await promptSendDetails();
          await executeSendToFriend(wallet, amount, times, recipient, jwt, address);
        }
      } catch (error) {
        spinner.fail(chalk.red(`Error processing wallet: ${error.message}`));
      }
    }
  }
})();
