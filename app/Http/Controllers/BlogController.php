<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BlogController extends Controller
{
    /** Public blog listing — /blog */
    public function publicIndex()
    {
        $posts = Post::where(function ($q) {
                $q->whereNull('status')->orWhereIn('status', ['Published', 'published', '1', 1]);
            })
            ->orWhereNull('status')
            ->orderBy('published_at', 'desc')
            ->get()
            ->unique('id')
            ->values();

        return Inertia::render('Blog/PublicIndex', [
            'posts' => $posts,
            'locations' => \App\Models\Location::orderBy('sort_order')->get(),
            'nav_menu' => \App\Models\NavMenu::first(),
        ]);
    }

    /** Public single article — /blog/{slug} & /bn/blog/{slug} */
    public function publicShow(Request $request, $slug)
    {
        $post = Post::where('slug', $slug)->orWhere('id', $slug)->firstOrFail();
        $related = Post::where('id', '!=', $post->id)->orderBy('published_at', 'desc')->take(2)->get();

        $isBn = $request->is('bn/*');
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
