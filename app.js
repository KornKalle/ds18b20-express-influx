const express = require('express');
const app = express();
const cron = require('node-cron');
const readSensorFile = require('./src/schedule/readSensor');

// Schedule the task to run every 5 minutes
cron.schedule('*/5 * * * *', () => {
    console.log('Reading sensors');
    readSensorFile();
});