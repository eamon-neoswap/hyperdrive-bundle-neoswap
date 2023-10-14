"use client";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import Image from "next/image";
import { SetStateAction, useEffect, useState } from "react";
import Bundle from "./_components/Bundle";
import { getSolBalance, stateToBuy } from "./services/utils";
import { getStarAtlasBundle, getStarAtlasPrices, styles } from "./services/starAtlas";
import { Wallet } from "@coral-xyz/anchor";

export default function Home() {
    const [balance, setBalance] = useState(0);
    const [state, setState] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { connected, publicKey, wallet } = useWallet();
    const { connection } = useConnection();

    const setOrderQuantity = (data: { [itemId: string]: number }) => {
        setState({ ...state, ...data });
    };

    const roundBalance = (balance: number) => Math.round(balance * 10000) / 10000;

    useEffect(() => {
        const getBalance = async () => {
            if (!publicKey) return;
            try {
                const fetchedBalance = await getSolBalance(publicKey);
                console.log("fetched balance", fetchedBalance);
                setBalance(roundBalance(fetchedBalance / LAMPORTS_PER_SOL));
            } catch (e) {
                console.log(`error getting balance: `, e);
            }
        };

        getBalance();
    }, [publicKey, connection]);

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
        } catch (error) {
            console.log(error);

            alert(error);
        } finally {
            setIsSubmitting(false);
        }
    };
    const getPrice = async () => {
        if (!publicKey || !wallet) throw "connect wallet";
        // console.log(state);

        if (Object.keys(state).length === 0) {
            alert("no item selected");
            throw "no item selected";
        }
        try {
            // setIsSubmitting(true);
            const toBuy = stateToBuy(state);

            console.log("toBuy", toBuy);

            const res = await getStarAtlasPrices({
                user: publicKey,
                // wallet: wallet.adapter as unknown as Wallet,
                toBuy,
            });
            console.log(res);

            return res;
        } catch (error) {
            console.log(error);

            alert(error);
        } finally {
            setIsSubmitting(false);
        }
    };
    const [selectedOption, setSelectedOption] = useState("STAR ATLAS");

    const handleOptionChange = (event: { target: { value: SetStateAction<string> } }) => {
        setSelectedOption(event.target.value);
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
                    <Image src="/smallLogo.svg" alt="Neoswap" width={100} height={24} priority />
                </a>
            </div>
            <div>
                <WalletMultiButton />
            </div>
            <div>
                <label
                    htmlFor="menu"
                    style={{
                        backgroundColor: "lightblue",
                        padding: "11px",
                        border: "none",
                        borderRadius: "10px",
                    }}
                >
                    {"Select an Game =>"}
                </label>
                ...
                <select
                    id="menu"
                    value={selectedOption}
                    onChange={handleOptionChange}
                    style={{
                        backgroundColor: "lightblue",
                        padding: "10px",
                        border: "none",
                        borderRadius: "10px",
                    }}
                >
                    <option value="STAR ATLAS">STAR ATLAS</option>
                </select>
            </div>

            {connected && (
                <>
                    <div className="text-white">
                        <span className="uppercase font-bold">Balance:</span> {balance} SOL
                    </div>

                    <Bundle
                        setOrderQuantity={setOrderQuantity}
                        handleSubmit={handleSubmit}
                        getPrice={getPrice}
                        orderQuantity={state}
                        isSubmitting={isSubmitting}
                    />
                </>
            )}
            <div style={styles.container}>
                <h1 style={styles.header}>Welcome to NeoSwap - Your Solana Games Companion</h1>
                <br />
                <h2 style={styles.instructionHeader}>Instructions:</h2>

                <ol>
                    <li style={styles.instructions}>
                        1) Connect your wallet by clicking on *Select Wallet* on the top of the page
                    </li>
                    <li style={styles.instructions}>
                        2) Select your game of choice in the dropdown menu
                    </li>
                    <li style={styles.instructions}>
                        3) Input in the according fields the required quantities of the specific
                        items you want to buy
                    </li>
                    <li style={styles.instructions}>3) Click on *Buy* and let magic happens</li>
                </ol>

                <br />
                <br />

                <p style={styles.paragraph}>
                    As a dedicated gamer, I've often found myself in dire straits within
                    StarAtlas—stranded in the cosmic abyss, lacking essentials like fuel, ammo, and
                    food.
                </p>
                <p style={styles.paragraph}>
                    It was cumbersome to scroll the galactic market place to find the cheapest
                    resources that can extend my expedition in the fastest way.
                </p>
                <br />
                <p style={styles.paragraph}>
                    Fortunately, at NeoSwap we came up with an idea. We were empowered to craft a
                    tool for the HyperDrive hackathon, enabling bulk purchases of vital items and
                    resources.
                </p>
                <p style={styles.paragraph}>
                    The tool excelled at sourcing the cheapest orders, securing the best deals with
                    minimal effort.
                </p>
                <br />
                <p style={styles.paragraph}>
                    The power of this tool is its streamlined transactions with a one-signature
                    feature, saving precious time.
                </p>
                <br />
                <p style={styles.paragraph}>
                    With NeoSwap's help, I'm conquering the galaxy, turning the tables on adversity,
                    all while embracing my lazy gamer spirit.
                </p>

                <br />
                <br />

                <h2 style={styles.faqHeader}>FAQ:</h2>

                <p style={styles.faq}>
                    <strong>-- What is happening?</strong>
                </p>
                <p style={styles.faq}>
                    Our bot scans Star Atlas Galactic Market to find the cheapest items and compiles
                    everything in a bundle of transactions that only requires one signature. Neoswap
                    Bundle is the fastest and easiest way to buy your resources on Star Atlas.
                </p>
                <br />
                <p style={styles.faq}>
                    <strong>-- Will there be other games integrated?</strong>
                </p>
                <p style={styles.faq}>
                    Yes, we plan to standardize Marketplaces interaction with a suite of tools to
                    allow users to make their custom bundle on games on Solana.
                </p>
            </div>
        </main>
    );
}
