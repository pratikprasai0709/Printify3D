import React, { useState } from 'react';
import { initiateEsewaApi } from '../shared/config/api';

interface EsewaPaymentProps {
    amount: number;
    productName: string;
    customerDetails: { name: string, phone: string, address: string };
    designImage?: string;
    getBottlePreview?: () => string | null;
    onError: (error: any) => void;
    disabled?: boolean;
}

const EsewaPayment: React.FC<EsewaPaymentProps> = ({ amount, productName, customerDetails, designImage, getBottlePreview, onError, disabled }) => {
    const [loading, setLoading] = useState(false);

    const handlePayment = async () => {
        try {
            setLoading(true);
            console.log("Initiating eSewa payment for:", { amount, productName });
            
            const bottlePreviewImage = getBottlePreview ? getBottlePreview() || undefined : undefined;
            const response = await initiateEsewaApi({ amount, productName, customerDetails, designImage, bottlePreviewImage });
            const { formData, gatewayUrl } = response.data;

            console.log("eSewa Form Data from Backend:", formData);
            console.log("eSewa Gateway URL:", gatewayUrl);

            // Create a hidden form and submit it
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = gatewayUrl;

            console.log("--- Submitting eSewa Form ---");
            Object.entries(formData).forEach(([key, value]) => {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = key;
                input.value = value as string;
                form.appendChild(input);
                console.log(`${key}: ${value}`);
            });
            console.log("-----------------------------");

            document.body.appendChild(form);
            form.submit();
        } catch (error: any) {
            console.error("eSewa initiation failed:", error);
            setLoading(false);
            onError(error);
        }
    };

    return (
        <button
            onClick={handlePayment}
            disabled={loading || disabled}
            className="w-full py-4 bg-[#60BB46] text-white rounded-2xl font-bold shadow-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:bg-slate-300"
        >
            {loading ? (
                <span>Processing...</span>
            ) : (
                <>
                    <img 
                        src="https://esewa.com.np/common/images/esewa_logo.png" 
                        alt="eSewa" 
                        className="h-6 object-contain brightness-0 invert" 
                    />
                    Pay with eSewa
                </>
            )}
        </button>
    );
};

export default EsewaPayment;
