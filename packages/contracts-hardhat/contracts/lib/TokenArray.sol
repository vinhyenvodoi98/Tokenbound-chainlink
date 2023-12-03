// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import './DataConsumer.sol';

contract TokenArray is DataConsumer {
    address[] public tokenArray;

    // Get the length of the array
    function getTokenArrayLength() public view returns (uint) {
        return tokenArray.length;
    }

    // Access an address at a specific index
    function getTokenAtIndex(uint index) public view returns (address) {
        require(index < tokenArray.length, "Index out of bounds");
        return tokenArray[index];
    }

    function getAllToken() public view returns (address[] memory) {
        return tokenArray;
    }
}