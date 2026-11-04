<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('doctor_settings', function (Blueprint $table) {
            $table->id();
            $table->string('page_title')->default('Specialist Dentists & Dental Surgeons – Tech Dental');
            $table->string('seo_title')->default('More about Dentists');
            $table->longText('seo_content')->nullable();
            $table->text('meta_desc')->nullable();
            $table->string('canonical_url')->nullable();
            $table->boolean('robots_index')->default(true);
            $table->boolean('robots_follow')->default(true);
            $table->string('schema_type')->default('MedicalOrganization');
            $table->longText('schema_json')->nullable();
            $table->longText('faqs')->nullable();
            $table->timestamps();
        });

        // Seed with initial content from current public index
        $initialContent = '<div>
<h3>About Dr. Aysha Siddika – Senior Dental Specialist in Mirpur, Dhaka</h3>
<p>Dr. Aysha Siddika is a Senior Dental Surgeon at Tech Dental Care (Mirpur Branch). With over 8+ years of dedicated clinical experience and more than 2,863+ successful patient treatments, she is widely recognized for her gentle, patient-first approach. She completed her Bachelor of Dental Surgery (BDS) from Shaheed Suhrawardy Medical College and Hospital, followed by advanced Post-Graduate Training (PGT) in Oral & Maxillofacial Surgery and Conservative Dentistry. Her BMDC Registration Number is 7897.</p>
</div>
<div>
<h3>Advanced Dental Procedures & Clinical Excellence</h3>
<p>Specializing in Aesthetic Dentistry and Painless Laser Root Canal Therapy (RCT), Dr. Aysha Siddika has completed 597+ single-visit root canals, cosmetic smile designing, porcelain veneers, and composite restorations. Utilizing modern rotary endodontic systems and digital apex locators, she ensures maximum tooth preservation and absolute comfort during dental interventions.</p>
</div>
<div>
<h3>Comprehensive Dental Care Network Across Dhaka</h3>
<p>Whether you require pediatric dental treatments, digital orthodontic aligners, painless wisdom tooth extractions, or permanent dental implants, our certified dental specialists across Mirpur, Uttara, Badda, and Jatrabari provide international-standard sterilization, digital OPG X-rays, and customized patient consultations.</p>
</div>';

        DB::table('doctor_settings')->insert([
            'page_title' => 'Specialist Dentists & Dental Surgeons – Tech Dental',
            'seo_title' => 'More about Dentists',
            'seo_content' => $initialContent,
            'meta_desc' => 'Meet our certified dental surgeons and specialists across Mirpur, Uttara, Badda, and Jatrabari. Expert treatments in Root Canal, Dental Implants, Braces, and Aesthetics.',
            'canonical_url' => 'https://techdentalcare.com/doctors',
            'robots_index' => true,
            'robots_follow' => true,
            'schema_type' => 'MedicalOrganization',
            'schema_json' => '{"@context":"https://schema.org","@type":"MedicalOrganization","name":"Tech Dental Specialists","url":"https://techdentalcare.com/doctors"}',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('doctor_settings');
    }
};
