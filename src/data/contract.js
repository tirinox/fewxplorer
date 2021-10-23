import {decodePersonality} from "./personality";

import Web3 from 'web3/dist/web3.min.js'

import TestBreedABI from './breeding.test.abi.json'
import TestFewmanABI from './fewman.test.abi.json'
import LiveBreedABI from './breeding.abi.json'
import LiveFewmanABI from './fewman.abi.json'
import {nowTS} from "../helpers/util";
import {Config} from "./config";


export function getInfuraWeb3(projectToken, test) {
    let url = ''
    if (test) {
        url = `https://ropsten.infura.io/v3/${projectToken}`
    } else {
        url = `https://mainnet.infura.io/v3/${projectToken}`
    }
    return new Web3(url)
}


export class FewmanContract {
    constructor(web3, contract, abi) {
        abi = abi || TestFewmanABI
        contract = contract || Config.FEWMANS_CONTRACT_TEST
        this.contract = new web3.eth.Contract(abi, contract)
    }

    async readTotalSupply() {
        return +(await this.contract.methods.totalSupply().call())
    }

    async getTokenByIndex(i) {
        return await this.contract.methods.tokenByIndex(i).call()
    }

    async getPersonality(tokenId) {
        return await this.contract.methods.personality(tokenId).call()
    }

    async addressBalance(address) {
        return await this.contract.methods.balanceOf(address).call()
    }

    async getOwnerOf(tokenId) {
        return await this.contract.methods.ownerOf(tokenId).call()
    }
}

export class FewmanBreedContract {
    constructor(web3, contract, abi) {
        abi = abi || TestBreedABI
        contract = contract || Config.FEWMANS_BREED_CONTRACT_TEST
        this.contract = new web3.eth.Contract(abi, contract)
    }

    async getGeneration(tokenId) {
        if (tokenId < 10000) {
            return 0
        } else {
            return await this.contract.methods.generation(tokenId).call()
        }
    }

    async getFewvulationDuration() {
        return +(await this.contract.methods.fewvulationDuration().call())
    }

    async getNextFewvulation() {
        return +(await this.contract.methods.nextFewvulation().call())
    }
}

const defaultWeb3 = getInfuraWeb3('')
const defaultWeb3Test = getInfuraWeb3('', true)

const holder = {
    web3: defaultWeb3,
    testWeb3: defaultWeb3Test,

    test: {
        fewmansContract: new FewmanContract(defaultWeb3Test),
        breedContract: new FewmanBreedContract(defaultWeb3Test)
    },

    live: {
        fewmansContract: new FewmanContract(defaultWeb3),
        breedContract: new FewmanBreedContract(defaultWeb3)
    }
}

export function setupInfura(projectId) {

    holder.web3 = getInfuraWeb3(projectId)
    holder.testWeb3 = getInfuraWeb3(projectId, true)

    holder.test.fewmansContract = new FewmanContract(holder.testWeb3, Config.FEWMANS_CONTRACT_TEST, TestFewmanABI)
    holder.test.breedContract = new FewmanBreedContract(holder.testWeb3, Config.FEWMANS_BREED_CONTRACT_TEST, TestBreedABI)

    holder.live.fewmansContract = new FewmanContract(holder.web3, Config.FEWMANS_CONTRACT, LiveFewmanABI)
    holder.live.breedContract = new FewmanBreedContract(holder.web3, Config.FEWMANS_BREED_CONTRACT, LiveBreedABI)

    return holder
}

export function getFewmansContracts(test) {
    return test ? holder.test : holder.live
}

export async function loadFewmanFromContractsById(tokenId, isTestnet) {
    try {
        if (tokenId === null || tokenId === '' || tokenId === undefined) {
            return {error: 'no token id'}
        }
        isTestnet = isTestnet || false
        const {fewmansContract, breedContract} = getFewmansContracts(isTestnet)

        const owner = await fewmansContract.getOwnerOf(tokenId)
        const personality = await fewmansContract.getPersonality(tokenId)
        const gen = await breedContract.getGeneration(tokenId)
        console.log(tokenId, personality, gen, owner)
        return decodePersonality(tokenId, personality, owner, gen)
    } catch (e) {
        return {error: e}
    }
}

export async function loadLastGeneratedTokenId(isTestnet) {
    try {
        isTestnet = isTestnet || false
        const {fewmansContract, breedContract} = getFewmansContracts(isTestnet)

        const supply = await fewmansContract.readTotalSupply()
        return parseInt(await fewmansContract.getTokenByIndex(+supply - 1))
    } catch (e) {
        return {error: e}
    }
}

export async function loadFewvulationState(isTestnet) {
    try {
        isTestnet = isTestnet || false
        const {fewmansContract, breedContract} = getFewmansContracts(isTestnet)

        const duration = await breedContract.getFewvulationDuration()
        const nextFewvulation = await breedContract.getNextFewvulation()

        const now = nowTS()
        let state = 'finished'
        let nextEventTS = nextFewvulation
        if(now < nextFewvulation) {
            state = 'soon'
        } else if(now < nextFewvulation + duration) {
            state = 'active'
            nextEventTS = nextFewvulation + duration
        }

        return {
            duration,
            nextFewvulation,
            state,
            nextEventTS,
        }
    } catch (e) {
        return {error: e}
    }
}

export async function getPendingBreedingTXS(isTestnet) {
    try {
        isTestnet = isTestnet || false

        const web3 = isTestnet ? holder.testWeb3 : holder.web3
        const breedAddress = isTestnet ? Config.FEWMANS_BREED_CONTRACT_TEST : Config.FEWMANS_BREED_CONTRACT
        const pending = await web3.eth.getBlock('pending', true)
        if(!pending.transactions) {
            return {error: 'no TXS loaded'}
        }
        const txs = pending.transactions
        return txs.filter(tx => tx.to === breedAddress)
    } catch (e) {
        return {error: e}
    }
}