require('dotenv').config();
const { InfluxDB, Point } = require('@influxdata/influxdb-client');
const { BucketsAPI, OrgsAPI } = require('@influxdata/influxdb-client-apis');

const url = process.env.INFLUXDB_URL;
const token = process.env.INFLUXDB_TOKEN;
const org = 'docs';

const influxDB = new InfluxDB({ url, token });
const bucketsAPI = new BucketsAPI(influxDB);
const orgsAPI = new OrgsAPI(influxDB);

/**
 * Creates a bucket in InfluxDB if it does not already exist.
 * @param {string} bucketName - The name of the bucket to create.
 */
const createBucketIfNotExists = async (bucketName) => {
    try {
        const orgs = await orgsAPI.getOrgs({ org });
        const orgID = orgs.orgs[0].id;

        const buckets = await bucketsAPI.getBuckets({ orgID });
        const bucketExists = buckets.buckets.some(bucket => bucket.name === bucketName);

        if (!bucketExists) {
            await bucketsAPI.postBuckets({
                body: {
                    orgID: orgID,
                    name: bucketName,
                    retentionRules: [],
                },
            });
            console.log(`Bucket: ${bucketName} created`);
        }
    } catch (error) {
        console.error('Error creating bucket:', error);
    }
};

/**
 * Writes sensor data to InfluxDB.
 * @param {string} filename - The name of the file (used as the bucket name).
 * @param {string} value - The sensor value to write.
 */
const writeToInfluxDB = async (filename, value) => {
    await createBucketIfNotExists(filename);

    const writeApi = influxDB.getWriteApi(org, filename, 'ns');
    const point = new Point('sensor_data')
        .floatField('value', parseFloat(value));

    writeApi.writePoint(point);
    writeApi.close().then(() => {
        console.log(`File: ${filename}, Value: ${value}°C written to InfluxDB`);
    }).catch(err => {
        console.error('Error writing to InfluxDB:', err);
    });
};

module.exports = writeToInfluxDB;