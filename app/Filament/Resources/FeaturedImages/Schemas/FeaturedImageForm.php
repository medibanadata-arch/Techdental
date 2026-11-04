<?php

namespace App\Filament\Resources\FeaturedImages\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class FeaturedImageForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('title'),
                Textarea::make('src')
                    ->required()
                    ->columnSpanFull(),
                TextInput::make('badge'),
                TextInput::make('branch'),
                TextInput::make('alt'),
                TextInput::make('type')
                    ->required()
                    ->default('half-size'),
                TextInput::make('sort_order')
                    ->required()
                    ->numeric()
                    ->default(1),
                TextInput::make('view_count')
                    ->required()
                    ->numeric()
                    ->default(350),
                Toggle::make('is_active')
                    ->required(),
            ]);
    }
}
