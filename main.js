
Moralis.start({ serverUrl: "https://u8oeui2ow1gv.usemoralis.com:2053/server", appId: "atphTdiuUd2EmqyjU1mfRWIaZf5maSRsUZaOAyvg" });
//new version of Moralis start and initialize
//Application ID from Moralis server
//Server URL from Moralis server url

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

function renderInventory(NFTs) {
    const parent = document.getElementById("app");
    for (let i = 0; i < NFTs.length; i++) {
        const nft = NFTs[i];
        let htmlString = `
        <div class="card">
        <img class="card-img-top" src="${nft.metadata.image}" alt="Card image cap">
            <div class="card-body">
                <!--<p class="card-text">>${nft.metadata.description}</p>-->
                <h5 class="card-title">> ${nft.metadata.name}</h5>
                <h5 class="card-title">Price: 0.01 ETH</h5>
                <!--<a href="./mint.html?nftId=${nft.token_id}" class="btn btn-primary">Mint</a>-->
                <a href="./detail.html?nftId=${nft.token_id}" class="btn">Detail</a>
            </div>
        </div>
        `
        let col = document.createElement("div");
        col.className = "col col-md-4";
        col.innerHTML = htmlString;
        parent.appendChild(col);
    }
}

// Code below allow us to store NFTs into our database. 
/*
function storeNFTs(NFTs) {
    for (let i = 0; i < NFTs.length; i++) {
        const nft = NFTs[i];
        const NFTdb = Moralis.Object.extend("NFTs");
        const nftdb = new NFTdb();

        nftdb.set("name", nft.metadata.name);
        nftdb.set("token_id", nft.token_id);
        nftdb.set("price", 0.1);
        nftdb.set("buyable", true);

        nftdb.save().then(
            (nftdb) => {
                // Execute any logic that should take place after the object is saved.
                console.log("New object created with objectId: " + nftdb.id);
            },
            (error) => {
                // Execute any logic that should take place if the save fails.
                // error is a Moralis.Error with an error code and message.
                alert("Failed to create new object, with error code: " + error.message);
            }
        );
    }
}*/

async function initializeApp() {

    let currentUser = Moralis.User.current();
    //check if the user have signed in
    if (!currentUser) {
        currentUser = await Moralis.Web3.authenticate();
    }

    // await Moralis.enableWeb3();
    // accounts = await Moralis.account;

    // const options = { chain: 'rinkeby', address: accounts };
    // const NFTs = await Moralis.Web3API.account.getNFTs(options);

    const options = { address: ADDRESS, chain: "rinkeby" };
    let NFTs = await Moralis.Web3API.token.getAllTokenIds(options);
    let NFTWithMetadata = await fetchNFTMetadata(NFTs.result);
    renderInventory(NFTWithMetadata);

}



initializeApp();