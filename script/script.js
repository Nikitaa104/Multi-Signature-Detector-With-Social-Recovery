// script.js
const { ethers } = require("ethers");

// Replace with your deployed contract address
const contractAddress = "YOUR_DEPLOYED_CONTRACT_ADDRESS";

// ABI of the MultiSigWallet contract (simplified)
const abi = [
    "function submitTransaction(address to, uint value, bytes data) public returns (uint)",
    "function confirmTransaction(uint txIndex) public",
    "function executeTransaction(uint txIndex) public",
    "function addOwner(address newOwner) public",
    "function recoverWallet(address newOwner) public",
    "function getOwners() public view returns (address[])",
    "function getTransactionCount() public view returns (uint)"
];

async function main() {
    // Connect to Ethereum via MetaMask
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();

    const walletContract = new ethers.Contract(contractAddress, abi, signer);

    // Example: Submit a transaction (send 0.01 ETH to some address)
    const tx = await walletContract.submitTransaction(
        "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
        ethers.utils.parseEther("0.01"),
        "0x"
    );
    await tx.wait();
    console.log("Transaction submitted");

    // Example: Confirm the transaction (by another owner)
    const txIndex = 0; // first transaction
    const confirmTx = await walletContract.confirmTransaction(txIndex);
    await confirmTx.wait();
    console.log("Transaction confirmed");

    // Example: Execute transaction once threshold is reached
    const executeTx = await walletContract.executeTransaction(txIndex);
    await executeTx.wait();
    console.log("Transaction executed");

    // Example: Get current owners
    const owners = await walletContract.getOwners();
    console.log("Wallet owners:", owners);
}

// Run the script
main().catch(console.error);
