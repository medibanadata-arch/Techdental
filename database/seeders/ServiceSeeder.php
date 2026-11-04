<?php

namespace Database\Seeders;

use App\Models\Service;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    /**
     * 8 services verbatim from the services listing design (L9769-9911)
     * + Dental Implant full detail for the single-service design (L9913-10557).
     */
    public function run(): void
    {
        $services = [
            [
                'slug' => 'dental-implants',
                'title' => 'Dental Implants – The Permanent Solution for Missing Teeth',
                'price' => '৳ 35,000',
                'price_suffix' => 'Starting Price',
                'short_desc' => 'A titanium implant replaces the root of a missing tooth and holds a natural-looking crown. It feels, looks and works like your own tooth, with no need to grind down healthy neighbours.',
                'hero_main' => 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                'hero_thumbs' => [
                    'https://images.unsplash.com/photo-1598256989800-fea5f60eb346?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                    'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                    'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                ],
                'features' => [
                    ['title' => 'Aesthetic Result', 'sub' => 'Blends with your own teeth'],
                    ['title' => 'Treatment Time', 'sub' => '3-6 months in total'],
                    ['title' => 'Durability', 'sub' => 'Lasts decades with good care'],
                    ['title' => 'Warranty', 'sub' => '10 years on the implant'],
                ],
                'pricing_cards' => [
                    ['img' => 'https://images.unsplash.com/photo-1598256989800-fea5f60eb346?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', 'title' => 'Multiple implants', 'price' => '৳ 32,000', 'note' => 'per implant, price drops with quantity', 'popular' => true],
                    ['img' => 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', 'title' => 'Single implant', 'price' => '৳ 35,000', 'note' => 'per implant', 'popular' => false],
                    ['img' => 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', 'title' => 'Full arch', 'price' => '৳ 2,50,000', 'note' => 'per arch', 'popular' => false],
                ],
                'results' => [
                    'https://images.unsplash.com/photo-1598256989800-fea5f60eb346?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
                    'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
                    'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
                ],
                'details_heading' => 'More About Dental Implant Treatments',
                'details_html' => '<p><strong>Advanced Dental Implants for a Perfect Smile:</strong> Reclaiming your beautiful smile and optimal oral functionality has never been more achievable. Dental implants serve as a permanent, robust foundation for replacement teeth that look, feel, and function exactly like your natural teeth.</p><p>Beyond aesthetics, implants prevent bone loss in the jaw, maintain facial structure, and eliminate the discomfort often associated with removable dentures. Our expert dental team utilizes precision 3D scanning to ensure your implant is placed perfectly, offering a seamless integration with your jawbone for lifelong durability.</p>',
                'seo_images' => ['https://images.unsplash.com/photo-1527613426441-4da17471b66d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'],
                'faqs' => [
                    ['q' => 'Does the implant procedure hurt?', 'a' => 'The procedure is performed under local anesthesia, ensuring you feel no pain during the surgery. Post-operative discomfort is usually mild and easily managed with standard pain medication prescribed by our doctors.'],
                    ['q' => 'How long do dental implants last?', 'a' => 'Dental implants are designed to be a permanent solution. With proper daily oral hygiene (brushing and flossing) and regular dental check-ups every 6 months, an implant can last a lifetime.'],
                ],
                'reviews' => [
                    ['stars' => 5, 'text' => '"The implant process was completely painless. Dr. Aysha and her team were incredibly supportive. I got my smile back!"', 'by' => 'Shafiqur Rahman'],
                    ['stars' => 4, 'text' => '"Highly recommend the Mirpur branch for implants. Clean environment and state-of-the-art equipment."', 'by' => 'Nazma Begum'],
                ],
                'rank_order' => 1,
                'status' => 'Published',
            ],
            ['slug' => 'tooth-replacement-services-cost-in-bangladesh', 'title' => 'Tooth Replacement Services & Cost in Bangladesh', 'price' => '৳ 1,000.00', 'short_desc' => 'Complete tooth replacement solutions including implants, bridges and dentures tailored to your budget.', 'hero_main' => 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=800', 'rank_order' => 2, 'status' => 'Published'],
            ['slug' => 'flexible-dentures-ultimate-solution-natural-smile', 'title' => 'Flexible Dentures – The Ultimate Solution For Natural Smile', 'price' => '৳ 1,500.00', 'short_desc' => 'Comfortable, virtually invisible flexible dentures for a secure and confident fit.', 'hero_main' => 'https://images.unsplash.com/photo-1598256989800-fea5f953c7b2?auto=format&fit=crop&q=80&w=800', 'rank_order' => 3, 'status' => 'Published'],
            ['slug' => 'broken-tooth-treatment-repair-services', 'title' => 'Broken Tooth Treatment & Repair Services', 'price' => '৳ 3,000.00', 'short_desc' => 'From chipped enamels to fractured crowns, restore broken teeth quickly and painlessly.', 'hero_main' => 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&q=80&w=800', 'rank_order' => 4, 'status' => 'Published'],
            ['slug' => 'dental-bridges-regain-your-smile-best-price', 'title' => 'Dental Bridges: Regain Your Smile at Best Price', 'price' => '৳ 2,500.00', 'short_desc' => 'Bridge the gap permanently with high-quality dental bridges at an affordable price.', 'hero_main' => 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=800', 'rank_order' => 5, 'status' => 'Published'],
            ['slug' => 'zirconia-crown-ultimate-solution-natural-smile', 'title' => 'Zirconia Crown – The Ultimate Solution for a Natural & Long-lasting Smile', 'price' => '৳ 5,500.00', 'short_desc' => 'Metal-free zirconia crowns that blend perfectly with your natural teeth.', 'hero_main' => 'https://images.unsplash.com/photo-1628177142898-93e46e46248c?auto=format&fit=crop&q=80&w=800', 'rank_order' => 6, 'status' => 'Published'],
            ['slug' => 'wisdom-tooth-removal-painless-extraction', 'title' => 'Wisdom Tooth Removal – Painless Extraction', 'price' => '৳ 4,000.00', 'short_desc' => 'Impacted wisdom tooth surgery performed by experienced oral surgeons with sedation options.', 'hero_main' => 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800', 'rank_order' => 7, 'status' => 'Published'],
            ['slug' => 'orthodontic-treatment-get-your-perfect-smile', 'title' => 'Orthodontic Treatment – Get Your Perfect Smile', 'price' => '৳ 12,000.00', 'short_desc' => 'Braces and aligners straightening treatments by certified orthodontist specialists.', 'hero_main' => 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=800', 'rank_order' => 8, 'status' => 'Published'],
            ['slug' => 'composite-fillings-get-back-your-natural-smile', 'title' => 'Composite Fillings – Get Back Your Natural Smile', 'price' => '৳ 1,200.00', 'short_desc' => 'Tooth-colored composite fillings that restore decayed teeth invisibly.', 'hero_main' => 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=800', 'rank_order' => 9, 'status' => 'Published'],
        ];

        foreach ($services as $s) {
            Service::updateOrCreate(['slug' => $s['slug']], $s);
        }
    }
}
