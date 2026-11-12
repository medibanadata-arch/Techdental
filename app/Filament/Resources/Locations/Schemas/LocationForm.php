<?php

namespace App\Filament\Resources\Locations\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class LocationForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Branch Information')
                    ->schema([
                        TextInput::make('name')
                            ->label('Branch Full Name')
                            ->required()
                            ->placeholder('e.g. Tech Dental, Mirpur Branch'),
                        TextInput::make('short_name')
                            ->label('Short Identifier')
                            ->required()
                            ->placeholder('Mirpur'),
                        TextInput::make('location_id')
                            ->label('Branch Slug ID')
                            ->required()
                            ->placeholder('mirpur'),
                        TextInput::make('phone')
                            ->label('Hotline Number')
                            ->tel()
                            ->default('09638000505')
                            ->required(),
                        Textarea::make('address')
                            ->label('Full Physical Address')
                            ->required()
                            ->rows(2)
                            ->columnSpanFull(),
                        TextInput::make('address_main')
                            ->label('Street Address / Building (Card Main Address)')
                            ->placeholder('e.g. 827 (2nd Floor), Shewrapara, Begum Rokeya Sarani'),
                        TextInput::make('address_sub')
                            ->label('Area / City / Postal (Card Sub Address)')
                            ->placeholder('e.g. Mirpur, Dhaka – 1216'),
                        TextInput::make('landmark')
                            ->label('Landmark')
                            ->columnSpanFull()
                            ->placeholder('e.g. East side of Metro Rail Pillar No. 318'),
                        TextInput::make('morning_hours')
                            ->label('Morning Shift Hours')
                            ->placeholder('e.g. 10 AM – 2 PM'),
                        TextInput::make('evening_hours')
                            ->label('Evening Shift Hours')
                            ->placeholder('e.g. 4 PM – 9 PM'),
                        TextInput::make('working_days')
                            ->label('Working Days Range')
                            ->default('Saturday – Thursday'),
                        TextInput::make('off_days')
                            ->label('Off / Closed Days')
                            ->default('Friday closed'),
                        TextInput::make('time')
                            ->label('Daily Visiting Hours')
                            ->default('Opening time: 10 AM - 9 PM'),
                        TextInput::make('status_text')
                            ->label('Status Text')
                            ->default('Open Now'),
                        Toggle::make('is_open_now')
                            ->label('Currently Open')
                            ->default(true),
                        TextInput::make('map_url')
                            ->label('Google Maps Navigation Link')
                            ->columnSpanFull()
                            ->placeholder('https://maps.google.com/?q=...'),
                        TextInput::make('review_url')
                            ->label('Google Review Link')
                            ->columnSpanFull()
                            ->placeholder('https://search.google.com/local/writereview?...'),
                    ])
                    ->columns(2),
            ]);
    }
}
