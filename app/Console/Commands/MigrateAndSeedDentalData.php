<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;

class MigrateAndSeedDentalData extends Command
{
    protected $signature = 'dental:seed';
    protected $description = 'Migrate and seed dental static data into SQLite';

    public function handle()
    {
        $this->info('Dropping existing tables...');
        Schema::dropIfExists('doctors');
        Schema::dropIfExists('locations');
        Schema::dropIfExists('pricing');
        Schema::dropIfExists('posts');
        Schema::dropIfExists('pages');
        Schema::dropIfExists('appointments');

        $this->info('Creating tables...');

        Schema::create('locations', function (Blueprint $table) {
            $table->id();
            $table->string('location_id')->unique();
            $table->string('name');
            $table->string('shortName');
            $table->string('address');
            $table->string('time');
            $table->string('phone');
            $table->string('mapUrl')->nullable();
            $table->string('reviewUrl')->nullable();
            $table->string('statusText');
            $table->boolean('isOpenNow')->default(false);
            $table->timestamps();
        });

        Schema::create('pricing', function (Blueprint $table) {
            $table->id();
            $table->string('service_id')->unique();
            $table->string('name');
            $table->string('desc');
            $table->string('price');
            $table->string('image')->nullable();
            $table->boolean('popular')->default(false);
            $table->timestamps();
        });

        Schema::create('doctors', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('spec');
            $table->string('degree');
            $table->string('branch'); // e.g. mirpur
            $table->string('branchTitle');
            $table->string('time');
            $table->string('days');
            $table->string('img')->nullable();
            $table->text('bio')->nullable();
            $table->string('bmdcReg')->nullable();
            $table->timestamps();
        });

        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('authorName');
            $table->string('authorAvatar')->nullable();
            $table->string('category');
            $table->text('excerpt');
            $table->string('thumbUrl')->nullable();
            $table->timestamps();
        });

        Schema::create('pages', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->longText('content')->nullable();
            $table->timestamps();
        });

        Schema::create('appointments', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('phone');
            $table->string('location_id');
            $table->string('date');
            $table->string('time');
            $table->string('status')->default('pending');
            $table->timestamps();
        });

        $this->info('Seeding locations...');
        $locations = [
            [
                'location_id' => 'mirpur', 'name' => 'Tech Dental, Mirpur Branch', 'shortName' => 'Mirpur',
                'address' => '827 (2nd Floor), Shewrapara, Mirpur, Dhaka', 'time' => 'Opening time: 10 AM - 9 PM',
                'phone' => '01400786162', 'mapUrl' => 'https://maps.google.com/?q=Tech+Dental+Shewrapara+Mirpur+Dhaka',
                'reviewUrl' => 'https://search.google.com/local/writereview?placeid=ChIJTechDentalMirpur',
                'statusText' => 'Open Now', 'isOpenNow' => true,
            ],
            [
                'location_id' => 'badda', 'name' => 'Tech Dental, Badda Branch', 'shortName' => 'Badda',
                'address' => 'Cha-68/1, Pragati Sarani, Middle Badda, Dhaka', 'time' => 'Opening time: 03.00 PM - 9.00 PM',
                'phone' => '01400786162', 'mapUrl' => 'https://maps.google.com/?q=Tech+Dental+Middle+Badda+Dhaka',
                'reviewUrl' => 'https://search.google.com/local/writereview?placeid=ChIJTechDentalBadda',
                'statusText' => 'Open Today', 'isOpenNow' => true,
            ],
            [
                'location_id' => 'uttara', 'name' => 'Tech Dental, Uttara Branch', 'shortName' => 'Uttara',
                'address' => 'House 18, Road 14, Sector 3, Uttara, Dhaka', 'time' => 'Opening time: 03.00 PM - 9.00 PM',
                'phone' => '01400786162', 'mapUrl' => 'https://maps.google.com/?q=Tech+Dental+Sector+3+Uttara+Dhaka',
                'reviewUrl' => 'https://search.google.com/local/writereview?placeid=ChIJTechDentalUttara',
                'statusText' => 'Open Soon', 'isOpenNow' => false,
            ],
            [
                'location_id' => 'jatrabari', 'name' => 'Tech Dental, Jatrabari Branch', 'shortName' => 'Jatrabari',
                'address' => 'Shahid Faruk Road, South Jatrabari, Dhaka', 'time' => 'Opening time: 03.00 PM - 9.00 PM',
                'phone' => '01400786162', 'mapUrl' => 'https://maps.google.com/?q=Tech+Dental+Jatrabari+Dhaka',
                'reviewUrl' => 'https://search.google.com/local/writereview?placeid=ChIJTechDentalJatrabari',
                'statusText' => 'Open Soon', 'isOpenNow' => false,
            ],
        ];
        DB::table('locations')->insert($locations);

        $this->info('Seeding pricing...');
        $pricing = [
            ['service_id' => 'consultation', 'name' => 'Dental Consultation', 'desc' => 'Intraoral checkup & report', 'price' => '৳ 500', 'image' => 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=150&q=80', 'popular' => true],
            ['service_id' => 'fiber-bridge', 'name' => 'Fiber Reinforced Bridge', 'desc' => 'Single sitting, metal-free', 'price' => '৳ 4,500+', 'image' => 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=150&q=80', 'popular' => true],
            ['service_id' => 'veneers', 'name' => 'Composite / Porcelain Veneers', 'desc' => 'Aesthetic smile correction', 'price' => '৳ 3,500/t', 'image' => 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&w=150&q=80', 'popular' => false],
            ['service_id' => 'rct', 'name' => 'Root Canal Treatment (RCT)', 'desc' => 'Painless rotary procedure', 'price' => '৳ 4,000+', 'image' => 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=150&q=80', 'popular' => true],
            ['service_id' => 'braces', 'name' => 'Orthodontic Braces', 'desc' => 'Teeth alignment treatment', 'price' => '৳ 45,000+', 'image' => 'https://images.unsplash.com/photo-1588776814546-daab30f310ce?auto=format&fit=crop&w=150&q=80', 'popular' => false],
            ['service_id' => 'scaling', 'name' => 'Scaling & Deep Polishing', 'desc' => 'Ultrasonic stain removal', 'price' => '৳ 1,200', 'image' => 'https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&w=150&q=80', 'popular' => false],
        ];
        DB::table('pricing')->insert($pricing);

        $this->info('Seeding doctors...');
        $doctors = [
            ['name' => 'Dr. Farhana Ahmed', 'spec' => 'Prosthodontist', 'degree' => 'BDS, PGT (Prosthodontics)', 'branch' => 'mirpur', 'branchTitle' => 'Mirpur', 'time' => '10:00 AM - 04:00 PM', 'days' => 'Saturday - Thursday', 'img' => 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=250&q=80', 'bio' => 'Expert in single-sitting fiber reinforced bridges, cosmetic smile makeovers, and ceramic veneers.'],
            ['name' => 'Dr. Tanvir Rahman', 'spec' => 'Endodontist', 'degree' => 'BDS, PGT (Rotary Endodontics)', 'branch' => 'mirpur', 'branchTitle' => 'Mirpur', 'time' => '04:00 PM - 09:00 PM', 'days' => 'Saturday - Thursday', 'img' => 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=250&q=80', 'bio' => 'Specialized in painless single-visit automated rotary root canal therapy and post-core reconstructions.'],
            ['name' => 'Dr. Nusrat Jahan', 'spec' => 'Orthodontist', 'degree' => 'BDS, MS (Orthodontics)', 'branch' => 'mirpur', 'branchTitle' => 'Mirpur', 'time' => '11:00 AM - 05:00 PM', 'days' => 'Friday & Monday Only', 'img' => 'https://images.unsplash.com/photo-1594824813571-638f0263613a?auto=format&fit=crop&w=250&q=80', 'bio' => 'Dedicated to contemporary braces and clear aligner therapies for straightening crooked teeth and bite correction.'],
            ['name' => 'Dr. Sabbir Hossain', 'spec' => 'Oral & Dental Surgeon', 'degree' => 'BDS, PGT (Oral Surgery)', 'branch' => 'mirpur', 'branchTitle' => 'Mirpur', 'time' => '05:00 PM - 09:00 PM', 'days' => 'Saturday - Wednesday', 'img' => 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=250&q=80', 'bio' => 'Skilled in atraumatic surgical extractions, impaction surgeries, and restorative dental emergencies.'],
            ['name' => 'Dr. Sadia Islam', 'spec' => 'Cosmetic Dental Surgeon', 'degree' => 'BDS, MPH, PGT', 'branch' => 'mirpur', 'branchTitle' => 'Mirpur', 'time' => '10:00 AM - 02:00 PM', 'days' => 'Sunday - Thursday', 'img' => 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=250&q=80', 'bio' => 'Focused on aesthetic composite restorations, laser teeth whitening, and preventive oral healthcare.'],
            ['name' => 'Dr. Ariful Haque', 'spec' => 'Implantologist & Surgeon', 'degree' => 'BDS, PGT (Dental Implants)', 'branch' => 'mirpur', 'branchTitle' => 'Mirpur', 'time' => '03:00 PM - 08:00 PM', 'days' => 'By Prior Appointment', 'img' => 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=250&q=80', 'bio' => 'Proficient in permanent titanium dental implants and bone augmentation surgical techniques.'],
            ['name' => 'Dr. Mahin Chowdhury', 'spec' => 'Senior Dental Surgeon', 'degree' => 'BDS, PGT (Advanced Dentistry)', 'branch' => 'badda', 'branchTitle' => 'Badda', 'time' => '03:00 PM - 09:00 PM', 'days' => 'Saturday - Thursday', 'img' => 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=250&q=80', 'bio' => 'In-charge of clinical operations at Badda branch, skilled in cosmetic smile design and root canals.'],
            ['name' => 'Dr. Rashedul Karim', 'spec' => 'Oral Health Specialist', 'degree' => 'BDS, PGT (Conservative)', 'branch' => 'badda', 'branchTitle' => 'Badda', 'time' => '04:00 PM - 09:00 PM', 'days' => 'Saturday - Thursday', 'img' => 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=250&q=80', 'bio' => 'Expert in composite fillings, ultrasonic scaling, and pediatric dental solutions.'],
            ['name' => 'Dr. Anika Tabassum', 'spec' => 'Cosmetic Dental Surgeon', 'degree' => 'BDS, PGT (Aesthetic Dentistry)', 'branch' => 'uttara', 'branchTitle' => 'Uttara', 'time' => '03:00 PM - 09:00 PM', 'days' => 'Saturday - Thursday', 'img' => 'https://images.unsplash.com/photo-1594824813571-638f0263613a?auto=format&fit=crop&w=250&q=80', 'bio' => 'Leading aesthetic treatments at Uttara, specializing in dental veneers and smile transformations.'],
            ['name' => 'Dr. Kazi Imran', 'spec' => 'Endodontic Surgeon', 'degree' => 'BDS, PGT (Rotary RCT)', 'branch' => 'uttara', 'branchTitle' => 'Uttara', 'time' => '04:00 PM - 09:00 PM', 'days' => 'Saturday - Thursday', 'img' => 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=250&q=80', 'bio' => 'Proficient in complex root canals, re-RCT procedures, and crown bridge restorations.'],
            ['name' => 'Dr. Nazmul Hasan', 'spec' => 'Senior Dental Surgeon', 'degree' => 'BDS, PGT (Restorative)', 'branch' => 'jatrabari', 'branchTitle' => 'Jatrabari', 'time' => '03:00 PM - 09:00 PM', 'days' => 'Saturday - Thursday', 'img' => 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=250&q=80', 'bio' => 'Dedicated to patient comfort, tooth extractions, and comprehensive family dental care in Jatrabari.'],
            ['name' => 'Dr. Farzana Boby', 'spec' => 'Dental Surgeon', 'degree' => 'BDS, PGT (Pediatric & General)', 'branch' => 'jatrabari', 'branchTitle' => 'Jatrabari', 'time' => '04:00 PM - 08:30 PM', 'days' => 'Saturday - Thursday', 'img' => 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=250&q=80', 'bio' => 'Gentle approach towards pediatric dentistry, stain removal scaling, and preventive sealants.'],
        ];
        DB::table('doctors')->insert($doctors);

        $this->info('Seeding posts (care guides)...');
        $posts = [
            ['title' => 'Single-Visit Tooth Replacement with Fiber Reinforced Bridge', 'authorName' => 'Dr. Farhana Ahmed, BDS', 'authorAvatar' => 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=100&q=80', 'category' => 'Prosthodontics', 'excerpt' => 'Preserve your adjacent healthy teeth with minimally invasive fiber bridges...', 'thumbUrl' => 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=250&q=80'],
            ['title' => 'Painless Root Canal Treatment: Signs & Modern Rotary Care', 'authorName' => 'Dr. Tanvir Rahman, BDS', 'authorAvatar' => 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=100&q=80', 'category' => 'Endodontics', 'excerpt' => 'Severe toothache or nerve infection doesn\'t mean losing your natural tooth...', 'thumbUrl' => 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=250&q=80'],
            ['title' => 'Modern Orthodontic Braces: Achieving Perfect Teeth Alignment', 'authorName' => 'Dr. Nusrat Jahan, BDS', 'authorAvatar' => 'https://images.unsplash.com/photo-1594824813571-638f0263613a?auto=format&fit=crop&w=100&q=80', 'category' => 'Orthodontics', 'excerpt' => 'Align crowded or crooked teeth with contemporary ceramic and self-ligating braces...', 'thumbUrl' => 'https://images.unsplash.com/photo-1588776814546-daab30f310ce?auto=format&fit=crop&w=250&q=80'],
        ];
        DB::table('posts')->insert($posts);

        $this->info('Data seeded successfully!');
    }
}
