<?php

namespace Database\Seeders;

use App\Models\Post;
use Illuminate\Database\Seeder;

class BlogSeeder extends Seeder
{
    /**
     * 6 blog listing cards verbatim from the "Dental Blog" design (L2584-2805).
     * Posts use the existing posts table (public blog reuse).
     */
    public function run(): void
    {
        $posts = [
            [
                'title' => 'Best Orthodontist Doctor in Dhaka',
                'excerpt' => "A beautiful and attractive smile plays an indispensable role in enhancing one's personality, and straight",
                'img' => 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=600&q=80',
                'category' => 'Orthodontics',
                'slug' => 'best-orthodontist-doctor-in-dhaka',
                'published_date' => '2026-06-04',
            ],
            [
                'title' => 'Best Dental Clinic in Chennai | Best Dentist in Chennai',
                'excerpt' => 'Finding the Best Dental Clinic in Chennai is essential for maintaining optimal oral health and',
                'img' => 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=600&q=80',
                'category' => 'General',
                'slug' => 'best-dental-clinic-in-chennai-best-dentist-in-chennai',
                'published_date' => '2026-03-27',
            ],
            [
                'title' => 'Bad Breath (Halitosis): Causes, Home Remedies, Prevention, and Permanent Solutions',
                'excerpt' => 'Bad breath, also known as halitosis, is a common problem that can significantly affect your',
                'img' => 'https://images.unsplash.com/photo-1598256989800-fea5f2081314?auto=format&fit=crop&w=600&q=80',
                'category' => 'Oral Health',
                'slug' => 'bad-breath-halitosis-causes-home-remedies-prevention',
                'published_date' => '2026-01-06',
            ],
            [
                'title' => 'Gum Cancer: Symptoms, Causes, and Prevention Strategies',
                'excerpt' => 'Gum cancer has become a significant health risk today, primarily driven by the widespread use',
                'img' => 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=600&q=80',
                'category' => 'Gum Disease',
                'slug' => 'gum-cancer-symptoms-causes-and-prevention-strategies',
                'published_date' => '2026-01-06',
            ],
            [
                'title' => 'Wisdom Tooth Pain Relief: Medication and 5 Effective Home Remedies',
                'excerpt' => 'Wisdom tooth pain is an extremely common and agonizing issue. Typically emerging between the ages',
                'img' => 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80',
                'category' => 'Dental Pain',
                'slug' => 'wisdom-tooth-pain-relief-medication-and-5-effective-home-remedies',
                'published_date' => '2026-12-15',
            ],
            [
                'title' => 'Medicines and 4 Home Remedies to Reduce Tooth Pain',
                'excerpt' => "Tooth pain is a common problem that can make daily life miserable. If you're searching",
                'img' => 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ad?auto=format&fit=crop&w=600&q=80',
                'category' => 'Dental Pain',
                'slug' => 'medicines-and-4-home-remedies-to-reduce-tooth-pain',
                'published_date' => '2026-11-28',
            ],
        ];

        $existing = Post::whereIn('slug', array_column($posts, 'slug'))->pluck('slug')->all();
        foreach ($posts as $p) {
            if (!in_array($p['slug'], $existing)) {
                Post::create([
                    'slug' => $p['slug'],
                    'title' => $p['title'],
                    'excerpt' => $p['excerpt'],
                    'content' => '<p>' . $p['excerpt'] . ' For more details, visit our clinic or call our hotline.</p>',
                    'img' => $p['img'],
                    'category' => $p['category'],
                    'author_name' => 'Dr. Farhana Ahmed',
                    'status' => 'Published',
                    'published_at' => $p['published_date'],
                ]);
            }
        }
    }
}
