'use client';
import { useState } from 'react';

type Step = 'question' | 'form' | 'success';

const CRYPTO_OPTIONS = ['BTC','ETH','USDT','USDC','WCT','SOL','XRP','BNB'];

export default function MerchantOnboarding() {
  const [step, setStep] = useState<Step>('question');
  const [isDark] = useState(true);
  const [form, setForm] = useState({
    storeName: '',
    ownerName: '',
    email: '',
    phone: '',
    address: '',
    googleMapsUrl: '',
    category: '',
    description: '',
    website: '',
    acceptedCryptos: [] as string[],
    walletAddress: '',
    imageUrl: '',
    hasWCPay: true,
  });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string,string>>({});

  const toggleCrypto = (coin: string) => {
    setForm(prev => ({
      ...prev,
      acceptedCryptos: prev.acceptedCryptos.includes(coin)
        ? prev.acceptedCryptos.filter(c => c !== coin)
        : [...prev.acceptedCryptos, coin]
    }));
  };

  const validate = () => {
    const e: Record<string,string> = {};
    if (!form.storeName.trim()) e.storeName = 'Store name required';
    if (!form.email.trim()) e.email = 'Email required';
    if (!form.address.trim()) e.address = 'Address required';
    if (!form.walletAddress.trim()) e.walletAddress = 'Wallet address required';
    if (form.acceptedCryptos.length === 0) e.cryptos = 'Select at least one crypto';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 2000));
    setSubmitting(false);
    setStep('success');
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-mono">
      
      {/* Navbar - Responsive */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-6 py-3 border-b border-[#00FF94]/20"
           style={{ background: 'rgba(5,5,5,0.95)', backdropFilter: 'blur(10px)' }}>
        <a href="/" className="text-[#00FF94] font-bold tracking-widest text-xs md:text-sm">
          ◈ CRYPTO_FINDER
        </a>
        <span className="text-gray-500 text-[0.6rem] md:text-xs tracking-tighter md:tracking-normal">// MERCHANT_ONBOARDING</span>
      </nav>

      <div className="pt-24 pb-16 px-4 md:px-6 max-w-2xl mx-auto">

        {/* ━━━ STEP 1 — Question ━━━ */}
        {step === 'question' && (
          <div className="text-center">
            <p className="text-[#00FF94] text-[0.6rem] md:text-xs tracking-widest mb-2">// MERCHANT_PORTAL</p>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">List Your Store</h1>
            <p className="text-gray-500 text-xs md:text-sm mb-8 md:mb-12">
              Join the WalletConnect Pay merchant network
            </p>

            <div className="border border-[#00FF94]/30 p-4 md:p-6 mb-8">
              <p className="text-[#00FF94] text-[0.6rem] md:text-xs mb-4">// FIRST — TELL US YOUR STATUS</p>
              <p className="text-white text-base md:text-lg mb-8">
                Does your store already have<br/>
                <span className="text-[#00FF94] font-bold">WalletConnect Pay</span> integrated?
              </p>

              <div className="grid grid-cols-1 gap-4">
                {/* YES Option */}
                <button
                  onClick={() => { setForm(p => ({...p, hasWCPay: true})); setStep('form'); }}
                  className="group border border-[#00FF94]/40 hover:border-[#00FF94] 
                             hover:bg-[#00FF94]/5 p-4 md:p-5 text-left transition-all"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xl md:text-2xl">✅</span>
                    <span className="text-[#00FF94] font-bold text-sm md:text-base">Yes, we have WalletConnect Pay</span>
                  </div>
                  <p className="text-gray-500 text-xs md:text-sm pl-8 md:pl-9">
                    My store already accepts crypto payments via WalletConnect Pay. 
                    I want to list my store on the finder map.
                  </p>
                  <div className="mt-3 pl-8 md:pl-9">
                    <span className="text-[0.6rem] md:text-xs border border-[#00FF94]/40 text-[#00FF94] px-2 py-1">
                      → FILL STORE DETAILS
                    </span>
                  </div>
                </button>

                {/* NO Option */}
                <button
                  onClick={() => window.open('https://walletconnect.com/partners', '_blank')}
                  className="group border border-gray-600/40 hover:border-gray-400 
                             hover:bg-white/5 p-4 md:p-5 text-left transition-all"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xl md:text-2xl">🔗</span>
                    <span className="text-white font-bold text-sm md:text-base">No, I want to integrate it first</span>
                  </div>
                  <p className="text-gray-500 text-xs md:text-sm pl-8 md:pl-9">
                    I want to add WalletConnect Pay to my store. 
                    Take me to the official integration guide.
                  </p>
                  <div className="mt-3 pl-8 md:pl-9 flex gap-2">
                    <span className="text-[0.6rem] md:text-xs border border-gray-500/40 text-gray-400 px-2 py-1">
                      → OFFICIAL DOCS
                    </span>
                    <span className="text-[0.6rem] md:text-xs border border-blue-500/40 text-blue-400 px-2 py-1">
                      ↗ WALLETCONNECT.COM
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* Stats bar - Smaller values on mobile */}
            <div className="grid grid-cols-3 gap-2 md:gap-4 border border-[#00FF94]/10 p-4">
              {[
                { label: 'MERCHANTS', value: '2,400+' },
                { label: 'COUNTRIES', value: '89' },
                { label: 'USERS', value: '50K+' },
              ].map(stat => (
                <div key={stat.label} className="text-center overflow-hidden">
                  <p className="text-[#00FF94] font-bold text-lg md:text-xl">{stat.value}</p>
                  <p className="text-gray-600 text-[0.55rem] md:text-xs uppercase truncate">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ━━━ STEP 2 — Form ━━━ */}
        {step === 'form' && (
          <div>
            <button onClick={() => setStep('question')} 
                    className="text-gray-500 text-xs hover:text-white mb-6 flex items-center gap-2">
              ← BACK
            </button>
            
            <p className="text-[#00FF94] text-[0.6rem] md:text-xs tracking-widest mb-2">// STORE_REGISTRATION</p>
            <h1 className="text-xl md:text-2xl font-bold mb-1">Register Your Store</h1>
            <p className="text-gray-500 text-xs md:text-sm mb-8">
              Fill in your store details to appear on the grid
            </p>

            <div className="space-y-6">

              {/* Section: Basic Info */}
              <div className="border border-[#00FF94]/20 p-4 md:p-5">
                <p className="text-[#00FF94] text-[0.6rem] md:text-xs mb-4">// BASIC_INFORMATION</p>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-[0.6rem] md:text-xs text-gray-400 block mb-1 uppercase">STORE NAME *</label>
                    <input
                      type="text"
                      placeholder="e.g. Bitcoin Coffee Lahore"
                      value={form.storeName}
                      onChange={e => setForm(p => ({...p, storeName: e.target.value}))}
                      className="w-full bg-black border border-[#00FF94]/30 focus:border-[#00FF94] 
                                 text-white p-2 md:p-3 text-sm outline-none transition-colors"
                    />
                    {errors.storeName && <p className="text-red-400 text-[0.65rem] mt-1">{errors.storeName}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[0.6rem] md:text-xs text-gray-400 block mb-1 uppercase">OWNER NAME</label>
                      <input
                        type="text"
                        placeholder="Your full name"
                        value={form.ownerName}
                        onChange={e => setForm(p => ({...p, ownerName: e.target.value}))}
                        className="w-full bg-black border border-[#00FF94]/30 focus:border-[#00FF94] 
                                   text-white p-2 md:p-3 text-sm outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-[0.6rem] md:text-xs text-gray-400 block mb-1 uppercase">BUSINESS EMAIL *</label>
                      <input
                        type="email"
                        placeholder="store@example.com"
                        value={form.email}
                        onChange={e => setForm(p => ({...p, email: e.target.value}))}
                        className="w-full bg-black border border-[#00FF94]/30 focus:border-[#00FF94] 
                                   text-white p-2 md:p-3 text-sm outline-none transition-colors"
                      />
                      {errors.email && <p className="text-red-400 text-[0.65rem] mt-1">{errors.email}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[0.6rem] md:text-xs text-gray-400 block mb-1 uppercase">PHONE</label>
                      <input
                        type="text"
                        placeholder="+1 234 567 8900"
                        value={form.phone}
                        onChange={e => setForm(p => ({...p, phone: e.target.value}))}
                        className="w-full bg-black border border-[#00FF94]/30 focus:border-[#00FF94] 
                                   text-white p-2 md:p-3 text-sm outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-[0.6rem] md:text-xs text-gray-400 block mb-1 uppercase">WEBSITE</label>
                      <input
                        type="text"
                        placeholder="https://yourstore.com"
                        value={form.website}
                        onChange={e => setForm(p => ({...p, website: e.target.value}))}
                        className="w-full bg-black border border-[#00FF94]/30 focus:border-[#00FF94] 
                                   text-white p-2 md:p-3 text-sm outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[0.6rem] md:text-xs text-gray-400 block mb-1 uppercase">STORE CATEGORY</label>
                    <select
                      value={form.category}
                      onChange={e => setForm(p => ({...p, category: e.target.value}))}
                      className="w-full bg-black border border-[#00FF94]/30 focus:border-[#00FF94] 
                                 text-white p-2 md:p-3 text-sm outline-none transition-colors"
                    >
                      <option value="">Select category...</option>
                      {['Cafe / Coffee Shop','Restaurant','Bar / Pub','Retail Shop',
                        'Electronics','Clothing & Fashion','Hotel / Hostel',
                        'Beauty & Spa','Fitness / Gym','Crypto Exchange / ATM',
                        'Co-working Space','Other'].map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[0.6rem] md:text-xs text-gray-400 block mb-1 uppercase">DESCRIPTION</label>
                    <textarea
                      placeholder="Tell customers about your store..."
                      value={form.description}
                      onChange={e => setForm(p => ({...p, description: e.target.value}))}
                      rows={3}
                      className="w-full bg-black border border-[#00FF94]/30 focus:border-[#00FF94] 
                                 text-white p-2 md:p-3 text-sm outline-none transition-colors resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Section: Location */}
              <div className="border border-[#00FF94]/20 p-4 md:p-5">
                <p className="text-[#00FF94] text-[0.6rem] md:text-xs mb-4">// LOCATION_DETAILS</p>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-[0.6rem] md:text-xs text-gray-400 block mb-1 uppercase">FULL ADDRESS *</label>
                    <input
                      type="text"
                      placeholder="Street, City, Country"
                      value={form.address}
                      onChange={e => setForm(p => ({...p, address: e.target.value}))}
                      className="w-full bg-black border border-[#00FF94]/30 focus:border-[#00FF94] 
                                 text-white p-2 md:p-3 text-sm outline-none transition-colors"
                    />
                    {errors.address && <p className="text-red-400 text-[0.65rem] mt-1">{errors.address}</p>}
                  </div>

                  <div>
                    <label className="text-[0.6rem] md:text-xs text-gray-400 block mb-1 uppercase">
                      GOOGLE MAPS LINK
                    </label>
                    <input
                      type="text"
                      placeholder="Paste your store maps link"
                      value={form.googleMapsUrl}
                      onChange={e => setForm(p => ({...p, googleMapsUrl: e.target.value}))}
                      className="w-full bg-black border border-[#00FF94]/30 focus:border-[#00FF94] 
                                 text-white p-2 md:p-3 text-sm outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-[0.6rem] md:text-xs text-gray-400 block mb-1 uppercase">STORE IMAGE URL</label>
                    <input
                      type="text"
                      placeholder="https://yourstore.com/image.jpg"
                      value={form.imageUrl}
                      onChange={e => setForm(p => ({...p, imageUrl: e.target.value}))}
                      className="w-full bg-black border border-[#00FF94]/30 focus:border-[#00FF94] 
                                 text-white p-2 md:p-3 text-sm outline-none transition-colors"
                    />
                    {form.imageUrl && (
                      <img src={form.imageUrl} alt="preview"
                           className="mt-2 h-32 w-full object-cover border border-[#00FF94]/20" />
                    )}
                  </div>
                </div>
              </div>

              {/* Section: Crypto */}
              <div className="border border-[#00FF94]/20 p-4 md:p-5">
                <p className="text-[#00FF94] text-[0.6rem] md:text-xs mb-4">// CRYPTO_DETAILS</p>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-[0.6rem] md:text-xs text-gray-400 block mb-2 uppercase">
                      ACCEPTED CRYPTOCURRENCIES *
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {CRYPTO_OPTIONS.map(coin => (
                        <button
                          key={coin}
                          onClick={() => toggleCrypto(coin)}
                          className={`px-2 py-2 md:px-3 text-xs border transition-all ${
                            form.acceptedCryptos.includes(coin)
                              ? 'bg-[#00FF94] text-black border-[#00FF94] font-bold'
                              : 'bg-transparent text-[#00FF94] border-[#00FF94]/40 hover:border-[#00FF94]'
                          }`}
                        >
                          {coin}
                        </button>
                      ))}
                    </div>
                    {errors.cryptos && <p className="text-red-400 text-[0.65rem] mt-1">{errors.cryptos}</p>}
                  </div>

                  <div>
                    <label className="text-[0.6rem] md:text-xs text-gray-400 block mb-1 uppercase">
                      YOUR WALLET ADDRESS *
                    </label>
                    <input
                      type="text"
                      placeholder="0x... or bc1..."
                      value={form.walletAddress}
                      onChange={e => setForm(p => ({...p, walletAddress: e.target.value}))}
                      className="w-full bg-black border border-[#00FF94]/30 focus:border-[#00FF94] 
                                 text-white p-2 md:p-3 text-sm outline-none transition-colors font-mono"
                    />
                    {errors.walletAddress && <p className="text-red-400 text-[0.65rem] mt-1">{errors.walletAddress}</p>}
                  </div>
                </div>
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full bg-[#00FF94] text-black font-bold py-4 text-sm
                           hover:bg-transparent hover:text-[#00FF94] border border-[#00FF94]
                           transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest"
              >
                {submitting ? '// SUBMITTING...' : '// SUBMIT FOR VERIFICATION →'}
              </button>

              <p className="text-center text-gray-600 text-[0.6rem] md:text-xs uppercase leading-relaxed">
                Your store will be reviewed within 24-48 hours.<br/>
                Once approved, it will appear on the map globally.
              </p>
            </div>
          </div>
        )}

        {/* ━━━ STEP 3 — Success ━━━ */}
        {step === 'success' && (
          <div className="text-center py-12 md:py-16 px-4">
            <div className="text-4xl md:text-6xl mb-6">✅</div>
            <p className="text-[#00FF94] text-[0.6rem] md:text-xs tracking-widest mb-2 uppercase">// SUBMISSION_RECEIVED</p>
            <h1 className="text-xl md:text-2xl font-bold text-white mb-4 uppercase">
              Store Submitted Successfully!
            </h1>
            <p className="text-gray-400 text-xs md:text-sm mb-8 max-w-md mx-auto leading-relaxed">
              Thank you <span className="text-white uppercase">{form.storeName}</span>! 
              Your store has been submitted for verification. 
              We will notify you at <span className="text-[#00FF94]">{form.email}</span> soon.
            </p>

            <div className="border border-[#00FF94]/20 p-5 md:p-6 mb-8 text-left max-w-md mx-auto bg-white/5">
              <p className="text-[#00FF94] text-[0.6rem] md:text-xs mb-4 uppercase tracking-widest">// NEXT_STEPS</p>
              {[
                { step: '01', text: 'Team reviews store details' },
                { step: '02', text: 'Wallet verification on-chain' },
                { step: '03', text: 'Verified badge assignment' },
                { step: '04', text: 'Store goes live on grid' },
              ].map(item => (
                <div key={item.step} className="flex gap-3 mb-3 items-center">
                  <span className="text-[#00FF94] font-bold text-xs md:text-sm tracking-tighter">// {item.step}</span>
                  <span className="text-gray-300 text-[0.7rem] md:text-sm uppercase">{item.text}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col md:flex-row gap-3 justify-center">
              <a href="/"
                 className="w-full md:w-auto border border-[#00FF94] text-[#00FF94] px-6 py-3 text-sm font-mono hover:bg-[#00FF94] hover:text-black transition-all uppercase">
                ← BACK TO FINDER
              </a>
              <button
                onClick={() => { setStep('question'); setForm({storeName:'',ownerName:'',email:'',phone:'',address:'',googleMapsUrl:'',category:'',description:'',website:'',acceptedCryptos:[],walletAddress:'',imageUrl:'',hasWCPay:true}); }}
                className="w-full md:w-auto border border-gray-600 text-gray-400 px-6 py-3 text-sm font-mono hover:border-white hover:text-white transition-all uppercase">
                + ADD ANOTHER
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
