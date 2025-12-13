// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ProjectVault is ERC721URIStorage, Ownable {
    uint256 private _tokenIds;

    mapping(bytes32 => uint256) public hashToTokenId;

    mapping(uint256 => bytes32) public tokenIdToHash;

    mapping(uint256 => uint256) public tokenIdToTimestamp;

    
    event ProofMinted(
        uint256 indexed tokenId,
        address indexed owner,
        bytes32 indexed fileHash,
        string metadataURI,
        uint256 timestamp
    );

    
    constructor() ERC721("Project Vault Proof", "PVPROOF") Ownable(msg.sender) {}

    
    function mintProof(
        address to,
        bytes32 fileHash,
        string memory metadataURI
    ) public onlyOwner returns (uint256) {
        require(to != address(0), "ProjectVault: cannot mint to zero address");
        require(hashToTokenId[fileHash] == 0, "ProjectVault: hash already exists");

        _tokenIds += 1;
        uint256 newTokenId = _tokenIds;

        hashToTokenId[fileHash] = newTokenId;
        tokenIdToHash[newTokenId] = fileHash;
        tokenIdToTimestamp[newTokenId] = block.timestamp;

        _safeMint(to, newTokenId);
        _setTokenURI(newTokenId, metadataURI);

        emit ProofMinted(newTokenId, to, fileHash, metadataURI, block.timestamp);

        return newTokenId;
    }

    
    function verifyHash(
        bytes32 fileHash
    )
        public
        view
        returns (bool exists, uint256 tokenId, address owner, string memory metadataURI)
    {
        tokenId = hashToTokenId[fileHash];
        exists = tokenId != 0 && tokenId <= _tokenIds;

        if (exists) {
            owner = ownerOf(tokenId);
            metadataURI = tokenURI(tokenId);
        } else {
            owner = address(0);
            metadataURI = "";
        }
    }

    
    function totalSupply() public view returns (uint256) {
        return _tokenIds;
    }

    
    function getHashByTokenId(uint256 tokenId) public view returns (bytes32) {
        require(_ownerOf(tokenId) != address(0), "ProjectVault: token does not exist");
        return tokenIdToHash[tokenId];
    }

    function getMintTimestamp(uint256 tokenId) public view returns (uint256) {
        require(_ownerOf(tokenId) != address(0), "ProjectVault: token does not exist");
        return tokenIdToTimestamp[tokenId];
    }
}

