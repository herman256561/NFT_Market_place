pragma solidity ^0.8.0;

//import openzeppelin erc1155
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC1155/ERC1155.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";


contract NFTContract is ERC1155, Ownable{
    uint256 public constant ARTWORK=0;
    uint256 public constant PHOTO=1;
    uint256 public constant PHOTO2=2;

    //to store the NFT data
    struct NFTitem{
        uint256 tokenId;
        address seller;
        bool buyable;
    }

    //NFT array
    NFTitem[] public itemsForSell;

    constructor() ERC1155("https://lhcutp47xmyd.usemoralis.com/{id}.json"){
        _mint(msg.sender, ARTWORK, 1, "");
        _mint(msg.sender, PHOTO, 1, "");
        _mint(msg.sender, PHOTO2, 1, "");

        itemsForSell.push(NFTitem(0, msg.sender, true));
        itemsForSell.push(NFTitem(1, msg.sender, true));
        itemsForSell.push(NFTitem(2, msg.sender, true));
    } 

    function getOwner(uint256 j) public view returns (address){
        return itemsForSell[j].seller;
    }


    function mint(address account, uint256 id, uint256 amount) public onlyOwner{
        _mint(account, id, amount, "");
    }

    function burn(address account, uint256 id, uint256 amount) public {
        require(msg.sender==account);
        _burn(account, id, amount);
    }

    function MysafeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes memory data) public {
        require(itemsForSell[id].buyable==true);
        _safeTransferFrom(from, to, id, amount, data);
        itemsForSell[id].seller=to;
        itemsForSell[id].buyable=false;
    }

    function sellable(uint256 id) public view returns (bool){
        return itemsForSell[id].buyable;
    }

    function changeToSell(uint256 id) public {
        require(getOwner(id)==msg.sender);
        require(itemsForSell[id].buyable==false);
        itemsForSell[id].buyable=true;
    }


}

//transaction hash: 0x3ec01bb8a0169dac36d2e131588a4b41020d40a0e4a43c23e171958884eda439
//contract address: 0x0191091F01E291C4DD27F1e3c8fB55dD4A63d135
//To see my contract on OpenseaTestnet: opensea.io/get-listed/

//wallets
//test1: 0x5454106B6aFD7b34ad9dd4c845D7C2Cb518E8e87
//test2: 0x693d55F1587CADeB4dEe8F170ca89B1B1691b3F3

//-----new deploy contract
// 0x29f9ee324bb9466eee199d36de39ffb077c431b5
//0xcebafaf03f9df763170ecc8e59d637ba6742aad9