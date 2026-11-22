<?php

namespace App\Http\Controllers\Concerns;

/**
 * Swaps the shared English content attributes for their Bangla `_bn`
 * counterparts when the current request is a Bangla page. The front end still
 * receives the same prop names, so no layout or design changes are needed.
 */
trait UsesLocalizedContent
{
    protected function applyBanglaContent($model, array $fields): void
    {
        if (!$model || app()->getLocale() !== 'bn') {
            return;
        }

        foreach ($fields as $field) {
            $bangla = $field . '_bn';
            if (filled($model->{$bangla} ?? null)) {
                $model->{$field} = $model->{$bangla};
            }
        }

        if (filled($model->faqs_bn ?? null)) {
            $decoded = is_array($model->faqs_bn)
                ? $model->faqs_bn
                : json_decode((string) $model->faqs_bn, true);

            if (is_array($decoded)) {
                $model->faqs = $decoded;
            }
        }
    }
}
