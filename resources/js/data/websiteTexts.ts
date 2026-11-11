/**
 * Editable public page texts that are not part of a dedicated CMS screen.
 * Saved as JSON in `home_content.website_texts` and edited in
 * Settings > Website Texts.
 */

export interface WebsiteTextField {
    key: string;
    label: string;
    group: string;
    multiline?: boolean;
    help?: string;
}

export const WEBSITE_TEXTS_DEFAULTS: Record<string, string> = {
    // Doctors page
    doctors_h1: 'Best Dentists in Dhaka, Bangladesh',

    // Services page
    services_h1: 'Our Services',
    services_h1_bn: 'আমাদের সেবাসমূহ',
    services_seo_title: 'Dental Services & Treatments in Dhaka',
    services_seo_title_bn: 'আমাদের ডেন্টাল সেবা ও চিকিৎসা',
    services_seo_desc: 'Explore every dental treatment at Tech Dental Care — implants, braces, root canal, fillings, crowns, scaling and more, across Mirpur, Uttara, Badda and Jatrabari in Dhaka.',
    services_seo_desc_bn: 'টেক ডেন্টালের সব ডেন্টাল সেবা এক জায়গায়—ইমপ্লান্ট, ব্রেসেস, রুট ক্যানেল, ফিলিং, ক্যাপ, স্কেলিং ও আরও অনেক কিছু। ঢাকার মিরপুর, উত্তরা, বাদ্দা ও যাত্রাবাড়ীতে বিশেষজ্ঞ চিকিৎসা।',

    // Medicines page
    medicines_h1: 'Medicines & Pharmacy Guides',
    medicines_h1_bn: 'ঔষধ ও প্রেসক্রিপশন নির্দেশিকা',
    medicines_seo_title: 'Medicines & Pharmacy Guides in Bangladesh',
    medicines_seo_title_bn: 'ঔষধ ও প্রেসক্রিপশন নির্দেশিকা',
    medicines_seo_desc: 'Dental and general medicines used for tooth pain, infection and oral health — uses, dosage, side effects and prices in Bangladesh.',
    medicines_seo_desc_bn: 'দাঁতের ব্যথা, ইনফেকশন ও মুখের স্বাস্থ্যের জন্য ব্যবহৃত ঔষধের ব্যবহারবিধি, মাত্রা, পার্শ্বপ্রতিক্রিয়া ও দাম জানুন।',

    // Blog list
    blog_h1: 'Dental Blog & Guides',
    blog_h1_bn: 'ডেন্টাল ব্লগ ও গাইড',

    // Team page
    team_seo_title: 'Our Team — Management, Doctors & Support Staff',
    team_seo_desc: "Meet the management, digital marketing, call centre and clinical support team behind Tech Dental Care, Bangladesh's trusted dental chain.",
    team_heading: 'Meet Our Management Team',
    team_ceo_heading: 'CEO Assistant',
    team_marketing_heading: 'Digital Marketing Team',
    team_call_heading: 'Call Center Team',
    team_details_label: 'See Details',

    // Gallery page
    gallery_h1: 'Tech Dental Gallery',
    gallery_seo_title: 'Tech Dental Gallery — Photos & Videos',
    gallery_seo_desc: 'Explore photos and videos of Tech Dental Care clinics, treatment rooms, sterilization protocols, doctors and happy patients across Dhaka.',
    gallery_tab_all: 'All',
    gallery_tab_images: 'Images',
    gallery_tab_videos: 'Videos',
    gallery_images_heading: 'Image Gallery',
    gallery_videos_heading: 'Video Gallery',
    gallery_photos_suffix: 'Photos',
    gallery_videos_suffix: 'Videos',
    gallery_click_image: 'Click to view image',
    gallery_click_video: 'Click to play video',
    gallery_empty: 'Photos and videos will appear here soon.',

    // Complaint box
    complaint_seo_title: 'Patient Feedback & Complaint Box',
    complaint_seo_desc: 'Submit confidential patient complaints, feedback and suggestions directly to Tech Dental Care management in Dhaka.',
    complaint_badge: 'Confidential Patient Voice',
    complaint_h1: 'Patient Feedback & Resolution Center',
    complaint_subtitle: 'Your experience matters to us. Whether you have a concern, a complaint, or a suggestion to improve our dental care services, please let us know.',
    complaint_form_title: 'Submit a Report',
    complaint_form_subtitle: 'All submissions are kept strictly confidential and reviewed directly by our management team.',

    // Appointment page
    appointment_seo_title: 'Book a Dental Appointment Online',
    appointment_seo_desc: 'Book your dental appointment at Tech Dental Care in Dhaka. Choose your branch, treatment, preferred date and time — confirmation within minutes.',
    appointment_name_ph: 'Patient Name',
    appointment_phone_ph: 'Phone',
    appointment_h1: 'Book An Appointment',
    appointment_success_heading: 'Appointment Request Received!',
    appointment_success_sub: 'Thank you for choosing Tech Dental',
    appointment_address_ph: 'Your Address (Ex: Mirpur 10, Gazipur)',
    appointment_treatment_label: 'Treatment',
    appointment_branch_label: 'Branch',
    appointment_book_btn: 'Book Now',
    appointment_processing: 'Processing Appointment...',
    appointment_success_title: 'Appointment Requested!',
    appointment_success_text: 'We will confirm your appointment shortly.',

    // Doctor detail
    doctor_bmdc_verified: 'BMDC Verified',
    doctor_book_now: 'Book Now',
    doctor_call_now: 'Call Now',
    doctor_experience: 'Experience',
    doctor_patients: 'Patients Treated',
    doctor_bmdc_reg: 'BMDC Reg. No',
    doctor_expertise: 'Area of Expertise',
    doctor_chamber: 'Chamber Location',
    doctor_about_heading: 'Advanced Dental Procedures & Clinical Excellence',
    doctor_faq_heading: 'Frequently Asked Questions (FAQs)',

    // Custom pages CTA
    custom_cta_badge: 'Painless Clinical Dentistry in Dhaka',
    custom_cta_title: 'Ready to Restore Your Healthy Smile?',
    custom_cta_subtext: 'Consult with our specialist oral surgeons across Mirpur, Uttara, Badda, and Jatrabari branches.',
    custom_cta_button: 'Make Appointment',

    // Service detail
    service_time_1: '4:00 PM - 6:00 PM',
    service_time_2: '6:00 PM - 8:00 PM',
};

export const WEBSITE_TEXT_FIELDS: WebsiteTextField[] = [
    { key: 'doctors_h1', label: 'Doctors page H1 heading', group: 'Doctors Page' },

    { key: 'services_h1', label: 'Services page H1 (English)', group: 'Services Page' },
    { key: 'services_h1_bn', label: 'Services page H1 (Bangla)', group: 'Services Page' },
    { key: 'services_seo_title', label: 'SEO title (English)', group: 'Services Page' },
    { key: 'services_seo_title_bn', label: 'SEO title (Bangla)', group: 'Services Page' },
    { key: 'services_seo_desc', label: 'SEO description (English)', group: 'Services Page', multiline: true },
    { key: 'services_seo_desc_bn', label: 'SEO description (Bangla)', group: 'Services Page', multiline: true },

    { key: 'medicines_h1', label: 'Medicines page H1 (English)', group: 'Medicines Page' },
    { key: 'medicines_h1_bn', label: 'Medicines page H1 (Bangla)', group: 'Medicines Page' },
    { key: 'medicines_seo_title', label: 'SEO title (English)', group: 'Medicines Page' },
    { key: 'medicines_seo_title_bn', label: 'SEO title (Bangla)', group: 'Medicines Page' },
    { key: 'medicines_seo_desc', label: 'SEO description (English)', group: 'Medicines Page', multiline: true },
    { key: 'medicines_seo_desc_bn', label: 'SEO description (Bangla)', group: 'Medicines Page', multiline: true },

    { key: 'blog_h1', label: 'Blog page H1 (English fallback)', group: 'Blog List' },
    { key: 'blog_h1_bn', label: 'Blog page H1 (Bangla fallback)', group: 'Blog List' },

    { key: 'team_heading', label: 'Management section heading', group: 'Team Page' },
    { key: 'team_ceo_heading', label: 'CEO Assistant section heading', group: 'Team Page' },
    { key: 'team_marketing_heading', label: 'Digital Marketing section heading', group: 'Team Page' },
    { key: 'team_call_heading', label: 'Call Center section heading', group: 'Team Page' },
    { key: 'team_details_label', label: '"See Details" link label', group: 'Team Page' },
    { key: 'team_seo_title', label: 'SEO title', group: 'Team Page' },
    { key: 'team_seo_desc', label: 'SEO description', group: 'Team Page', multiline: true },

    { key: 'gallery_h1', label: 'Page H1', group: 'Gallery Page' },
    { key: 'gallery_tab_all', label: '"All" tab label', group: 'Gallery Page' },
    { key: 'gallery_tab_images', label: '"Images" tab label', group: 'Gallery Page' },
    { key: 'gallery_tab_videos', label: '"Videos" tab label', group: 'Gallery Page' },
    { key: 'gallery_images_heading', label: 'Images section heading', group: 'Gallery Page' },
    { key: 'gallery_videos_heading', label: 'Videos section heading', group: 'Gallery Page' },
    { key: 'gallery_photos_suffix', label: 'Photo count suffix', group: 'Gallery Page' },
    { key: 'gallery_videos_suffix', label: 'Video count suffix', group: 'Gallery Page' },
    { key: 'gallery_click_image', label: 'Image hover tooltip', group: 'Gallery Page' },
    { key: 'gallery_click_video', label: 'Video hover tooltip', group: 'Gallery Page' },
    { key: 'gallery_empty', label: 'Empty gallery message', group: 'Gallery Page' },
    { key: 'gallery_seo_title', label: 'SEO title', group: 'Gallery Page' },
    { key: 'gallery_seo_desc', label: 'SEO description', group: 'Gallery Page', multiline: true },

    { key: 'complaint_badge', label: 'Hero badge text', group: 'Complaint Box' },
    { key: 'complaint_h1', label: 'Hero heading', group: 'Complaint Box' },
    { key: 'complaint_subtitle', label: 'Hero subtitle', group: 'Complaint Box', multiline: true },
    { key: 'complaint_form_title', label: 'Form section heading', group: 'Complaint Box' },
    { key: 'complaint_form_subtitle', label: 'Form section subtitle', group: 'Complaint Box', multiline: true },
    { key: 'complaint_seo_title', label: 'SEO title', group: 'Complaint Box' },
    { key: 'complaint_seo_desc', label: 'SEO description', group: 'Complaint Box', multiline: true },

    { key: 'appointment_name_ph', label: 'Name field placeholder', group: 'Appointment Page' },
    { key: 'appointment_phone_ph', label: 'Phone field placeholder', group: 'Appointment Page' },
    { key: 'appointment_h1', label: 'Page H1 heading', group: 'Appointment Page' },
    { key: 'appointment_success_heading', label: 'Confirmation modal heading', group: 'Appointment Page' },
    { key: 'appointment_success_sub', label: 'Confirmation modal subtitle', group: 'Appointment Page' },
    { key: 'appointment_address_ph', label: 'Address field placeholder', group: 'Appointment Page' },
    { key: 'appointment_treatment_label', label: 'Treatment field label', group: 'Appointment Page' },
    { key: 'appointment_branch_label', label: 'Branch field label', group: 'Appointment Page' },
    { key: 'appointment_book_btn', label: 'Submit button label', group: 'Appointment Page' },
    { key: 'appointment_processing', label: 'Submit button loading label', group: 'Appointment Page' },
    { key: 'appointment_success_title', label: 'Success modal heading', group: 'Appointment Page' },
    { key: 'appointment_success_text', label: 'Success modal text', group: 'Appointment Page', multiline: true },
    { key: 'appointment_seo_title', label: 'SEO title', group: 'Appointment Page' },
    { key: 'appointment_seo_desc', label: 'SEO description', group: 'Appointment Page', multiline: true },

    { key: 'doctor_bmdc_verified', label: '"BMDC Verified" badge', group: 'Doctor Detail' },
    { key: 'doctor_book_now', label: '"Book Now" button', group: 'Doctor Detail' },
    { key: 'doctor_call_now', label: '"Call Now" button', group: 'Doctor Detail' },
    { key: 'doctor_experience', label: 'Experience label', group: 'Doctor Detail' },
    { key: 'doctor_patients', label: 'Patients treated label', group: 'Doctor Detail' },
    { key: 'doctor_bmdc_reg', label: 'BMDC registration label', group: 'Doctor Detail' },
    { key: 'doctor_expertise', label: 'Expertise section heading', group: 'Doctor Detail' },
    { key: 'doctor_chamber', label: 'Chamber section heading', group: 'Doctor Detail' },
    { key: 'doctor_about_heading', label: 'About procedures heading', group: 'Doctor Detail' },
    { key: 'doctor_faq_heading', label: 'FAQ section heading', group: 'Doctor Detail' },

    { key: 'custom_cta_badge', label: 'CTA badge text', group: 'Custom Pages CTA' },
    { key: 'custom_cta_title', label: 'CTA heading', group: 'Custom Pages CTA' },
    { key: 'custom_cta_subtext', label: 'CTA subtext', group: 'Custom Pages CTA', multiline: true },
    { key: 'custom_cta_button', label: 'CTA button label', group: 'Custom Pages CTA' },

    { key: 'service_time_1', label: 'Preferred time slot 1', group: 'Service Detail' },
    { key: 'service_time_2', label: 'Preferred time slot 2', group: 'Service Detail' },
];

export function getWebsiteTexts(raw?: Record<string, string> | null): Record<string, string> {
    const merged: Record<string, string> = { ...WEBSITE_TEXTS_DEFAULTS };
    if (raw && typeof raw === 'object') {
        Object.keys(merged).forEach((key) => {
            const value = raw[key];
            if (typeof value === 'string' && value.trim() !== '') {
                merged[key] = value;
            }
        });
    }
    return merged;
}
