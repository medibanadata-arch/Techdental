<?php

namespace App\Filament\Resources\FeaturedImages\Pages;

use App\Filament\Resources\FeaturedImages\FeaturedImageResource;
use Filament\Resources\Pages\CreateRecord;

class CreateFeaturedImage extends CreateRecord
{
    protected static string $resource = FeaturedImageResource::class;
}
