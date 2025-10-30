import React, { useState } from 'react';
import { useNavigate, useLocation, Navigate, Link } from 'react-router-dom';
import axios from 'axios';

// Define the types for our discount state
type Discount = {
  type: 'flat' | 'percentage' | null;
  value: number;
};

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;

  // Form input state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  
  // Validation and API state
  const [errors, setErrors] = useState({ fullName: '', email: '', terms: '' });
  const [promoMessage, setPromoMessage] = useState({ text: '', isError: false });
  const [discount, setDiscount] = useState<Discount>({ type: null, value: 0 });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If user lands here directly without data, redirect to home
  if (!state || !state.experienceId) { // Check for state and experienceId
    return <Navigate to="/" />;
  }

  // Get data from DetailsPage (including the new experienceId)
  const { 
    experienceId, 
    experienceTitle, 
    date, 
    time, 
    quantity, 
    subtotal, 
    taxes 
  } = state;

  // --- Promo Code Logic ---
  const handleApplyPromo = async () => {
    if (!promoCode) return;
    try {
        const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/promo/validate`, {
        promoCode: promoCode,
      });
      
      const { valid, message, discountValue, type } = response.data;
      if (valid) {
        setDiscount({ type, value: discountValue });
        setPromoMessage({ text: message, isError: false });
      }
    } catch (err: any) {
      setDiscount({ type: null, value: 0 });
      setPromoMessage({ 
        text: err.response?.data?.message || 'Error validating code',
        isError: true 
      });
    }
  };

  // --- Dynamic Price Calculation ---
  let finalTotal = subtotal + taxes;
  let discountAmount = 0;
  if (discount.type === 'flat') {
    discountAmount = discount.value;
    finalTotal -= discountAmount;
  } else if (discount.type === 'percentage') {
    discountAmount = (subtotal * discount.value) / 100;
    finalTotal -= discountAmount;
  }
  
  // --- Booking Submission Logic ---
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrors({ fullName: '', email: '', terms: '' });
    setIsSubmitting(true);

    // --- Validation ---
    let hasError = false;
    if (!fullName) {
      setErrors(prev => ({ ...prev, fullName: 'Full name is required' }));
      hasError = true;
    }
    if (!email.includes('@')) {
      setErrors(prev => ({ ...prev, email: 'Please enter a valid email' }));
      hasError = true;
    }
    if (!agreedToTerms) {
      setErrors(prev => ({ ...prev, terms: 'You must agree to the terms' }));
      hasError = true;
    }

    if (hasError) {
      setIsSubmitting(false);
      return;
    }

    // --- Prepare Booking Data ---
    const bookingData = {
      customer: {
        fullName: fullName,
        email: email,
      },
      experience: {
        id: experienceId, // <-- *** THIS IS THE KEY UPDATE ***
        title: experienceTitle,
        date: date,
        time: time,
        quantity: quantity,
      },
      price: {
        subtotal: subtotal,
        taxes: taxes,
        discount: discountAmount,
        total: finalTotal,
      },
      promoCodeApplied: promoCode || null,
      bookedAt: new Date().toISOString(),
    };

    // --- Call Backend Booking Endpoint ---
    try {
        const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/bookings`, bookingData);
      const { bookingId } = response.data;
      
      navigate('/result', { state: { refId: bookingId } });

    } catch (err: any) {
      console.error(err);
      // Show the double-booking error from the backend
      const serverError = err.response?.data?.message || 'Booking failed. Please try again.';
      setErrors(prev => ({ ...prev, terms: serverError }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate(-1)} 
        className="text-gray-700 hover:text-gray-900 mb-4 inline-block"
      >
        &larr; Back
      </button>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Side: Form */}
        <div className="md:col-span-2">
          <div className="bg-white p-6 rounded-xl shadow-lg border">
            <h2 className="text-2xl font-bold mb-6">Your Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="full-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full name
                </label>
                <input
                  type="text"
                  id="full-name"
                  placeholder="Your name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="promo-code" className="block text-sm font-medium text-gray-700 mb-1">
                Promo code
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  id="promo-code"
                  placeholder="Enter promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                <button 
                  type="button" 
                  onClick={handleApplyPromo}
                  className="bg-gray-800 hover:bg-gray-900 text-white font-semibold py-2 px-6 rounded-lg"
                >
                  Apply
                </button>
              </div>
              {promoMessage.text && (
                <p className={`text-sm mt-1 ${promoMessage.isError ? 'text-red-500' : 'text-green-600'}`}>
                  {promoMessage.text}
                </p>
              )}
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="h-4 w-4 text-yellow-500 rounded border-gray-300 focus:ring-yellow-400"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                I agree to the terms and safety policy
              </label>
            </div>
            {errors.terms && <p className="text-red-500 text-sm mt-1">{errors.terms}</p>}
          </div>
        </div>

        {/* Right Side: Price Summary (now dynamic) */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-xl shadow-lg border p-6 sticky top-24">
            <h3 className="text-2xl font-bold mb-4">Price Summary</h3>
            <p className="text-lg font-semibold text-gray-800 mb-2">{experienceTitle}</p>
            <div className="space-y-3 text-gray-700">
              <div className="flex justify-between">
                <span>Date</span>
                <span className="font-medium">{date}</span>
              </div>
              <div className="flex justify-between">
                <span>Time</span>
                <span className="font-medium">{time}</span>
              </div>
              <div className="flex justify-between">
                <span>Qty</span>
                <span className="font-medium">{quantity}</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium">₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes</span>
                <span className="font-medium">₹{taxes}</span>
              </div>
              {discount.value > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span className="font-medium">- ₹{discountAmount.toFixed(2)}</span>
                </div>
              )}
            </div>
            <hr className="my-4 border-t-2" />
            <div className="flex justify-between text-xl font-bold mb-6">
              <span>Total</span>
              <span>₹{finalTotal.toFixed(2)}</span>
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-4 rounded-lg shadow disabled:bg-gray-300"
            >
              {isSubmitting ? 'Processing...' : 'Pay and Confirm'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
