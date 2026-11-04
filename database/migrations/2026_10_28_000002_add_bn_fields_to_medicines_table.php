<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('medicines', function (Blueprint $table) {
            $bnColumns = [
                'name_bn' => 'string',
                'generic_bn' => 'string',
                'tag_bn' => 'string',
                'quick_use_bn' => 'string',
                'pharma_bn' => 'string',
                'dosage_bn' => 'string',
                'dental_usage_bn' => 'text',
                'uses_text_bn' => 'text',
                'side_effects_bn' => 'text',
                'subtitle_bn' => 'string',
                'intro_bn' => 'text',
            ];

            foreach ($bnColumns as $col => $type) {
                if (!Schema::hasColumn('medicines', $col)) {
                    if ($type === 'text') {
                        $table->text($col)->nullable();
                    } else {
                        $table->string($col)->nullable();
                    }
                }
            }
        });
    }

    public function down(): void
    {
        Schema::table('medicines', function (Blueprint $table) {
            $table->dropColumn([
                'name_bn', 'generic_bn', 'tag_bn', 'quick_use_bn', 'pharma_bn',
                'dosage_bn', 'dental_usage_bn', 'uses_text_bn', 'side_effects_bn',
                'subtitle_bn', 'intro_bn'
            ]);
        });
    }
};
