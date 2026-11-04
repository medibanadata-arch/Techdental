<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PostController extends Controller
{
    public function index()
    {
        $posts = Post::latest()->get();
        $counts = [
            'all' => $posts->where('status', '!=', 'trash')->count(),
            'published' => $posts->where('status', 'published')->count(),
            'drafts' => $posts->where('status', 'draft')->count(),
            'trash' => $posts->where('status', 'trash')->count(),
        ];
        return Inertia::render('Posts/Index', [
            'posts' => $posts,
            'data' => $posts,
            'counts' => $counts,
        ]);
    }

    public function create()
    {
        $mediaList = \App\Models\Media::latest()->get();
        return Inertia::render('Posts/Create', ['mediaList' => $mediaList]);
    }

    public function store(Request $request)
    {
        if (!$request->filled('slug') && $request->filled('title')) {
            $request->merge(['slug' => \Illuminate\Support\Str::slug($request->title)]);
        }

        $validated = $request->validate([
            'slug' => 'required|string|max:255',
            'title' => 'required|string|max:255',
            'title_bn' => 'nullable|string|max:255',
            'excerpt' => 'nullable|string',
            'excerpt_bn' => 'nullable|string',
            'content' => 'nullable|string',
            'content_bn' => 'nullable|string',
            'img' => 'nullable|string',
            'thumb_url' => 'nullable|string',
            'author_name' => 'nullable|string',
            'author_avatar' => 'nullable|string',
            'category' => 'nullable|string',
            'category_bn' => 'nullable|string',
            'tags' => 'nullable|string',
            'status' => 'nullable|string|in:published,draft,trash',
            'focus_keyword' => 'nullable|string',
            'seo_title' => 'nullable|string',
            'meta_desc' => 'nullable|string',
            'canonical_url' => 'nullable|string',
            'breadcrumb_title' => 'nullable|string',
            'robots_index' => 'nullable|boolean',
            'robots_follow' => 'nullable|boolean',
            'schema_json' => 'nullable|string',
            'is_redirect' => 'nullable|boolean',
            'redirect_url' => 'nullable|string',
            'faqs' => 'nullable|array',
            'section_titles' => 'nullable|array',
            'cta_box' => 'nullable|array',
            'author_name_bn' => 'nullable|string',
            'author_bio' => 'nullable|string',
            'author_bio_bn' => 'nullable|string',
        ]);

        if (empty($validated['status'])) {
            $validated['status'] = $request->input('action') === 'draft' ? 'draft' : 'published';
        }

        if (!empty($validated['img']) && empty($validated['thumb_url'])) {
            $validated['thumb_url'] = $validated['img'];
        }

        $validated['excerpt'] = $validated['excerpt'] ?? strip_tags(substr($request->input('content', ''), 0, 150));
        $validated['author_name'] = $validated['author_name'] ?? $request->input('author_name', 'Dr. Farhana Ahmed, BDS');

        Post::create($validated);
        return redirect()->route('posts.index')->with('success', 'Post created successfully.');
    }

    public function show($id)
    {
        $item = is_numeric($id) 
            ? Post::findOrFail($id) 
            : Post::where('slug', $id)->firstOrFail();
            
        return Inertia::render('Posts/Show', ['item' => $item]);
    }

    public function publicShow($slug)
    {
        $item = Post::where('slug', $slug)->orWhere('id', $slug)->firstOrFail();
        return Inertia::render('Posts/Show', ['item' => $item]);
    }

    public function edit(Post $post)
    {
        $mediaList = \App\Models\Media::latest()->get();
        return Inertia::render('Posts/Edit', ['post' => $post, 'mediaList' => $mediaList]);
    }

    public function update(Request $request, Post $post)
    {
        if (!$request->filled('slug') && $request->filled('title')) {
            $request->merge(['slug' => \Illuminate\Support\Str::slug($request->title)]);
        }

        $validated = $request->validate([
            'slug' => 'required|string|max:255',
            'title' => 'required|string|max:255',
            'title_bn' => 'nullable|string|max:255',
            'excerpt' => 'nullable|string',
            'excerpt_bn' => 'nullable|string',
            'content' => 'nullable|string',
            'content_bn' => 'nullable|string',
            'img' => 'nullable|string',
            'thumb_url' => 'nullable|string',
            'author_name' => 'nullable|string',
            'author_avatar' => 'nullable|string',
            'category' => 'nullable|string',
            'category_bn' => 'nullable|string',
            'tags' => 'nullable|string',
            'status' => 'nullable|string|in:published,draft,trash',
            'focus_keyword' => 'nullable|string',
            'seo_title' => 'nullable|string',
            'meta_desc' => 'nullable|string',
            'canonical_url' => 'nullable|string',
            'breadcrumb_title' => 'nullable|string',
            'robots_index' => 'nullable|boolean',
            'robots_follow' => 'nullable|boolean',
            'schema_json' => 'nullable|string',
            'is_redirect' => 'nullable|boolean',
            'redirect_url' => 'nullable|string',
            'faqs' => 'nullable|array',
            'section_titles' => 'nullable|array',
            'cta_box' => 'nullable|array',
            'author_name_bn' => 'nullable|string',
            'author_bio' => 'nullable|string',
            'author_bio_bn' => 'nullable|string',
        ]);

        if (empty($validated['status'])) {
            $validated['status'] = $request->input('action') === 'draft' ? 'draft' : 'published';
        }

        if (!empty($validated['img']) && empty($validated['thumb_url'])) {
            $validated['thumb_url'] = $validated['img'];
        }

        $post->update($validated);
        return redirect()->route('posts.index')->with('success', 'Post updated successfully.');
    }

    // Move to Trash
    public function destroy(Post $post)
    {
        $post->update(['status' => 'trash']);
        return redirect()->route('posts.index')->with('success', 'Post moved to trash.');
    }

    // Restore from Trash
    public function restore($id)
    {
        $post = Post::findOrFail($id);
        $post->update(['status' => 'published']);
        return redirect()->route('posts.index')->with('success', 'Post restored successfully.');
    }

    // Delete Permanently
    public function forceDelete($id)
    {
        $post = Post::findOrFail($id);
        $post->delete();
        return redirect()->route('posts.index')->with('success', 'Post deleted permanently.');
    }
}
