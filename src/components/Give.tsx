import React, { useState, useEffect } from 'react';
import { Heart, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface DonationFormData {
  amount: string;
  name: string;
  email: string;
  phone: string;
  message: string;
}

interface DonationResponse {
  status: string;
  message: string;
  data?: {
    link: string;
    reference: string;
  };
}

declare global {
  interface Window {
    FlutterwaveCheckout: (config: Record<string, unknown>) => void;
  }
}

const Give: React.FC = () => {
  const [formData, setFormData] = useState<DonationFormData>({
    amount: '',
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [selectedAmount, setSelectedAmount] = useState<string>('');

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.flutterwave.com/v3.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const presetAmounts = ['5000', '10000', '25000', '50000', '100000'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePresetAmount = (amount: string) => {
    setSelectedAmount(amount);
    setFormData(prev => ({
      ...prev,
      amount
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const finalAmount = formData.amount || selectedAmount;

      if (!finalAmount || !formData.name || !formData.email) {
        setError('Please fill in all required fields');
        setLoading(false);
        return;
      }

      if (!window.FlutterwaveCheckout) {
        setError('Payment system is loading. Please try again.');
        setLoading(false);
        return;
      }

      const config = {
        public_key: 'FLWPUBK_TEST-e995556f43e7826917d6dae77028eadb-X',
        tx_ref: `donation-${Date.now()}`,
        amount: parseFloat(finalAmount),
        currency: 'NGN',
        payment_options: 'card,ussd,account,qr,banktransfer',
        customer: {
          email: formData.email,
          name: formData.name,
          phonenumber: formData.phone,
        },
        customizations: {
          title: 'Shining Light Family Church',
          description: formData.message || 'Support our ministry',
          logo: 'https://raw.githubusercontent.com/makindetwinsfoundation/slfc/main/images/slfclogo-removebg-preview.png',
        },
        callback: () => {
          setSuccess(true);
          setLoading(false);
        },
        onclose: () => {
          setLoading(false);
        },
      };

      window.FlutterwaveCheckout(config);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  return (
    <section id="give" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-4">
            <Heart className="h-12 w-12 text-red-500" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Give Online
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Support our ministry and help us make a difference in our community. Your generous giving enables us to continue our mission of spreading God's love.
          </p>
        </div>

        <div className="bg-gray-50 rounded-2xl p-8 md:p-12 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-red-800">{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <p className="text-green-800">Thank you for your donation!</p>
              </div>
            )}

            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-4">
                Donation Amount
              </label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
                {presetAmounts.map(amount => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => handlePresetAmount(amount)}
                    className={`py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                      selectedAmount === amount
                        ? 'bg-blue-600 text-white shadow-lg scale-105'
                        : 'bg-white text-gray-900 border-2 border-gray-200 hover:border-blue-600'
                    }`}
                  >
                    ₦{Number(amount).toLocaleString()}
                  </button>
                ))}
              </div>
              <input
                type="number"
                name="amount"
                placeholder="Or enter custom amount"
                value={formData.amount}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 transition-colors"
                step="100"
                min="100"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 transition-colors"
                placeholder="Your full name"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 transition-colors"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Phone (Optional)
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 transition-colors"
                  placeholder="Your phone number"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Message (Optional)
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 transition-colors"
                placeholder="Add a message with your donation..."
                rows={4}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-4 px-6 rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Heart className="h-5 w-5" />
                  Continue to Payment
                </>
              )}
            </button>

            <p className="text-sm text-gray-600 text-center">
              Your donation is secure and processed through Flutterwave. We are a registered nonprofit organization.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Give;
