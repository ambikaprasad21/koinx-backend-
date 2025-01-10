const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const axios = require("axios");
const Crypto = require("../models/cryptoModel");

const validCoins = ["bitcoin", "matic-network", "ethereum"];

exports.getStats = catchAsync(async (req, res, next) => {
  const { coin } = req.params;

  if (!coin || !validCoins.includes(coin)) {
    return next(
      new AppError(
        "Please enter either coin: bitcoin, matic-network or ethereum",
        400
      )
    );
  }

  const statsUrl = process.env.STATS_URL.replace("<COIN>", coin.toLowerCase());

  try {
    const resdata = await axios.get(statsUrl);
    const data = resdata.data[0];

    const statsdata = {
      price: data.current_price,
      marketCap: data.market_cap,
      "24hChange": data.price_change_24h,
    };

    res.status(200).json({
      statsdata,
    });
  } catch (err) {
    return next(new AppError("Some error occurred, please try again", 500));
  }
});

exports.getDeviation = catchAsync(async (req, res, next) => {
  let { coin } = req.params;

  if (!coin || !validCoins.includes(coin)) {
    return next(
      new AppError(
        "Please specify a valid coin: bitcoin, matic-network, or ethereum",
        400
      )
    );
  }

  if (coin === "matic-network") {
    coin = "matic";
  }

  const records = await Crypto.find({}).sort({ createdAt: -1 }).limit(100);

  const prices = records
    .map((record) => record[coin]?.currentPrice)
    .filter((price) => price !== undefined);

  if (prices.length === 0) {
    return next(new AppError("No data available for the specified coin.", 404));
  }

  const mean = prices.reduce((sum, price) => sum + price, 0) / prices.length;

  const variance =
    prices.reduce((sum, price) => sum + Math.pow(price - mean, 2), 0) /
    prices.length;

  const deviation = Math.sqrt(variance);

  res.status(200).json({
    deviation: deviation.toFixed(2),
  });
});
