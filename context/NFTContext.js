import React, { useState, useEffect } from 'react';
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';
import axios from 'axios';

import { MarketAddress, MarketAddressABI } from './constants';

let JWT;
const fetchJWT = async () => {
    try {
        const response = await fetch('/api/get-jwt');
        const data = await response.json();
        JWT = data.JWT;
    } catch (error) {
        console.error('Failed to get JWT:', error);
    }
};

const fetchContract = (signerOrProvider) => new ethers.Contract(MarketAddress, MarketAddressABI, signerOrProvider);
export const NFTContext = React.createContext();

export const NFTProvider = ({ children }) => {
    const [currentAccount, setCurrentAccount] = useState('');
    const nftCurrency = 'ETH';

    const checkIfWalletIsConnected = async () => {
        if (!window.ethereum) return alert("please install MetaMask");

        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length) {
            setCurrentAccount(accounts[0]);
        } else {
            console.log("No accounts found.");
        }
    }

    useEffect(() => {
        checkIfWalletIsConnected();
        fetchJWT();
    }, []);

    const connectWallet = async () => {
        if (!window.ethereum) return alert("please install MetaMask");

        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setCurrentAccount(accounts[0]);

        window.location.reload();
    }

    const uploadToIPFS = async (file) => {
        console.log(file);
        if (file) {
            try {
                const formData = new FormData();
                formData.append("file", file);
        
                const response = await axios({
                    method: "post",
                    url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
                    data: formData,
                    headers: {
                    "Authorization": `Bearer ${JWT}`,
                    "Content-Type": "multipart/form-data",
                    },
                });
                const ImgHash = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
                return ImgHash;
            } catch (error) {
              console.log("Unable to upload image to Pinata");
            }
        }
    }

    const createNFT = async (formInput, fileUrl, router) => {
        const { name, description, price } = formInput;

        if (!name || !description || !price || !fileUrl) {
            return;
        }

        try {
            // create NFT
            const searchParams = new URLSearchParams(formInput).toString();
            fileUrl += "?" + searchParams + "&image=" + fileUrl;
            await createSale(fileUrl, price);

            router.push('/');
        } catch (error) {
            console.log(error);
        }
    }

    const createSale = async (url, formInputPrice, isReselling, id) => {
        try {
            const web3Modal = new Web3Modal();
            const connection = await web3Modal.connect();
            const provider = new ethers.providers.Web3Provider(connection);
            const signer = provider.getSigner();

            const price = ethers.utils.parseUnits(formInputPrice, 'ether');
            const contract = fetchContract(signer);
            const listingPrice = await contract.getListingPrice();

            const transaction = !isReselling 
                ? await contract.createToken(url, price, { value: listingPrice.toString() })
                : await contract.resellToken(id, price, { value: listingPrice.toString() })

            await transaction.wait();
            console.log(contract);
        } catch (error) {
            console.info(error);
        }
    }

    const fetchNFTs = async () => {
        const provider = new ethers.providers.JsonRpcProvider();
        const contract = fetchContract(provider);

        const data = await contract.fetchMarketItems();
        
        const items = await Promise.all(data.map(async ({ tokenId, seller, owner, price: unformattedPrice }) => {
            const tokenURI = await contract.tokenURI(tokenId);
            
            const url = new URL(tokenURI);
            const searchParams = new URLSearchParams(url.search);
            const price = ethers.utils.formatUnits(unformattedPrice.toString(), 'ether');
            
            return {
                price,
                tokenId: tokenId.toNumber(),
                seller,
                owner,
                image: url.origin + url.pathname,
                name: searchParams.get('name'), 
                description: searchParams.get('description'),
                tokenURI
            };
        }));

        return items;
    }

    const fetchMyNFTsOrListedNFTs = async (type) => {
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();

        const contract = fetchContract(signer);

        const data = type === 'fetchItemsListed' 
            ? await contract.fetchItemsListed() 
            : await contract.fetchMyItems();

        const items = await Promise.all(data.map(async ({ tokenId, seller, owner, price: unformattedPrice }) => {
            const tokenURI = await contract.tokenURI(tokenId);
            
            const url = new URL(tokenURI);
            const searchParams = new URLSearchParams(url.search);
            const price = ethers.utils.formatUnits(unformattedPrice.toString(), 'ether');
            
            return {
                price,
                tokenId: tokenId.toNumber(),
                seller,
                owner,
                image: url.origin + url.pathname,
                name: searchParams.get('name'), 
                description: searchParams.get('description'),
                tokenURI
            };
        }));

        return items;
    }

    const buyNFT = async (nft) => {
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();
        const contract = fetchContract(signer);
        
        const price = ethers.utils.parseUnits(nft.price.toString(), 'ether');
        const transaction = await contract.createMarketSale(nft.tokenId, { value: price });
        await transaction.wait();

    }
    
    return (
        <NFTContext.Provider value={{ 
            nftCurrency, 
            connectWallet, 
            currentAccount, 
            uploadToIPFS, 
            createNFT,
            fetchNFTs,
            fetchMyNFTsOrListedNFTs,
            buyNFT,
            createSale }}>
            {children}
        </NFTContext.Provider>
    )
}