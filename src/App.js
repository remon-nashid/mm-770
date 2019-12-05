import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { abi } from './Counter.json'

function App() {
  const [web3, setWeb3] = useState(null);

  useEffect(() => {
    console.log(window.ethereum)

    async function initWeb3() {
      let web3
      if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        try { 
          await window.ethereum.enable()
        } catch(e) {
          console.error('User has denied account access to DApp...')
        }
      }
      else if (window.web3) {
        web3 = new Web3(web3.currentProvider);
      }
      else {
        console.error('You have to install MetaMask !');
      }
      setWeb3(web3)
    }

    if (!web3) {
      initWeb3();
    }
  }, [web3]);

  useEffect(() => {
    async function sendTx() {
      const account = (await web3.eth.getAccounts())[0]
      const contract = new web3.eth.Contract(abi, '0x6b691719F721F514794e1cD4e7a811BE1846ad2B')
      console.log('Current count:', await contract.methods.count().call())
      contract.methods.increment().send({from: account})
        .on('error', console.error)
        .on('transactionHash', (txHash) => console.log('txHash', txHash))
        .on('receipt', (receipt) => console.log('receipt', receipt))
        .on('confirmation', (confirmation) => console.log('confirmation', confirmation))
    }
    if (web3) {
      sendTx()
    }
  }, [web3])

  return (
    <div>content</div>
  );
}

export default App;