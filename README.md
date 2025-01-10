# Koinx Backend Assignment

This is a simple backend made using Node.js, Express, MongoDB.

Features are:

- Background operation that stores crypto information into databse every 2 hours.
- Get the stats for a particular crypto coin.
- Get the deviation for previous 100 records for a particular crypto coin.

**Steps for setup**

Create a `config.env` file. In this provide value for the respective fields:
`DATABASE` = mongodb+srv://{username}:<PASSWORD>@cluster0.upadp.mongodb.net/koinx?retryWrites=true&w=majority&appName=Cluster0
`PASSWORD` = databasepassword
`PORT` = 8000
`NODE_ENV` = production/development
`COINSAPI` = https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,matic-network,ethereum&x_cg_demo_api_key={Your api key}
`STATS_URL` = https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=<COIN>&x_cg_demo_api_key={Your api key}
