<?php

namespace App\Filament\Resources\Pages\Schemas;

use App\Filament\Forms\Components\GrapesJsEditor;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class PageForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Page Information')
                    ->schema([
                        TextInput::make('title')
                            ->required()
                            ->maxLength(255)
                            ->reactive()
                            ->placeholder('e.g. Laser Dentistry Treatment'),
                        TextInput::make('slug')
                            ->required()
                            ->unique(ignoreRecord: true)
                            ->maxLength(255)
                            ->placeholder('e.g. laser-dentistry-treatment'),
                    ])
                    ->columns(2),

                Section::make('Visual Page Builder (GrapesJS)')
                    ->description('Drag & drop elements, edit typography, layouts, colors and responsiveness.')
                    ->schema([
                        GrapesJsEditor::make('content')
                            ->label('Page Content & Layout')
                            ->minHeight(700)
                            ->columnSpanFull(),
                    ]),
            ]);
    }
}
