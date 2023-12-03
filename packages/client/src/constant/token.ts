// https://docs.chain.link/resources/link-token-contracts
export const TOKEN_SUPPORTED: Record<any, any> = {
  // Goerli
  "5": {
    "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE": {
      name: "ETH",
      image: 'https://s2.coinmarketcap.com/static/img/coins/128x128/1027.png',
      dataFeed: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e",
      dataFeedName: "ETH / USD"
    },
    "0x326C977E6efc84E512bB9C30f76E30c160eD06FB": {
      name: "LINK",
      image: 'https://s2.coinmarketcap.com/static/img/coins/128x128/1975.png',
      dataFeed: "0x48731cF7e84dc94C5f84577882c14Be11a5B7456",
      dataFeedName: "LINK / USD"
    }
  },
  // Mumbai
  "80001": {
    "0x326C977E6efc84E512bB9C30f76E30c160eD06FB": {
      name: "LINK",
      image: 'https://s2.coinmarketcap.com/static/img/coins/128x128/1975.png',
      dataFeed: "0x1C2252aeeD50e0c9B64bDfF2735Ee3C932F5C408",
      dataFeedName: "LINK / USD"
    },
    "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE": {
      name: "MATIC",
      image: 'https://s2.coinmarketcap.com/static/img/coins/128x128/3890.png',
      dataFeed: "0xd0D5e3DB44DE05E9F294BB0a3bEEaF030DE24Ada",
      dataFeedName: "MATIC / USD"
    }
  },
  "43113": {
    "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE": {
      name: "AVAX",
      image: 'https://s2.coinmarketcap.com/static/img/coins/128x128/5805.png',
      dataFeed: "0x5498BB86BC934c8D34FDA08E81D444153d0D06aD",
      dataFeedName: "AVAX / USD"
    },
    "0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846": {
      name: "LINK",
      image: 'https://s2.coinmarketcap.com/static/img/coins/128x128/1975.png',
      dataFeed: "0x34C4c526902d88a3Aa98DB8a9b802603EB1E3470",
      dataFeedName: "LINK / USD"
    }
  }
};
