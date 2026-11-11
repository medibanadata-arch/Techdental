/**
 * Editable homepage copy.
 * Every string shown on the homepage is stored in `home_content.homepage_texts`
 * and can be changed from Homepage CMS → "Page Texts". The values below are the
 * fallbacks used when a field is empty.
 */
export const HOMEPAGE_COPY_DEFAULTS: Record<string, string> = {
    hero_title: 'কিভাবে সাহায্য করতে পারি?',
    search_placeholder_focus: 'খরচ, ঠিকানা, ডাক্তার...',
    search_button_title: 'সার্চ করুন',
    ai_online_label: 'Online',
    ai_related_label: 'সম্পর্কিত:',
    ai_expand_title: 'ফুল ভিউ দেখুন',
    ai_close_title: 'বন্ধ করুন',

    quick_call_label: 'Call',
    quick_directions_label: 'Directions',
    quick_whatsapp_label: 'WhatsApp',
    quick_book_label: 'Book',
    call_modal_title: 'কল করুন (Call)',
    call_modal_message: 'টেক ডেন্টাল হটলাইন নম্বরে কল করতে ডায়াল করুন:\n{hotline}',
    call_modal_action: 'এখনই কল করুন ({hotline})',

    image_gallery_title: 'Image Gallery',
    video_gallery_title: 'Video Gallery',
    see_more_label: 'See More',
    see_less_label: 'See Less',
    video_watch_label: 'ভিডিও দেখুন',
    gallery_alt_fallback: 'Tech Dental',
    image_click_title: 'ছবি দেখতে ক্লিক করুন',
    video_click_title: 'ভিডিও দেখতে ক্লিক করুন',

    faq_title: 'Frequently Asked Questions (FAQ)',
    ok_button_label: 'ঠিক আছে (OK)',
};

export interface HomepageCopyField {
    key: string;
    label: string;
    help?: string;
    multiline?: boolean;
    group: string;
}

export const HOMEPAGE_COPY_FIELDS: HomepageCopyField[] = [
    { key: 'hero_title', label: 'Hero heading', group: 'Hero & AI search' },
    { key: 'search_placeholder_focus', label: 'Search input placeholder (focused)', group: 'Hero & AI search' },
    { key: 'search_button_title', label: 'Search button tooltip', group: 'Hero & AI search' },
    { key: 'ai_online_label', label: 'AI widget — online label', group: 'Hero & AI search' },
    { key: 'ai_related_label', label: 'AI widget — related chips label', group: 'Hero & AI search' },
    { key: 'ai_expand_title', label: 'AI widget — expand tooltip', group: 'Hero & AI search' },
    { key: 'ai_close_title', label: 'AI widget — close tooltip', group: 'Hero & AI search' },

    { key: 'quick_call_label', label: 'Call button label', group: 'Quick action buttons' },
    { key: 'quick_directions_label', label: 'Directions button label', group: 'Quick action buttons' },
    { key: 'quick_whatsapp_label', label: 'WhatsApp button label', group: 'Quick action buttons' },
    { key: 'quick_book_label', label: 'Book button label', group: 'Quick action buttons' },
    { key: 'call_modal_title', label: 'Call popup title', group: 'Quick action buttons' },
    { key: 'call_modal_message', label: 'Call popup message', help: 'Use {hotline} to insert the current branch hotline number.', multiline: true, group: 'Quick action buttons' },
    { key: 'call_modal_action', label: 'Call popup button label', help: 'Use {hotline} to insert the current branch hotline number.', group: 'Quick action buttons' },

    { key: 'image_gallery_title', label: 'Image gallery heading', group: 'Galleries' },
    { key: 'video_gallery_title', label: 'Video gallery heading', group: 'Galleries' },
    { key: 'see_more_label', label: '"See More" label', group: 'Galleries' },
    { key: 'see_less_label', label: '"See Less" label', group: 'Galleries' },
    { key: 'video_watch_label', label: 'Video thumbnail badge', group: 'Galleries' },
    { key: 'gallery_alt_fallback', label: 'Image alt fallback text', group: 'Galleries' },
    { key: 'image_click_title', label: 'Image click tooltip', group: 'Galleries' },
    { key: 'video_click_title', label: 'Video click tooltip', group: 'Galleries' },

    { key: 'faq_title', label: 'FAQ heading', group: 'More About & FAQ' },
    { key: 'ok_button_label', label: 'OK button label', group: 'More About & FAQ' },
];

/** Merge saved copy over the defaults, ignoring empty saved values. */
export function getHomepageCopy(source: any): Record<string, string> {
    const saved = source && typeof source === 'object' ? source : {};
    const merged: Record<string, string> = { ...HOMEPAGE_COPY_DEFAULTS };
    Object.keys(merged).forEach((key) => {
        const value = saved[key];
        if (typeof value === 'string' && value.trim() !== '') {
            merged[key] = value;
        }
    });
    return merged;
}
