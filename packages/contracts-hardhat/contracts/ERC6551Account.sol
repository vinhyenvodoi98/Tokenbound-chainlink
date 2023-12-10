// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/interfaces/IERC1271.sol";
import "@openzeppelin/contracts/utils/cryptography/SignatureChecker.sol";

import "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";
import "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import "./interfaces/IERC6551Account.sol";

import {CCIPReceiver} from "@chainlink/contracts-ccip/src/v0.8/ccip/applications/CCIPReceiver.sol";
import {IRouterClient} from "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import {IAny2EVMMessageReceiver} from "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IAny2EVMMessageReceiver.sol";

import "./lib/ERC6551AccountLib.sol";
import "./lib/TokenArray.sol";

contract ERC6551Account is IERC1271, CCIPReceiver, IERC6551Account, TokenArray {
    uint256 public nonce;

    // crosschain
    address public sourceAddress;
    address public desAddress;

    constructor() CCIPReceiver(0x554472a2720E5E7D5D3C817529aBA05EEd5F82D8) {} // fuji router

    receive() external payable {}

    event CreateAccountCallSuccessfull();
    event MessageSent(bytes32 messageId);

    function setSourceAddress(address _sourceAddress) external {
        require(nonce == 0, "need to set in first transaction");
        sourceAddress = _sourceAddress;
        ++nonce;
    }

    function setDesAddress(address _desAddress) external {
        require(nonce == 0, "need to set in first transaction");
        desAddress = _desAddress;
        ++nonce;
    }

    function executeCall(
        address to,
        uint256 value,
        uint256 chainId,
        bytes calldata data
    ) external payable returns (bytes memory result) {
        require(msg.sender == owner() || msg.sender == address(this), "Not token owner"); // TODO need to fix require

        ++nonce;

        if ( block.chainid != chainId ) {
            bytes32 messageId;

            Client.EVM2AnyMessage memory message = Client.EVM2AnyMessage({
                receiver: abi.encode(desAddress),
                data: abi.encodeWithSignature("executeCall(address,uint256,uint256,bytes)", to, value, chainId, data),
                tokenAmounts: new Client.EVMTokenAmount[](0),
                extraArgs: "",
                feeToken: address(0)
            });

            uint64 _destinationChainSelector = 14767482510784806043; // fuji

            // uint256 fee = IRouterClient(CCIPRouteAddress).getFee(
            //     _destinationChainSelector,
            //     message
            // );

            messageId = IRouterClient(0xD0daae2231E9CB96b94C8512223533293C3693Bf).ccipSend{value: msg.value}( //sepolia
                _destinationChainSelector,
                message
            );

            emit MessageSent(messageId);

            return abi.encodePacked(messageId);
        } else {
            emit TransactionExecuted(to, value, data);

            bool success;
            (success, result) = to.call{value: value}(data);

            if (!success) {
                assembly {
                    revert(add(result, 32), mload(result))
                }
            }
        }
    }

    function token()
        external
        view
        returns (
            uint256,
            address,
            uint256
        )
    {
        return ERC6551AccountLib.token();
    }

    function owner() public view returns (address) {
        (, address tokenContract, uint256 tokenId) = this.token();
        // if (chainId != block.chainid) return address(0);

        return IERC721(tokenContract).ownerOf(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public pure virtual override returns (bool) {
        return (interfaceId == type(IERC165).interfaceId ||
            interfaceId == type(IERC6551Account).interfaceId ||
            interfaceId == type(IAny2EVMMessageReceiver).interfaceId);
    }

    function isValidSignature(bytes32 hash, bytes memory signature)
        external
        view
        returns (bytes4 magicValue)
    {
        bool isValid = SignatureChecker.isValidSignatureNow(owner(), hash, signature);

        if (isValid) {
            return IERC1271.isValidSignature.selector;
        }

        return "";
    }

    // Add an address to the array
    function addToken(address _token, address _dataFeed) public {
        require(msg.sender == owner(), "Not token owner");
        tokenArray.push(_token);
        dataFeedAddress[_token] = _dataFeed;
    }

    // Remove an address from the array
    function removeAddress(address _token) public {
        require(msg.sender == owner(), "Not token owner");
        dataFeedAddress[_token] = address(0);
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

    function caculateFee(
        uint64 destinationChainSelector,
        address routeAddress,
        address to,
        uint256 value,
        uint256 chainId,
        bytes calldata data
    ) external view returns(uint256) {
        Client.EVM2AnyMessage memory message = Client.EVM2AnyMessage({
            receiver: abi.encode(desAddress),
            data: abi.encodeWithSignature("executeCall(address,uint256,uint256,bytes)", to, value, chainId, data),
            tokenAmounts: new Client.EVMTokenAmount[](0),
            extraArgs: "",
            feeToken: address(0)
        });

        uint256 fee = IRouterClient(routeAddress).getFee(
            destinationChainSelector,
            message
        );

        return fee;
    }

    function _ccipReceive(
        Client.Any2EVMMessage memory message
    ) internal override {
        // address sender = abi.decode(message.sender, (address));
        // require(sender == sourceAddress, "Only allow owner");

        (bool success, ) = address(this).call(message.data);
        require(success);
        emit CreateAccountCallSuccessfull();
    }
}
