module.exports = {
  networks: {
    development: {
// For trontools/quickstart docker image
      from: 'TCnFqRo8mF2XQRyaVmo5zskEe8JK5KJxjr',
      //privateKey: 'da146374a75310b9666e834ee4ad0866d6f4035967bfc76217c5a495fff9f0d0',
      privateKey: '82b4f083a36ce64f53647262a04ace479e1c0eb0d2985fe54d1e56eadae6c635',
      consume_user_resource_percent: 50,
      fee_limit: 1000000000,

      // Requires TronBox 2.1.9+ and Tron Quickstart 1.1.16+
      // fullHost: "http://127.0.0.1:9090",

      // The three settings below for TronBox < 2.1.9
      fullNode: "http://127.0.0.1:8090",
      solidityNode: "http://127.0.0.1:8091",
      eventServer: "http://127.0.0.1:8092",
      // fullNode: "https://api.trongrid.io",
      // solidityNode: "https://api.trongrid.io",
      // eventServer: "https://api.trongrid.io",

      network_id: "*"
    },
    mainnet: {
// Don't put your private key here:
      privateKey: process.env.PK,
      /*
      Create a .env file (it must be gitignored) containing something like

        export PK=4E7FECCB71207B867C495B51A9758B104B1D4422088A87F4978BE64636656243

      Then, run the migration with:

        source .env && tronbox migrate --network mainnet

      */
      consume_user_resource_percent: 30,
      fee_limit: 100000000,

      // tronbox 2.1.9+
      // fullHost: "https://api.trongrid.io",

      // tronbox < 2.1.9
      fullNode: "https://api.trongrid.io",
      solidityNode: "https://api.trongrid.io",
      eventServer: "https://api.trongrid.io",

      network_id: "*"
    },
    shasta: {
      //privateKey: process.env.PK,
      from: 'TETsrEFMWFSPpY4Ey5EpT4V84k34CxFpFE',
      //privateKey: 'da146374a75310b9666e834ee4ad0866d6f4035967bfc76217c5a495fff9f0d0',
      privateKey: '37d459332e86c6e63224ec0099ff5c1466c0d1e6fd0aa011165977fd56cf7e3b',
      consume_user_resource_percent: 100,
      fee_limit: 1000000000,

      // tronbox 2.1.9+
      // fullHost: "https://api.shasta.trongrid.io",

      // tronbox < 2.1.9
      fullNode: "https://api.shasta.trongrid.io",
      solidityNode: "https://api.shasta.trongrid.io",
      eventServer: "https://api.shasta.trongrid.io",

      network_id: "*"
    }
  }
}
