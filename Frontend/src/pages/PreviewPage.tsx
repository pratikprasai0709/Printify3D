import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import ThreeScene from '../components/ThreeScene';
import EsewaPayment from '../components/EsewaPayment';
import type { CustomizationState, BottleModel } from '../types';
import { Icons } from '../constants';
import { verifyEsewaApi } from '../shared/config/api';

const PreviewPage: React.FC = () => {
   const location = useLocation();
   const navigate = useNavigate();
   const [searchParams] = useSearchParams();
   const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);
   const [isVerifying, setIsVerifying] = useState(false);
   const verificationStarted = React.useRef(false);
   
   const [customerDetails, setCustomerDetails] = useState({
      name: '',
      phone: '',
      address: ''
   });

   const model = location.state?.model as BottleModel;
   const customization = location.state?.customization as CustomizationState;

   const isFormValid = customerDetails.name.trim() !== '' && 
                       customerDetails.phone.trim() !== '' && 
                       customerDetails.address.trim() !== '';

   const handleCustomerChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setCustomerDetails(prev => ({ ...prev, [name]: value }));
   };

   useEffect(() => {
     if (!model || !customization) {
        const dataParam = searchParams.get('data');
        if (!dataParam) {
            navigate('/selection');
        }
     }
   }, [model, customization, navigate, searchParams]);

   useEffect(() => {
        const dataParam = searchParams.get('data');
        if (dataParam && !isPaymentSuccess && !isVerifying && !verificationStarted.current) {
            verificationStarted.current = true;
            handleEsewaVerification(dataParam);
        }
   }, [searchParams]);

   const handleEsewaVerification = async (data: string) => {
        try {
            setIsVerifying(true);
            const response = await verifyEsewaApi({ data });
            console.log("eSewa Verification Success:", response.data);
            setIsPaymentSuccess(true);
            setTimeout(() => {
                navigate('/');
            }, 3000);
        } catch (error) {
            console.error("eSewa Verification Failed:", error);
            toast.error("Payment verification failed. Please contact support.");
            setIsVerifying(false);
        }
   };

   if (!model || !customization) {
        if (isVerifying || isPaymentSuccess) {
            return (
                <div className="pt-8 min-h-screen bg-slate-50 flex items-center justify-center">
                    <div className="bg-white p-12 rounded-[3rem] shadow-xl text-center space-y-4">
                        {isPaymentSuccess ? (
                            <>
                                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                                </div>
                                <h2 className="text-2xl font-bold text-slate-800">Payment Successful!</h2>
                                <p className="text-slate-500">Redirecting to home...</p>
                            </>
                        ) : (
                            <>
                                <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                                <h2 className="text-2xl font-bold text-slate-800">Verifying Payment...</h2>
                                <p className="text-slate-500">Please wait while we confirm your transaction.</p>
                            </>
                        )}
                    </div>
                </div>
            );
        }
        return null;
   }

   const orderTotal = model.price + 1500; // base + material (500) + artwork (1000)

   const handlePaymentError = (error: any) => {
        console.error("Payment failed", error);
        toast.error("Payment failed or was cancelled. Please try again.");
   };

   const getBottlePreview = () => {
      const canvas = document.querySelector('canvas');
      if (canvas) {
         return canvas.toDataURL('image/png');
      }
      return null;
   };

   return (
      <div className="pt-8 min-h-screen bg-slate-50 flex flex-col">
         <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 flex flex-col lg:flex-row gap-12">
            {/* Left: Interactive 3D */}
            <div className="flex-1 glass rounded-[3rem] shadow-xl overflow-hidden min-h-[500px]">
               <ThreeScene customization={customization} modelPath={model.modelPath} className="w-full h-full" capturePreview />
            </div>

            {/* Right: Summary & Checkout */}
            <div className="w-full lg:w-96 flex flex-col gap-8">
               <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 space-y-6">
                  <div>
                     <h1 className="text-3xl font-extrabold text-slate-900">{model.name}</h1>
                     <p className="text-slate-500 font-medium">Custom Configuration</p>
                  </div>

                  <div className="space-y-4">
                     <div className="flex justify-between items-center py-3 border-b border-slate-50">
                        <span className="text-sm text-slate-500">Base Model</span>
                        <span className="text-sm font-bold text-slate-800">Rs. {model.price.toLocaleString()}</span>
                     </div>
                     <div className="flex justify-between items-center py-3 border-b border-slate-50">
                        <span className="text-sm text-slate-500">Finish ({customization.material})</span>
                        <span className="text-sm font-bold text-slate-800">Rs. 500</span>
                     </div>
                     <div className="flex justify-between items-center py-3 border-b border-slate-50">
                        <span className="text-sm text-slate-500">Custom Artwork</span>
                        <span className="text-sm font-bold text-slate-800">Rs. 1,000</span>
                     </div>
                     <div className="flex justify-between items-center pt-6">
                        <span className="text-lg font-bold text-slate-900">Total</span>
                        <span className="text-2xl font-black text-blue-600">Rs. {orderTotal.toLocaleString()}</span>
                     </div>
                  </div>

                  {/* Customer Details Form */}
                  <div className="pt-6 border-t border-slate-100 space-y-4">
                      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Delivery Details</h3>
                      <div className="space-y-3">
                          <input 
                              type="text" 
                              name="name"
                              value={customerDetails.name}
                              onChange={handleCustomerChange}
                              placeholder="Full Name"
                              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                          />
                          <input 
                              type="tel" 
                              name="phone"
                              value={customerDetails.phone}
                              onChange={handleCustomerChange}
                              placeholder="Phone Number"
                              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                          />
                          <textarea 
                              name="address"
                              value={customerDetails.address}
                              onChange={handleCustomerChange}
                              placeholder="Delivery Address"
                              rows={2}
                              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none"
                          />
                      </div>
                  </div>

                  <div className="flex flex-col gap-3 pt-4">
                     <EsewaPayment
                        amount={orderTotal}
                        productName={model.name}
                        customerDetails={customerDetails}
                        designImage={customization.labelTexture}
                        getBottlePreview={getBottlePreview}
                        onError={handlePaymentError}
                        disabled={!isFormValid}
                     />
                     <button
                        onClick={() => navigate(-1)}
                        className="w-full py-4 bg-slate-50 text-slate-700 rounded-2xl font-bold hover:bg-slate-100 transition-all flex items-center justify-center gap-2"
                     >
                        <Icons.Edit />
                        Back to Editor
                     </button>
                  </div>
               </div>

               <div className="bg-blue-600 rounded-[2rem] p-8 text-white shadow-xl shadow-blue-100 flex items-center justify-between">
                  <div className="space-y-1">
                     <h4 className="font-bold">Share Your Design</h4>
                     <p className="text-xs text-blue-100">Get a preview image for social media.</p>
                  </div>
                  <button className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-all">
                     <Icons.Download />
                  </button>
               </div>
            </div>
         </div>
      </div>
   );
};

export default PreviewPage;
