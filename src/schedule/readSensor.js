const fs = require('fs');
const path = require('path');
const writeToInfluxDB = require('../influx/influxdb');

/**
 * Reads sensor files from the specified directory and writes the data to InfluxDB.
 */
const readSensorFile = () => {
    const directoryPath = '/app/sensors';

    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            console.error('Error reading the directory:', err);
            return;
        }

        files.forEach(file => {
            const filePath = path.join(directoryPath, file);
            fs.readFile(filePath, 'utf8', (err, data) => {
                if (err) {
                    console.error('Error reading the file:', err);
                    return;
                }

                const lines = data.split('\n');
                lines.forEach(line => {
                    const match = line.match(/t=(\d+)/);
                    if (match) {
                        const value = parseInt(match[1], 10);
                        const processedValue = (value / 1000).toFixed(1);
                        console.log(`File: ${file}, Value: ${processedValue}°C`);
                        writeToInfluxDB(file, processedValue);
                    }
                });
            });
        });
    });
};

module.exports = readSensorFile;