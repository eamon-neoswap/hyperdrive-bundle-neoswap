import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { data } from "../_data";

interface Props {
  handleSubmit: () => void;
  getPrice: () => void;
  setOrderQuantity: (data: any) => void;
  orderQuantity: { [itemId: string]: number };
  isSubmitting: boolean;
  priceData: any;
  fetchingPrices: boolean;
}

function getPriceInfo(mint: string, priceData: any) {
  let label: string = "--";
  let price = 0;
  priceData?.itemsData?.forEach((ele: { mint: string; price: number }) => {
    if (ele.mint === mint) {
      price += ele.price;
    }
  });

  if (price > 0) {
    label = `${price}`;
  }
  return label;
}

function showSpinner() {
  return (
    <svg
      aria-hidden="true"
      role="status"
      className="inline w-4 h-4 mr-3 animate-spin"
      viewBox="0 0 100 101"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
        fill="#E5E7EB"
      />
      <path
        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function Bundle({
  getPrice,
  handleSubmit,
  setOrderQuantity,
  orderQuantity,
  isSubmitting,
  priceData,
  fetchingPrices,
}: Props) {
  console.log("PRICE DATA", priceData);
  return (
    <div className="w-full flex flex-col gap-10">
      <div className="flex flex-row w-full rounded-2xl p-2 gap-4 flex-wrap justify-center">
        {data.map((ele) => {
          return (
            <div
              key={`give_${ele.itemId}_panel`}
              className="flex-col justify-start items-start gap-2 inline-flex w-1/2 sm:w-1/3 md:w-60"
            >
              <div className="bg-white rounded-2xl border-b-2 border-red-500 justify-center items-center inline-flex overflow-hidden">
                <div className="relative">
                  <div className="absolute bg-[#0F151B] rounded-lg text-white bottom-3 left-3 p-2 flex gap-2">
                    <span className="text-xs font-normal leading-3">
                      Quantity
                    </span>
                    <span className="text-white text-sm font-bold leading-3">
                      {ele.quantity.toLocaleString()}
                    </span>
                  </div>
                  <img src={ele.thumbnail} alt={ele.name} className="w-full" />
                </div>
              </div>
              <div className="px-3 py-[10.58px] flex-col justify-start items-start gap-2 flex w-full">
                <div className="self-stretch text-white text-[13px] font-bold leading-tight">
                  {ele.name}
                </div>
                <div className="self-stretch justify-start items-start gap-[6.61px] inline-flex">
                  <div className="grow shrink basis-0 text-white text-[10px] font-normal">
                    {ele.collection.collection}
                  </div>
                  <div className="text-right text-red-600 text-[10px] font-normal">
                    <div role="button" className="text-white text-[10px]">
                      <a target="_blank" href={ele.marketplace.url}>
                        View more details
                      </a>
                    </div>
                  </div>
                </div>
                <div className="self-stretch justify-start items-start gap-[6.61px] inline-flex text-white text-[10px]">
                  <span>Total price in ATLAS: {getPriceInfo(ele.mint, priceData)}</span>
                </div>
              </div>

              <div className="justify-center">
                <label
                  className="block text-white text-sm font-bold mb-2"
                  htmlFor={`quantity_${ele.itemId}`}
                >
                  Quantity
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                  id={`quantity_${ele.itemId}`}
                  type="number"
                  placeholder="0"
                  value={orderQuantity[ele.itemId] || 0}
                  min={0}
                  onChange={(e) => {
                    setOrderQuantity({ [ele.itemId]: e.target.value });
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex flex-col w-full gap-2 text-white items-center">
        <div>Price Estimates</div>
        <div><span className="uppercase font-bold">SOL:</span> {priceData?.atlasData?.sol ?? '--'}</div>
        <div><span className="uppercase font-bold">ATLAS:</span> {priceData?.atlasData?.atlas ?? '--'}</div>
      </div>
      <div className="flex w-full justify-center gap-5">
        <button
          onClick={getPrice}
          className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-4 px-6 border border-blue-500 hover:border-transparent rounded"
          disabled={fetchingPrices}
        >
          {fetchingPrices && showSpinner()}
          Estimate Prices
        </button>
        <button
          onClick={handleSubmit}
          className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-4 px-6 border border-blue-500 hover:border-transparent rounded"
          disabled={isSubmitting}
        >
          {isSubmitting && showSpinner()}
          Buy Now
        </button>
      </div>
    </div>
  );
}
