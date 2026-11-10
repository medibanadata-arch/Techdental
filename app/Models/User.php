<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Filament\Models\Contracts\FilamentUser;
use Filament\Panel;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

#[Fillable(['name', 'username', 'email', 'password', 'role', 'avatar'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable implements FilamentUser
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /** Backend admin panel access is limited to the Administrator role. */
    public function isAdmin(): bool
    {
        return strtolower(trim((string) $this->role)) === 'administrator';
    }

    /** Filament /admin panel guard. */
    public function canAccessPanel(Panel $panel): bool
    {
        return $this->isAdmin();
    }

    /** Never let a row fall back to the legacy "Administrator" DB default. */
    protected static function booted(): void
    {
        static::creating(function (User $user) {
            if (blank($user->role)) {
                $user->role = 'Editor';
            }
        });
    }
}
