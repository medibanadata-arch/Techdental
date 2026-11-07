import React, { useState, useRef } from "react";
import { Head, Link } from "@inertiajs/react";
import { TopHeader } from "@/Components/TopHeader";
import { GlobalFooter } from "@/Components/GlobalFooter";
import {
  CreditCard,
  Banknote,
  QrCode,
  Smartphone,
  Check,
  Copy,
  MapPin,
  Clock,
  PhoneCall,
  Info,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  Receipt
} from "lucide-react";

interface Props {
  locations?: any[];
  nav_menu?: any;
  canonical_url?: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  bn: string;
  badge: string;
  color: string;
  iconName: string;
  description: string;
  steps: string[];
}

interface BranchPaymentConfig {
  id: string;
  slug: string;
  name: string;
  fullName: string;
  addr: string;
  hours: string;
  phone: string;
  has: Record<string, boolean>;
  acct: Record<string, string>;
}

const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "cash",
    name: "Cash",
    bn: "নগদ টাকা",
    badge: "৳",
    color: "#15803d",
    iconName: "banknote",
    description: "Pay directly at the front reception billing desk.",
    steps: [
      "Visit the billing counter after your consultation or treatment.",
      "Pay the exact bill amount in cash (Bangladeshi Taka).",
      "Collect and verify your official computerized printed money receipt."
    ]
  },
  {
    id: "pos",
    name: "Card (POS)",
    bn: "ডেবিট / ক্রেডিট কার্ড",
    badge: "POS",
    color: "#2563eb",
    iconName: "card",
    description: "Visa, Mastercard, Nexus & UnionPay cards accepted with zero extra surcharge.",
    steps: [
      "Inform the receptionist that you wish to pay using a card.",
      "Tap, insert chip, or swipe your Debit or Credit card on the POS terminal.",
      "Enter your card PIN code securely if requested on the machine.",
      "Collect your customer charge slip along with your dental invoice."
    ]
  },
  {
    id: "qr",
    name: "Bangla QR",
    bn: "বাংলা কিউআর (Interoperable QR)",
    badge: "QR",
    color: "#0d9488",
    iconName: "qr",
    description: "Scan with any Bangladeshi bank or MFS app (City Touch, bKash, etc.).",
    steps: [
      "Open your preferred banking or mobile wallet app supporting Bangla QR.",
      "Tap the QR Scanner icon and scan the counter's official Bangla QR display.",
      "Enter your total treatment bill amount and review beneficiary name (Tech Dental).",
      "Authorize with PIN/OTP and present the success confirmation screen to our billing staff."
    ]
  },
  {
    id: "bkash",
    name: "bKash Merchant",
    bn: "বিকাশ মার্চেন্ট পে",
    badge: "bK",
    color: "#e11475",
    iconName: "smartphone",
    description: "Instant merchant payment with zero cash-out or additional fee.",
    steps: [
      "Open the bKash app on your phone and tap 'Make Payment / পেমেন্ট'.",
      "Scan the branch bKash QR stand or enter the branch merchant number.",
      "Enter the billed amount, add treatment reference if requested, and enter your PIN.",
      "Show the transaction successful screen with TrxID to reception staff."
    ]
  },
  {
    id: "nagad",
    name: "Nagad Merchant",
    bn: "নগদ মার্চেন্ট পে",
    badge: "Ng",
    color: "#ea580c",
    iconName: "smartphone",
    description: "Fast digital payment through Nagad App or USSD *167#.",
    steps: [
      "Open the Nagad app and tap 'Merchant Pay' (মার্চেন্ট পে).",
      "Scan the desk QR code or type our branch merchant wallet number.",
      "Input the total bill amount and submit with your secret 4-digit PIN.",
      "Present the SMS or screen confirmation to collect your printed receipt."
    ]
  },
  {
    id: "rocket",
    name: "DBBL Rocket",
    bn: "রকেট পেমেন্ট",
    badge: "Rk",
    color: "#7e22ce",
    iconName: "smartphone",
    description: "Dutch-Bangla Bank Rocket wallet payment via App or *322#.",
    steps: [
      "Launch Rocket app or dial *322# from your registered mobile number.",
      "Select 'Merchant Payment' and enter the Tech Dental merchant biller code/number.",
      "Enter the exact treatment cost and your secret 4-digit Rocket PIN.",
      "Verify the 12-digit transaction ID with the branch accountant."
    ]
  }
];

const TECH_DENTAL_BRANCHES: BranchPaymentConfig[] = [
  {
    id: "mirpur",
    slug: "mirpur",
    name: "Mirpur",
    fullName: "Mirpur Branch (শেওড়াপাড়া)",
    addr: "827 (2nd Floor), Shewrapara, Begum Rokeya Sarani, Mirpur, Dhaka-1216 (East side of Metro Pillar 318)",
    hours: "Saturday – Thursday: 10:00 AM – 9:00 PM (Friday Closed)",
    phone: "09638-000505",
    has: {
      cash: true,
      pos: true,
      qr: true,
      bkash: true,
      nagad: true,
      rocket: true
    },
    acct: {
      bkash: "09638-000505",
      nagad: "09638-000505",
      rocket: "09638-000505-1"
    }
  },
  {
    id: "uttara",
    slug: "uttara",
    name: "Uttara",
    fullName: "Uttara Branch (সেক্টর ৩)",
    addr: "House 18, Road 14, Sector 3, Uttara, Dhaka-1230",
    hours: "Saturday – Thursday: 3:00 PM – 9:00 PM (Friday Closed)",
    phone: "09638-000505",
    has: {
      cash: true,
      pos: true,
      qr: true,
      bkash: true,
      nagad: true,
      rocket: false
    },
    acct: {
      bkash: "09638-000505",
      nagad: "09638-000505"
    }
  },
  {
    id: "badda",
    slug: "badda",
    name: "Badda",
    fullName: "Badda Branch (উত্তর বাড্ডা)",
    addr: "Haji Abdur Rashid Mansion (3rd Floor), North Badda Bazar, Pragati Sarani, Dhaka-1212",
    hours: "Saturday – Thursday: 3:00 PM – 9:00 PM (Friday Closed)",
    phone: "09638-000505",
    has: {
      cash: true,
      pos: true,
      qr: true,
      bkash: true,
      nagad: true,
      rocket: false
    },
    acct: {
      bkash: "09638-000505",
      nagad: "09638-000505"
    }
  },
  {
    id: "jatrabari",
    slug: "jatrabari",
    name: "Jatrabari",
    fullName: "Jatrabari Branch (দক্ষিণ যাত্রাবাড়ী)",
    addr: "Shahid Faruk Road, South Jatrabari, Dhaka-1204",
    hours: "Saturday – Thursday: 3:00 PM – 9:00 PM (Friday Closed)",
    phone: "09638-000505",
    has: {
      cash: true,
      pos: true,
      qr: true,
      bkash: true,
      nagad: true,
      rocket: false
    },
    acct: {
      bkash: "09638-000505",
      nagad: "09638-000505"
    }
  }
];

export default function HowToPayPublicShow({
  locations = [],
  nav_menu,
  canonical_url = "https://techdentalbd.com/how-to-pay"
}: Props) {
  const [selectedBranchId, setSelectedBranchId] = useState<string>("mirpur");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const branchCardRef = useRef<HTMLDivElement>(null);

  const currentBranch =
    TECH_DENTAL_BRANCHES.find((b) => b.id === selectedBranchId) ||
    TECH_DENTAL_BRANCHES[0];

  const availableCount = PAYMENT_METHODS.filter(
    (m) => currentBranch.has[m.id]
  ).length;

  const handleSelectBranch = (id: string, scroll: boolean = false) => {
    setSelectedBranchId(id);
    if (scroll && branchCardRef.current) {
      branchCardRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  return (
    <div className="bg-[#f8fafc] flex flex-col min-h-screen text-slate-800 font-sans selection:bg-rose-900 selection:text-white">
      <Head>
        <title>How to Pay | Accepted Payment Methods by Branch | Tech Dental Care</title>
        <meta
          name="description"
          content="Choose your Tech Dental branch (Mirpur, Uttara, Badda, Jatrabari) to see all accepted payment options: Cash, Visa/Mastercard POS Card, Bangla QR, bKash, and Nagad."
        />
        <link rel="canonical" href={canonical_url} />
      </Head>

      {/* Global Navigation Header */}
      <TopHeader locations={locations} nav_menu={nav_menu} />

      {/* Main Container */}
      <main className="flex-1 py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        {/* Hero Section */}
        <header className="mb-8 sm:mb-10 text-left">
          <div className="inline-flex items-center gap-2 border-l-4 border-rose-600 pl-3 py-0.5 text-xs sm:text-sm font-extrabold uppercase tracking-wider text-rose-700 bg-rose-50/70 pr-3 rounded-r-lg mb-3">
            <Receipt className="w-4 h-4 text-rose-600" />
            <span>Payment Methods by Branch</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 uppercase font-sans mb-3 leading-tight">
            How to Pay <span className="text-rose-700">at our clinic</span>
          </h1>

          <p className="text-slate-600 text-base sm:text-lg max-w-2xl leading-relaxed">
            Choose your branch to see exactly which payment methods work there.
            <span className="block text-sm sm:text-base text-slate-500 font-medium mt-1">
              টেক ডেন্টালের প্রতিটি শাখায় উপলব্ধ পেমেন্ট পদ্ধতি ও মার্চেন্ট নম্বর দেখে নিন।
            </span>
          </p>
        </header>

        {/* Branch Selection Pills */}
        <section className="mb-6">
          <div className="flex items-center justify-between gap-4 mb-2">
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 uppercase tracking-tight">
              Select Your Branch
            </h2>
            <span className="text-xs font-semibold text-slate-500 hidden sm:inline-block">
              Payment options differ by branch
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mb-3">
            শাখা ভিত্তিক পেমেন্ট অপশন ও মার্চেন্ট ডিটেইলস দেখতে নিচের বাটনে ক্লিক করুন:
          </p>

          <div
            className="flex flex-wrap gap-2.5 sm:gap-3"
            role="group"
            aria-label="Tech Dental Branches"
          >
            {TECH_DENTAL_BRANCHES.map((b) => {
              const isSelected = b.id === selectedBranchId;
              return (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => handleSelectBranch(b.id)}
                  aria-pressed={isSelected}
                  className={`px-5 py-2.5 sm:px-6 sm:py-3 rounded-full text-sm font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer ${
                    isSelected
                      ? "bg-rose-800 text-white shadow-md ring-2 ring-rose-800 ring-offset-2 scale-[1.02]"
                      : "bg-white text-slate-700 border border-slate-200/90 hover:bg-slate-100 hover:border-slate-300"
                  }`}
                >
                  <MapPin
                    className={`w-4 h-4 ${
                      isSelected ? "text-rose-200" : "text-rose-700"
                    }`}
                  />
                  <span>{b.name} Branch</span>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* Selected Branch Active Info Card */}
        <div
          ref={branchCardRef}
          className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xs mb-8 transition-all relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-rose-50/50 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none" />

          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-200">
              <Sparkles className="w-3.5 h-3.5 text-rose-700" />
              {availableCount} of {PAYMENT_METHODS.length} methods available
            </span>

            <Link
              href={`/branch/${currentBranch.slug}`}
              className="text-xs font-bold text-rose-700 hover:text-rose-800 hover:underline flex items-center gap-1"
            >
              View Full Branch Details →
            </Link>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-2">
            {currentBranch.fullName}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-slate-600 text-xs sm:text-sm">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{currentBranch.addr}</span>
            </div>

            <div className="flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{currentBranch.hours}</span>
            </div>

            <div className="flex items-start gap-2.5">
              <PhoneCall className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>
                Hotline:{" "}
                <a
                  href={`tel:${currentBranch.phone.replace(/[^0-9]/g, "")}`}
                  className="font-bold text-slate-900 hover:text-rose-700 underline"
                >
                  {currentBranch.phone}
                </a>
              </span>
            </div>
          </div>
        </div>

        {/* Payment Methods Cards Grid */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-extrabold text-slate-900 uppercase tracking-tight">
              Accepted Methods at {currentBranch.name}
            </h2>
            <span className="text-xs text-slate-500 font-medium">
              Click &quot;How to pay&quot; for step-by-step instructions
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {PAYMENT_METHODS.map((m) => {
              const isAvailable = Boolean(currentBranch.has[m.id]);
              const acctNum = currentBranch.acct[m.id];
              const whereAvailable = TECH_DENTAL_BRANCHES.filter(
                (b) => b.has[m.id]
              )
                .map((b) => b.name)
                .join(", ");

              return (
                <article
                  key={m.id}
                  className={`rounded-2xl p-5 border transition-all flex flex-col justify-between ${
                    isAvailable
                      ? "bg-white border-slate-200/90 shadow-xs hover:shadow-md hover:border-slate-300"
                      : "bg-slate-100/70 border-dashed border-slate-300/80 opacity-75"
                  }`}
                >
                  <div>
                    {/* Top strip: Badge + Name + Status */}
                    <div className="flex items-center gap-3.5 mb-3">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-base text-white shrink-0 shadow-xs"
                        style={{
                          backgroundColor: isAvailable ? m.color : "#94a3b8"
                        }}
                      >
                        {m.badge}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-base sm:text-lg text-slate-900 leading-snug truncate">
                          {m.name}
                        </h3>
                        <span className="text-xs text-slate-500 block truncate font-medium">
                          {m.bn}
                        </span>
                      </div>

                      <span
                        className={`text-xs font-extrabold px-2.5 py-1 rounded-full whitespace-nowrap shrink-0 ${
                          isAvailable
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                            : "bg-slate-200/80 text-slate-600 border border-slate-300"
                        }`}
                      >
                        {isAvailable ? "Available" : "Not here"}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                      {m.description}
                    </p>

                    {/* Merchant Account Box (if applicable) */}
                    {isAvailable && acctNum && (
                      <div className="mb-3.5 p-2.5 bg-rose-50/60 rounded-xl border border-rose-100 flex items-center justify-between gap-2">
                        <div className="text-xs text-slate-700">
                          <span className="font-bold text-slate-900 block text-[11px] uppercase tracking-wider text-rose-900">
                            Merchant Wallet
                          </span>
                          <span className="font-mono font-bold text-slate-900 text-sm">
                            {acctNum}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(acctNum, m.id)}
                          className="px-2.5 py-1.5 rounded-lg bg-white border border-rose-200 hover:bg-rose-100 text-rose-800 text-xs font-bold transition flex items-center gap-1 cursor-pointer shrink-0 shadow-2xs"
                          title="Copy merchant number"
                        >
                          {copiedId === m.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-700 font-extrabold">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Steps / Alternative info */}
                  <div className="pt-3 border-t border-slate-100">
                    {isAvailable ? (
                      <details className="group cursor-pointer">
                        <summary className="text-xs font-bold text-rose-700 hover:text-rose-800 flex items-center justify-between list-none py-1 select-none">
                          <span className="flex items-center gap-1.5">
                            <Info className="w-3.5 h-3.5 text-rose-600" />
                            How to pay with {m.name}
                          </span>
                          <ChevronDown className="w-4 h-4 transition-transform duration-200 group-open:rotate-180" />
                        </summary>
                        <ol className="mt-2.5 pl-5 space-y-1.5 text-xs text-slate-600 list-decimal leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                          {m.steps.map((st, i) => (
                            <li key={i}>{st}</li>
                          ))}
                        </ol>
                      </details>
                    ) : (
                      <p className="text-xs text-slate-500 italic">
                        Available at:{" "}
                        <strong className="text-slate-700 font-semibold">
                          {whereAvailable || "Currently unavailable"}
                        </strong>
                      </p>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Comparison Matrix Table */}
        <section className="mb-10">
          <div className="mb-4">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight">
              All Branches at a Glance
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Tap any branch header to jump to that branch&apos;s details.
            </p>
          </div>

          <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80">
                    <th className="py-4 px-4 sm:px-6 text-xs sm:text-sm font-extrabold uppercase text-slate-700 w-1/3">
                      Payment Method
                    </th>
                    {TECH_DENTAL_BRANCHES.map((b) => {
                      const isSel = b.id === selectedBranchId;
                      return (
                        <th
                          key={b.id}
                          className={`py-3.5 px-3 sm:px-4 text-center transition-colors ${
                            isSel ? "bg-rose-50/90" : ""
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => handleSelectBranch(b.id, true)}
                            className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-extrabold transition cursor-pointer ${
                              isSel
                                ? "bg-rose-800 text-white shadow-xs"
                                : "text-slate-700 hover:bg-slate-200/70"
                            }`}
                          >
                            {b.name}
                          </button>
                        </th>
                      );
                    })}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                  {PAYMENT_METHODS.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50/60 transition">
                      <td className="py-3.5 px-4 sm:px-6 font-bold text-slate-800">
                        <div className="flex items-center gap-2.5">
                          <span
                            className="w-3 h-3 rounded-full shrink-0"
                            style={{ backgroundColor: m.color }}
                          />
                          <div>
                            <span className="block font-bold">{m.name}</span>
                            <span className="text-[11px] text-slate-400 font-normal">
                              {m.bn}
                            </span>
                          </div>
                        </div>
                      </td>

                      {TECH_DENTAL_BRANCHES.map((b) => {
                        const hasIt = Boolean(b.has[m.id]);
                        const isSel = b.id === selectedBranchId;
                        return (
                          <td
                            key={b.id}
                            className={`py-3.5 px-3 sm:px-4 text-center ${
                              isSel ? "bg-rose-50/50" : ""
                            }`}
                          >
                            {hasIt ? (
                              <span
                                className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 font-black text-xs shadow-2xs"
                                title="Available"
                              >
                                ✓
                              </span>
                            ) : (
                              <span
                                className="inline-flex items-center justify-center w-7 h-7 rounded-full border border-dashed border-slate-300 text-slate-400 text-xs"
                                title="Not available at this branch"
                              >
                                —
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>

                <tfoot>
                  <tr className="bg-slate-100/80 font-bold border-t border-slate-200 text-xs sm:text-sm text-slate-700">
                    <td className="py-3.5 px-4 sm:px-6 uppercase tracking-wider text-slate-600 font-extrabold">
                      Total Available
                    </td>
                    {TECH_DENTAL_BRANCHES.map((b) => {
                      const count = PAYMENT_METHODS.filter((m) => b.has[m.id]).length;
                      const isSel = b.id === selectedBranchId;
                      return (
                        <td
                          key={b.id}
                          className={`py-3.5 px-3 sm:px-4 text-center font-extrabold ${
                            isSel ? "bg-rose-100/70 text-rose-900" : "text-slate-800"
                          }`}
                        >
                          {count} of {PAYMENT_METHODS.length}
                        </td>
                      );
                    })}
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </section>

        {/* Good to Know / Important Advice Callout */}
        <section className="bg-white rounded-2xl border-l-4 border-rose-600 border-y border-r border-slate-200 p-5 sm:p-6 shadow-xs flex items-start gap-4 mb-8">
          <ShieldCheck className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-slate-600 text-xs sm:text-sm leading-relaxed space-y-1.5">
            <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">
              Good to Know (পেমেন্ট সংক্রান্ত জরুরি নির্দেশিকা):
            </h4>
            <p>
              Always collect your official computer-generated billing receipt or transaction ID after payment. For mobile wallet transactions (bKash/Nagad/Rocket), please show the successful confirmation SMS or app screen to our billing desk before leaving.
            </p>
            <p className="text-slate-500">
              পেমেন্ট সম্পন্ন করার পর অবশ্যই ক্যাশ মেমো বা ট্রানজেকশন স্লিপ সংগ্রহ করুন। কোনো তথ্যের প্রয়োজন হলে আমাদের ফ্রন্ট ডেস্কে অথবা সেন্ট্রাল হটলাইনে যোগাযোগ করুন:{" "}
              <a href="tel:09638000505" className="font-bold text-rose-700 underline">
                09638-000505
              </a>
              .
            </p>
          </div>
        </section>
      </main>

      {/* Global Footer */}
      <GlobalFooter />
    </div>
  );
}
