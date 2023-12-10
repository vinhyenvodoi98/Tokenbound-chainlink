## Inspiration
Chainlink has an ecosystem of services with many interesting functions, the most impressive of which is ccip. I find extending the eip6551 standard crosschain with ccip to be a great idea. It will help us create an account at Avalance Fuji from an NFT owned by an account in Sepolia and have full rights to interact with that account. 

## What it does
- implement erc6551 contract
- create cross-chain tokenbound account between sepolia and fuji network by CCIP
- get price of token by chainlink feeds
- show ens avatar, name
- create new subnames

## How we built it
I use nextjs for frontend programming and hardhat for smartcontract programming

My application has extended the eip6551 standard with features to get current token price using chainlink data feeds and create crosschain account using chainlink ccip.

To be able to integrate ccip, I override the createAccount function in the Registry contract ( eip 6551 ). For example, when a user requests to create an account on the fuji network from nft on sepolia, they will call the createAccount function in the contract Registry on sepolia. Then create an Account on sepolia with initdata as the account destination address on Fuji. Then a request will be sent to the contract Registry on Fuji to create an account through CCIP

Similar to above, when users want to interact with the crosschain tokenbound account, they will interact with the account in the current chain and the request will be sent to the destination address using CCIP. For example, my account was created on fuji network from nft on sepolia, then when I want to send a transaction on fuji account, I will need to call it through the tract account on sepolia.

I also integrated ens so I can remember addresses more easily. In addition, I integrate the addition of subnames for managed tokenbounds, so that it is easy to remember the created tokenbounds.

## Challenges we ran into
- Improve cross-chain flow of eip6551 with chainlink ccip

## What we learned
I learned about
- how erc6551 works and improve it with chainlink services
- how to use chainlink service ( chainlink data feeds, chainlink ccip )
- how to use ensjs to show and set subnames for account

## What's next for Tokenbound-chainlink
- I want to improve the security aspect to make the dataflow more stable
- Integrate chainlink automation with automatic selling and buying feature according to orderbook

