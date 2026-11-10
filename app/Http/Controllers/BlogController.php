<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BlogController extends Controller
{
    /** Public blog listing — /blog & /bn/blog */
    public function publicIndex(Request $request)
    {
        $posts = Post::where(function ($q) {
                $q->whereNull('status')->orWhereIn('status', ['Published', 'published', '1', 1]);
            })
            ->where(function ($q) {
                $q->where('category', 'Dental')
                  ->orWhere('category_id', 7);
            })
            ->orderBy('id', 'asc')
            ->get();

        return Inertia::render('Blog/PublicIndex', [
            'posts' => $posts,
            'locations' => \App\Models\Location::orderBy('sort_order')->get(),
            'nav_menu' => \App\Models\NavMenu::first(),
            'is_bn' => $request->is('bn/*'),
        ]);
    }

    /** Public single article — /blog/{slug} & /bn/blog/{slug} */
    public function publicShow(Request $request, $slug)
    {
        // 301 redirects for previous long slugs to clean original canonical slugs
        $slugRedirects = [
            'best-dental-clinic-in-chennai-best-dentist-in-chennai' => 'best-dental-clinic-in-chennai',
            'bad-breath-halitosis-causes-home-remedies-prevention' => 'bad-breath-causes',
            'gum-cancer-symptoms-causes-and-prevention-strategies' => 'gum-cancer-symptoms-causes',
            'wisdom-tooth-pain-relief-medication-and-5-effective-home-remedies' => 'wisdom-tooth-pain-relief-tips',
            'medicines-and-4-home-remedies-to-reduce-tooth-pain' => 'toothache-relief',
            'orthodontic-centre-tech-dental' => 'best-orthodontist-doctor-in-dhaka',
            'bad-breath-remedies' => 'bad-breath-causes',
            'gum-cancer-symptoms' => 'gum-cancer-symptoms-causes',
            'wisdom-tooth-pain-relief' => 'wisdom-tooth-pain-relief-tips',
            'toothache-relief-tips' => 'toothache-relief',
        ];

        if (isset($slugRedirects[$slug])) {
            $prefix = $request->is('bn/*') ? '/bn/blog/' : '/blog/';
            return redirect($prefix . $slugRedirects[$slug], 301);
        }

        // Exact slug first: the tag fallback used to shadow real slugs and served a
        // different article under the same URL.
        $post = Post::where('slug', $slug)->first()
            ?? Post::where('id', $slug)->first()
            ?? Post::where('tags', 'like', "%{$slug}%")->firstOrFail();
        $related = Post::where('id', '!=', $post->id)->orderBy('published_at', 'desc')->take(2)->get();

        $isBn = $request->is('bn/*');

        // Untranslated articles: keep the Bangla URL working by sending it to the English one
        // instead of rendering an empty page.
        if ($isBn && trim((string) $post->content_bn) === '') {
            return redirect("/blog/{$post->slug}", 301);
        }

        $postSlug = $post->slug ?: $post->id;
        $canonicalUrl = $isBn ? url("bn/blog/{$postSlug}") : url("blog/{$postSlug}");
        $hreflang = [
            'en' => url("blog/{$postSlug}"),
            'bn' => url("bn/blog/{$postSlug}"),
            'x-default' => url("blog/{$postSlug}"),
        ];

        return Inertia::render('Blog/PublicSingle', [
            'post' => $post,
            'related' => $related,
            'locations' => \App\Models\Location::orderBy('sort_order')->get(),
            'nav_menu' => \App\Models\NavMenu::first(),
            'is_bn' => $isBn,
            'canonical_url' => $canonicalUrl,
            'hreflang' => $hreflang,
        ]);
    }
}
