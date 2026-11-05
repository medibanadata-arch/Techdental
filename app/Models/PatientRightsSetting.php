<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PatientRightsSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'hero_title_en',
        'hero_title_bn',
        'hero_desc_en',
        'hero_desc_bn',
        'partnership_title_en',
        'partnership_title_bn',
        'partnership_text_en',
        'partnership_text_bn',
        'author_name_en',
        'author_name_bn',
        'author_bio_en',
        'author_bio_bn',
        'author_image',
        'meta_title_en',
        'meta_title_bn',
        'meta_desc_en',
        'meta_desc_bn',
    ];
}
