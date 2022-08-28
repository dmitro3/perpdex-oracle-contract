import { FakeContract, smock } from "@defi-wonderland/smock"
import { expect } from "chai"
import { BigNumber } from "ethers"
import { ethers, waffle } from "hardhat"
import { IUniswapV2Pair, UniswapV2PriceFeed, IERC20 } from "../typechain"

interface UniswapV2PriceFeedFixture {
    priceFeed: UniswapV2PriceFeed
    pair: FakeContract<IUniswapV2Pair>
    token0: FakeContract<IERC20>
    token1: FakeContract<IERC20>
}

interface Params {
    inverse: boolean
    decimals0?: number
    decimals1?: number
}

function createFixture(params: Params) {
    params = {
        decimals0: 18,
        decimals1: 18,
        ...params,
    }

    return async (): Promise<UniswapV2PriceFeedFixture> => {
        const token0 = await smock.fake<IERC20>("IERC20")
        const token1 = await smock.fake<IERC20>("IERC20")
        const pair = await smock.fake<IUniswapV2Pair>("IUniswapV2Pair")

        pair.token0.returns(token0.address)
        pair.token1.returns(token1.address)

        token0.decimals.returns(params.decimals0)
        token1.decimals.returns(params.decimals1)

        const factory = await ethers.getContractFactory("UniswapV2PriceFeed")
        const priceFeed = (await factory.deploy(pair.address, params.inverse)) as UniswapV2PriceFeed

        return { priceFeed, pair, token0, token1 }
    }
}

describe("UniswapV2PriceFeed Spec", () => {
    const [admin] = waffle.provider.getWallets()
    const loadFixture: ReturnType<typeof waffle.createFixtureLoader> = waffle.createFixtureLoader([admin])
    let priceFeed: UniswapV2PriceFeed
    let pair: FakeContract<IUniswapV2Pair>

    const X10_18 = BigNumber.from(10).pow(18)
    const X10_6 = BigNumber.from(10).pow(6)

    describe("various cases", () => {
        ;[
            {
                title: "one",
                reserve0: 10000,
                reserve1: 10000,
                decimals0: 18,
                decimals1: 18,
                inverse: false,
                price: X10_18,
            },
            {
                title: "two",
                reserve0: 20000,
                reserve1: 10000,
                decimals0: 18,
                decimals1: 18,
                inverse: false,
                price: X10_18.mul(2),
            },
            {
                title: "USDC/WETH",
                reserve0: X10_6.mul(20000),
                reserve1: X10_18.mul(10000),
                decimals0: 6,
                decimals1: 18,
                inverse: false,
                price: X10_18.mul(2),
            },
            {
                title: "USDC/WETH inverse",
                reserve0: X10_6.mul(20000),
                reserve1: X10_18.mul(10000),
                decimals0: 6,
                decimals1: 18,
                inverse: true,
                price: X10_18.div(2),
            },
        ].forEach(test => {
            describe(test.title, () => {
                beforeEach(async () => {
                    const _fixture = await loadFixture(
                        createFixture({
                            inverse: test.inverse,
                            decimals0: test.decimals0,
                            decimals1: test.decimals1,
                        }),
                    )
                    priceFeed = _fixture.priceFeed
                    pair = _fixture.pair

                    pair.getReserves.returns([test.reserve0, test.reserve1, 0])
                })

                it("decimals", async () => {
                    expect(await priceFeed.decimals()).to.be.eq(18)
                })

                it("getPrice", async () => {
                    expect(await priceFeed.getPrice()).to.eq(test.price)
                })
            })
        })
    })
})
