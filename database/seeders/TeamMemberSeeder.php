<?php

namespace Database\Seeders;

use App\Models\TeamMember;
use Illuminate\Database\Seeder;

class TeamMemberSeeder extends Seeder
{
    /**
     * 14 members verbatim from "Our Corporate Team" design (L4776-4997)
     * + CEO letter content from "Message From CEO" design (L4671-4773).
     */
    public function run(): void
    {
        $members = [
            // Management Team (3) — cards with "See Details"
            ['name' => 'Md. Noman Khan', 'role' => 'Chief Executive Officer', 'section' => 'management', 'image' => 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80', 'photo_alt' => 'Md. Noman Khan', 'sort_order' => 1,
                'quote' => '“Our commitment to excellence goes beyond dental procedures. It includes the relationships we build with every one of our patients.”',
                'letter' => [
                    'I hope this message finds you well. It is with great pleasure and gratitude that I reach out to you on behalf of the entire Tech Dental team. Thank you for trusting us as your dental care provider.',
                    'Your well-being and satisfaction are at the core of everything we do, and we are truly honored to be a part of your oral health journey. We understand the importance of your smile and oral health, and we are dedicated to providing the highest quality care possible.',
                    'Our team of skilled professionals is here to ensure that your experience at Tech Dental is not only effective but also comfortable and compassionate. As we continue to embrace advancements in dental technology and best practices, we remain steadfast in our commitment to delivering personalized and comprehensive care to meet your unique needs.',
                    'Your feedback and trust inspire us to continually strive for excellence, and we are grateful for the opportunity to serve you. Thank you for choosing Tech Dental. We look forward to being your partner in maintaining a healthy and vibrant smile for years to come.',
                    'If there is anything we can do to enhance your experience or address any concerns, please do not hesitate to reach out. Wishing you continued health and happiness.',
                ],
            ],
            ['name' => 'Prof. Dr. Nafees Uddin', 'role' => 'Medical Director', 'section' => 'management', 'image' => 'https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=400&q=80', 'photo_alt' => 'Prof. Dr. Nafees Uddin', 'sort_order' => 2],
            ['name' => 'Sornaly Ahmed', 'role' => 'Human Resources Officer', 'section' => 'management', 'image' => 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80', 'photo_alt' => 'Sornaly Ahmed', 'sort_order' => 3],

            // CEO Assistant (1)
            ['name' => 'M. Jamil Rahman', 'role' => 'CEO Assistant', 'section' => 'ceo_assistant', 'image' => 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80', 'photo_alt' => 'M. Jamil Rahman', 'sort_order' => 1],

            // Digital Marketing Team (4)
            ['name' => 'Md. Samiul Biswas', 'role' => 'Sr. Digital Mkt Exec.', 'section' => 'digital_marketing', 'image' => 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80', 'photo_alt' => 'Md. Samiul Biswas', 'sort_order' => 1],
            ['name' => 'Md. Sabbir Ahmed', 'role' => 'Digital Mkt Exec.', 'section' => 'digital_marketing', 'image' => 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80', 'photo_alt' => 'Md. Sabbir Ahmed', 'sort_order' => 2],
            ['name' => 'Md. Ariful Amin', 'role' => 'Digital Mkt Exec.', 'section' => 'digital_marketing', 'image' => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80', 'photo_alt' => 'Md. Ariful Amin', 'sort_order' => 3],
            ['name' => 'Probal Barua', 'role' => 'Digital Mkt Exec.', 'section' => 'digital_marketing', 'image' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80', 'photo_alt' => 'Probal Barua', 'sort_order' => 4],

            // Call Center Team (6)
            ['name' => 'Md. Noman', 'role' => 'Call Center Exec.', 'section' => 'call_center', 'image' => 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80', 'photo_alt' => 'Md. Noman', 'sort_order' => 1],
            ['name' => 'Md. Al-Amin Islam', 'role' => 'Call Center Exec.', 'section' => 'call_center', 'image' => 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&w=400&q=80', 'photo_alt' => 'Md. Al-Amin Islam', 'sort_order' => 2],
            ['name' => 'Md. Abdullah Sadid', 'role' => 'Call Center Exec.', 'section' => 'call_center', 'image' => 'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?auto=format&fit=crop&w=400&q=80', 'photo_alt' => 'Md. Abdullah Sadid', 'sort_order' => 3],
            ['name' => 'Farzana Akter', 'role' => 'Call Center Exec.', 'section' => 'call_center', 'image' => 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80', 'photo_alt' => 'Farzana Akter', 'sort_order' => 4],
            ['name' => 'Sumaiya Islam', 'role' => 'Call Center Exec.', 'section' => 'call_center', 'image' => 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80', 'photo_alt' => 'Sumaiya Islam', 'sort_order' => 5],
            ['name' => 'Farida Akter Rumi', 'role' => 'Call Center Exec.', 'section' => 'call_center', 'image' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', 'photo_alt' => 'Farida Akter Rumi', 'sort_order' => 6],
        ];

        foreach ($members as $m) {
            // Key on name+section to avoid clobbering the other "Md. Noman" (call center) with "Md. Noman Khan".
            TeamMember::updateOrCreate(
                ['section' => $m['section'], 'name' => $m['name']],
                $m
            );
        }
    }
}
