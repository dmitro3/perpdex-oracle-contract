// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity >=0.7.6;
pragma experimental ABIEncoderV2;

import { Address } from "@openzeppelin/contracts/utils/Address.sol";
import { IPerpdexPriceFeed } from "../interface/IPerpdexPriceFeed.sol";

contract DebugPriceFeed is IPerpdexPriceFeed {
    uint256 private _price;

    constructor(uint256 price) {
        _price = price;
    }

    function setPrice(uint256 value) external {
        _price = value;
    }

    function getPrice() external view override returns (uint256) {
        return _price;
    }

    function decimals() external pure override returns (uint8) {
        return 18;
    }
}
