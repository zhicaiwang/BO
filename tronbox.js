module.exports = {
  networks: {
    development: {
// For trontools/quickstart docker image
      from: 'TKyFMa8Ug6U1bHcnSGyt88HY2Tdg9huAZu',
      //privateKey: 'da146374a75310b9666e834ee4ad0866d6f4035967bfc76217c5a495fff9f0d0',
      privateKey: '47db8562ee9028039dcd8c4a35e089168dc389808a4b8fe625b7b41395246561',
      consume_user_resource_percent: 50,
      fee_limit: 1000000000,

      // Requires TronBox 2.1.9+ and Tron Quickstart 1.1.16+
      // fullHost: "http://127.0.0.1:9090",

      // The three settings below for TronBox < 2.1.9
      fullNode: "http://127.0.0.1:8090",
      solidityNode: "http://127.0.0.1:8091",
      eventServer: "http://127.0.0.1:8092",

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
      privateKey: process.env.PK,
      consume_user_resource_percent: 30,
      fee_limit: 100000000,

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
