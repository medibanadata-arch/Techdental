<?php

namespace App\Filament\Resources\Pricings\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class PricingForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Treatment Details')
                    ->schema([
                        TextInput::make('name')
                            ->label('Treatment / Service Name')
                            ->required()
                            ->placeholder('e.g. Single-Visit Rotary Root Canal'),
                        Select::make('category')
                            ->label('Category')
                            ->options([
                                'Consultation' => 'Consultation & Diagnostics',
                                'Restorative' => 'Restorative Dentistry',
                                'Root Canal' => 'Endodontics (Root Canal)',
                                'Orthodontics' => 'Orthodontics & Aligners',
                                'Cosmetic' => 'Cosmetic Dentistry & Whitening',
                                'Surgery' => 'Oral Surgery & Extractions',
                                'Preventive' => 'Preventive & Scaling',
                            ])
                            ->default('Consultation'),
                        TextInput::make('price')
                            ->label('Price in BDT')
                            ->required()
                            ->placeholder('৳ 4,500+'),
                        Toggle::make('popular')
                            ->label('Highlight as Popular Treatment')
                            ->default(false),
                        Textarea::make('desc')
                            ->label('Treatment Description')
                            ->rows(3)
                            ->columnSpanFull(),
                    ])
                    ->columns(2),
            ]);
    }
}
