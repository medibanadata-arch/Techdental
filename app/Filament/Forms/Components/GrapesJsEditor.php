<?php

namespace App\Filament\Forms\Components;

use Filament\Forms\Components\Field;

class GrapesJsEditor extends Field
{
    protected string $view = 'filament.forms.components.grapesjs-editor';

    protected int $minHeight = 700;

    public function minHeight(int $height): static
    {
        $this->minHeight = $height;

        return $this;
    }

    public function getMinHeight(): int
    {
        return $this->minHeight;
    }
}
