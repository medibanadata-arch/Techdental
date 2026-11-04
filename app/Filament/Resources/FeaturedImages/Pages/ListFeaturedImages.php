<?php

namespace App\Filament\Resources\FeaturedImages\Pages;

use App\Filament\Resources\FeaturedImages\FeaturedImageResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListFeaturedImages extends ListRecords
{
    protected static string $resource = FeaturedImageResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
