<?php

namespace App\Filament\Resources\Posts\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Select;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class PostForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Post Details')
                    ->schema([
                        TextInput::make('title')
                            ->label('Article Title')
                            ->required()
                            ->reactive()
                            ->placeholder('e.g. 5 Signs You Need a Root Canal'),
                        TextInput::make('slug')
                            ->label('URL Slug')
                            ->required()
                            ->placeholder('5-signs-you-need-a-root-canal'),
                        Select::make('category')
                            ->label('Category')
                            ->options([
                                'Tooth Care' => 'Tooth Care',
                                'Root Canal' => 'Root Canal',
                                'Orthodontics' => 'Orthodontics & Braces',
                                'Gum Care' => 'Gum Care & Hygiene',
                                'Pediatric' => 'Pediatric Dentistry',
                                'Surgery' => 'Oral Surgery',
                            ])
                            ->default('Tooth Care'),
                        Select::make('status')
                            ->label('Publication Status')
                            ->options([
                                'published' => 'Published',
                                'draft' => 'Draft',
                            ])
                            ->default('published')
                            ->required(),
                        TextInput::make('author_name')
                            ->label('Author Name')
                            ->default('Dr. Afsana Haque Joty'),
                        TextInput::make('img')
                            ->label('Featured Cover Image URL')
                            ->placeholder('https://images.unsplash.com/...'),
                        Textarea::make('excerpt')
                            ->label('Short Summary / Excerpt')
                            ->rows(2)
                            ->columnSpanFull(),
                        RichEditor::make('content')
                            ->label('Full Article Body')
                            ->columnSpanFull(),
                        TextInput::make('tags')
                            ->label('Tags (comma separated)')
                            ->placeholder('root canal, toothache, dental care'),
                        DateTimePicker::make('published_at')
                            ->label('Publish Date & Time')
                            ->default(now()),
                    ])
                    ->columns(2),

                Section::make('SEO & Search Optimization')
                    ->collapsed()
                    ->schema([
                        TextInput::make('seo_title')
                            ->label('Meta Title'),
                        TextInput::make('focus_keyword')
                            ->label('Focus Keyword'),
                        Textarea::make('meta_desc')
                            ->label('Meta Description')
                            ->rows(2)
                            ->columnSpanFull(),
                        TextInput::make('canonical_url')
                            ->label('Canonical URL'),
                    ])
                    ->columns(2),
            ]);
    }
}
