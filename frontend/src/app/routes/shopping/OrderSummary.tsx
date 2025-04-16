import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { OrderSummaryProps } from "@/assets/types/summary";

type Props = {
  summary: OrderSummaryProps;
};

const OrderSummary: React.FC<Props> = ({ summary }) => {
  const { totalItems, address, paymentMethod, total } = summary;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Back */}
      <button className="flex items-center text-sm text-black mb-6 hover:underline">
        <FaArrowLeft className="mr-2" />
        Back
      </button>

      {/* Title */}
      <h2 className="text-center text-[#820000] text-lg font-semibold mb-6">
        Order summary
      </h2>

      {/* Details */}
      <div className="space-y-4 text-sm">
        <div className="flex justify-between">
          <span className="font-semibold">Total items:</span>
          <span>{totalItems}</span>
        </div>

        <div className="flex flex-col md:flex-row md:justify-between gap-1">
          <span className="font-semibold">Shipping address:</span>
          <span className="text-right font-medium whitespace-pre-line">{address}</span>
        </div>

        <div className="flex flex-col md:flex-row md:justify-between gap-1 items-start md:items-center">
          <span className="font-semibold">Payment method:</span>
          <div className="flex items-center gap-2">
            <img src={paymentMethod.logo} alt={paymentMethod.brand} className="w-8 h-auto" />
            <span className="text-sm font-medium">
              Ending in {paymentMethod.last4} {paymentMethod.bank}
            </span>
          </div>
        </div>

        <div className="border-t pt-2 flex justify-between">
          <span className="font-semibold text-base">Total:</span>
          <span className="text-[#007B83] font-semibold text-base">${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Confirm */}
      <div className="text-center mt-6">
        <button className="bg-[#007B83] hover:bg-[#00666e] text-white px-6 py-2 rounded">
          Confirm purchase
        </button>
      </div>
    </div>
  );
};

export { OrderSummary };
