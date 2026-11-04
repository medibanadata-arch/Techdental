<?php

namespace App\Filament\Resources\FeaturedImages;

use App\Filament\Resources\FeaturedImages\Pages\CreateFeaturedImage;
use App\Filament\Resources\FeaturedImages\Pages\EditFeaturedImage;
use App\Filament\Resources\FeaturedImages\Pages\ListFeaturedImages;
use App\Filament\Resources\FeaturedImages\Schemas\FeaturedImageForm;
use App\Filament\Resources\FeaturedImages\Tables\FeaturedImagesTable;
use App\Models\FeaturedImage;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class FeaturedImageResource extends Resource
{
    protected static ?string $model = FeaturedImage::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    public static function form(Schema $schema): Schema
    {
        return FeaturedImageForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return FeaturedImagesTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListFeaturedImages::route('/'),
            'create' => CreateFeaturedImage::route('/create'),
            'edit' => EditFeaturedImage::route('/{record}/edit'),
        ];
    }
}
