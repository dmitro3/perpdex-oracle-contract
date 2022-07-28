import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { parseEther } from "ethers/lib/utils"

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { deployments, getNamedAccounts, getChainId } = hre
    const { deploy, execute } = deployments
    const { deployer } = await getNamedAccounts()

    const configs = {
        hardhat: [
            // hardhat (ETH mainnet)
            {
                contract: "ChainlinkPriceFeed",
                symbol: "ETHUSD",
                args: ["0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419"],
            },
        ],
        rinkeby: [
            // ETH rinkeby
            {
                contract: "ChainlinkPriceFeed",
                symbol: "ETHUSD",
                args: ["0x8A753747A1Fa494EC906cE90E9f37563A8AF630e"],
            },
            {
                contract: "ChainlinkPriceFeed",
                symbol: "BTCUSD",
                args: ["0xECe365B379E1dD183B20fc5f022230C044d51404"],
            },
            {
                contract: "ChainlinkPriceFeed",
                symbol: "MATICUSD",
                args: ["0x7794ee502922e2b723432DDD852B3C30A911F021"],
            },
            {
                contract: "ChainlinkPriceFeed",
                symbol: "LINKUSD",
                args: ["0xd8bD0a1cB028a31AA859A21A3758685a95dE4623"],
            },
        ],
        shibuya: [
            // astar shibuya https://docs.diadata.org/documentation/oracle-documentation/deployed-contracts
            {
                contract: "DiaPriceFeed",
                symbol: "BTCUSD",
                args: ["0x1232AcD632Dd75f874E357c77295Da3f5Cd7733E", "BTC/USD"],
            },
            {
                contract: "DiaPriceFeed",
                symbol: "ETHUSD",
                args: ["0x1232AcD632Dd75f874E357c77295Da3f5Cd7733E", "ETH/USD"],
            },
            {
                contract: "DiaPriceFeed",
                symbol: "KSMUSD",
                args: ["0x1232AcD632Dd75f874E357c77295Da3f5Cd7733E", "KSM/USD"],
            },
            {
                contract: "DiaPriceFeed",
                symbol: "SDNUSD",
                args: ["0x1232AcD632Dd75f874E357c77295Da3f5Cd7733E", "SDN/USD"],
            },
            {
                contract: "DiaPriceFeed",
                symbol: "DIAUSD",
                args: ["0x1232AcD632Dd75f874E357c77295Da3f5Cd7733E", "DIA/USD"],
            },
            {
                contract: "DiaPriceFeed",
                symbol: "ASTRUSD",
                args: ["0x1232AcD632Dd75f874E357c77295Da3f5Cd7733E", "ASTR/USD"],
            },
        ],
        mumbai: [
            // mumbai
            {
                contract: "ChainlinkPriceFeed",
                symbol: "MATICUSD",
                args: ["0xd0D5e3DB44DE05E9F294BB0a3bEEaF030DE24Ada"],
            },
        ],
        fuji: [
            // AVAX fuji
            {
                contract: "ChainlinkPriceFeed",
                symbol: "AVAXUSD",
                args: ["0x0A77230d17318075983913bC2145DB16C7366156"],
            },
        ],
        zksync2_testnet: [
            // use scripts/univ2_survey.ts to get addresses
            {
                contract: "DebugPriceFeed",
                symbol: "ETHUSD",
                args: [parseEther("1500")],
            },
        ],
        optimism_kovan: [
            {
                contract: "ChainlinkPriceFeed",
                symbol: "ETHUSD",
                args: ["0x7f8847242a530E809E17bF2DA5D2f9d2c4A43261"],
            },
        ],
        arbitrum_rinkeby: [
            {
                contract: "ChainlinkPriceFeed",
                symbol: "ETHUSD",
                args: ["0x5f0423B1a6935dc5596e7A24d98532b67A0AeFd8"],
            },
        ],
    }[hre.network.name]

    for (let i = 0; i < configs.length; i++) {
        const config = configs[i]
        await deploy(config.contract + config.symbol, {
            contract: config.contract,
            from: deployer,
            args: config.args,
            log: true,
            autoMine: true,
        })
    }
}

export default func
func.tags = ["price_feed"]
