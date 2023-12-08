SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract SPER is ERC721 {
    uint256 private _nextTokenId;

    constructor()
        ERC721("Scroll Pioneers", "SPER")
    {}

    function _baseURI() internal pure override returns (string memory) {
        return "https://token.artblocks.io/0x8cDBd7010Bd197848e95C1FD7F6E870AaC9b0d3C/";
    }

    function safeMint(address to) public {
        _nextTokenId ++;
        _safeMint(to, _nextTokenId);
    }
}
