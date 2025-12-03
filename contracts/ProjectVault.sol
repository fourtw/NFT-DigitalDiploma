// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ProjectVault
 * @dev ERC721 NFT contract for issuing verifiable diploma proofs on-chain
 * @notice Each token represents a unique diploma with SHA-256 hash verification
 */
contract ProjectVault is ERC721URIStorage, Ownable {
    uint256 private _tokenIds;

    // Mapping from file hash (SHA-256) to token ID
    mapping(bytes32 => uint256) public hashToTokenId;

    // Mapping from token ID to file hash
    mapping(uint256 => bytes32) public tokenIdToHash;

    // Mapping from token ID to mint timestamp
    mapping(uint256 => uint256) public tokenIdToTimestamp;

    /**
     * @dev Emitted when a new proof is minted
     * @param tokenId The unique token ID
     * @param owner The address that owns the token
     * @param fileHash The SHA-256 hash of the diploma file
     * @param metadataURI The IPFS/Arweave URI containing metadata
     * @param timestamp The block timestamp when minted
     */
    event ProofMinted(
        uint256 indexed tokenId,
        address indexed owner,
        bytes32 indexed fileHash,
        string metadataURI,
        uint256 timestamp
    );

    /**
     * @dev Constructor sets the token name and symbol
     */
    constructor() ERC721("Project Vault Proof", "PVPROOF") Ownable(msg.sender) {}

    /**
     * @dev Mints a new diploma proof NFT
     * @param to The address that will own the token
     * @param fileHash The SHA-256 hash of the diploma file (must be unique)
     * @param metadataURI The IPFS/Arweave URI containing diploma metadata
     * @return tokenId The newly minted token ID
     */
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

    /**
     * @dev Verifies if a file hash exists and returns associated token data
     * @param fileHash The SHA-256 hash to verify
     * @return exists True if the hash exists in the contract
     * @return tokenId The token ID associated with the hash (0 if not found)
     * @return owner The current owner of the token (address(0) if not found)
     * @return metadataURI The metadata URI for the token (empty if not found)
     */
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

    /**
     * @dev Returns the total number of tokens minted
     * @return The current token count
     */
    function totalSupply() public view returns (uint256) {
        return _tokenIds;
    }

    /**
     * @dev Returns the hash associated with a token ID
     * @param tokenId The token ID to query
     * @return The file hash for the token
     */
    function getHashByTokenId(uint256 tokenId) public view returns (bytes32) {
        require(_ownerOf(tokenId) != address(0), "ProjectVault: token does not exist");
        return tokenIdToHash[tokenId];
    }

    /**
     * @dev Returns the mint timestamp for a token
     * @param tokenId The token ID to query
     * @return The block timestamp when the token was minted
     */
    function getMintTimestamp(uint256 tokenId) public view returns (uint256) {
        require(_ownerOf(tokenId) != address(0), "ProjectVault: token does not exist");
        return tokenIdToTimestamp[tokenId];
    }
}

