import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { PaymentMethod } from "@/assets/types/card";

type Props = {
    card: PaymentMethod;
    onContinue: (cvc: string) => void;
};

const CvcForm: React.FC<Props> = ({ card }) => {
    return (
        <div className="max-w-xl mx-auto px-4 py-8">
            {/* Title */}
            <h2 className="text-center text-[#820000] text-lg font-semibold mb-6">
                Choose your payment method
            </h2>

            <div className="bg-white shadow-md border rounded px-6 py-6">
                {/* Back button */}
                <button className="flex items-center text-sm text-black mb-4 hover:underline">
                    <FaArrowLeft className="mr-2" />
                    Back
                </button>

                {/* Subtitle */}
                <h3 className="text-lg font-bold mb-2">Enter security code</h3>

                {/* Card info */}
                <div className="flex items-center mb-4 gap-2">
                    <img src={card.logo} alt={card.brand} className="w-10 h-6" />
                    <div>
                        <p className="text-sm">
                            Ending in <span className="font-semibold">{card.last4}</span>
                        </p>
                        <p className="text-xs text-gray-600">{card.bank}</p>
                    </div>
                </div>

                {/* Card CVC image */}
                <div className="flex justify-center mb-6">
                    <img src="/card-cvc.png" alt="CVC location on card" className="w-40 h-auto" />
                </div>

                {/* CVC input */}
                <div className="text-center mb-6">
                    <input
                        type="text"
                        placeholder="CVC"
                        maxLength={4}
                        className="border border-black rounded px-4 py-2 text-center w-24"
                    />
                </div>

                {/* Continue button */}
                <div className="text-center">
                    <button className="bg-[#007B83] hover:bg-[#00666e] text-white px-6 py-2 rounded">
                        Continue
                    </button>
                </div>
            </div>
        </div>
    );
};

export { CvcForm };
