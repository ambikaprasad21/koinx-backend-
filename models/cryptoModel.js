const mongoose = require("mongoose");

const CryptoInfo = new mongoose.Schema({
  currentPrice: Number,
  marketCap: Number,
  hour24Change: Number,
});

const CryptoSchema = new mongoose.Schema(
  {
    bitcoin: CryptoInfo,
    matic: CryptoInfo,
    ethereum: CryptoInfo,
  },
  {
    timestamps: true,
  }
);

const crypto = mongoose.model("Crypto", CryptoSchema);
module.exports = crypto;
