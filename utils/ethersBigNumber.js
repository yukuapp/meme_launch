const ethers = require('ethers');
const BigNumber = require('bignumber.js')
function getNumber(bigNumber) {
    return parseFloat(ethers.utils.bigNumberify(bigNumber).toString());
}

function parseEth(ethAmount) {
    return ethers.utils.parseEther(ethAmount.toString());
}

function formatEth(ethAmount) {
    return ethers.utils.formatEther(ethAmount.toString());
}

function parseUnit(tokenAmount, unit) {
    return ethers.utils.parseUnits(tokenAmount.toString(), unit == undefined ? 18 : unit)
}

function formatUnit(tokenAmount, unit) {
    return ethers.utils.formatUnits(tokenAmount.toString(), unit == undefined ? 18 : unit)
}

module.exports = { getNumber, parseEth, formatEth, parseUnit, formatUnit }