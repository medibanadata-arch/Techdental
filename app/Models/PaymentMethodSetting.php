<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentMethodSetting extends Model
{
    use HasFactory;

    protected $table = 'payment_methods_settings';

    protected $guarded = [];

    protected $casts = [
        'methods_data' => 'array',
        'branches_data' => 'array',
    ];

    /**
     * Get or create the singleton settings instance with default structure.
     */
    public static function getSingleton(): self
    {
        $setting = self::first();
        if (!$setting) {
            $setting = self::create([
                'tagline' => 'Payment methods by branch',
                'title_main' => 'How to pay',
                'title_highlight' => 'at our clinic',
                'lead_text' => 'Choose your branch to see exactly which payment methods work there.',
                'branches_section_title' => 'Select your branch',
                'branches_section_sub' => 'Payment options differ from branch to branch.',
                'matrix_section_title' => 'All branches at a glance',
                'matrix_section_sub' => 'Tap a branch name to jump to its details.',
                'notice_text' => 'Always keep your payment receipt or transaction ID. For mobile payments, show the success message at the counter before you leave. Need help? Ask the front desk at any branch.',
                'seo_title' => 'How to Pay | Payment Methods by Branch | Tech Dental Care',
                'meta_desc' => 'Choose your branch to see accepted payment methods at Tech Dental Care: Cash, POS Debit/Credit Card, Bangla QR, bKash, Nagad, and Rocket.',
                'methods_data' => self::defaultMethods(),
                'branches_data' => self::defaultBranches(),
            ]);
        }
        return $setting;
    }

    public static function defaultMethods(): array
    {
        return [
            [
                'id' => 'cash',
                'name' => 'Cash',
                'badge' => '৳',
                'color' => '#2e7d57',
                'image' => '',
                'steps' => ['Pay at the billing counter', 'Collect your printed receipt'],
                'sort_order' => 1,
                'is_active' => true,
            ],
            [
                'id' => 'pos',
                'name' => 'Card (POS)',
                'badge' => 'POS',
                'color' => '#3a5ba0',
                'image' => '',
                'steps' => [
                    'Tell the counter you will pay by card',
                    'Tap, insert or swipe your debit/credit card',
                    'Enter PIN if asked and keep the slip',
                ],
                'sort_order' => 2,
                'is_active' => true,
            ],
            [
                'id' => 'qr',
                'name' => 'Bangla QR',
                'badge' => 'QR',
                'color' => '#0b7a75',
                'image' => '',
                'steps' => [
                    'Open any bank or wallet app with QR pay',
                    'Scan the Bangla QR at the counter',
                    'Enter the bill amount and confirm',
                    'Show the success screen to staff',
                ],
                'sort_order' => 3,
                'is_active' => true,
            ],
            [
                'id' => 'bkash',
                'name' => 'bKash',
                'badge' => 'bK',
                'color' => '#e2136e',
                'image' => '',
                'steps' => [
                    'Open the bKash app and tap Payment',
                    'Scan the QR or enter the merchant number',
                    'Enter the bill amount and your PIN',
                    'Show the confirmation to staff',
                ],
                'sort_order' => 4,
                'is_active' => true,
            ],
            [
                'id' => 'nagad',
                'name' => 'Nagad',
                'badge' => 'Ng',
                'color' => '#f26a21',
                'image' => '',
                'steps' => [
                    'Open the Nagad app and tap Merchant Pay',
                    'Scan the QR or enter the merchant number',
                    'Enter the bill amount and your PIN',
                    'Show the confirmation to staff',
                ],
                'sort_order' => 5,
                'is_active' => true,
            ],
            [
                'id' => 'rocket',
                'name' => 'Rocket',
                'badge' => 'Rk',
                'color' => '#8c3494',
                'image' => '',
                'steps' => [
                    'Dial *322# or open the Rocket app',
                    'Choose Payment and enter the merchant number',
                    'Enter the amount and your PIN',
                    'Show the confirmation to staff',
                ],
                'sort_order' => 6,
                'is_active' => true,
            ],
        ];
    }

    public static function defaultBranches(): array
    {
        return [
            [
                'id' => 'mirpur',
                'name' => 'Mirpur',
                'fullName' => 'Mirpur Branch',
                'addr' => '827 (2nd Floor), Shewrapara, Begum Rokeya Sarani, Mirpur, Dhaka-1216 (Metro Rail Pillar 318)',
                'hours' => 'Sat – Thu 10:00 am – 9:00 pm (Friday Closed)',
                'phone' => '09638-000505',
                'has' => ['cash' => 1, 'pos' => 1, 'qr' => 1, 'bkash' => 1, 'nagad' => 1, 'rocket' => 1],
                'acct' => ['bkash' => '01400786162', 'nagad' => '01400786162', 'rocket' => '01400786162-8'],
            ],
            [
                'id' => 'uttara',
                'name' => 'Uttara',
                'fullName' => 'Uttara Branch',
                'addr' => 'House 18, Road 14, Sector 3, Uttara, Dhaka-1230',
                'hours' => 'Sat – Thu 10:00 am – 9:00 pm (Friday Closed)',
                'phone' => '09638-000505',
                'has' => ['cash' => 1, 'pos' => 1, 'qr' => 1, 'bkash' => 1, 'nagad' => 1, 'rocket' => 0],
                'acct' => ['bkash' => '01400786162', 'nagad' => '01400786162'],
            ],
            [
                'id' => 'badda',
                'name' => 'Badda',
                'fullName' => 'Badda Branch',
                'addr' => 'Haji Abdur Rashid Mansion (3rd Floor), North Badda Bazar, Dhaka-1212',
                'hours' => 'Sat – Thu 10:00 am – 9:00 pm (Friday Closed)',
                'phone' => '09638-000505',
                'has' => ['cash' => 1, 'pos' => 1, 'qr' => 1, 'bkash' => 1, 'nagad' => 1, 'rocket' => 0],
                'acct' => ['bkash' => '01400786162', 'nagad' => '01400786162'],
            ],
            [
                'id' => 'jatrabari',
                'name' => 'Jatrabari',
                'fullName' => 'Jatrabari Branch',
                'addr' => 'Shahid Faruk Road, South Jatrabari, Dhaka-1204',
                'hours' => 'Sat – Thu 10:00 am – 9:00 pm (Friday Closed)',
                'phone' => '09638-000505',
                'has' => ['cash' => 1, 'pos' => 1, 'qr' => 1, 'bkash' => 1, 'nagad' => 0, 'rocket' => 0],
                'acct' => ['bkash' => '01400786162'],
            ],
        ];
    }
}

