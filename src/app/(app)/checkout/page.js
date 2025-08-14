"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cartStore";
export default function CheckoutPage() {
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    zip: "",
    phone: "",
    country: "Pakistan",
    // Billing address fields
    billingCountry: "Pakistan",
    billingFirstName: "",
    billingLastName: "",
    billingAddress: "",
    billingApartment: "",
    billingCity: "",
    billingZip: "",
    billingPhone: "",
  });
  const { cart } = useCartStore();
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [billingSame, setBillingSame] = useState(true);
  const [saveInfo, setSaveInfo] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  console.log(cart, "thi si shte cart");
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate payment processing
    setTimeout(() => {
      alert(
        paymentMethod === "card"
          ? "You will be redirected to PayFast for payment"
          : "Order placed! Cash payment will be collected on delivery."
      );
      setIsLoading(false);
    }, 1500);
  };
  const subtotal = cart.reduce(
    (sum, item) => sum + item.discountPrice * item.qty,
    0
  );
  const shipping = shippingMethod === "standard" ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const codCharge = paymentMethod === "cash" ? 90 : 0;
  const total = subtotal + shipping + tax + codCharge;

  return (
    <div className="min-h-screen pt-[120px] bg-[#0A0A0A] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-center mb-8">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-[#D4AF37] to-[#F5E8B5] w-10 h-10 rounded-full flex items-center justify-center mr-3">
              <span className="text-[#0A0A0A] font-bold text-xl">L</span>
            </div>
            <h1 className="text-2xl font-bold text-white">LUXE GADGETS</h1>
          </div>
        </div>

        <div className="flex justify-center mb-2">
          <div className="flex">
            <div className="flex items-center">
              <div className="w-6 h-6 rounded-full bg-[#D4AF37] flex items-center justify-center mr-2">
                <span className="text-[#0A0A0A] text-xs font-bold">1</span>
              </div>
              <span className="text-white text-sm">Cart</span>
            </div>
            <div className="w-16 h-0.5 bg-gray-700 mx-2 mt-2"></div>
            <div className="flex items-center">
              <div className="w-6 h-6 rounded-full bg-[#D4AF37] flex items-center justify-center mr-2">
                <span className="text-[#0A0A0A] text-xs font-bold">2</span>
              </div>
              <span className="text-white text-sm">Information</span>
            </div>
            <div className="w-16 h-0.5 bg-gray-700 mx-2 mt-2"></div>
            <div className="flex items-center">
              <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center mr-2">
                <span className="text-gray-400 text-xs font-bold">3</span>
              </div>
              <span className="text-gray-400 text-sm">Payment</span>
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          Checkout
        </h1>

        <div className="bg-[#1A1A1A] rounded-xl shadow-xl overflow-hidden border border-gray-800">
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Customer Info */}
              <div>
                <h2 className="text-xl font-semibold text-white mb-6">
                  Contact Information
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full outline-none px-4 py-3 bg-[#0A0A0A] text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-all duration-200"
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="newsletter"
                      name="newsletter"
                      className="h-4 w-4 outline-none text-[#D4AF37] focus:ring-[#D4AF37] border-gray-600 rounded"
                    />
                    <label
                      htmlFor="newsletter"
                      className="ml-2 block text-sm text-gray-300"
                    >
                      Email me with news and offers
                    </label>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-white mb-4">
                      Shipping Address
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="country"
                          className="block text-sm font-medium text-gray-300 mb-1"
                        >
                          Country
                        </label>
                        <select
                          id="country"
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                          required
                          className="w-full outline-none px-4 py-3 bg-[#0A0A0A] text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-all duration-200"
                        >
                          <option value="Pakistan">Pakistan</option>
                          <option value="USA">United States</option>
                          <option value="UK">United Kingdom</option>
                          <option value="CA">Canada</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="firstName"
                            className="block text-sm font-medium text-gray-300 mb-1"
                          >
                            First name (optional)
                          </label>
                          <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className="w-full outline-none px-4 py-3 bg-[#0A0A0A] text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-all duration-200"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="lastName"
                            className="block text-sm font-medium text-gray-300 mb-1"
                          >
                            Last name
                          </label>
                          <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                            className="w-full outline-none px-4 py-3 bg-[#0A0A0A] text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-all duration-200"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="address"
                          className="block text-sm font-medium text-gray-300 mb-1"
                        >
                          Address
                        </label>
                        <input
                          type="text"
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          required
                          className="w-full px-4 outline-none py-3 bg-[#0A0A0A] text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-all duration-200"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="apartment"
                          className="block text-sm font-medium text-gray-300 mb-1"
                        >
                          Apartment, suite, etc. (optional)
                        </label>
                        <input
                          type="text"
                          id="apartment"
                          name="apartment"
                          value={formData.apartment}
                          onChange={handleChange}
                          className="w-full outline-none px-4 py-3 bg-[#0A0A0A] text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-all duration-200"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="city"
                            className="block text-sm font-medium text-gray-300 mb-1"
                          >
                            City
                          </label>
                          <input
                            type="text"
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            required
                            className="w-full outline-none px-4 py-3 bg-[#0A0A0A] text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-all duration-200"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="zip"
                            className="block text-sm font-medium text-gray-300 mb-1"
                          >
                            Postal code (optional)
                          </label>
                          <input
                            type="text"
                            id="zip"
                            name="zip"
                            value={formData.zip}
                            onChange={handleChange}
                            className="w-full outline-none px-4 py-3 bg-[#0A0A0A] text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-all duration-200"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="phone"
                          className="block text-sm font-medium text-gray-300 mb-1"
                        >
                          Phone
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          className="w-full outline-none px-4 py-3 bg-[#0A0A0A] text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-all duration-200"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="saveInfo"
                      name="saveInfo"
                      checked={saveInfo}
                      onChange={(e) => setSaveInfo(e.target.checked)}
                      className="h-4 outline-none w-4 text-[#D4AF37] focus:ring-[#D4AF37] border-gray-600 rounded"
                    />
                    <label
                      htmlFor="saveInfo"
                      className="ml-2 block text-sm text-gray-300"
                    >
                      Save this information for next time
                    </label>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-white mb-4">
                      Shipping Method
                    </h3>
                    <div className="bg-[#0A0A0A] p-4 rounded-lg border border-gray-700">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="standard-shipping"
                          name="shippingMethod"
                          checked={shippingMethod === "standard"}
                          onChange={() => setShippingMethod("standard")}
                          className="h-4 w-4 text-[#D4AF37] focus:ring-[#D4AF37] border-gray-600"
                        />
                        <label
                          htmlFor="standard-shipping"
                          className="ml-3 block text-sm font-medium text-white flex-1"
                        >
                          <span className="block">Standard</span>
                          <span className="text-gray-400 text-sm">
                            Delivery in 5-7 business days
                          </span>
                        </label>
                        <span className="text-gray-300">Free</span>
                      </div>
                    </div>
                  </div>

                  {/* Billing Address Section */}
                  <div>
                    <h3 className="text-lg font-medium text-white mb-4">
                      Billing Address
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="same-address"
                          name="billingAddress"
                          checked={billingSame}
                          onChange={() => setBillingSame(true)}
                          className="h-4 w-4 text-[#D4AF37] focus:ring-[#D4AF37] border-gray-600"
                        />
                        <label
                          htmlFor="same-address"
                          className="ml-2 block text-sm text-gray-300"
                        >
                          Same as shipping address
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="different-address"
                          name="billingAddress"
                          checked={!billingSame}
                          onChange={() => setBillingSame(false)}
                          className="h-4 w-4 text-[#D4AF37] focus:ring-[#D4AF37] border-gray-600"
                        />
                        <label
                          htmlFor="different-address"
                          className="ml-2 block text-sm text-gray-300"
                        >
                          Use a different billing address
                        </label>
                      </div>

                      {/* Different Billing Address Form */}
                      {!billingSame && (
                        <div className="bg-[#0A0A0A] p-4 rounded-lg border border-gray-700 mt-4 space-y-4">
                          <div>
                            <label
                              htmlFor="billingCountry"
                              className="block text-sm font-medium text-gray-300 mb-1"
                            >
                              Country
                            </label>
                            <select
                              id="billingCountry"
                              name="billingCountry"
                              value={formData.billingCountry}
                              onChange={handleChange}
                              required
                              className="w-full outline-none px-4 py-3 bg-[#1A1A1A] text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-all duration-200"
                            >
                              <option value="Pakistan">Pakistan</option>
                              <option value="USA">United States</option>
                              <option value="UK">United Kingdom</option>
                              <option value="CA">Canada</option>
                            </select>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label
                                htmlFor="billingFirstName"
                                className="block text-sm font-medium text-gray-300 mb-1"
                              >
                                First name (optional)
                              </label>
                              <input
                                type="text"
                                id="billingFirstName"
                                name="billingFirstName"
                                value={formData.billingFirstName}
                                onChange={handleChange}
                                className="w-full outline-none px-4 py-3 bg-[#1A1A1A] text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-all duration-200"
                              />
                            </div>

                            <div>
                              <label
                                htmlFor="billingLastName"
                                className="block text-sm font-medium text-gray-300 mb-1"
                              >
                                Last name
                              </label>
                              <input
                                type="text"
                                id="billingLastName"
                                name="billingLastName"
                                value={formData.billingLastName}
                                onChange={handleChange}
                                required
                                className="w-full outline-none px-4 py-3 bg-[#1A1A1A] text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-all duration-200"
                              />
                            </div>
                          </div>

                          <div>
                            <label
                              htmlFor="billingAddress"
                              className="block text-sm font-medium text-gray-300 mb-1"
                            >
                              Address
                            </label>
                            <input
                              type="text"
                              id="billingAddress"
                              name="billingAddress"
                              value={formData.billingAddress}
                              onChange={handleChange}
                              required
                              className="w-full px-4 outline-none py-3 bg-[#1A1A1A] text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-all duration-200"
                            />
                          </div>

                          <div>
                            <label
                              htmlFor="billingApartment"
                              className="block text-sm font-medium text-gray-300 mb-1"
                            >
                              Apartment, suite, etc. (optional)
                            </label>
                            <input
                              type="text"
                              id="billingApartment"
                              name="billingApartment"
                              value={formData.billingApartment}
                              onChange={handleChange}
                              className="w-full outline-none px-4 py-3 bg-[#1A1A1A] text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-all duration-200"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label
                                htmlFor="billingCity"
                                className="block text-sm font-medium text-gray-300 mb-1"
                              >
                                City
                              </label>
                              <input
                                type="text"
                                id="billingCity"
                                name="billingCity"
                                value={formData.billingCity}
                                onChange={handleChange}
                                required
                                className="w-full outline-none px-4 py-3 bg-[#1A1A1A] text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-all duration-200"
                              />
                            </div>

                            <div>
                              <label
                                htmlFor="billingZip"
                                className="block text-sm font-medium text-gray-300 mb-1"
                              >
                                Postal code (optional)
                              </label>
                              <input
                                type="text"
                                id="billingZip"
                                name="billingZip"
                                value={formData.billingZip}
                                onChange={handleChange}
                                className="w-full outline-none px-4 py-3 bg-[#1A1A1A] text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-all duration-200"
                              />
                            </div>
                          </div>

                          <div>
                            <label
                              htmlFor="billingPhone"
                              className="block text-sm font-medium text-gray-300 mb-1"
                            >
                              Phone (optional)
                            </label>
                            <input
                              type="tel"
                              id="billingPhone"
                              name="billingPhone"
                              value={formData.billingPhone}
                              onChange={handleChange}
                              className="w-full outline-none px-4 py-3 bg-[#1A1A1A] text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-all duration-200"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-white mb-4">
                      Payment Method
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => setPaymentMethod("payfast")}
                          className={`py-3 px-4 rounded-lg border ${
                            paymentMethod === "payfast"
                              ? "border-[#D4AF37] bg-[#1A1A1A] shadow-[0_0_0_1px_#D4AF37]"
                              : "border-gray-700 hover:border-gray-500"
                          } transition-all duration-200`}
                        >
                          <div className="flex flex-col items-center">
                            <span className="text-gray-300 text-sm">
                              Pay Now
                            </span>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => setPaymentMethod("cash")}
                          className={`py-3 px-4 rounded-lg border ${
                            paymentMethod === "cash"
                              ? "border-[#D4AF37] bg-[#1A1A1A] shadow-[0_0_0_1px_#D4AF37]"
                              : "border-gray-700 hover:border-gray-500"
                          } transition-all duration-200 flex flex-col items-center`}
                        >
                          <span className="text-gray-300 text-sm">
                            Cash on Delivery (COD)
                          </span>
                        </button>

                        {/* <button
                          type="button"
                          onClick={() => setPaymentMethod("bank")}
                          className={`py-3 px-4 rounded-lg border ${
                            paymentMethod === "bank"
                              ? "border-[#D4AF37] bg-[#1A1A1A] shadow-[0_0_0_1px_#D4AF37]"
                              : "border-gray-700 hover:border-gray-500"
                          } transition-all duration-200 flex flex-col items-center`}
                        >
                          <span className="text-gray-300 text-sm">
                            Bank Deposit
                          </span>
                        </button> */}
                      </div>

                      {paymentMethod === "payfast" && (
                        <div className="bg-[#0A0A0A] p-4 rounded-lg border border-gray-700">
                          <p className="text-gray-300 text-sm">
                            You will be redirected to PayFast to complete your
                            payment securely.
                          </p>
                        </div>
                      )}

                      {paymentMethod === "cash" && (
                        <div className="bg-[#0A0A0A] p-4 rounded-lg border border-gray-700">
                          <div className="flex items-start">
                            <svg
                              className="w-5 h-5 text-[#D4AF37] mt-0.5 mr-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              ></path>
                            </svg>
                            <p className="text-gray-300 text-sm">
                              Cash on Delivery includes an additional ₹90
                              charge. Payment will be collected when your order
                              is delivered.
                            </p>
                          </div>
                        </div>
                      )}

                      {paymentMethod === "bank" && (
                        <div className="bg-[#0A0A0A] p-4 rounded-lg border border-gray-700">
                          <div className="flex items-start">
                            <svg
                              className="w-5 h-5 text-[#D4AF37] mt-0.5 mr-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              ></path>
                            </svg>
                            <p className="text-gray-300 text-sm">
                              Please deposit the payment to our bank account.
                              Account details will be provided after order
                              confirmation.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-4 px-4 rounded-lg text-white font-bold ${
                      isLoading
                        ? "bg-[#D4AF37]/70 cursor-not-allowed"
                        : "bg-gradient-to-r from-[#D4AF37] to-[#F5E8B5] hover:from-[#C19C30] hover:to-[#E5D7A5] text-[#0A0A0A]"
                    } transition-all duration-200 flex items-center justify-center`}
                  >
                    {isLoading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#0A0A0A]"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </>
                    ) : paymentMethod === "payfast" ? (
                      "Proceed to PayFast"
                    ) : (
                      "Place Order"
                    )}
                  </button>
                </form>
              </div>

              {/* Right Column - Order Summary */}
              <div className="bg-[#0A0A0A] p-6 rounded-xl border border-gray-800">
                <h2 className="text-xl font-semibold text-white mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  {cart.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between pb-4 border-b border-gray-800"
                    >
                      {/* Left Section - Image + Details */}
                      <div className="flex items-center gap-4">
                        <img
                          src={item.images[0].url || item.images[0]} // handle url field or direct link
                          alt={item.title}
                          className="w-16 h-16 rounded-lg object-cover border border-gray-700"
                        />
                        <div>
                          <p className="font-medium text-white">{item.title}</p>
                          <p className="text-gray-400 text-sm">
                            Qty: {item.qty} &bull; Color:{" "}
                            {item.selectedOptions.color} &bull; Size:{" "}
                            {item.selectedOptions.size}
                          </p>
                        </div>
                      </div>

                      {/* Right Section - Price */}
                      <p className="font-medium text-white">
                        ${(item.discountPrice * item.qty).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Subtotal</span>
                    <span className="font-medium text-white">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Shipping</span>
                    <span className="font-medium text-white">
                      {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Tax</span>
                    <span className="font-medium text-white">
                      ${tax.toFixed(2)}
                    </span>
                  </div>
                  {paymentMethod === "cash" && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">COD Charge</span>
                      <span className="font-medium text-white">₹90.00</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-4 border-t border-gray-800">
                    <span className="text-lg font-semibold text-white">
                      Total
                    </span>
                    <span className="text-lg font-bold text-white">
                      {paymentMethod === "cash"
                        ? `₹${total.toFixed(2)}`
                        : `$${total.toFixed(2)}`}
                    </span>
                  </div>
                </div>

                {/* Secure Payment Box */}
                <div className="bg-[#1A1A1A] p-4 rounded-lg border border-gray-800">
                  <h3 className="font-medium text-[#D4AF37] mb-2 flex items-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      ></path>
                    </svg>
                    Secure Payment
                  </h3>
                  <p className="text-sm text-gray-400">
                    Your payment information is encrypted and securely
                    processed. We never store your credit card details.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>© 2023 Luxe Gadgets. All rights reserved.</p>
          <p className="mt-1">Need help? Contact support@luxegadgets.com</p>
        </div>
      </div>
    </div>
  );
}
