"use client";

import { useCallback, useMemo } from "react";
import styles from "./index.module.css";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { goerli } from "wagmi/chains";
import { usePrepareContractWrite, useContractWrite, useAccount } from "wagmi";
import nigriAbi from "@/app/abis/Nigiri.abi.json";
import Image from "next/image";
import { useCalculateCost } from "@/app/hooks/useCalculateCost";
import { createPublicClient, formatEther, http, parseEther } from "viem";
import { useReadMintEvents } from "@/app/hooks/useReadMintEvents";
import { shortenAddress } from "@/app/utils/shortenAddress";
import moment from "moment";

export const publicClient = createPublicClient({
  chain: goerli,
  transport: http(),
});

const MINT_CONTRACT_ADDRESS = "0xe6148aabfd307f1ebe2a093fc0cab04f214c1183";
const RPC_PROVIDER_URL =
  "https://goerli.infura.io/v3/17911305d1cd4604a6b90a2c993fa8eb";

export default function HomeRight() {
  const { cost, costInEth } = useCalculateCost();

  const { data, isLoading } = useReadMintEvents(
    MINT_CONTRACT_ADDRESS,
    RPC_PROVIDER_URL
  );

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

  const renderActivity = useMemo(() => {
    if (isLoading) {
      return <div>Loading activity...</div>;
    }

    if (!data) {
      return null;
    }

    return data
      .sort((a: any, b: any) => b.value.timestamp - a.value.timestamp)
      .map((item: any) => {
        if (!item) {
          return null;
        }

        const address = shortenAddress(item.value.tx.from);
        const value = Number(
          formatEther(item.value.tx.value.toString())
        ).toFixed(4);
        const time = moment(item.value.timestamp * 1000).fromNow();

        return (
          <div key={item.value?.timestamp} className={styles.activityItem}>
            {address} - {value} ETH - {time}
          </div>
        );
      });
  }, [data, isLoading]);

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
          {renderActivity}
        </div>
      </div>
    </div>
  );
}
