import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Copy,
  Eye,
  EyeOff,
  LogIn,
  LogOut,
  MessageCircle,
  ShieldCheck,
  UserPlus,
} from 'lucide-react';
import { Department, DesignMode, RegisteredUser } from '../types';
import {
  buildWhatsAppUrl,
  copyTextToClipboard,
  formatRegistrationWhatsAppMessage,
} from '../utils/whatsapp';

interface RegisterScreenProps {
  mode: DesignMode;
  registeredUser: RegisteredUser | null;
  savedAccounts: RegisteredUser[];
  onSaveRegistration: (user: RegisteredUser) => void;
  onSignInUser: (user: RegisteredUser) => void;
  onClearRegistration: () => void;
  onBrowseDepartment: (dept: Department) => void;
  onBackHome: () => void;
}

const SIZE_SCALES: Record<Department, string[]> = {
  men: ['7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '12', '13'],
  women: ['5', '5.5', '6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10'],
  kids: ['1Y', '1.5Y', '2Y', '2.5Y', '3Y', '3.5Y', '4Y', '4.5Y', '5Y', '6Y'],
};

function computePassDigest(raw: string): string {
  let h1 = 0x811c9dc5;
  let h2 = 0x9e3779b9;
  for (let i = 0; i < raw.length; i++) {
    const code = raw.charCodeAt(i);
    h1 ^= code;
    h1 = Math.imul(h1, 0x01000193);
    h2 ^= code + i;
    h2 = Math.imul(h2, 0x85ebca6b);
  }
  return `${(h1 >>> 0).toString(16)}-${(h2 >>> 0).toString(16)}`;
}

export function RegisterScreen({
  mode,
  registeredUser,
  savedAccounts,
  onSaveRegistration,
  onSignInUser,
  onClearRegistration,
  onBrowseDepartment,
  onBackHome,
}: RegisterScreenProps) {
  const isObsidian = mode === 'obsidian';

  const [authTab, setAuthTab] = useState<'signup' | 'signin'>('signup');
  const [isEditing, setIsEditing] = useState(!registeredUser);
  const [fullName, setFullName] = useState(registeredUser?.fullName || '');
  const [email, setEmail] = useState(registeredUser?.email || '');
  const [whatsappPhone, setWhatsappPhone] = useState(
    registeredUser?.whatsappPhone || ''
  );
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [preferredDepartment, setPreferredDepartment] = useState<Department>(
    registeredUser?.preferredDepartment || 'men'
  );
  const [preferredUsSize, setPreferredUsSize] = useState(
    registeredUser?.preferredUsSize || '9.5'
  );
  const [city, setCity] = useState(registeredUser?.city || '');
  const [shippingAddress, setShippingAddress] = useState(
    registeredUser?.shippingAddress || ''
  );
  const [notifyWhatsappDrops, setNotifyWhatsappDrops] = useState(
    registeredUser ? registeredUser.notifyWhatsappDrops : true
  );
  const [acceptedTerms, setAcceptedTerms] = useState(true);

  const [signInIdentifier, setSignInIdentifier] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [copiedPass, setCopiedPass] = useState(false);

  useEffect(() => {
    if (registeredUser) {
      setFullName(registeredUser.fullName);
      setEmail(registeredUser.email);
      setWhatsappPhone(registeredUser.whatsappPhone);
      setPreferredDepartment(registeredUser.preferredDepartment);
      setPreferredUsSize(registeredUser.preferredUsSize);
      setCity(registeredUser.city);
      setShippingAddress(registeredUser.shippingAddress);
      setNotifyWhatsappDrops(registeredUser.notifyWhatsappDrops);
    } else {
      setFullName('');
      setEmail('');
      setWhatsappPhone('');
      setCity('');
      setShippingAddress('');
      setNotifyWhatsappDrops(true);
    }
    setPassword('');
    setConfirmPassword('');
  }, [registeredUser]);

  const handleDepartmentChange = (dept: Department) => {
    setPreferredDepartment(dept);
    const sizes = SIZE_SCALES[dept];
    if (!sizes.includes(preferredUsSize)) {
      setPreferredUsSize(sizes[Math.floor(sizes.length / 2)] || sizes[0]);
    }
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (whatsappPhone.replace(/[^\d]/g, '').length < 7) {
      setErrorMsg('Please enter a valid WhatsApp phone number.');
      return;
    }

    let nextDigest = registeredUser?.passDigest;
    if (!registeredUser || password.length > 0 || confirmPassword.length > 0) {
      if (password.length < 6) {
        setErrorMsg('Password must be at least 6 characters.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match.');
        return;
      }
      nextDigest = computePassDigest(password);
    }

    if (!city.trim() || !shippingAddress.trim()) {
      setErrorMsg('Please enter your city and street shipping address.');
      return;
    }
    if (!acceptedTerms) {
      setErrorMsg('Please accept the 30-day return & retention terms.');
      return;
    }

    const nextUser: RegisteredUser = {
      memberId:
        registeredUser?.memberId ||
        `PX1-MBR-${Math.floor(1000 + Math.random() * 9000)}`,
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      whatsappPhone: whatsappPhone.trim(),
      preferredDepartment,
      preferredUsSize,
      city: city.trim(),
      shippingAddress: shippingAddress.trim(),
      notifyWhatsappDrops,
      registeredAt:
        registeredUser?.registeredAt ||
        new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
      passDigest: nextDigest,
    };

    onSaveRegistration(nextUser);
    setPassword('');
    setConfirmPassword('');
    setIsEditing(false);
  };

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const idQuery = signInIdentifier.trim().toLowerCase();
    if (!idQuery) {
      setErrorMsg('Enter your registered email or Member ID.');
      return;
    }
    if (!signInPassword) {
      setErrorMsg('Enter your password.');
      return;
    }

    const matched = savedAccounts.find(
      (acc) =>
        acc.email.toLowerCase() === idQuery ||
        acc.memberId.toLowerCase() === idQuery
    );

    if (!matched) {
      setErrorMsg('No account found for that email or Member ID. Please Sign Up first.');
      return;
    }

    if (
      matched.passDigest &&
      computePassDigest(signInPassword) !== matched.passDigest
    ) {
      setErrorMsg('Incorrect password. Please try again.');
      return;
    }

    onSignInUser(matched);
    setSignInPassword('');
    setIsEditing(false);
  };

  const handleCopyPass = async (user: RegisteredUser) => {
    const ok = await copyTextToClipboard(
      formatRegistrationWhatsAppMessage(user)
    );
    if (ok) {
      setCopiedPass(true);
      window.setTimeout(() => setCopiedPass(false), 1800);
    }
  };

  const inputClass = `w-full h-11 px-3.5 text-base sm:text-sm outline-none transition-colors ${
    isObsidian
      ? 'rounded-lg bg-[#09090b] border border-zinc-800 text-white placeholder:text-zinc-500 focus:border-[#ccff00]'
      : 'rounded-none bg-[#f4f4f5] border border-[#0d0d0e] text-[#0d0d0e] placeholder:text-[#767676] focus:border-[#e5001a]'
  }`;

  const labelClass = `block text-[11px] font-bold uppercase tracking-wider mb-1.5 ${
    isObsidian ? 'text-zinc-400' : 'text-[#5f5e5f]'
  }`;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 space-y-8">
      {/* Top Breadcrumb */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBackHome}
          className={`inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider cursor-pointer transition-colors ${
            isObsidian
              ? 'text-zinc-400 hover:text-[#ccff00]'
              : 'text-[#5f5e5f] hover:text-[#0d0d0e]'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Storefront</span>
        </button>

        <span
          className={`text-xs font-mono-tech ${
            isObsidian ? 'text-zinc-400' : 'text-[#5f5e5f]'
          }`}
        >
          30-Day Profile Retention · Express Checkout Sync
        </span>
      </div>

      {/* Section Header */}
      <div className="space-y-2">
        <div
          className={`text-xs font-bold uppercase tracking-wider ${
            isObsidian ? 'text-[#ccff00]' : 'text-[#e5001a] font-display-apex'
          }`}
        >
          PRO-X1 SHOE Member Access
        </div>
        <h1
          className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${
            isObsidian
              ? 'font-display-obsidian text-white'
              : 'font-display-apex uppercase text-[#0d0d0e]'
          }`}
        >
          {registeredUser && !isEditing
            ? `Welcome, ${registeredUser.fullName}`
            : authTab === 'signin' && !registeredUser
              ? 'Sign In to Your Account'
              : 'Sign Up for PRO-X1 SHOE'}
        </h1>
        <p
          className={`text-sm max-w-2xl ${
            isObsidian ? 'text-zinc-400' : 'text-[#5f5e5f]'
          }`}
        >
          Sign up to lock 75% off all shoes, claim a complimentary free product
          with every pair, activate free first-order transport, and auto-fill
          WhatsApp tracking &amp; delivery details.
        </p>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Active Pass or Sign Up / Sign In Form */}
        <div className="lg:col-span-7">
          {registeredUser && !isEditing ? (
            <div
              className={`p-4 sm:p-8 space-y-6 ${
                isObsidian
                  ? 'rounded-2xl bg-[#18181b] border border-[#ccff00]/40'
                  : 'rounded-none bg-white border border-[#0d0d0e] apex-hard-shadow'
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2
                    className={`w-6 h-6 shrink-0 mt-0.5 ${
                      isObsidian ? 'text-[#ccff00]' : 'text-[#e5001a]'
                    }`}
                  />
                  <div>
                    <div className="text-xs font-mono-tech uppercase opacity-75">
                      Member ID {registeredUser.memberId} · Joined{' '}
                      {registeredUser.registeredAt}
                    </div>
                    <h2 className="text-xl font-extrabold mt-0.5">
                      {registeredUser.fullName}
                    </h2>
                    <div
                      className={`text-xs mt-1 ${
                        isObsidian ? 'text-zinc-400' : 'text-[#5f5e5f]'
                      }`}
                    >
                      {registeredUser.email} · {registeredUser.whatsappPhone}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setAuthTab('signup');
                    setIsEditing(true);
                  }}
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors ${
                    isObsidian
                      ? 'rounded-full border border-zinc-700 text-white hover:border-[#ccff00]'
                      : 'rounded-none border border-[#0d0d0e] text-[#0d0d0e] hover:bg-[#0d0d0e] hover:text-white'
                  }`}
                >
                  Edit Details
                </button>
              </div>

              <div
                className={`grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 ${
                  isObsidian
                    ? 'rounded-xl bg-[#09090b] border border-zinc-800'
                    : 'rounded-none bg-[#f4f4f5] border border-[#0d0d0e]'
                }`}
              >
                <div>
                  <div className="text-[11px] uppercase tracking-wider opacity-65">
                    Preferred Collection &amp; Size
                  </div>
                  <div className="text-sm font-bold font-mono-tech mt-1 uppercase">
                    {registeredUser.preferredDepartment} · US{' '}
                    {registeredUser.preferredUsSize}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wider opacity-65">
                    WhatsApp Drop Alerts
                  </div>
                  <div className="text-sm font-bold mt-1">
                    {registeredUser.notifyWhatsappDrops
                      ? 'Enabled for Drops & Orders'
                      : 'Order Tracking Only'}
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <div className="text-[11px] uppercase tracking-wider opacity-65">
                    Saved Delivery Destination
                  </div>
                  <div className="text-sm font-medium mt-1">
                    {registeredUser.shippingAddress}, {registeredUser.city}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() =>
                    onBrowseDepartment(registeredUser.preferredDepartment)
                  }
                  className={`min-h-[44px] w-full sm:w-auto px-5 py-3 text-xs font-bold uppercase tracking-wider text-center cursor-pointer transition-colors ${
                    isObsidian
                      ? 'rounded-full bg-[#ccff00] text-[#09090b] hover:bg-[#d8ff33]'
                      : 'rounded-none bg-[#0d0d0e] text-white hover:bg-[#e5001a]'
                  }`}
                >
                  Shop {registeredUser.preferredDepartment}&apos;s Shoes
                </button>

                <a
                  href={buildWhatsAppUrl(
                    formatRegistrationWhatsAppMessage(registeredUser),
                    registeredUser.whatsappPhone
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`min-h-[44px] w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${
                    isObsidian
                      ? 'rounded-full bg-[#25D366] text-[#09090b] hover:bg-[#34e073]'
                      : 'rounded-none border border-[#0d0d0e] bg-white text-[#0d0d0e] hover:bg-[#0d0d0e] hover:text-white'
                  }`}
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send Pass on WhatsApp</span>
                </a>

                <button
                  type="button"
                  onClick={() => handleCopyPass(registeredUser)}
                  className={`min-h-[44px] inline-flex items-center justify-center gap-1.5 px-4 py-3 text-xs font-semibold cursor-pointer ${
                    isObsidian
                      ? 'rounded-full border border-zinc-700 text-zinc-200 hover:border-white'
                      : 'rounded-none border border-[#0d0d0e] text-[#0d0d0e] hover:bg-[#f4f4f5]'
                  }`}
                >
                  {copiedPass ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onClearRegistration();
                    setAuthTab('signin');
                    setIsEditing(true);
                  }}
                  className="min-h-[44px] inline-flex items-center gap-1.5 px-3 py-3 text-xs font-semibold opacity-75 hover:opacity-100 cursor-pointer ml-auto"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          ) : (
            <div
              className={`p-4 sm:p-8 space-y-6 ${
                isObsidian
                  ? 'rounded-2xl bg-[#18181b] border border-zinc-800'
                  : 'rounded-none bg-white border border-[#0d0d0e] apex-hard-shadow'
              }`}
            >
              {/* Sign Up / Sign In Tab Switcher */}
              {!registeredUser && (
                <div
                  className={`grid grid-cols-2 sm:inline-flex items-center p-1 w-full sm:w-auto ${
                    isObsidian
                      ? 'rounded-full bg-[#09090b] border border-zinc-800'
                      : 'rounded-none bg-[#f4f4f5] border border-[#0d0d0e]'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setAuthTab('signup');
                      setErrorMsg('');
                    }}
                    className={`min-h-[40px] inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors ${
                      isObsidian
                        ? `rounded-full ${
                            authTab === 'signup'
                              ? 'bg-[#ccff00] text-[#09090b]'
                              : 'text-zinc-400 hover:text-white'
                          }`
                        : `rounded-none ${
                            authTab === 'signup'
                              ? 'bg-[#0d0d0e] text-white'
                              : 'text-[#5f5e5f] hover:text-[#0d0d0e]'
                          }`
                    }`}
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Sign Up</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthTab('signin');
                      setErrorMsg('');
                    }}
                    className={`min-h-[40px] inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors ${
                      isObsidian
                        ? `rounded-full ${
                            authTab === 'signin'
                              ? 'bg-[#ccff00] text-[#09090b]'
                              : 'text-zinc-400 hover:text-white'
                          }`
                        : `rounded-none ${
                            authTab === 'signin'
                              ? 'bg-[#0d0d0e] text-white'
                              : 'text-[#5f5e5f] hover:text-[#0d0d0e]'
                          }`
                    }`}
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Sign In</span>
                  </button>
                </div>
              )}

              {errorMsg && (
                <div
                  role="alert"
                  className={`p-3.5 text-xs font-semibold border ${
                    isObsidian
                      ? 'rounded-xl bg-[#ff3b30]/15 border-[#ff3b30] text-[#ff6961]'
                      : 'rounded-none bg-[#e5001a]/10 border-[#e5001a] text-[#e5001a]'
                  }`}
                >
                  {errorMsg}
                </div>
              )}

              {authTab === 'signin' && !registeredUser ? (
                <form
                  onSubmit={handleSignInSubmit}
                  noValidate
                  className="space-y-4"
                >
                  <div>
                    <label htmlFor="signin-id" className={labelClass}>
                      Email Address or Member ID *
                    </label>
                    <input
                      id="signin-id"
                      type="text"
                      required
                      value={signInIdentifier}
                      onChange={(e) => setSignInIdentifier(e.target.value)}
                      placeholder="you@example.com or PX1-MBR-XXXX"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label htmlFor="signin-password" className={labelClass}>
                      Password *
                    </label>
                    <div className="relative">
                      <input
                        id="signin-password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={signInPassword}
                        onChange={(e) => setSignInPassword(e.target.value)}
                        placeholder="Enter your password"
                        className={`${inputClass} pr-10`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label={
                          showPassword ? 'Hide password' : 'Show password'
                        }
                        className="w-9 h-9 flex items-center justify-center absolute right-1.5 top-1/2 -translate-y-1/2 opacity-65 hover:opacity-100 cursor-pointer"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className={`w-full h-12 inline-flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider cursor-pointer transition-transform duration-150 active:scale-[0.98] ${
                      isObsidian
                        ? 'rounded-full bg-[#ccff00] text-[#09090b] hover:bg-[#d8ff33] volt-glow'
                        : 'rounded-none bg-[#0d0d0e] text-white hover:bg-[#e5001a] apex-hard-shadow-sm'
                    }`}
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Sign In</span>
                  </button>

                  <div className="text-xs text-center pt-1 opacity-80">
                    New to PRO-X1 SHOE?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setAuthTab('signup');
                        setErrorMsg('');
                      }}
                      className="underline font-bold cursor-pointer"
                    >
                      Sign Up here
                    </button>
                  </div>
                </form>
              ) : (
                <form
                  onSubmit={handleSignUpSubmit}
                  noValidate
                  className="space-y-5"
                >
                  <div className="flex items-center justify-between gap-2 pb-3 border-b border-zinc-800/20 dark:border-zinc-800">
                    <div className="flex items-center gap-2">
                      <UserPlus
                        className={`w-4 h-4 ${
                          isObsidian ? 'text-[#ccff00]' : 'text-[#e5001a]'
                        }`}
                      />
                      <h2 className="text-sm font-bold uppercase tracking-wider">
                        {registeredUser
                          ? 'Update Profile'
                          : 'Sign Up Form — Free Membership'}
                      </h2>
                    </div>
                    {registeredUser && (
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="text-xs underline cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="reg-fullname" className={labelClass}>
                        Full Name *
                      </label>
                      <input
                        id="reg-fullname"
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Hamza Tariq"
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label htmlFor="reg-email" className={labelClass}>
                        Email Address *
                      </label>
                      <input
                        id="reg-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label htmlFor="reg-phone" className={labelClass}>
                        WhatsApp Number *
                      </label>
                      <input
                        id="reg-phone"
                        type="tel"
                        required
                        value={whatsappPhone}
                        onChange={(e) => setWhatsappPhone(e.target.value)}
                        placeholder="+92 300 5550194"
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label htmlFor="reg-city" className={labelClass}>
                        City *
                      </label>
                      <input
                        id="reg-city"
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. Karachi / Lahore / Islamabad"
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label htmlFor="reg-password" className={labelClass}>
                        {registeredUser
                          ? 'New Password (optional)'
                          : 'Create Password *'}
                      </label>
                      <div className="relative">
                        <input
                          id="reg-password"
                          type={showPassword ? 'text' : 'password'}
                          required={!registeredUser}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Min 6 characters"
                          className={`${inputClass} pr-10`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          aria-label={
                            showPassword ? 'Hide password' : 'Show password'
                          }
                          className="w-9 h-9 flex items-center justify-center absolute right-1.5 top-1/2 -translate-y-1/2 opacity-65 hover:opacity-100 cursor-pointer"
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="reg-confirm-password"
                        className={labelClass}
                      >
                        Confirm Password {registeredUser ? '(if changing)' : '*'}
                      </label>
                      <input
                        id="reg-confirm-password"
                        type={showPassword ? 'text' : 'password'}
                        required={!registeredUser}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter password"
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label htmlFor="reg-dept" className={labelClass}>
                        Footwear Department
                      </label>
                      <select
                        id="reg-dept"
                        value={preferredDepartment}
                        onChange={(e) =>
                          handleDepartmentChange(e.target.value as Department)
                        }
                        className={inputClass}
                      >
                        <option value="men">Men&apos;s Performance</option>
                        <option value="women">Women&apos;s Precision</option>
                        <option value="kids">Kids&apos; Track &amp; Speed</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="reg-size" className={labelClass}>
                        Preferred US Size
                      </label>
                      <select
                        id="reg-size"
                        value={preferredUsSize}
                        onChange={(e) => setPreferredUsSize(e.target.value)}
                        className={inputClass}
                      >
                        {SIZE_SCALES[preferredDepartment].map((sz) => (
                          <option key={sz} value={sz}>
                            US {sz}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="reg-address" className={labelClass}>
                      Delivery Street Address *
                    </label>
                    <input
                      id="reg-address"
                      type="text"
                      required
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      placeholder="House / Street / Sector for 1st-order free transport"
                      className={inputClass}
                    />
                  </div>

                  <div className="space-y-2.5 pt-1 text-xs">
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifyWhatsappDrops}
                        onChange={(e) =>
                          setNotifyWhatsappDrops(e.target.checked)
                        }
                        className="mt-0.5 accent-[#ccff00]"
                      />
                      <span>
                        Sync my WhatsApp number for 75% off drop alerts, restock
                        notifications, and order tracking receipts.
                      </span>
                    </label>

                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={acceptedTerms}
                        onChange={(e) => setAcceptedTerms(e.target.checked)}
                        className="mt-0.5 accent-[#ccff00]"
                      />
                      <span>
                        I agree to the 30-day wear-test return policy and 30-day
                        retained account storage.
                      </span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className={`w-full h-12 inline-flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider cursor-pointer transition-transform duration-150 active:scale-[0.98] ${
                      isObsidian
                        ? 'rounded-full bg-[#ccff00] text-[#09090b] hover:bg-[#d8ff33] volt-glow'
                        : 'rounded-none bg-[#0d0d0e] text-white hover:bg-[#e5001a] apex-hard-shadow-sm'
                    }`}
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>
                      {registeredUser ? 'Save Account Changes' : 'Sign Up Now'}
                    </span>
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Member Perks Breakdown */}
        <aside
          className={`lg:col-span-5 p-6 sm:p-8 space-y-5 ${
            isObsidian
              ? 'rounded-2xl bg-[#18181b] border border-zinc-800'
              : 'rounded-none bg-[#f4f4f5] border border-[#0d0d0e]'
          }`}
        >
          <div className="flex items-center gap-2">
            <ShieldCheck
              className={`w-5 h-5 ${
                isObsidian ? 'text-[#ccff00]' : 'text-[#e5001a]'
              }`}
            />
            <h2 className="text-sm font-bold uppercase tracking-wider">
              Included When You Sign Up
            </h2>
          </div>

          <ul className="space-y-4 text-sm">
            {[
              {
                title: '75% Off All Footwear (PKR)',
                detail:
                  'Instant access to 75%-off marathon, track, and trail models across Men, Women, and Kids collections.',
              },
              {
                title: '+1 Free Product With Every Shoe',
                detail:
                  'Every shoe pair automatically ships with a matching complimentary gear item at PKR 0.',
              },
              {
                title: 'Free First-Order Transport',
                detail:
                  'Courier transport charges are waived automatically on your first completed order.',
              },
              {
                title: '30-Day Retention & Returns',
                detail:
                  'Your account, bag, wishlist, and order receipts stay saved for 30 days alongside a 30-day wear-test return window.',
              },
              {
                title: '1-Click Checkout & WhatsApp Auto-Fill',
                detail:
                  'Pre-populates your name, WhatsApp number, and shipping address in the shopping bag and drop dispatch alerts.',
              },
            ].map((perk) => (
              <li
                key={perk.title}
                className={`p-3.5 border ${
                  isObsidian
                    ? 'rounded-xl bg-[#09090b] border-zinc-800'
                    : 'rounded-none bg-white border-[#0d0d0e]'
                }`}
              >
                <div
                  className={`text-xs font-bold uppercase tracking-wider ${
                    isObsidian ? 'text-[#ccff00]' : 'text-[#e5001a]'
                  }`}
                >
                  {perk.title}
                </div>
                <p
                  className={`text-xs leading-relaxed mt-1 ${
                    isObsidian ? 'text-zinc-300' : 'text-[#474647]'
                  }`}
                >
                  {perk.detail}
                </p>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </section>
  );
}
