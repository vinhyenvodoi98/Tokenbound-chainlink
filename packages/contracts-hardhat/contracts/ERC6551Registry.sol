// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/Create2.sol";
import "./interfaces/IERC6551Registry.sol";
import {CCIPConfig} from "./crosschain/CCIPConfig.sol";

import {CCIPReceiver} from "@chainlink/contracts-ccip/src/v0.8/ccip/applications/CCIPReceiver.sol";
import {IRouterClient} from "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";

contract ERC6551Registry is IERC6551Registry, CCIPReceiver, CCIPConfig {
    error InitializationFailed();

    event MessageSent(bytes32 messageId);
    event CreateAccountCallSuccessfull();

    constructor(address router) CCIPReceiver(router) {
        CCIPRouteAddress = router;
    }

    function createAccount(
        address implementation,
        uint256 chainId,
        address tokenContract,
        uint256 tokenId,
        uint256 salt,
        bytes calldata initData
    ) external payable returns (address) {
        bytes memory code = _creationCode(implementation, chainId, tokenContract, tokenId, salt);

        address _account = Create2.computeAddress(
            bytes32(salt),
            keccak256(code)
        );

        if (_account.code.length != 0) return _account;

        _account = Create2.deploy(0, bytes32(salt), code);

        if ( block.chainid != chainId ) {
            bytes32 messageId;

            bytes memory _initData = abi.encodeWithSignature("setSourceAddress(address)",_account);

            Client.EVM2AnyMessage memory message = Client.EVM2AnyMessage({
                receiver: abi.encode(ERC6551RegistryAddress[chainId]),
                data: abi.encodeWithSignature("createAccount(address,uint256,address,uint256,uint256,bytes)", ERC6551AccountAddress[chainId], chainId, tokenContract, tokenId, salt, _initData),
                tokenAmounts: new Client.EVMTokenAmount[](0),
                extraArgs: "",
                feeToken: address(0)
            });

            uint64 _destinationChainSelector = destinationChainSelector[chainId];

            // uint256 fee = IRouterClient(CCIPRouteAddress).getFee(
            //     _destinationChainSelector,
            //     message
            // );

            messageId = IRouterClient(CCIPRouteAddress).ccipSend{value: msg.value}(
                _destinationChainSelector,
                message
            );

            emit MessageSent(messageId);
        } else {
            if (initData.length != 0) {
                (bool success, ) = _account.call(initData);
                if (!success) revert InitializationFailed();
            }

            emit AccountCreated(
                _account,
                implementation,
                chainId,
                tokenContract,
                tokenId,
                salt
            );
        }
        return _account;
    }

    function account(
        address implementation,
        uint256 chainId,
        address tokenContract,
        uint256 tokenId,
        uint256 salt
    ) external view returns (address) {
        bytes32 bytecodeHash = keccak256(
            _creationCode(implementation, chainId, tokenContract, tokenId, salt)
        );

        return Create2.computeAddress(bytes32(salt), bytecodeHash);
    }

    function caculateFee(
        uint256 chainId,
        address tokenContract,
        uint256 tokenId,
        uint256 salt,
        bytes calldata initData
    ) external view returns(uint256) {
        uint64 _destinationChainSelector = destinationChainSelector[chainId];

        Client.EVM2AnyMessage memory message = Client.EVM2AnyMessage({
            receiver: abi.encode(ERC6551RegistryAddress[chainId]),
            data: abi.encodeWithSignature("createAccount(address,uint256,address,uint256,uint256,bytes)", ERC6551AccountAddress[chainId], chainId, tokenContract, tokenId, salt, initData),
            tokenAmounts: new Client.EVMTokenAmount[](0),
            extraArgs: "",
            feeToken: address(0)
        });

        uint256 fee = IRouterClient(CCIPRouteAddress).getFee(
            _destinationChainSelector,
            message
        );

        return fee;
    }

    function _creationCode(
        address implementation_,
        uint256 chainId_,
        address tokenContract_,
        uint256 tokenId_,
        uint256 salt_
    ) internal pure returns (bytes memory) {
        return
            abi.encodePacked(
                hex"3d60ad80600a3d3981f3363d3d373d3d3d363d73",
                implementation_,
                hex"5af43d82803e903d91602b57fd5bf3",
                abi.encode(salt_, chainId_, tokenContract_, tokenId_)
            );
    }

    function _ccipReceive(
        Client.Any2EVMMessage memory message
    ) internal override {
        (bool success, ) = address(this).call(message.data);
        require(success);
        emit CreateAccountCallSuccessfull();
    }
}
