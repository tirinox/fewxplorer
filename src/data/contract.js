import {decodePersonality} from "./personality";

export const FEWMANS_CONTRACT = '0xad5f6cdda157694439ef9f6dd409424321c74628'
export const FEWMANS_BREED_CONTRACT = '0x7977eb2Ba4bE7CC4Bb747baF2eE9177CAdc96a02'
export const FEWMANS_CONTRACT_TEST = '0xB1E8EBA3613e0195eAA96792c5fc545Cb7f7EFF6'
export const FEWMANS_BREED_CONTRACT_TEST = '0x0FC0C72F5b3378c07789f0aa9B738d6171881c81'
import Web3 from 'web3/dist/web3.min.js'

import TestBreedABI from './breeding.test.abi.json'
import TestFewmanABI from './fewman.test.abi.json'
import LiveBreedABI from './breeding.abi.json'
import LiveFewmanABI from './fewman.abi.json'
import {nowTS} from "../helpers/util";


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
        contract = contract || FEWMANS_CONTRACT_TEST
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
        contract = contract || FEWMANS_BREED_CONTRACT_TEST
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
        return +(await this.contract.methods.fewvulationDuration(tokenId).call())
    }

    async getNextFewvulation() {
        return +(await this.contract.methods.nextFewvulation(tokenId).call())
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

    holder.test.fewmansContract = new FewmanContract(holder.testWeb3, FEWMANS_CONTRACT_TEST, TestFewmanABI)
    holder.test.breedContract = new FewmanBreedContract(holder.testWeb3, FEWMANS_BREED_CONTRACT_TEST, TestBreedABI)

    holder.live.fewmansContract = new FewmanContract(holder.web3, FEWMANS_CONTRACT, LiveFewmanABI)
    holder.live.breedContract = new FewmanBreedContract(holder.web3, FEWMANS_BREED_CONTRACT, LiveBreedABI)

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
        return await fewmansContract.getTokenByIndex(+supply - 1)
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
        let secondsToNextEvent = 0
        if(now < nextFewvulation) {
            state = 'soon'
            secondsToNextEvent = nextFewvulation - now
        } else if(now < nextFewvulation + duration) {
            state = 'active'
            secondsToNextEvent = nextFewvulation + duration - now
        }

        return {
            duration,
            nextFewvulation,
            state,
            secondsToNextEvent,
        }
    } catch (e) {
        return {error: e}
    }
}
