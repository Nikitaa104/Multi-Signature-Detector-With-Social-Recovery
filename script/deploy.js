// deploy.js
const hre = require("hardhat");

async function main() {
    // Example initial owners and threshold
    const owners = [
        "0x1234567890abcdef1234567890abcdef12345678",
        "0xabcdef1234567890abcdef1234567890abcdef12"
    ];
    const threshold = 2;

    const MultiSigWallet = await hre.ethers.getContractFactory("MultiSigWalletWithRecovery");
    const wallet = await MultiSigWallet.deploy(owners, threshold);

    await wallet.deployed();
    console.log("MultiSigWalletWithRecovery deployed to:", wallet.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
