
Moralis.start({ serverUrl: "https://u8oeui2ow1gv.usemoralis.com:2053/server", appId: "atphTdiuUd2EmqyjU1mfRWIaZf5maSRsUZaOAyvg" });
//new version of Moralis start and initialize
//Application ID from Moralis server
//Server URL from Moralis server url


const ethers = Moralis.web3Library;


function fetchNFTMetadata(NFTs) {
    let promises = [];
    for (let i = 0; i < NFTs.length; i++) {
        let nft = NFTs[i];
        let id = nft.token_id;

        //Call moralis cloud function -> static json file
        promises.push(fetch("https://u8oeui2ow1gv.usemoralis.com:2053/server/functions/getNFT?_ApplicationId=atphTdiuUd2EmqyjU1mfRWIaZf5maSRsUZaOAyvg&nftId=" + id)
            .then(res => res.json())
            .then(res => JSON.parse(res.result))
            .then(res => { nft.metadata = res })
            .then(() => { return nft; }))

        //The flow of the code below exceeds the service plan of my Moralis server.
        // .then(res => {
        //     const option = { address: CONTRACT_ADDRESS, token_id: id, chain: "rinkeby" };
        //     return Moralis.Web3API.token.getTokenIdOwners(option)
        // })
        // .then((res) => {
        //     nft.owners = [];
        //     res.result.forEach(element => {
        //         nft.owners.push(element.ownerOf);
        //     });
        //     return nft;
        // }))

    }

    return Promise.all(promises);
}

async function renderInventory(NFTs) {


    await Moralis.enableWeb3();
    accounts = await Moralis.account;

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(ADDRESS, contractAbi, signer);

    //console.log(tx);

    const parent = document.getElementById("app");
    for (let i = 0; i < NFTs.length; i++) {
        const nft = NFTs[i];
        const tx = await contract.balanceOf(accounts, nft.token_id);

        let htmlString = `
        <div class="card">
        <img class="card-img-top" src="${nft.metadata.image}" alt="Card image cap">
            <div class="card-body">
            <h5 class="card-title">${nft.metadata.name}</h5>
                <p class="card-text">> ${nft.metadata.description}</p>
                <p class="card-text">> Own: ${tx}</p>
                <!--<a href="./mint.html?nftId=${nft.token_id}" class="btn">Mint</a>-->
                <a href="./transfer.html?nftId=${nft.token_id}" class="btn">Transfer</a>
                <a href="./sell.html?nftId=${nft.token_id}" id="sellBtn" class="btn">Sell</a>
            </div>
        </div>
        `

        if (tx >= 1) {
            let col = document.createElement("div");
            col.className = "col col-md-4";
            col.innerHTML = htmlString;
            parent.appendChild(col);
        }

    }
}


async function initializeApp() {
    let currentUser = Moralis.User.current();
    //check if the user have signed in
    if (!currentUser) {
        currentUser = await Moralis.Web3.authenticate();
    }

    await Moralis.enableWeb3();
    accounts = await Moralis.account;

    // const options = { chain: 'rinkeby', address: accounts };
    // const NFTs = await Moralis.Web3API.account.getNFTs(options);

    const options = { address: ADDRESS, chain: "rinkeby" };
    let NFTs = await Moralis.Web3API.token.getAllTokenIds(options);
    let NFTWithMetadata = await fetchNFTMetadata(NFTs.result);
    renderInventory(NFTWithMetadata);
}

initializeApp();