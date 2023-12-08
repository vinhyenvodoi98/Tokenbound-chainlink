export type AddressMap = { [blockchain: string]: string };
export type TokenAmounts = { token: string, amount: string }

export enum PayFeesIn {
    Native,
    LINK
}

export const supportedNetworks = [
    `sepolia`,
    `fuji`,
    `mumbai`,
];

export const LINK_ADDRESSES: AddressMap = {
    [`sepolia`]: `0x779877A7B0D9E8603169DdbD7836e478b4624789`,
    [`mumbai`]: `0x326C977E6efc84E512bB9C30f76E30c160eD06FB`,
    [`fuji`]: `0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846`
};

export const routerConfig: Record<string,any> = {
    sepolia: {
        address: `0xd0daae2231e9cb96b94c8512223533293c3693bf`,
        chainSelector: `16015286601757825753`,
        feeTokens: [LINK_ADDRESSES[`sepolia`], `0x097D90c9d3E0B50Ca60e1ae45F6A81010f9FB534`]
    },
    fuji: {
        address: `0x554472a2720e5e7d5d3c817529aba05eed5f82d8`,
        chainSelector: `14767482510784806043`,
        feeTokens: [LINK_ADDRESSES[`fuji`], `0xd00ae08403B9bbb9124bB305C09058E32C39A48c`]
    },
    mumbai: {
        address: `0x70499c328e1e2a3c41108bd3730f6670a44595d1`,
        chainSelector: `12532609583862916517`,
        feeTokens: [LINK_ADDRESSES[`mumbai`], `0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889`]
    }
}