

Moralis.start({ serverUrl: "https://u8oeui2ow1gv.usemoralis.com:2053/server", appId: "atphTdiuUd2EmqyjU1mfRWIaZf5maSRsUZaOAyvg" });



const ethers = Moralis.web3Library;
let accounts;


async function init() {
    let currentUser = Moralis.User.current();
    //check if the user have signed in
    if (!currentUser) {
        window.location.pathname = "/nft_dashboard/index.html";
    }

    await Moralis.enableWeb3();

    //get the current connected wallet address
    accounts = await Moralis.account;
    console.log(accounts);

    const urlParams = new URLSearchParams(window.location.search);
    const nftId = urlParams.get("nftId");
    console.log(nftId);
    document.getElementById("token_id_input").value = nftId;
    document.getElementById("address_input").value = accounts;
}

async function mint() {

    //connect to MetaMask
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();

    let tokenId = parseInt(document.getElementById("token_id_input").value);
    let address = document.getElementById("address_input").value;
    let amount = parseInt(document.getElementById("amount_input").value);
    const contract = new ethers.Contract(ADDRESS, contractAbi, signer);
    // Seemed send is unnecessary??
    // const tx = await contract.mint(address, tokenId, amount).send({ from: accounts, value: 0 });
    const tx = await contract.mint(address, tokenId, amount);
    await tx.wait();

    //here's a subsitutional approach to call mint function
    /*
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi, provider);
    const contractWithSigner = contract.connect(signer);
    const tx = contractWithSigner.mint(address, tokenId, amount);
    */
}

document.getElementById("submit_mint").onclick = mint;

init();