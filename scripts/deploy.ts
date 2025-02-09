import { ethers } from 'hardhat';
import { parseEther } from "ethers";  

async function main() {
    const ChatCoinFactory = await ethers.getContractFactory('ChatCoin');
    const chatCoin = await ChatCoinFactory.deploy(parseEther('10000000'));

    await chatCoin.waitForDeployment();

    const contractAddress = await chatCoin.getAddress();
    console.log("ChatCoin contract is deployed to: ", contractAddress);
}

main().catch(error=> {
    console.error(error);
    process.exit(1);
})