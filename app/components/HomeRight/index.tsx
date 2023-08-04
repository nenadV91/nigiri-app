"use client";

import { useCallback } from "react";
import styles from "./index.module.css";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { goerli } from "wagmi/chains";
import { usePrepareContractWrite, useContractWrite } from "wagmi";
import nigriAbi from "@/app/abis/Nigiri.abi.json";
import Image from "next/image";
import { useCalculateCost } from "@/app/hooks/useCalculateCost";

const MINT_CONTRACT_ADDRESS = "0xe6148aabfd307f1ebe2a093fc0cab04f214c1183";

export default function HomeRight() {
  const { cost, costInEth } = useCalculateCost();

  console.log("debug cost", cost);

  const { config } = usePrepareContractWrite({
    address: MINT_CONTRACT_ADDRESS,
    abi: nigriAbi,
    functionName: "mint",
    chainId: goerli.id,
    value: cost,
  });

  const { write } = useContractWrite(config);

  const handleClick = useCallback(() => {
    write?.();
  }, [write]);

  return (
    <div className={styles.rightSide}>
      <div className={styles.heading}>
        <ConnectButton />
      </div>

      <div className={styles.mainContentText}>
        <h1 className={styles.mainTitle}>Join our family</h1>
        <h4 className={styles.subtitle}>We are a community of chefs</h4>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.mainContentLeft}>
          <Image
            className={styles.nftImage}
            src="/sushi-nft.png"
            alt="Mint nft image"
            width={300}
            height={300}
          />
          <button className={styles.mintButton} onClick={handleClick}>
            Mint
          </button>

          <div className={styles.costLabel}>Cost: {costInEth} ETH</div>
        </div>

        <div className={styles.mainContentRight}>
          <h4 className={styles.activityTitle}>Activity</h4>
        </div>
      </div>
    </div>
  );
}
