<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DoctorController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\PricingController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\FeaturedImageController;
use App\Http\Controllers\MediaController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\TagController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\MedicineController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\TeamMemberController;
use App\Http\Controllers\AboutContentController;
use App\Http\Controllers\PriceListController;
use App\Http\Controllers\HomeContentController;
use App\Http\Controllers\BranchController;
use App\Http\Controllers\RedirectController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AiAssistantController;
use App\Http\Controllers\PatientRightsController;
use App\Http\Controllers\ComplaintController;
use App\Http\Controllers\PaymentMethodsController;
use Inertia\Inertia;

$homeHandler = function () {
    $homeContent = \App\Models\HomeContent::first();
    $aiSettings = \Illuminate\Support\Facades\DB::table('ai_chat_settings')->first();
    $aiChips = $aiSettings && !empty($aiSettings->chips) ? json_decode($aiSettings->chips, true) : null;

    return Inertia::render('Home', [
        'locations' => \Illuminate\Support\Facades\DB::table('locations')->orderBy('sort_order')->orderBy('id')->get(),
        'services' => \Illuminate\Support\Facades\DB::table('pricing')->orderBy('sort_order')->orderBy('id')->get(),
        'doctors' => \Illuminate\Support\Facades\DB::table('doctors')->orderBy('rank_order')->orderBy('id')->get(),
        'posts' => \Illuminate\Support\Facades\DB::table('posts')
            ->where(function ($q) {
                $q->whereNull('status')->orWhere('status', '!=', 'trash');
            })
            ->orderBy('published_at', 'desc')
            ->orderBy('id', 'desc')
            ->get(),
        'featured_images' => \Illuminate\Support\Facades\DB::table('featured_images')
            ->where('is_active', 1)
            ->where(function ($q) {
                $q->where('branch', 'homepage')
                  ->orWhere('branch', 'all')
                  ->orWhereNull('branch')
                  ->orWhere('branch', '');
            })
            ->orderBy('sort_order')
            ->get(),
        'nav_menu' => \App\Models\NavMenu::first(),
        'home_content' => $homeContent,
        'ai_chips' => $aiChips,
    ]);
};

Route::get('/', $homeHandler)->name('home');
Route::get('/home', $homeHandler)->name('home.alias');

Route::get('/dashboard', function () {
    return \Inertia\Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// Public Single Post route
Route::get('post/{slug}', [PostController::class, 'publicShow'])->name('posts.public.show');

// Public Single Page route
Route::get('page/{slug}', [PageController::class, 'publicShow'])->name('pages.public.show');

// Public endpoints used by the website (no login required)
Route::post('api/featured-images/{id}/view', [FeaturedImageController::class, 'incrementRealView'])->name('featured-images.increment-view');
Route::post('api/ai-chat', [AiAssistantController::class, 'chatApi'])->name('ai-chat.api');
Route::post('api/ai-chat/stream', [AiAssistantController::class, 'streamChatApi'])->name('ai-chat.stream');
Route::post('appointments', [AppointmentController::class, 'store'])
    ->middleware('throttle:20,1')
    ->name('appointments.store');
// Admin list; guests (e.g. old CTA links saved in page content) are sent to the public booking page.
Route::get('appointments', [AppointmentController::class, 'index'])->name('appointments.index');

// ============================================================
// ADMIN PANEL — all management routes require an authenticated user
// ============================================================
Route::middleware('auth')->group(function () {
    // Profile (Breeze)
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Posts Submenu Routes
    Route::get('posts/categories', [CategoryController::class, 'index'])->name('posts.categories');
    Route::post('posts/categories', [CategoryController::class, 'store'])->name('posts.categories.store');
    Route::delete('posts/categories/{id}', [CategoryController::class, 'destroy'])->name('posts.categories.destroy');

    Route::get('posts/tags', [TagController::class, 'index'])->name('posts.tags');
    Route::post('posts/tags', [TagController::class, 'store'])->name('posts.tags.store');
    Route::delete('posts/tags/{id}', [TagController::class, 'destroy'])->name('posts.tags.destroy');

    // Custom post status actions
    Route::post('posts/{id}/restore', [PostController::class, 'restore'])->name('posts.restore');
    Route::delete('posts/{id}/force-delete', [PostController::class, 'forceDelete'])->name('posts.force-delete');

    // Resources
    Route::resource('featured-images', FeaturedImageController::class)->except(['show']);
    Route::get('media/{id}/download', [MediaController::class, 'download'])->name('media.download');
    Route::get('admin-api/media', [MediaController::class, 'apiIndex'])->name('admin.api.media');
    Route::post('admin-api/media/upload', [MediaController::class, 'apiUpload'])->name('admin.api.media.upload');
    Route::post('admin-api/media/{id}/rotate', [MediaController::class, 'rotate'])->name('admin.api.media.rotate');
    Route::resource('media', MediaController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::post('doctors/reorder', [DoctorController::class, 'reorder'])->name('doctors.reorder');
    Route::resource('doctors', DoctorController::class)->except(['index', 'show']);
    Route::get('doctors-admin', [DoctorController::class, 'index'])->name('doctors.index');
    Route::post('doctors-admin/settings', [DoctorController::class, 'saveSettings'])->name('doctors.admin.settings');
    Route::get('pages/{id}/builder', [PageController::class, 'builder'])->name('pages.builder');
    Route::post('pages/quick-draft', [PageController::class, 'quickDraft'])->name('pages.quick-draft');

    Route::resource('pages', PageController::class);
    Route::resource('posts', PostController::class);
    Route::resource('pricing', PricingController::class)->except(['show']);
    Route::resource('locations', LocationController::class)->except(['show']);
    Route::resource('appointments', AppointmentController::class)->only(['update', 'destroy']);
    Route::resource('users', UserController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::get('settings-admin', [SettingController::class, 'index'])->name('settings.admin');
    Route::post('settings-admin', [SettingController::class, 'update'])->name('settings.admin.update');
    Route::get('settings/header-footer', [SettingController::class, 'headerFooter'])->name('settings.header-footer');
    Route::post('settings/header-footer', [SettingController::class, 'updateHeaderFooter'])->name('settings.header-footer.update');
    Route::resource('menus', \App\Http\Controllers\NavMenuController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::resource('templates', \App\Http\Controllers\TemplateController::class)->only(['index', 'store', 'update', 'destroy']);
});

// ============================================================
// NEW MODULES (Public + Admin) — Task list integration
// ============================================================

// ---------- Medicines ----------
Route::get('/medicines', [MedicineController::class, 'publicIndex'])->name('medicines.public');
Route::get('/medicines/{slug}', [MedicineController::class, 'publicShow'])->name('medicines.public.show');
Route::get('/bn/medicines/{slug}', [MedicineController::class, 'publicShow'])->name('medicines.public.show.bn');

// ---------- Services ----------
Route::get('/services', [ServiceController::class, 'publicIndex'])->name('services.public');
Route::get('/services/{slug}', [ServiceController::class, 'publicShow'])->name('services.public.show');
Route::get('/service/{slug}', [ServiceController::class, 'publicShow'])->name('service.alias.show');

// ---------- Blog (public) ----------
Route::get('/blog', [BlogController::class, 'publicIndex'])->name('blog.public');
Route::get('/blog/{slug}', [BlogController::class, 'publicShow'])->name('blog.public.show');
Route::get('/bn/blog/{slug}', [BlogController::class, 'publicShow'])->name('blog.public.show.bn');

// ---------- 301 Redirects for Old WordPress Dental Blog URLs ----------
Route::get('/dental/{slug}', function ($slug) {
    return redirect("/blog/{$slug}", 301);
});
Route::get('/blog-en/dental/{slug?}', function ($slug = null) {
    return $slug ? redirect("/blog/{$slug}", 301) : redirect('/blog', 301);
});
Route::get('/bn/blog/dental/{slug?}', function ($slug = null) {
    return $slug ? redirect("/bn/blog/{$slug}", 301) : redirect('/blog', 301);
});

// ---------- 301 Redirects for Old WordPress Medicine & Medical URLs ----------
Route::get('/medicine/{slug}', function ($slug) {
    return redirect("/medicines/{$slug}", 301);
});
Route::get('/blog-en/medical/{slug?}', function ($slug = null) {
    return $slug ? redirect("/medicines/{$slug}", 301) : redirect('/medicines', 301);
});
Route::get('/physician/{slug}', function ($slug) {
    return redirect("/blog/{$slug}", 301);
});
Route::get('/update/case-study/{slug}', function ($slug) {
    return redirect("/blog/{$slug}", 301);
});
Route::get('/update/centres/{slug}', function ($slug) {
    return redirect("/blog/{$slug}", 301);
});
Route::get('/update/{slug}', function ($slug) {
    return redirect("/blog/{$slug}", 301);
});
Route::get('/uncategorized-en/{slug}', function ($slug) {
    return redirect("/blog/{$slug}", 301);
});
Route::get('/tech-physio/{slug}', function ($slug) {
    return redirect("/blog/{$slug}", 301);
});

// ---------- About ----------
Route::get('/about', [AboutContentController::class, 'publicShow'])->name('about.public');

// ---------- Team ----------
Route::get('/team', [TeamMemberController::class, 'publicIndex'])->name('team.public');
Route::get('/team/{slug}', [TeamMemberController::class, 'publicShow'])->name('team.public.show');

// ---------- Doctors (public) ----------
Route::get('/doctors', [DoctorController::class, 'publicIndex'])->name('doctors.public');
Route::get('/doctors/{id}', [DoctorController::class, 'publicShow'])->name('doctors.public.show');

// ---------- Price List ----------
Route::get('/price-list', [PriceListController::class, 'publicShow'])->name('pricelist.public');

// ---------- Patient Rights & Responsibilities (public) ----------
Route::get('/patient-rights', [PatientRightsController::class, 'publicShow'])->name('patient-rights.public');
Route::get('/bn/patient-rights', [PatientRightsController::class, 'publicShow'])->name('patient-rights.public.bn');
Route::get('/patient-rights-and-responsibilities', fn() => redirect('/patient-rights', 301));
Route::get('/patient-bill-of-rights', fn() => redirect('/patient-rights', 301));

// ---------- Complaint Box (public) ----------
Route::get('/complaint-box', [ComplaintController::class, 'publicShow'])->name('complaints.public');
Route::post('/complaint-box', [ComplaintController::class, 'store'])->name('complaints.store');
Route::get('/complaint', fn() => redirect('/complaint-box', 301));
Route::get('/complaints', fn() => redirect('/complaint-box', 301));
Route::get('/feedback', fn() => redirect('/complaint-box', 301));

// ---------- How to Pay / Payment Methods (public) ----------
Route::get('/how-to-pay', [PaymentMethodsController::class, 'publicShow'])->name('how-to-pay.public');
Route::get('/payment-methods', fn() => redirect('/how-to-pay', 301));
Route::get('/payment', fn() => redirect('/how-to-pay', 301));
Route::get('/howtopay', fn() => redirect('/how-to-pay', 301));

// ---------- Appointment (public) ----------
Route::get('/appointment', [AppointmentController::class, 'publicBook'])->name('appointment.public');
Route::get('/book', [AppointmentController::class, 'publicBook'])->name('book.public');

// ---------- Gallery (public) ----------
Route::get('/gallery', function () {
    return Inertia::render('Gallery/PublicIndex', [
        'locations' => \Illuminate\Support\Facades\DB::table('locations')->orderBy('sort_order')->orderBy('id')->get(),
        'nav_menu' => \App\Models\NavMenu::first(),
        'featured_images' => \Illuminate\Support\Facades\DB::table('featured_images')
            ->where('is_active', 1)
            ->orderBy('sort_order')
            ->get(),
    ]);
})->name('gallery.public');
Route::get('/photos', fn() => redirect('/gallery', 301));
Route::get('/videos', fn() => redirect('/gallery#videos', 301));

// ---------- Branches (public + admin) ----------
Route::get('/branches', [BranchController::class, 'publicIndex'])->name('branches.public');
Route::get('/branch/{slug}', [BranchController::class, 'publicShow'])->name('branch.public.show');

// Direct Branch URL Aliases for seamless navigation
Route::get('/mirpur', fn() => redirect('/branch/mirpur', 301));
Route::get('/uttara', fn() => redirect('/branch/uttara', 301));
Route::get('/badda', fn() => redirect('/branch/badda', 301));
Route::get('/jatrabari', fn() => redirect('/branch/jatrabari', 301));
Route::get('/mirpur-branch', fn() => redirect('/branch/mirpur', 301));
Route::get('/uttara-branch', fn() => redirect('/branch/uttara', 301));
Route::get('/badda-branch', fn() => redirect('/branch/badda', 301));
Route::get('/jatrabari-branch', fn() => redirect('/branch/jatrabari', 301));
Route::get('/branch-mirpur', fn() => redirect('/branch/mirpur', 301));
Route::get('/branch-uttara', fn() => redirect('/branch/uttara', 301));
Route::get('/branch-badda', fn() => redirect('/branch/badda', 301));
Route::get('/branch-jatrabari', fn() => redirect('/branch/jatrabari', 301));

// Legal & Policy Direct Aliases
Route::get('/about-us', fn() => redirect('/about', 301));
Route::get('/aboutus', fn() => redirect('/about', 301));
Route::get('/contact', fn() => redirect('/branches', 301));
Route::get('/contact-us', fn() => redirect('/branches', 301));
Route::get('/contacts', fn() => redirect('/branches', 301));
Route::get('/our-doctors', fn() => redirect('/doctors', 301));
Route::get('/our-services', fn() => redirect('/services', 301));
Route::get('/terms-of-service', fn() => redirect('/page/terms-of-service', 301));
Route::get('/terms', fn() => redirect('/page/terms-of-service', 301));
Route::get('/privacy-policy', fn() => redirect('/page/privacy-policy', 301));
Route::get('/privacy', fn() => redirect('/page/privacy-policy', 301));

// ============================================================
// ADMIN CMS MODULES — require an authenticated user
// ============================================================
Route::middleware('auth')->group(function () {
// ---------- Medicines (admin) ----------
Route::get('medicines-admin', [MedicineController::class, 'index'])->name('medicines.admin');
Route::get('medicines-admin/create', [MedicineController::class, 'create'])->name('medicines.admin.create');
Route::post('medicines-admin', [MedicineController::class, 'store'])->name('medicines.admin.store');
Route::get('medicines-admin/{id}/edit', [MedicineController::class, 'edit'])->name('medicines.admin.edit');
Route::put('medicines-admin/{id}', [MedicineController::class, 'update'])->name('medicines.admin.update');
Route::delete('medicines-admin/{id}', [MedicineController::class, 'destroy'])->name('medicines.admin.destroy');

// ---------- Services (admin) ----------
Route::get('services-admin', [ServiceController::class, 'index'])->name('services.admin');
Route::get('services-admin/create', [ServiceController::class, 'create'])->name('services.admin.create');
Route::post('services-admin', [ServiceController::class, 'store'])->name('services.admin.store');
Route::get('services-admin/{id}/edit', [ServiceController::class, 'edit'])->name('services.admin.edit');
Route::put('services-admin/{id}', [ServiceController::class, 'update'])->name('services.admin.update');
Route::delete('services-admin/{id}', [ServiceController::class, 'destroy'])->name('services.admin.destroy');

// ---------- About (admin) ----------
Route::get('about-cms', [AboutContentController::class, 'index'])->name('about.admin');
Route::put('about-cms/save', [AboutContentController::class, 'update'])->name('about.admin.update');

// ---------- Team (admin) ----------
Route::get('team-admin', [TeamMemberController::class, 'index'])->name('team.admin');
Route::get('team-admin/create', [TeamMemberController::class, 'create'])->name('team.admin.create');
Route::post('team-admin', [TeamMemberController::class, 'store'])->name('team.admin.store');
Route::get('team-admin/{id}/edit', [TeamMemberController::class, 'edit'])->name('team.admin.edit');
Route::put('team-admin/{id}', [TeamMemberController::class, 'update'])->name('team.admin.update');
Route::post('team-admin/{id}/toggle-active', [TeamMemberController::class, 'toggleActive'])->name('team.admin.toggle');
Route::delete('team-admin/{id}', [TeamMemberController::class, 'destroy'])->name('team.admin.destroy');

// ---------- Price List (admin) ----------
Route::get('price-list-admin', [PriceListController::class, 'adminIndex'])->name('pricelist.admin');
Route::post('price-list-admin/save', [PriceListController::class, 'save'])->name('pricelist.admin.save');

// ---------- Branches (admin) ----------
Route::get('branch-admin', [BranchController::class, 'adminIndex'])->name('branch.admin');
Route::post('branch-admin', [BranchController::class, 'adminStore'])->name('branch.admin.store');
Route::put('branch-admin/{id}', [BranchController::class, 'adminUpdate'])->name('branch.admin.update');
Route::delete('branch-admin/{id}', [BranchController::class, 'adminDestroy'])->name('branch.admin.destroy');

// ---------- Homepage CMS ----------
Route::get('homepage-cms', [HomeContentController::class, 'index'])->name('homepage.admin');
Route::put('homepage-cms/content', [HomeContentController::class, 'saveContent'])->name('homepage.admin.content');
Route::post('homepage-cms/sections-order', [HomeContentController::class, 'saveSectionsOrder'])->name('homepage.admin.sections.order');
Route::post('homepage-cms/gallery', [HomeContentController::class, 'createGalleryRow'])->name('homepage.admin.gallery.create');
Route::put('homepage-cms/gallery/{id}', [HomeContentController::class, 'saveGalleryRow'])->name('homepage.admin.gallery.update');
Route::delete('homepage-cms/gallery/{id}', [HomeContentController::class, 'deleteGalleryRow'])->name('homepage.admin.gallery.destroy');
Route::post('homepage-cms/gallery/reorder', [HomeContentController::class, 'reorderGallery'])->name('homepage.admin.gallery.reorder');
Route::put('homepage-cms/branches/{id}', [HomeContentController::class, 'saveBranch'])->name('homepage.admin.branches.update');
Route::post('homepage-cms/branches/reorder', [HomeContentController::class, 'reorderBranches'])->name('homepage.admin.branches.reorder');
Route::put('homepage-cms/doctors/{id}', [HomeContentController::class, 'saveDoctor'])->name('homepage.admin.doctors.update');
Route::post('homepage-cms/doctors/reorder', [HomeContentController::class, 'reorderDoctors'])->name('homepage.admin.doctors.reorder');
Route::put('homepage-cms/services/{id}', [HomeContentController::class, 'saveService'])->name('homepage.admin.services.update');
Route::post('homepage-cms/services/reorder', [HomeContentController::class, 'reorderServices'])->name('homepage.admin.services.reorder');

// ---------- 301 / 302 Redirect Manager ----------
Route::get('redirects-admin', [RedirectController::class, 'index'])->name('redirects.index');
Route::post('redirects-admin', [RedirectController::class, 'store'])->name('redirects.store');
Route::put('redirects-admin/{id}', [RedirectController::class, 'update'])->name('redirects.update');
Route::delete('redirects-admin/{id}', [RedirectController::class, 'destroy'])->name('redirects.destroy');
Route::post('redirects-admin/{id}/toggle', [RedirectController::class, 'toggle'])->name('redirects.toggle');

// ---------- AI Chat Assistant Admin ----------
Route::get('ai-assistant', [AiAssistantController::class, 'adminIndex'])->name('ai-assistant.admin');
Route::post('ai-assistant/settings', [AiAssistantController::class, 'updateSettings'])->name('ai-assistant.settings.update');
Route::post('ai-assistant/rules', [AiAssistantController::class, 'storeRule'])->name('ai-assistant.rules.store');
Route::put('ai-assistant/rules/{id}', [AiAssistantController::class, 'updateRule'])->name('ai-assistant.rules.update');
Route::delete('ai-assistant/rules/{id}', [AiAssistantController::class, 'deleteRule'])->name('ai-assistant.rules.destroy');
Route::post('ai-assistant/rules/{id}/toggle', [AiAssistantController::class, 'toggleRule'])->name('ai-assistant.rules.toggle');
Route::post('ai-assistant/test-gemini', [AiAssistantController::class, 'testGemini'])->name('ai-assistant.test');
Route::post('ai-assistant/fetch-models', [AiAssistantController::class, 'fetchModels'])->name('ai-assistant.models');
    // ---------- Complaint Box (admin) ----------
    Route::get('complaints-admin', [ComplaintController::class, 'adminIndex'])->name('complaints.admin');
    Route::put('complaints-admin/{id}', [ComplaintController::class, 'updateStatus'])->name('complaints.admin.update');
    Route::delete('complaints-admin/{id}', [ComplaintController::class, 'destroy'])->name('complaints.admin.destroy');

    // ---------- Patient Rights CMS ----------
    Route::get('patient-rights-cms', [PatientRightsController::class, 'adminIndex'])->name('patient-rights.admin');
    Route::post('patient-rights-cms/settings', [PatientRightsController::class, 'updateSettings'])->name('patient-rights.admin.settings');
    Route::post('patient-rights-cms/rights', [PatientRightsController::class, 'storeRight'])->name('patient-rights.admin.rights.store');
    Route::put('patient-rights-cms/rights/{id}', [PatientRightsController::class, 'updateRight'])->name('patient-rights.admin.rights.update');
    Route::delete('patient-rights-cms/rights/{id}', [PatientRightsController::class, 'deleteRight'])->name('patient-rights.admin.rights.destroy');
    Route::post('patient-rights-cms/responsibilities', [PatientRightsController::class, 'storeResponsibility'])->name('patient-rights.admin.responsibilities.store');
    Route::put('patient-rights-cms/responsibilities/{id}', [PatientRightsController::class, 'updateResponsibility'])->name('patient-rights.admin.responsibilities.update');
    Route::delete('patient-rights-cms/responsibilities/{id}', [PatientRightsController::class, 'deleteResponsibility'])->name('patient-rights.admin.responsibilities.destroy');

    // ---------- How to Pay CMS (admin) ----------
    Route::get('how-to-pay-cms', [PaymentMethodsController::class, 'adminIndex'])->name('how-to-pay.admin');
    Route::post('how-to-pay-cms/settings', [PaymentMethodsController::class, 'updateSettings'])->name('how-to-pay.admin.settings');
    Route::post('how-to-pay-cms/methods', [PaymentMethodsController::class, 'updateMethods'])->name('how-to-pay.admin.methods');
    Route::post('how-to-pay-cms/branches', [PaymentMethodsController::class, 'updateBranches'])->name('how-to-pay.admin.branches');
});

require __DIR__.'/auth.php';
