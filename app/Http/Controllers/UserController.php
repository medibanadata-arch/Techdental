<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index()
    {
        $users = User::latest()->get();
        return Inertia::render('Users/Index', ['users' => $users]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'nullable|string|max:255',
            'email' => 'required|email|max:255|unique:users',
            'password' => 'required|string|min:6',
            'role' => 'nullable|string|in:Administrator,Manager,Editor,Author',
            'avatar' => 'nullable|string',
        ]);

        $validated['password'] = Hash::make($validated['password']);
        if (empty($validated['role'])) {
            $validated['role'] = 'Editor';
        }
        if (empty($validated['avatar'])) {
            $validated['avatar'] = 'https://ui-avatars.com/api/?name=' . urlencode($validated['name']) . '&background=800038&color=fff';
        }

        User::create($validated);

        return redirect()->route('users.index')->with('success', 'User created successfully.');
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'nullable|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . $id,
            'role' => 'nullable|string|in:Administrator,Manager,Editor,Author',
            'password' => 'nullable|string|min:6',
            'avatar' => 'nullable|string',
        ]);

        if (!empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        $user->update($validated);

        return redirect()->route('users.index')->with('success', 'User updated successfully.');
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);
        if ($user->email === 'info@techdentalcare.com' || $user->id === 1) {
            return redirect()->route('users.index')->with('error', 'The primary administrator account cannot be deleted.');
        }
        $user->delete();

        return redirect()->route('users.index')->with('success', 'User deleted successfully');
    }
}
