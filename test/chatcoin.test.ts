import { ChatCoin } from "../typechain-types";
import { expect } from "chai";
import { ethers } from "hardhat";
import { parseEther } from "ethers";    
import { HardhatEthersSigner } from '@nomicfoundation/hardhat-ethers/signers';

describe("ChatCoin", ()=> {
    let ChatCoinFactory: any;
    let owner: HardhatEthersSigner, addr1: HardhatEthersSigner, addr2: HardhatEthersSigner;
    let chatCoin: ChatCoin;

    beforeEach(async function(){
        ChatCoinFactory = await ethers.getContractFactory('ChatCoin');
        [owner, addr1, addr2] = await ethers.getSigners();
        chatCoin = (await ChatCoinFactory.deploy(parseEther("100000"))) as ChatCoin;
        await chatCoin.waitForDeployment();
    });

    it('should assign the initial supply to the owner', async()=> {
        const ownerBalance = await chatCoin.balanceOf(owner.address);
        const totalSupply = await chatCoin.totalSupply();
        expect(totalSupply).to.equal(ownerBalance);
    });

    it('should transfer tokens between accounts', async()=> {
        await chatCoin.transfer(addr1.address, parseEther('100'));
        const addr1Balance = await chatCoin.balanceOf(addr1.address);
        expect(addr1Balance).to.equal(parseEther('100'));
    });

    it('should allow the owner to mint new tokens', async()=> {
        await chatCoin.mint(owner.address, parseEther('500'));
        const newSupply = await chatCoin.totalSupply();
        expect(newSupply).to.equal(parseEther('100500'));
    });

    it('should allow the users to burn their tokens', async()=> {
        await chatCoin.burn(parseEther('100'));
        const newSupply = await chatCoin.totalSupply();
        expect(newSupply).to.equal(parseEther('99900'));
    })
})