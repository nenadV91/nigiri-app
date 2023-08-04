"use client";

import { useAccount } from "wagmi";
import { calculateCost } from "@/app/utils/calculateCost";
import { formatEther } from "ethers/lib/utils";
import { useEffect, useState } from "react";

export function useCalculateCost() {
  const { address } = useAccount();
  const [cost, setCost] = useState<bigint | undefined>();
  const [costInEth, setCostInEth] = useState<undefined | string>();

  useEffect(() => {
    const newCost = calculateCost(address);
    const newCostInEth = newCost ? formatEther(newCost) : undefined;

    setCost(newCost);
    setCostInEth(newCostInEth);
  }, [address]);

  return { cost, costInEth };
}
