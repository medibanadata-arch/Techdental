<?php

namespace App\Http\Controllers;

use App\Models\NavMenu;
use App\Models\Post;
use App\Models\Page;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class NavMenuController extends Controller
{
    public function index()
    {
        $menus = NavMenu::latest()->get();
        
        // Seed a default header menu if none exists
        if ($menus->isEmpty()) {
            $defaultMenu = NavMenu::create([
                'name' => 'Primary Header Navigation',
                'slug' => 'primary-header-navigation',
                'location' => 'header',
                'items_json' => json_encode([
                    ['id' => '1', 'title' => 'Home', 'url' => '/', 'type' => 'custom'],
                    ['id' => '2', 'title' => 'About Tech Dental', 'url' => '/page/about-us', 'type' => 'custom'],
                    ['id' => '3', 'title' => 'Branches & Schedules', 'url' => '/page/branches-schedule', 'type' => 'custom'],
                    ['id' => '4', 'title' => 'Privacy Policy', 'url' => '/page/privacy-policy', 'type' => 'custom'],
                    ['id' => '5', 'title' => 'Terms of Service', 'url' => '/page/terms-of-service', 'type' => 'custom'],
                ])
            ]);
            $menus = collect([$defaultMenu]);
        }

        // Auto-tag any unassigned menu items with page_id to keep 100% sync integrity
        $allPages = Page::all()->keyBy('slug');
        foreach ($menus as $menu) {
            $items = json_decode($menu->items_json, true) ?: [];
            $changed = false;
            foreach ($items as &$item) {
                if (empty($item['page_id']) && !empty($item['url'])) {
                    if (str_starts_with($item['url'], '/page/')) {
                        $slug = substr($item['url'], 6);
                        if (isset($allPages[$slug])) {
                            $item['page_id'] = $allPages[$slug]->id;
                            $changed = true;
                        } elseif ($slug === 'mirpur' && isset($allPages['branch-mirpur'])) {
                            $item['page_id'] = $allPages['branch-mirpur']->id;
                            $item['url'] = '/page/branch-mirpur';
                            $changed = true;
                        }
                    } elseif ($item['url'] === '/' && isset($allPages['home'])) {
                        $item['page_id'] = $allPages['home']->id;
                        $changed = true;
                    }
                }
            }
            unset($item);
            if ($changed) {
                $menu->items_json = json_encode($items, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
                $menu->save();
            }
        }

        $postsList = Post::select('id', 'title', 'slug')->get();
        $customPages = Page::select('id', 'title', 'slug')->get()->map(function ($page) {
            return [
                'id' => $page->id,
                'title' => $page->title,
                'url' => $page->slug === 'home' ? '/' : '/page/' . $page->slug,
            ];
        });

        return Inertia::render('Menus/Index', [
            'menus' => $menus,
            'postsList' => $postsList,
            'customPages' => $customPages,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'location' => 'nullable|string',
            'items_json' => 'nullable|string',
        ]);

        $baseSlug = Str::slug($validated['name']) ?: 'menu';
        $slug = $baseSlug;
        $count = 1;
        while (NavMenu::where('slug', $slug)->exists()) {
            $slug = $baseSlug . '-' . $count++;
        }
        $validated['slug'] = $slug;

        if (empty($validated['items_json'])) {
            $validated['items_json'] = json_encode([]);
        }

        NavMenu::create($validated);
        return redirect()->route('menus.index')->with('success', 'Menu created successfully.');
    }

    public function update(Request $request, $id)
    {
        $menu = NavMenu::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'location' => 'nullable|string',
            'items_json' => 'nullable|string',
        ]);

        if ($menu->name !== $validated['name']) {
            $baseSlug = Str::slug($validated['name']) ?: 'menu';
            $slug = $baseSlug;
            $count = 1;
            while (NavMenu::where('slug', $slug)->where('id', '!=', $id)->exists()) {
                $slug = $baseSlug . '-' . $count++;
            }
            $validated['slug'] = $slug;
        }

        $menu->update($validated);
        return redirect()->route('menus.index')->with('success', 'Menu updated successfully.');
    }

    public function destroy($id)
    {
        $menu = NavMenu::findOrFail($id);
        $menu->delete();
        return redirect()->route('menus.index')->with('success', 'Menu deleted successfully.');
    }
}
