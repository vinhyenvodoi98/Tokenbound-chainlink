// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {Withdraw} from "./Withdraw.sol";
import {IERC20} from "@chainlink/contracts-ccip/src/v0.8/vendor/openzeppelin-solidity/v4.8.0/token/ERC20/IERC20.sol";

contract CCIPConfig is Withdraw {
    mapping(uint256 => address) public ERC6551RegistryAddress;
    mapping(uint256 => address) public ERC6551AccountAddress;

    address public CCIPRouteAddress;
    mapping(uint256 => uint64) public destinationChainSelector;

    function addCCIPAddress(uint256 _chain, address _ERC6551Registry, address _ERC6551Account, uint64 _destinationChainSelector) public onlyOwner {
        ERC6551RegistryAddress[_chain] = _ERC6551Registry;
        ERC6551AccountAddress[_chain] = _ERC6551Account;

        destinationChainSelector[_chain]=_destinationChainSelector;
    }
}
