// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";


contract Valinity is Ownable, ERC721Enumerable{
  using Strings for uint256;
  using Counters for Counters.Counter;

  Counters.Counter private _tokenIds;

  string public baseTokenURI;
  uint256 public maxSupply = 400;
  uint256 public cost = 0 ether;
  uint256 public maxMintAmount = 10;
  uint256 public nftPerAddressLimit = 1;
  bool public paused = false;
  mapping(address => uint256) public addressMintedBalance;
  mapping(address => bool) public airdropList;

  constructor(
    string memory _name,
    string memory _symbol,
    string memory _initBaseURI
  ) ERC721(_name, _symbol) {
    setBaseURI(_initBaseURI);
  }

  //  function baseURI() internal view virtual override returns (string memory) {
  //   return baseTokenURI;
  //  }

//  modifier onlyOwner()  {
//     require(msg.sender == owner(), "Only the contract owner can perform this action");
//      _;
//     }

    
function mint(uint256 _mintAmount) public payable onlyOwner {
    require(!paused, "the contract is paused");
    uint256 supply = totalSupply();
    require(_mintAmount > 0, "need to mint at least 1 NFT");
    require(supply + _mintAmount <= maxSupply, "max NFT limit exceeded");

    if (msg.sender != owner()) {
      uint256 ownerMintedCount = addressMintedBalance[msg.sender];
    require(ownerMintedCount + _mintAmount <= nftPerAddressLimit, "max NFT per address exceeded");
    require(_mintAmount <= maxMintAmount, "max mint amount per session exceeded");
      if (airdropList[msg.sender]){
        require(_mintAmount <= 1, "max mint amount per session exceeded");
        airdropList[msg.sender] = false;
      }
      else{
        require(msg.value >= cost * _mintAmount, "insufficient funds");
      }
    }

    for (uint256 i = 1; i <= _mintAmount; i++) {
      addressMintedBalance[msg.sender]++;
      _safeMint(msg.sender, supply + i);
    }
  }



  function haveAirdrop(address _user) public view returns (bool) {
    return airdropList[_user];
  }

  function walletOfOwner(address _owner)
  public
  view
  returns (uint256[] memory)
  {
    uint256 ownerTokenCount = balanceOf(_owner);
    uint256[] memory tokenIds = new uint256[](ownerTokenCount);
    for (uint256 i; i < ownerTokenCount; i++) {
      tokenIds[i] = tokenOfOwnerByIndex(_owner, i);
    }
    return tokenIds;
  }

  function tokenURI(uint256 tokenId)
    public
    view
    virtual
    override
    returns (string memory)
    {
    require(
      _exists(tokenId),
      "ERC721Metadata: URI query for nonexistent token"
    );

    string memory currentBaseURI = _baseURI();
    return bytes(currentBaseURI).length > 0
      ? string(abi.encodePacked(currentBaseURI, tokenId.toString()))
      : "";
  }
//only owner

 function transferFrom(address from, address to, uint256 tokenId) public virtual override(ERC721, IERC721) onlyOwner {
        // Bypass any checks, and directly perform the transfer
        _transfer(from, to, tokenId);
    }
  function safeTransferFrom(address from, address to, uint256 tokenId) public virtual override(ERC721, IERC721) {
    revert("Transfers are not allowed.");
}

  function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory _data) public virtual override(ERC721, IERC721) {
    revert("Transfers are not allowed.");
}

  function approve(address to, uint256 tokenId) public virtual override(ERC721, IERC721) {
    revert("Transfers are not allowed.");
} 

  function setNftPerAddressLimit(uint256 _limit) public onlyOwner {
    nftPerAddressLimit = _limit;
  }

  function setmaxSupply(uint256 _newmaxSupply) public onlyOwner {
    maxSupply = _newmaxSupply;
  }

  function setBaseURI(string memory _newBaseURI) public onlyOwner {
    baseTokenURI = _newBaseURI;
  }

  function pause(bool _state) public onlyOwner {
    paused = _state;
  }

  function airdrop(address[] calldata _users) public onlyOwner {
    for (uint i = 0; i < _users.length; i++) {
        airdropList[_users[i]] = true;
    }
  }
 
  function unsetAirdrop(address[] calldata _users) public onlyOwner {
    for (uint i = 0; i < _users.length; i++) {
        airdropList[_users[i]] = false;
    }
  }

    // Burn an NFT
    function burn(uint256 _tokenId) public onlyOwner{
        _burn(_tokenId);
    }
}
