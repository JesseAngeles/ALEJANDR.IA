import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { addresses } from "@/assets/data/addresses";
import { Address } from "@/assets/types/address";
import { usePurchase } from "@/app/domain/context/PurchaseContext";

const DeliveryAddress: React.FC = () => {
    const navigate = useNavigate();
    const { setPurchase } = usePurchase();

    const handleSelect = (selectedAddress: string) => {
        setPurchase((prev) => ({ ...prev, address: selectedAddress }));
        navigate("/payment");
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            {/* Back Button */}
            <button className="flex items-center text-sm text-black mb-6 hover:underline">
                <FaArrowLeft className="mr-2" />
                Back
            </button>

            {/* Title */}
            <h2 className="text-center text-[#820000] text-lg font-semibold mb-6">
                Choose your delivery address
            </h2>

            {/* Address list */}
            <div className="space-y-4">
                {addresses.map((addr: Address) => (
                    <div
                        key={addr.id}
                        className="border rounded bg-gray-50 p-4 flex justify-between items-start text-sm"
                    >
                        <div>
                            <p className="font-semibold">{addr.name}</p>
                            <p className="text-gray-700">{addr.fullAddress}</p>
                            <p className="mt-2 text-xs text-black font-semibold">Estimated delivery date:</p>
                            <p className="text-xs">{addr.estimatedDate}</p>
                        </div>
                        <button
                            className="text-[#820000] font-semibold hover:underline"
                            onClick={() => handleSelect(addr.fullAddress)}
                        >
                            Select
                        </button>
                    </div>
                ))}
            </div>

            {/* Add/Modify button */}
            <div className="mt-8 text-center">
                <button className="bg-[#007B83] hover:bg-[#00666e] text-white px-6 py-2 rounded">
                    Add or edit address
                </button>
            </div>
        </div>
    );
};

export { DeliveryAddress };
