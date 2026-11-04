<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Page;
use App\Models\Appointment;
use App\Models\FeaturedImage;
use App\Models\Media;
use App\Models\Category;
use App\Models\Tag;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Users
        if (User::count() === 0) {
            User::create([
                'name' => 'Tech Dental',
                'username' => 'admin',
                'email' => 'info@techdentalcare.com',
                'password' => Hash::make('admin123'),
                'role' => 'Administrator',
                'avatar' => 'https://ui-avatars.com/api/?name=Tech+Dental&background=800038&color=fff',
            ]);

            User::create([
                'name' => 'Dr. Farhana Ahmed',
                'username' => 'farhana',
                'email' => 'farhana@techdentalcare.com',
                'password' => Hash::make('doctor123'),
                'role' => 'Author',
                'avatar' => 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=250&q=80',
            ]);

            User::create([
                'name' => 'Reception Team',
                'username' => 'reception',
                'email' => 'reception@techdentalcare.com',
                'password' => Hash::make('staff123'),
                'role' => 'Editor',
                'avatar' => 'https://ui-avatars.com/api/?name=Reception&background=0284c7&color=fff',
            ]);
        }

        // 2. Featured Images
        if (FeaturedImage::count() === 0) {
            $images = [
                [
                    'title' => 'Mirpur Branch Photo',
                    'src' => 'https://res.cloudinary.com/aijtiabn/image/upload/v1789568105/techdental_gallery_7_Mirpur_Branch_Photo.webp',
                    'badge' => 'Uttara',
                    'branch' => 'Uttara',
                    'alt' => 'Mirpur Branch Photo',
                    'type' => 'half-size',
                    'sort_order' => 1,
                    'view_count' => 1240,
                    'is_active' => true,
                ],
                [
                    'title' => 'Operatory',
                    'src' => 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80',
                    'badge' => 'Badda',
                    'branch' => 'Badda',
                    'alt' => 'Tech Dental Mirpur Consultation Operatory',
                    'type' => 'half-size',
                    'sort_order' => 2,
                    'view_count' => 980,
                    'is_active' => true,
                ],
                [
                    'title' => 'Sterilization Tools',
                    'src' => 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=500&q=80',
                    'badge' => 'Uttara',
                    'branch' => 'Uttara',
                    'alt' => 'Dental Sterilization and Surgical Tools',
                    'type' => 'half-size',
                    'sort_order' => 3,
                    'view_count' => 740,
                    'is_active' => true,
                ],
                [
                    'title' => 'WhatsApp Image 2026-08-31 at 5.06.04 PM (1)',
                    'src' => 'https://res.cloudinary.com/aijtiabn/image/upload/v1789568094/techdental_gallery_5_WhatsApp_Image_2026-08-31_at_5_06_04_PM__1_.jpg',
                    'badge' => 'Uttara',
                    'branch' => 'Uttara',
                    'alt' => 'WhatsApp Image 2026-08-31 at 5.06.04 PM (1)',
                    'type' => 'half-size',
                    'sort_order' => 4,
                    'view_count' => 890,
                    'is_active' => true,
                ],
                [
                    'title' => '18757',
                    'src' => 'https://res.cloudinary.com/aijtiabn/image/upload/v1789568099/techdental_gallery_6_18757.jpg',
                    'badge' => 'Badda',
                    'branch' => 'Badda',
                    'alt' => '18757',
                    'type' => 'half-size',
                    'sort_order' => 5,
                    'view_count' => 1120,
                    'is_active' => true,
                ],
                [
                    'title' => 'Modern Ergonomic Chair',
                    'src' => 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=500&q=80',
                    'badge' => 'Uttara',
                    'branch' => 'Uttara',
                    'alt' => 'Modern Patient Ergonomic Chair & Tech',
                    'type' => 'half-size',
                    'sort_order' => 6,
                    'view_count' => 630,
                    'is_active' => true,
                ],
                [
                    'title' => '18761',
                    'src' => 'https://res.cloudinary.com/aijtiabn/image/upload/v1789568089/techdental_gallery_4_18761.jpg',
                    'badge' => 'Badda',
                    'branch' => 'Badda',
                    'alt' => '18761',
                    'type' => 'half-size',
                    'sort_order' => 7,
                    'view_count' => 540,
                    'is_active' => true,
                ],
                [
                    'title' => 'Mirpur Branch Photo',
                    'src' => 'https://res.cloudinary.com/aijtiabn/image/upload/v1789568110/techdental_gallery_8_Mirpur_Branch_Photo.webp',
                    'badge' => 'Mirpur',
                    'branch' => 'Mirpur',
                    'alt' => 'Mirpur Branch Photo',
                    'type' => 'half-size',
                    'sort_order' => 8,
                    'view_count' => 1450,
                    'is_active' => true,
                ],
            ];

            foreach ($images as $img) {
                FeaturedImage::create($img);
            }
        }

        // 3. Media Items (27 items mirroring screenshot)
        if (Media::count() === 0) {
            $mediaList = [
                ['title' => 'Dental Reception Desk', 'url' => 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=600&q=80', 'file_name' => 'reception-desk.jpg', 'file_type' => 'image/jpeg', 'file_size' => '245 KB', 'dimensions' => '1200 x 800'],
                ['title' => 'HR Officer Circular', 'url' => 'https://res.cloudinary.com/aijtiabn/image/upload/v1789568094/techdental_gallery_5_WhatsApp_Image_2026-08-31_at_5_06_04_PM__1_.jpg', 'file_name' => 'hr-circular.webp', 'file_type' => 'image/webp', 'file_size' => '180 KB', 'dimensions' => '1080 x 1080'],
                ['title' => 'Dental Consultation Doctor', 'url' => 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80', 'file_name' => 'doctor-consult.jpg', 'file_type' => 'image/jpeg', 'file_size' => '320 KB', 'dimensions' => '1400 x 933'],
                ['title' => 'Tech Dental Logo Banner', 'url' => 'https://res.cloudinary.com/aijtiabn/image/upload/v1789568099/techdental_gallery_6_18757.jpg', 'file_name' => 'banner-techdental.webp', 'file_type' => 'image/webp', 'file_size' => '210 KB', 'dimensions' => '1200 x 630'],
                ['title' => 'Female Surgeon Circular', 'url' => 'https://images.unsplash.com/photo-1594824813571-638f0263613a?auto=format&fit=crop&w=600&q=80', 'file_name' => 'surgeon-job.jpg', 'file_type' => 'image/jpeg', 'file_size' => '295 KB', 'dimensions' => '1080 x 1080'],
                ['title' => 'Smile Makeover Teeth Model', 'url' => 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=600&q=80', 'file_name' => 'teeth-model.jpg', 'file_type' => 'image/jpeg', 'file_size' => '410 KB', 'dimensions' => '1920 x 1080'],
                ['title' => 'Dr Farhana Profile Picture', 'url' => 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80', 'file_name' => 'dr-farhana.jpg', 'file_type' => 'image/jpeg', 'file_size' => '115 KB', 'dimensions' => '600 x 600'],
                ['title' => 'Dr Tanvir Rahman Profile', 'url' => 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80', 'file_name' => 'dr-tanvir.jpg', 'file_type' => 'image/jpeg', 'file_size' => '130 KB', 'dimensions' => '600 x 600'],
                ['title' => 'Dr Nusrat Jahan Profile', 'url' => 'https://images.unsplash.com/photo-1594824813571-638f0263613a?auto=format&fit=crop&w=400&q=80', 'file_name' => 'dr-nusrat.jpg', 'file_type' => 'image/jpeg', 'file_size' => '142 KB', 'dimensions' => '600 x 600'],
                ['title' => 'Dr Sabbir Hossain Profile', 'url' => 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80', 'file_name' => 'dr-sabbir.jpg', 'file_type' => 'image/jpeg', 'file_size' => '120 KB', 'dimensions' => '600 x 600'],
                ['title' => 'Dr Sadia Islam Profile', 'url' => 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=400&q=80', 'file_name' => 'dr-sadia.jpg', 'file_type' => 'image/jpeg', 'file_size' => '110 KB', 'dimensions' => '600 x 600'],
                ['title' => 'Dr Ariful Haque Profile', 'url' => 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=400&q=80', 'file_name' => 'dr-ariful.jpg', 'file_type' => 'image/jpeg', 'file_size' => '125 KB', 'dimensions' => '600 x 600'],
                ['title' => 'Mirpur Clinic Exterior', 'url' => 'https://res.cloudinary.com/aijtiabn/image/upload/v1789568110/techdental_gallery_8_Mirpur_Branch_Photo.webp', 'file_name' => 'mirpur-exterior.webp', 'file_type' => 'image/webp', 'file_size' => '195 KB', 'dimensions' => '1000 x 750'],
                ['title' => 'Uttara Clinic Reception', 'url' => 'https://res.cloudinary.com/aijtiabn/image/upload/v1789568094/techdental_gallery_5_WhatsApp_Image_2026-08-31_at_5_06_04_PM__1_.jpg', 'file_name' => 'uttara-rec.webp', 'file_type' => 'image/webp', 'file_size' => '160 KB', 'dimensions' => '1080 x 720'],
                ['title' => 'Sterilization Chamber Autoclave', 'url' => 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=600&q=80', 'file_name' => 'autoclave.jpg', 'file_type' => 'image/jpeg', 'file_size' => '380 KB', 'dimensions' => '1600 x 1067'],
                ['title' => 'Clear Aligner Braces Setup', 'url' => 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=600&q=80', 'file_name' => 'aligners.jpg', 'file_type' => 'image/jpeg', 'file_size' => '270 KB', 'dimensions' => '1200 x 800'],
            ];

            foreach ($mediaList as $m) {
                Media::create($m);
            }
        }

        // 4. Categories & Tags
        if (Category::count() === 0) {
            $categories = [
                ['name' => 'Dental Care', 'slug' => 'dental-care', 'description' => 'General dental health tips and prevention guides', 'count' => 4],
                ['name' => 'Oral Surgery', 'slug' => 'oral-surgery', 'description' => 'Surgical extractions, wisdom tooth and impactions', 'count' => 2],
                ['name' => 'Orthodontics', 'slug' => 'orthodontics', 'description' => 'Braces, aligners, and bite correction', 'count' => 3],
                ['name' => 'Root Canal', 'slug' => 'root-canal', 'description' => 'Single-sitting painless root canal treatments', 'count' => 1],
                ['name' => 'Cosmetic Dentistry', 'slug' => 'cosmetic-dentistry', 'description' => 'Smile design, veneers, whitening, and aesthetic restoration', 'count' => 2],
            ];
            foreach ($categories as $cat) {
                Category::create($cat);
            }
        }

        if (Tag::count() === 0) {
            $tags = [
                ['name' => 'dental', 'slug' => 'dental', 'description' => 'General dental topics', 'count' => 5],
                ['name' => 'braces', 'slug' => 'braces', 'description' => 'Braces and teeth straightening', 'count' => 3],
                ['name' => 'teeth whitening', 'slug' => 'teeth-whitening', 'description' => 'Laser teeth whitening', 'count' => 2],
                ['name' => 'root canal', 'slug' => 'root-canal', 'description' => 'Endodontic procedures', 'count' => 2],
                ['name' => 'mirpur', 'slug' => 'mirpur', 'description' => 'Mirpur branch updates', 'count' => 4],
                ['name' => 'uttara', 'slug' => 'uttara', 'description' => 'Uttara branch updates', 'count' => 3],
            ];
            foreach ($tags as $tag) {
                Tag::create($tag);
            }
        }

        // 5. Custom Pages
        if (Page::count() === 0) {
            $pages = [
                ['title' => 'About Tech Dental', 'slug' => 'about-us', 'content' => 'Tech Dental is a modern, patient-first dental care provider in Dhaka offering specialized treatments across Mirpur, Uttara, Badda, and Jatrabari.'],
                ['title' => 'Privacy Policy', 'slug' => 'privacy-policy', 'content' => 'Your personal health records and appointments are handled with the highest standards of confidentiality and security.'],
                ['title' => 'Terms of Service', 'slug' => 'terms-of-service', 'content' => 'Standard operating procedures, appointment guidelines, and clinic visiting policies.'],
                ['title' => 'Branches & Schedules', 'slug' => 'branches-schedule', 'content' => 'Full operating hours, doctor visiting hours, and contact information for all branches in Dhaka.'],
            ];
            foreach ($pages as $p) {
                Page::create($p);
            }
        }

        // 6. Appointments
        if (Appointment::count() === 0) {
            $appointments = [
                ['name' => 'Kamal Hossain', 'phone' => '01711223344', 'date' => '2026-09-18', 'service' => 'Root Canal Treatment (RCT)', 'status' => 'Pending', 'notes' => 'Mirpur Branch - Preferred morning slot'],
                ['name' => 'Nusrat Parveen', 'phone' => '01819887766', 'date' => '2026-09-19', 'service' => 'Braces Consultation', 'status' => 'Confirmed', 'notes' => 'Uttara Branch - Dr. Nusrat Jahan'],
                ['name' => 'Tanvir Alam', 'phone' => '01912345678', 'date' => '2026-09-17', 'service' => 'Teeth Cleaning & Polishing', 'status' => 'Completed', 'notes' => 'Badda Branch - Routine checkup completed'],
                ['name' => 'Fatima Begum', 'phone' => '01671122334', 'date' => '2026-09-20', 'service' => 'Dental Implant Evaluation', 'status' => 'Pending', 'notes' => 'Jatrabari Branch'],
            ];
            foreach ($appointments as $apt) {
                Appointment::create($apt);
            }
        }

        // 7. Design-driven content (Tech Dental Care redesign seeders)
        $this->call([
            LocationsSeeder::class,
            DoctorsSeeder::class,
            MedicineSeeder::class,
            ServiceSeeder::class,
            TeamMemberSeeder::class,
            AboutSeeder::class,
            PriceListSeeder::class,
            HomeContentSeeder::class,
            BlogSeeder::class,
        ]);
    }
}
