export const FEWMANS_CONTRACT = '0xad5f6cdda157694439ef9f6dd409424321c74628'
export const FEWMANS_BREED_CONTRACT = '0x7977eb2Ba4bE7CC4Bb747baF2eE9177CAdc96a02'
export const FEWMANS_CONTRACT_TEST = '0xB1E8EBA3613e0195eAA96792c5fc545Cb7f7EFF6'
export const FEWMANS_BREED_CONTRACT_TEST = '0x0FC0C72F5b3378c07789f0aa9B738d6171881c81'
import Web3 from 'web3/dist/web3.min.js'

import TestBreedABI from './breeding.test.abi.json'
import TestFewmanABI from './fewman.test.abi.json'


export function getInfuraWeb3(projectToken) {
    return new Web3(`https://ropsten.infura.io/v3/${projectToken}`)
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
}

const defaultWeb3 = getInfuraWeb3('')
const holder = {
    web3: defaultWeb3,
    fewmansTestContract: new FewmanContract(defaultWeb3),
    fewmansBreedTestContract: new FewmanBreedContract(defaultWeb3)
}

export function setupInfura(projectId) {
    holder.web3 = getInfuraWeb3(projectId)
    holder.fewmansTestContract = new FewmanContract(holder.web3)
    holder.fewmansBreedTestContract = new FewmanBreedContract(holder.web3)
    return holder
}

export function fewmansTestContract() {
    return holder.fewmansTestContract
}

export function fewmansBreedTestContract() {
    return holder.fewmansBreedTestContract
}

