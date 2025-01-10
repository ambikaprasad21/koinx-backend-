const express = require("express");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const axios = require("axios");
const cron = require("node-cron");
const Crypto = require("./models/cryptoModel");
const appController = require("./controllers/appController");
const app = express();

// TASK 1
const getCryptoInfo = async () => {
  try {
    const res = await axios.get(process.env.COINSAPI);
    const data = res.data;

    const cryptoData = {
      bitcoin: {
        currentPrice: data[0].current_price,
        marketCap: data[0].market_cap,
        hour24Change: data[0].price_change_24h,
      },
      matic: {
        currentPrice: data[1].current_price,
        marketCap: data[1].market_cap,
        hour24Change: data[1].price_change_24h,
      },
      ethereum: {
        currentPrice: data[2].current_price,
        marketCap: data[2].market_cap,
        hour24Change: data[2].price_change_24h,
      },
    };

    const latest = new Crypto(cryptoData);
    await latest.save();
  } catch (err) {
    console.log(err.message);
    return next(
      new AppError(
        "Failed to fetch data from CoinGecko. Please try again later.",
        500
      )
    );
  }
};

cron.schedule("0 */2 * * *", () => {
  getCryptoInfo();
  console.log("running a task every one minutes");
});

// TASK 2
app.use("/stats/:coin", appController.getStats);

// TASK 3
app.use("/deviation/:coin", appController.getDeviation);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);
module.exports = app;
