//in node js
//require()

//in front-end jsyou can not use require
//import
import { ethers } from "./ethers-5.6.esm.min.js"
import { abi, contractadress } from "./consts.js"
const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("fundButton")
const balancebtn = document.getElementById("getbalance")
const withdrawbtn = document.getElementById("withdrawButton")
balancebtn.onclick = getBalance
connectButton.onclick = connect
fundButton.onclick = fund
withdrawbtn.onclick = withdraw

async function connect() {
    if (window.ethereum !== "undefined") {
        window.ethereum.request({ method: "eth_requestAccounts" })
        console.log("Conected!")
        connectButton.innerHTML = "Conected!"
    } else {
        connectButton.innerHTML = "Install Metamask"
    }
}
//fund function
async function fund() {
    const amountfund = document.getElementById("ethamount").value
    console.log(`Funding with ${amountfund}...`)
    if (window.ethereum !== "undefined") {
        //provider/connection to the blockchain
        //signer/ wallet/ someone with some gas
        //contract that we are interacting with
        //ABI
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractadress, abi, signer)
        try {
            const transactionResponse = await contract.fund({
                value: ethers.utils.parseEther(amountfund),
            })
            //lstned for th to be mined
            //wait for this tx to finish
            await listenForTransactionMine(transactionResponse, provider)
            console.log("Done")
        } catch (error) {
            console.log(error)
        }
    } else {
    }
}

function listenForTransactionMine(transactionResponse, provider) {
    console.log(`Mining ${transactionResponse.hash}...`)
    //listen for this transaction to finish
    return new Promise((resolve, reject) => {
        provider.once(transactionResponse.hash, (transactionReceipt) => {
            console.log(
                `Completed with ${transactionReceipt.confirmations} confirmations`
            )
            resolve()
        })
    })
}
async function getBalance() {
    if (window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const balance = await provider.getBalance(contractadress)
        console.log(ethers.utils.formatEther(balance))
    }
}
//withdraw
async function withdraw() {
    if (window.ethereum !== "undefined") {
        console.log("Withdarwing...")
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractadress, abi, signer)
        try {
            const transactionResponse = await contract.withdraw()
            await listenForTransactionMine(transactionResponse, provider)
        } catch (error) {
            console.log(error)
        }
    }
}
