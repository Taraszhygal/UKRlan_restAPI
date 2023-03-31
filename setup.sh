#!bin/bash
apt update && apt install git nodejs npm postgresql postgresql-contrib
systemctl start postgresql.service


sudo -i -u postgres && psql -U postgres -tc "SELECT 1 FROM pg_database WHERE datname = 'diploma'" | grep -q 1 || psql -U postgres -c "CREATE DATABASE diploma"

psql -U postgres -tc "CREATE TABLE data ("_id integer, add_time VARCHAR(50),carrier integer, city VARCHAR(50), expired_time VARCHAR(50), given_time VARCHAR(50),manufacturer integer, order_number VARCHAR(50),state VARCHAR(50), sync_time VARCHAR(50), technology integer")"

psql -U postgres -tc "COPY persons(first_name, last_name, dob, email) FROM './ruslan-duda.csv' DELIMITER ',' CSV HEADER;"

npm i

node index.js
