<?php

namespace Database\Seeders;

use App\Models\HomeContent;
use Illuminate\Database\Seeder;

class HomeContentSeeder extends Seeder
{
    /**
     * Homepage CMS content verbatim from "Homepage Backend" design siteData (L12902-12927).
     */
    public function run(): void
    {
        $data = [
            'seo_title' => 'Your Trusted Dental Care Provider in Dhaka',
            'about_text' => 'At Tech Dental, we are committed to providing world-class, painless dental care.',
            'about_image' => 'https://images.unsplash.com/photo-1600170311833-c2cf5280ce49?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'about_caption' => 'State-of-the-art equipment',
            'faqs' => [
                ['q' => 'Is root canal treatment really painless?', 'a' => 'Yes, we use advanced anesthesia.'],
                ['q' => 'How can I book an appointment?', 'a' => 'Call our hotline 09638000505 or use the online booking form.'],
            ],
        ];

        $content = HomeContent::first();
        if ($content) {
            $content->update($data);
        } else {
            HomeContent::create($data);
        }
    }
}
