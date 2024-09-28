"use strict";

const path = require("path");
const PUBLIC_DIR = path.resolve(__dirname, "./public");
const LOG_PATH = path.resolve(__dirname, "./logs/yumi-api-service.log");
const TELEGRAM_BOT_TOKEN = "";
const JWT_SECRET = "";
const MNEMONIC="";
//BASE Chain
// const FACTORY_CONTRACT_ADDRESS="0xcB8327E07D377F55cb251F60108bC9163d72Cca4";
// const EVENT_CONTRACT_ADDRESS="0xDF727B8986e294d02D8A1b096509252f2D06A2a0";
// const BASE_PROVIDER="https://base-mainnet.g.alchemy.com/v2/I-ZVEdUQy4Mk3rwbsNAIp_MVql6coseO";
//MANTA Chain
const FACTORY_CONTRACT_ADDRESS="0xcB8327E07D377F55cb251F60108bC9163d72Cca4";
const EVENT_CONTRACT_ADDRESS="0xDF727B8986e294d02D8A1b096509252f2D06A2a0";
const MANTA_PROVIDER="https://pacific-rpc.manta.network/http";
module.exports = {
  PUBLIC_DIR,
  LOG_PATH,
  TELEGRAM_BOT_TOKEN,
  JWT_SECRET,
  FACTORY_CONTRACT_ADDRESS,
  EVENT_CONTRACT_ADDRESS,
  MNEMONIC,
  // BASE_PROVIDER
  MANTA_PROVIDER
};
