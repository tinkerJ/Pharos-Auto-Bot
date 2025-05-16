nston logger setup
 */
const winston = require('winston');
const chalk = require('chalk');
const moment = require('moment');
const fs = require('fs');
const path = require('path');
const { format } = winston;

/**
 * Set up Winston logger with custom format and colors
 */
function setupLogger() {
  // Define custom format
  const customFormat = format.printf(({ level, message, timestamp, walletIndex = '0-' }) => {
    const formattedDate = moment(timestamp).format('YYYY-MM-DD HH:mm:ss');
    
    // Format wallet index properly - use it directly if it's already in the correct format
    let formattedWalletIndex
