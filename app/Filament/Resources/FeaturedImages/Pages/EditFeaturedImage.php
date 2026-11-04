<?php

namespace App\Filament\Resources\FeaturedImages\Pages;

use App\Filament\Resources\FeaturedImages\FeaturedImageResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditFeaturedImage extends EditRecord
{
    protected static string $resource = FeaturedImageResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
