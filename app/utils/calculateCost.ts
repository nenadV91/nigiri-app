import { defaultAbiCoder, keccak256, parseEther } from "ethers/lib/utils";
import { BigNumber } from "ethers";

export function calculateCost(
  address: `0x${string}` | undefined
): bigint | undefined {
  if (!address) {
    return undefined;
  }

  const hash = keccak256(defaultAbiCoder.encode(["address"], [address]));
  const bigNumberHash = BigNumber.from(hash);
  const cost = bigNumberHash.mod(parseEther("0.1"));
  const value = BigInt(cost.toString());

  return value;
}
