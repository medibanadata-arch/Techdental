<?php

namespace App\Filament\Resources\Doctors\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Select;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class DoctorForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Doctor Profile')
                    ->schema([
                        TextInput::make('name')
                            ->label('Doctor Full Name')
                            ->required()
                            ->placeholder('e.g. Dr. Afsana Haque Joty'),
                        TextInput::make('spec')
                            ->label('Specialization')
                            ->required()
                            ->placeholder('e.g. Aesthetic & Restorative Dentistry'),
                        TextInput::make('deg')
                            ->label('Degrees & Qualifications')
                            ->required()
                            ->placeholder('e.g. BDS (DU), PGT (Aesthetic), FCPS (Part 1)'),
                        TextInput::make('exp')
                            ->label('Experience / BMDC Reg')
                            ->placeholder('e.g. 7+ Years Experience | BMDC: A-89421'),
                        Select::make('branch')
                            ->label('Primary Branch')
                            ->options([
                                'Mirpur Branch' => 'Mirpur Branch',
                                'Badda Branch' => 'Badda Branch',
                                'Uttara Branch' => 'Uttara Branch',
                                'Jatrabari Branch' => 'Jatrabari Branch',
                                'All Branches' => 'All Branches',
                            ])
                            ->default('Mirpur Branch'),
                        TextInput::make('phone')
                            ->label('Contact Phone')
                            ->tel()
                            ->placeholder('01400786162'),
                        TextInput::make('img')
                            ->label('Profile Photo URL')
                            ->columnSpanFull()
                            ->placeholder('https://images.unsplash.com/...'),
                        Textarea::make('bio')
                            ->label('Doctor Biography & Profile Details')
                            ->rows(4)
                            ->columnSpanFull(),
                    ])
                    ->columns(2),
            ]);
    }
}
