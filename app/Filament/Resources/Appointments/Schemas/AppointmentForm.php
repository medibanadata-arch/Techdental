<?php

namespace App\Filament\Resources\Appointments\Schemas;

use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Select;
use Filament\Schemas\Schema;

class AppointmentForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name')
                    ->label('Patient Name')
                    ->required(),
                TextInput::make('phone')
                    ->label('Phone Number')
                    ->tel()
                    ->required(),
                DatePicker::make('date')
                    ->label('Appointment Date')
                    ->required(),
                TextInput::make('service')
                    ->label('Requested Treatment / Doctor'),
                Select::make('status')
                    ->label('Booking Status')
                    ->options([
                        'Pending' => 'Pending',
                        'Confirmed' => 'Confirmed',
                        'Completed' => 'Completed',
                        'Cancelled' => 'Cancelled',
                    ])
                    ->default('Pending')
                    ->required(),
                Textarea::make('notes')
                    ->label('Reception / Medical Notes')
                    ->columnSpanFull(),
            ]);
    }
}
