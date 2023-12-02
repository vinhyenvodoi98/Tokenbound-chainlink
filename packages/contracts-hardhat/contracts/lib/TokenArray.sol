// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract TokenArray {
    address[] public tokenArray;

    // Add an address to the array
    function addToken(address _token) public {
        tokenArray.push(_token);
    }

    // Remove an address from the array
    function removeAddress(address _token) public {
        for (uint i = 0; i < tokenArray.length; i++) {
            if (tokenArray[i] == _token) {
                // Move the last element to the position to be removed
                tokenArray[i] = tokenArray[tokenArray.length - 1];
                // Remove the last element
                tokenArray.pop();
                // Exit the loop after removing the element
                break;
            }
        }
    }

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