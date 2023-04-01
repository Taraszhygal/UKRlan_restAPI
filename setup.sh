#!bin/bash
apt update && apt install git nodejs npm postgresql postgresql-contrib
systemctl start postgresql.service
psql -U postgres -c "CREATE DATABASE diploma" 
psql -U postgres -c "\c diploma" -tc "CREATE TABLE data (_id integer, add_time VARCHAR(50),carrier integer, city VARCHAR(50), expired_time VARCHAR(50), given_time VARCHAR(50),manufacturer integer, order_number VARCHAR(50),state VARCHAR(50), sync_time VARCHAR(50), technology integer)" -c "\dt"
psql -U postgres -c "\c diploma" -tc "\COPY persons(first_name, last_name, dob, email) FROM './ruslan-duda.csv' DELIMITER ',' CSV HEADER;"
npm i
npm install -g forever
forever start ./index.js 
wget https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-linux-amd64.tgz && tar -xvzf ngrok-v3-stable-linux-amd64.tgz
./ngrok config add-authtoken $1
./ngrok https 9393 > /dev/null &
