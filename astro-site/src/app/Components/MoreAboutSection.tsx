import React, { useState, useRef } from "react";
import { ChevronDown } from "lucide-react";

interface MoreAboutProps {
  content?: {
    about_text?: string;
    about_image?: string;
    about_caption?: string;
    seo_title?: string;
    more_about_title?: string;
    faqs?: { q: string; a: string }[];
  };
}

export const MoreAboutSection: React.FC<MoreAboutProps> = ({ content }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  const safeFaqs = React.useMemo(() => {
    if (!content?.faqs) return [];
    if (Array.isArray(content.faqs)) return content.faqs;
    try {
      const p = typeof content.faqs === 'string' ? JSON.parse(content.faqs) : content.faqs;
      return Array.isArray(p) ? p : [];
    } catch {
      return [];
    }
  }, [content?.faqs]);

  const toggleOpen = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    if (nextState) {
      setTimeout(() => {
        drawerRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  return (
    <section className="px-1 sm:px-4.5 pb-1 sm:pb-2">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={toggleOpen}
        className="w-full bg-white hover:bg-slate-50 border border-slate-200 py-3.5 px-5 rounded-2xl text-sm font-bold text-slate-800 flex items-center justify-between text-left transition-all cursor-pointer shadow-xs active:scale-[0.99]"
        aria-expanded={isOpen}
      >
        <span className="text-left font-bold text-slate-800">
          {content?.more_about_title || content?.seo_title || "More about Tech Dental"}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-slate-500 transition-transform duration-300 shrink-0 ${isOpen ? "rotate-180 text-rose-700" : ""
            }`}
        />
      </button>

      {/* SEO Content Drawer */}
      {isOpen && (
        <div
          ref={drawerRef}
          className="mt-2.5 p-4 sm:p-5 bg-white border border-slate-200 rounded-2xl text-[0.8rem] text-slate-600 leading-relaxed animate-fade-in shadow-xs space-y-4"
        >
          {content?.about_text ? (
            <div
              className="rich-content-view wp-editor-content prose prose-slate max-w-none text-slate-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: content.about_text }}
            />
          ) : (
            <div className="space-y-3">
              <h4 className="text-[0.88rem] font-black text-primary-maroon mb-2">
                Tech Dental - ঢাকা শহরের অন্যতম বিশ্বস্ত ডেন্টাল নেটওয়ার্ক
              </h4>
              <p>
                টেক ডেন্টাল (Tech Dental) অভিজ্ঞ বিডিএস ও স্পেশালিস্ট ডেন্টাল সার্জনদের তত্ত্বাবধানে আন্তর্জাতিক মানের যন্ত্রপাতি এবং শতভাগ জীবাণুমুক্ত পরিবেশে উন্নত ডেন্টাল সেবা প্রদান করে আসছে।
              </p>

              <div className="my-3 space-y-1">
                <p className="font-bold text-slate-800">আমাদের ৪টি প্রধান শাখা:</p>
                <p>• <strong>মিরপুর শাখা:</strong> ৮২৭ (২য় তলা), শেওড়াপাড়া, বেগম রোকেয়া সরণি, মিরপুর, ঢাকা-১২১৬।</p>
                <p>• <strong>বাড্ডা শাখা:</strong> চা-৬৮/১, প্রগতি সরণি, মধ্য বাড্ডা, ঢাকা।</p>
                <p>• <strong>উত্তরা শাখা:</strong> হাউস ১৮, রোড ১৪, সেক্টর ৩, উত্তরা, ঢাকা।</p>
                <p>• <strong>যাত্রাবাড়ী শাখা:</strong> শহীদ ফারুক রোড, দক্ষিণ যাত্রাবাড়ী, ঢাকা।</p>
              </div>

              <p>
                <strong>প্রধান সেবাসমূহ:</strong> অর্থোডন্টিক ব্রেসেস, ব্যথামুক্ত রুট ক্যানেল, ফাইবার ব্রিজ, ভিনিয়ার্স, স্কেলিং ও পলিশিং এবং ডেন্টাল ইমপ্ল্যান্ট।
              </p>
            </div>
          )}

          {/* FAQs inside More About Tech Dental Drawer */}
          {safeFaqs.length > 0 && (
            <div className="pt-4 mt-2 border-t border-slate-100">
              <h4 className="text-xs sm:text-sm font-extrabold text-slate-800 mb-2.5 flex items-center gap-2">
                <span className="w-1.5 h-3.5 bg-rose-700 rounded-full" />
                Frequently Asked Questions (FAQ)
              </h4>
              <div className="space-y-2">
                {safeFaqs.filter(f => f && f.q).map((faq, i) => {
                  const isFaqOpen = openFaqIndex === i;
                  return (
                    <div key={i} className="border border-slate-200/90 rounded-xl overflow-hidden bg-slate-50/60">
                      <button
                        type="button"
                        onClick={() => setOpenFaqIndex(isFaqOpen ? null : i)}
                        className="w-full p-2.5 sm:p-3 text-left font-bold text-xs text-slate-800 flex items-center justify-between hover:bg-slate-100/60 transition cursor-pointer select-none"
                      >
                        <span className="flex items-center gap-2 pr-2">
                          <span className="w-4 h-4 rounded-full bg-rose-100 text-rose-700 text-[10px] font-bold flex items-center justify-center shrink-0">
                            {i + 1}
                          </span>
                          <span className="text-slate-900">{faq.q}</span>
                        </span>
                        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform ${isFaqOpen ? 'rotate-180 text-rose-700' : ''}`} />
                      </button>
                      {isFaqOpen && (
                        <div className="px-3.5 pb-3 pt-1 text-xs text-slate-600 bg-white border-t border-slate-100 leading-relaxed">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
