"use client";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js'
import Image from "next/image";
import { useEffect, useState } from "react";
import Bundle from "./_components/Bundle";
import { stateToBuy } from "./services/utils";
import { getStarAtlasBundle } from "./services/starAtlas";
import { Wallet } from "@coral-xyz/anchor";

export default function Home() {
  const [balance, setBalance] = useState(0)
  const [state, setState] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { connected, publicKey, wallet } = useWallet();
  const { connection } = useConnection();

  const setOrderQuantity = (data: { [itemId: string]: number }) => {
    setState({ ...state, ...data });
  };


  useEffect(() => {
    const getSolBalance = async () => {
      if (!publicKey) return;
      try {
        const fetchedBalance = await connection.getBalance(
          publicKey,
          'confirmed'
        );
        console.log('fetched balance', fetchedBalance)
        setBalance(fetchedBalance / LAMPORTS_PER_SOL)
      } catch (e) {
        console.log(`error getting balance: `, e);
      }
    }
    
    getSolBalance()
  }, [publicKey, connection])

  const handleSubmit = async () => {
    if (!publicKey || !wallet) throw "connect wallet";
    // console.log(state);

    if (Object.keys(state).length === 0) {
      alert("no item selected");
      throw "no item selected";
    }
    try {
      setIsSubmitting(true);
      const toBuy = stateToBuy(state);

      console.log("toBuy", toBuy);
      const res = await getStarAtlasBundle({
        user: publicKey,
        wallet: wallet.adapter as unknown as Wallet,
        toBuy,
      });
      console.log(res);
      alert("success");
      return res;
    }catch (error) {
      console.log(error);
      
      alert(error)
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-24 gap-5">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm lg:flex">
        <a
          className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
          href="https://neoswap.xyz"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src="/smallLogo.svg"
            alt="Neoswap"
            width={100}
            height={24}
            priority
          />
        </a>
      </div>
      <div>
        <WalletMultiButton />
      </div>
      {connected && (
        <Bundle
          setOrderQuantity={setOrderQuantity}
          handleSubmit={handleSubmit}
          orderQuantity={state}
          isSubmitting={isSubmitting}
        />
      )}
    </main>
  );
}
