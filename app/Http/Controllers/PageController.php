<?php

namespace App\Http\Controllers;

use App\Models\Page;
use App\Models\NavMenu;
use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class PageController extends Controller
{
    public function index()
    {
        $pages = Page::latest()->get();
        return Inertia::render('CustomPages/Index', ['pages' => $pages]);
    }

    public function create()
    {
        return Inertia::render('CustomPages/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255',
            'content' => 'nullable|string',
            'blocks' => 'nullable|array',
        ]);

        if (!isset($validated['content']) || $validated['content'] === null) {
            $validated['content'] = '';
        }

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);
        } else {
            $validated['slug'] = Str::slug($validated['slug']);
        }

        $page = Page::create($validated);

        return redirect()->route('pages.index')->with('success', 'Page created successfully');
    }

    private function getHomeProps(): array
    {
        return [
            'locations' => \Illuminate\Support\Facades\DB::table('locations')->get(),
            'services' => \Illuminate\Support\Facades\DB::table('pricing')->get(),
            'doctors' => \Illuminate\Support\Facades\DB::table('doctors')->get(),
            'posts' => \Illuminate\Support\Facades\DB::table('posts')
                ->where(function ($q) {
                    $q->whereNull('status')->orWhere('status', '!=', 'trash');
                })
                ->orderBy('published_at', 'desc')
                ->orderBy('id', 'desc')
                ->get(),
            'featured_images' => \Illuminate\Support\Facades\DB::table('featured_images')->where('is_active', 1)->orderBy('sort_order')->get(),
            'nav_menu' => \App\Models\NavMenu::first(),
        ];
    }

    public function show($id)
    {
        $page = Page::findOrFail($id);
        $redirectMap = [
            'home' => '/',
            'services' => '/services',
            'price-list' => '/price-list',
            'doctors' => '/doctors',
            'medicines' => '/medicines',
            'branches' => '/branches',
            'branch-mirpur' => '/branch/mirpur',
            'mirpur' => '/branch/mirpur',
            'branch-uttara' => '/branch/uttara',
            'uttara' => '/branch/uttara',
            'branch-badda' => '/branch/badda',
            'badda' => '/branch/badda',
            'branch-jatrabari' => '/branch/jatrabari',
            'jatrabari' => '/branch/jatrabari',
            'about' => '/about',
            'team' => '/team',
            'blog' => '/blog',
            'appointment' => '/appointment',
        ];

        if (isset($redirectMap[$page->slug])) {
            return redirect($redirectMap[$page->slug]);
        }

        return Inertia::render('CustomPages/Show', [
            'item' => $page,
            'locations' => \Illuminate\Support\Facades\DB::table('locations')->get(),
            'nav_menu' => \App\Models\NavMenu::first(),
        ]);
    }

    public function publicShow($slug)
    {
        // 301 Redirect legacy "best-dentist-in-dhaka" page to the official "/doctors" module
        if (in_array($slug, ['best-dentist-in-dhaka', 'best-dentist', 'best-dentist-in-dhaka-bangladesh'])) {
            return redirect()->to('/doctors', 301);
        }

        $page = Page::where('slug', $slug)->orWhere('id', $slug)->first();
        if (!$page) {
            $aliases = [
                'mirpur' => 'branch-mirpur',
                'uttara' => 'branch-uttara',
                'badda' => 'branch-badda',
                'jatrabari' => 'branch-jatrabari',
            ];
            if (isset($aliases[$slug])) {
                $page = Page::where('slug', $aliases[$slug])->first();
            }
        }

        if (!$page) {
            abort(404);
        }

        // Rich About Page handler for about-tech-dental-care, about-us, about
        if (in_array($page->slug, ['about-tech-dental-care', 'about-us', 'about'])) {
            $content = \App\Models\AboutContent::first();
            if (!$content) {
                (new \Database\Seeders\AboutSeeder())->run();
                $content = \App\Models\AboutContent::first();
            }
            $doctors = \App\Models\Doctor::orderBy('rank_order')->get();
            $management = \App\Models\TeamMember::where('is_active', true)->where('section', 'management')->orderBy('sort_order')->get();
            return Inertia::render('About/PublicIndex', [
                'content' => $content,
                'doctors' => $doctors,
                'management' => $management,
                'locations' => \App\Models\Location::orderBy('sort_order')->get(),
                'nav_menu' => \App\Models\NavMenu::first(),
            ]);
        }

        $redirectMap = [
            'home' => '/',
            'services' => '/services',
            'price-list' => '/price-list',
            'doctors' => '/doctors',
            'medicines' => '/medicines',
            'branches' => '/branches',
            'branch-mirpur' => '/branch/mirpur',
            'mirpur' => '/branch/mirpur',
            'branch-uttara' => '/branch/uttara',
            'uttara' => '/branch/uttara',
            'branch-badda' => '/branch/badda',
            'badda' => '/branch/badda',
            'branch-jatrabari' => '/branch/jatrabari',
            'jatrabari' => '/branch/jatrabari',
            'about' => '/about',
            'team' => '/team',
            'blog' => '/blog',
            'appointment' => '/appointment',
        ];

        if (isset($redirectMap[$page->slug])) {
            return redirect($redirectMap[$page->slug]);
        }

        return Inertia::render('CustomPages/Show', [
            'item' => $page,
            'locations' => \Illuminate\Support\Facades\DB::table('locations')->get(),
            'nav_menu' => \App\Models\NavMenu::first(),
        ]);
    }

    public function builder($id)
    {
        $page = Page::findOrFail($id);
        return Inertia::render('CustomPages/Builder', ['page' => $page]);
    }

    public function quickDraft(Request $request)
    {
        $title = $request->input('title', 'Untitled Page');
        if (empty(trim($title))) {
            $title = 'Untitled Page';
        }
        $slug = Str::slug($title);
        // Ensure unique slug
        $baseSlug = $slug;
        $count = 1;
        while (Page::where('slug', $slug)->exists()) {
            $slug = $baseSlug . '-' . $count++;
        }

        $page = Page::create([
            'title' => $title,
            'slug' => $slug,
            'content' => $request->input('content', ''),
        ]);

        return redirect()->route('pages.builder', $page->id);
    }

    public function edit($id)
    {
        $page = Page::findOrFail($id);
        return Inertia::render('CustomPages/Edit', ['page' => $page]);
    }

    public function update(Request $request, $id)
    {
        $page = Page::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255',
            'content' => 'nullable|string',
            'blocks' => 'nullable|array',
            'seo_title' => 'nullable|string|max:255',
            'meta_desc' => 'nullable|string',
            'canonical_url' => 'nullable|string',
            'robots_index' => 'nullable|boolean',
            'robots_follow' => 'nullable|boolean',
            'schema_type' => 'nullable|string',
            'schema_json' => 'nullable|string',
            'faqs' => 'nullable|array',
        ]);

        if (!isset($validated['content']) || $validated['content'] === null) {
            $validated['content'] = '';
        }

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);
        } else {
            $validated['slug'] = Str::slug($validated['slug']);
        }

        $oldTitle = $page->title;
        $oldSlug = $page->slug;

        $page->update($validated);

        // Auto 301 redirect if slug was changed
        if (!empty($oldSlug) && $oldSlug !== $page->slug) {
            \App\Models\Redirect::firstOrCreate(
                ['source_url' => '/page/' . $oldSlug],
                [
                    'target_url' => '/page/' . $page->slug,
                    'status_code' => 301,
                    'is_active' => true,
                ]
            );
        }

        // Auto sync all menus and links across the site
        $this->syncPageToMenusAndLinks($page, $oldTitle, $oldSlug, $page->title, $page->slug);

        return redirect()->route('pages.index')->with('success', 'Page and linked menus updated successfully');
    }

    public function destroy($id)
    {
        $page = Page::findOrFail($id);

        // Remove dead links from all navigation menus
        $menus = NavMenu::all();
        foreach ($menus as $menu) {
            $items = json_decode($menu->items_json, true) ?: [];
            $filtered = array_values(array_filter($items, function ($item) use ($page) {
                if (!empty($item['page_id']) && (int)$item['page_id'] === (int)$page->id) {
                    return false;
                }
                $targetUrl = '/page/' . $page->slug;
                if (isset($item['url']) && ($item['url'] === $targetUrl || $item['url'] === '/' . $page->slug)) {
                    return false;
                }
                return true;
            }));
            if (count($filtered) !== count($items)) {
                $menu->items_json = json_encode($filtered, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
                $menu->save();
            }
        }

        $page->delete();

        return redirect()->route('pages.index')->with('success', 'Page deleted and removed from menus');
    }

    protected function syncPageToMenusAndLinks(Page $page, string $oldTitle, string $oldSlug, string $newTitle, string $newSlug)
    {
        $redirectMap = [
            'home' => '/',
            'services' => '/services',
            'price-list' => '/price-list',
            'doctors' => '/doctors',
            'medicines' => '/medicines',
            'branches' => '/branches',
            'branch-mirpur' => '/branch/mirpur',
            'branch-uttara' => '/branch/uttara',
            'branch-badda' => '/branch/badda',
            'branch-jatrabari' => '/branch/jatrabari',
            'about' => '/about',
            'team' => '/team',
            'blog' => '/blog',
            'appointment' => '/appointment',
        ];

        // 1. Calculate new canonical URL
        if ($newSlug === 'home') {
            $newUrl = '/';
        } elseif (isset($redirectMap[$newSlug])) {
            $newUrl = $redirectMap[$newSlug];
        } else {
            $newUrl = '/page/' . $newSlug;
        }

        // 2. Collect all possible old URL variations for this page
        $oldUrls = [
            '/page/' . $oldSlug,
            '/' . $oldSlug,
        ];
        if ($oldSlug === 'home') {
            $oldUrls[] = '/';
            $oldUrls[] = '/home';
        }
        if (isset($redirectMap[$oldSlug])) {
            $oldUrls[] = $redirectMap[$oldSlug];
        }
        if (str_starts_with($oldSlug, 'branch-')) {
            $branchShort = str_replace('branch-', '', $oldSlug);
            $oldUrls[] = '/branch/' . $branchShort;
            $oldUrls[] = '/page/' . $branchShort;
        }

        $oldUrls = array_unique(array_filter($oldUrls));

        // 3. Update all menus in nav_menus table
        $menus = NavMenu::all();
        foreach ($menus as $menu) {
            $items = json_decode($menu->items_json, true) ?: [];
            $changed = false;

            foreach ($items as &$item) {
                $isMatch = false;

                // Priority 1: Match by page_id
                if (!empty($item['page_id']) && (int)$item['page_id'] === (int)$page->id) {
                    $isMatch = true;
                }

                // Priority 2: Match by existing URL against oldUrls
                if (!$isMatch && !empty($item['url'])) {
                    $cleanItemUrl = rtrim(strtolower($item['url']), '/');
                    foreach ($oldUrls as $u) {
                        if ($cleanItemUrl === rtrim(strtolower($u), '/')) {
                            $isMatch = true;
                            break;
                        }
                    }
                }

                // Priority 3: Match by title
                if (!$isMatch && !empty($item['title'])) {
                    $cleanItemTitle = trim(strtolower($item['title']));
                    $cleanOldTitle = trim(strtolower($oldTitle));
                    if ($cleanItemTitle === $cleanOldTitle) {
                        $isMatch = true;
                    }
                }

                if ($isMatch) {
                    $item['page_id'] = $page->id;
                    $item['title'] = $newTitle;
                    $item['url'] = $newUrl;
                    $changed = true;
                }
            }
            unset($item);

            if ($changed) {
                $menu->items_json = json_encode($items, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
                $menu->save();
            }
        }

        // 4. Update content in other Pages & Posts where old URLs might be linked
        if ($oldSlug !== $newSlug || $oldTitle !== $newTitle) {
            $otherPages = Page::where('id', '!=', $page->id)->get();
            foreach ($otherPages as $otherPage) {
                $content = $otherPage->content;
                if (!empty($content)) {
                    $updatedContent = $content;
                    foreach ($oldUrls as $u) {
                        $updatedContent = str_replace('href="' . $u . '"', 'href="' . $newUrl . '"', $updatedContent);
                        $updatedContent = str_replace("href='" . $u . "'", "href='" . $newUrl . "'", $updatedContent);
                    }
                    if ($updatedContent !== $content) {
                        $otherPage->content = $updatedContent;
                        $otherPage->save();
                    }
                }
            }

            $posts = Post::all();
            foreach ($posts as $post) {
                $content = $post->content;
                if (!empty($content)) {
                    $updatedContent = $content;
                    foreach ($oldUrls as $u) {
                        $updatedContent = str_replace('href="' . $u . '"', 'href="' . $newUrl . '"', $updatedContent);
                        $updatedContent = str_replace("href='" . $u . "'", "href='" . $newUrl . "'", $updatedContent);
                    }
                    if ($updatedContent !== $content) {
                        $post->content = $updatedContent;
                        $post->save();
                    }
                }
            }
        }
    }
}
