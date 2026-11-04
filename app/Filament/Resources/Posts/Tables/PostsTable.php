<?php

namespace App\Filament\Resources\Posts\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class PostsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('slug')
                    ->searchable(),
                TextColumn::make('title')
                    ->searchable(),
                TextColumn::make('img')
                    ->searchable(),
                TextColumn::make('category')
                    ->searchable(),
                TextColumn::make('category_id')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('author_name')
                    ->searchable(),
                TextColumn::make('author_avatar')
                    ->searchable(),
                TextColumn::make('thumb_url')
                    ->searchable(),
                TextColumn::make('published_at')
                    ->dateTime()
                    ->sortable(),
                TextColumn::make('tags')
                    ->searchable(),
                TextColumn::make('status')
                    ->searchable(),
                TextColumn::make('focus_keyword')
                    ->searchable(),
                TextColumn::make('seo_title')
                    ->searchable(),
                TextColumn::make('canonical_url')
                    ->searchable(),
                TextColumn::make('breadcrumb_title')
                    ->searchable(),
                IconColumn::make('robots_index')
                    ->boolean(),
                IconColumn::make('robots_follow')
                    ->boolean(),
                IconColumn::make('is_redirect')
                    ->boolean(),
                TextColumn::make('redirect_url')
                    ->searchable(),
            ])
            ->filters([
                //
            ])
            ->recordActions([
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
