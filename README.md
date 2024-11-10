# Sensor Reader Application

This application reads sensor data from DS18B20 temperature sensors on a Raspberry Pi and writes the data to an InfluxDB instance every 5 minutes.   
It also includes a Grafana instance for visualizing the data and uses PostgreSQL as the database for Grafana.  
  

The application should be good to go for usage with docker-compose. 
Sensors should be mounted into /app/sensors when running the docker setup. 

[ToC]

## Prerequisites

- Docker
- Docker Compose

## Usage

This won't cover the hardware setup on the raspberry Pi as there are many good tutorials out there.

### DS18B20 Temperature Sensors data

I linked the 4 sensors I attached to my PI 4 to the following paths:

`/opt/sensors/indoor -> /sys/bus/w1/devices/28-00000a3b3b4e/w1_slave`  
`/opt/sensors/outdoor -> /sys/bus/w1/devices/28-00000a3b3b4e/w1_slave`  
`/opt/sensors/cabin -> /sys/bus/w1/devices/28-00000a3b3b4e/w1_slave`  
`/opt/sensors/fridge -> /sys/bus/w1/devices/28-00000a3b3b4e/w1_slave`

### Docker Compose

1. Copy .env.example to .env and adjust the values to your needs.
2. Following the above example, mount /opt/sensors to /app/sensors in the docker-compose file.

```yaml
    volumes:
        - /opt/sensors:/app/sensors
```  

3. After this ´docker-compose up -d´ should be enough to run the application and write data into influxdb.

### Grafana

The docker-compose.yml also features a grafana instance with a connected psql database.  
The default login is admin:admin.  
You will need to add the influxdb as a datasource and create a dashboard to visualize the data.  
Every sensor will be written to an own database/bucket with the sensor name as the measurement name.
(e.g. indoor as in the example above)

You should now be good to go.

## Quick Start

1. **Clone the repository**:
    ```sh
    git clone <repository-url>
    cd <repository-directory>
    ```

2. **Install dependencies**:
    ```sh
    npm install
    ```

3. **Copy `.env.example` to `.env`** and adjust the values to your needs:
    ```sh
    cp .env.example .env
    ```

4. **Create a directory for the sensors and link the sensors to the directory**
    ```sh
    mkdir /opt/sensors
    ln -s /sys/bus/w1/devices/<your_sensor_id>/w1_slave /opt/sensors/<your_sensor_bucket_name>
    ln -s /sys/bus/w1/devices/<your_sensor_id>/w1_slave /opt/sensors/<your_sensor_bucket_name>
    ```
   
5. **Mount the sensors to the container**
   ```yaml
    volumes:
        - /opt/sensors:/app/sensors
   ```  

## Running the Application

1. **Build and start the Docker containers**:
    ```sh
    docker-compose up -d
    ```

2. **Access Grafana**:
   - Open your browser and go to `http://localhost:3000`
   - Default login is `admin:admin`
