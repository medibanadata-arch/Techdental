<?php

namespace Database\Seeders;

use App\Models\AboutContent;
use Illuminate\Database\Seeder;

class AboutSeeder extends Seeder
{
    /**
     * Content verbatim from "About Us - Tech Dental Care" design (L2809-3149).
     */
    public function run(): void
    {
        $data = [
            // Hero
            'hero_title' => 'About Tech Dental Care',
            'hero_subtitle' => 'Your trusted partner for comprehensive dental care and innovative dental technology solutions',
            'hero_bg' => 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=1920&q=80',

            // About & Story
            'headline' => 'Let a New Smile Begin with Tech Dental',
            'founded_year' => '2018',
            'patients_count' => '200,000',
            'story_p1' => "Founded in 2018, Tech Dental has grown into the country's most trusted dental care provider. With five modern branches located in Mirpur, Uttara, Badda, Jatrabari, we have already served more than 200,000 patients across Bangladesh.\n\nOur mission is to restore your dream smile. From treatment for missing teeth, dental implants, root canal therapy, dental fillings, scaling and polishing, tooth extractions, to orthodontic care for misaligned teeth—we provide all dental solutions under one roof.",
            'story_p2' => 'With experienced doctors, advanced technology, and international-standard hygiene protocols, we ensure safe, effective, and comfortable dental care for every patient.',
            'video_thumb' => 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1000&q=80',
            'video_url' => '',

            // Services & Tech
            'services_cards' => [
                ['img' => 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=600&q=80', 'title' => 'Preventive Care', 'desc' => 'Regular check-ups, cleanings, digital X-rays, and oral cancer screenings using advanced diagnostic technology to maintain your optimal oral health.'],
                ['img' => 'https://images.unsplash.com/photo-1598256989800-fea5ce5146f2?auto=format&fit=crop&w=600&q=80', 'title' => 'Cosmetic Dentistry', 'desc' => 'Teeth whitening, porcelain veneers, Invisalign, and digital smile design to create beautiful, natural-looking smiles with precision technology.'],
                ['img' => 'https://images.unsplash.com/photo-1574542289669-e7d69b3506bf?auto=format&fit=crop&w=600&q=80', 'title' => 'Restorative Services', 'desc' => 'Dental implants, crowns, bridges, and dentures using CAD/CAM technology for same-day restorations and perfect fits.'],
            ],

            // Advanced Technology
            'tech_headline' => 'Tech Dental Modern Advanced Dental Technology',
            'tech_subtext' => 'Tech Dental brings you modern dental care with Digital X-Ray, Intraoral Cameras, Live Patient Portal, and 4-Step Sterilization — ensuring safe, precise, and patient-friendly treatment.',
            'tech_cards' => [
                ['img' => 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=400&q=80', 'title' => 'Digital X-Ray (RVG)', 'tag' => 'Instant & Precise', 'desc' => 'Our advanced RVG digital X-ray system delivers crystal-clear images with minimal radiation, ensuring fast and accurate diagnosis for every patient.'],
                ['img' => 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=400&q=80', 'title' => 'Intra Oral Camera', 'tag' => 'High-Resolution', 'desc' => 'Tiny yet powerful cameras provide real-time, high-definition visuals inside your mouth—helping dentists detect hidden issues.'],
                ['img' => 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=400&q=80', 'title' => 'Live Patient Portal', 'tag' => 'Smart Digital Exp.', 'desc' => 'Our patient portal on TV screens keeps you connected—view treatment plans, upcoming appointments, and educational content.'],
                ['img' => 'https://images.unsplash.com/photo-1584362917165-526a968579e8?auto=format&fit=crop&w=400&q=80', 'title' => '4-Step Sterilization', 'tag' => 'Hygiene Protocol', 'desc' => 'Our advanced 4-step sterilization process guarantees the highest standards of safety, ensuring every instrument is 100% clean.'],
            ],

            // Vision & Mission
            'vision_title' => 'Our Vision',
            'vision_text' => "Building Asia's premier dental institute, synonymous with cutting-edge technology and impeccable aesthetic results.",
            'mission_title' => 'Our Mission',
            'mission_text' => 'Prepare to be stunned: Introducing the most integrated aesthetic treatment appliance, engineered to surpass even your wildest vision for a beautiful smile.',
            'team_banner' => 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',

            // Why Choose
            'why_cards' => [
                ['img' => 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=400&q=80', 'title' => 'High Quality', 'desc' => "Tech Dental excels in high-quality dental care, seamlessly merging advanced technology with a patient-focused approach. The clinic's dedication to using state-of-the-art equipment ensures precise diagnosis and treatment, creating a comfortable and efficient experience for patients."],
                ['img' => 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=400&q=80', 'title' => 'Innovation', 'desc' => 'Tech Dental stands out with ongoing innovation in dental practices, incorporating the latest technology for improved patient experiences. With digital diagnostics and cutting-edge treatments, the clinic leads in dental innovation.'],
            ],
        ];

        $content = AboutContent::first();
        if ($content) {
            $content->update($data);
        } else {
            AboutContent::create($data);
        }
    }
}
