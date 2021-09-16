// import * as Web3 from 'web3'
// import { OpenSeaPort, Network } from 'opensea-js'

export const FEWMANS_CONTRACT = '0xad5f6cdda157694439ef9f6dd409424321c74628'
//
// // This example provider won't let you make transactions, only read-only calls:
// const provider = new Web3.providers.HttpProvider('https://mainnet.infura.io')
//
// export const seaport = new OpenSeaPort(provider, {
//     networkName: Network.Main
// })
//
// async function a_test() {
//     const asset = {
//         tokenAddress: FEWMANS_CONTRACT,
//         tokenId: "1", // Token ID
//     }
//
//     const balance = await seaport.getAssetBalance({
//         accountAddress, // string
//         asset, // Asset
//     })
//
//     seaport
// }
//
// export function test() {
//     a_test().then(console.info)
// }