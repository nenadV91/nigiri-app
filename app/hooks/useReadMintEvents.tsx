import { useCallback, useEffect, useMemo, useState } from "react";
import { Contract } from "ethers";
import { JsonRpcProvider } from "@ethersproject/providers";
import nigriAbi from "@/app/abis/Nigiri.abi.json";
import { getBlock } from "viem/actions";

export function useReadMintEvents(
  contractAddress: string,
  providerUrl: string
) {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const provider = useMemo(
    () => new JsonRpcProvider(providerUrl),
    [providerUrl]
  );
  const contract = useMemo(
    () => new Contract(contractAddress, nigriAbi, provider),
    [contractAddress, provider]
  );

  const fetchMintEventData = useCallback(async () => {
    setIsLoading(true);

    const filter = contract.filters.Transfer();
    const events = await contract.queryFilter(filter);

    return await Promise.allSettled(
      events.map(async (event) => {
        const tx = await provider.getTransaction(event.transactionHash);

        if (!tx.blockNumber) {
          // Transaction is not yet included in a block
          return null;
        }

        const timestamp = (await provider.getBlock(tx.blockNumber)).timestamp;

        return {
          tx,
          timestamp,
        };
      })
    );
  }, [contract, provider]);

  useEffect(() => {
    fetchMintEventData()
      .then((d) => setData(d))
      .catch((e) => setError(e))
      .finally(() => setIsLoading(false));
  }, [contract, fetchMintEventData]);

  return {
    data,
    error,
    isLoading,
  };
}
