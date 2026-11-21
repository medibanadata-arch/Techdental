<!DOCTYPE html>
<html lang="{{ !empty($page['props']['legacy_seo']['lang']) ? $page['props']['legacy_seo']['lang'] : str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        @php
            $siteSettings = \App\Models\HomeContent::first();
            $faviconUrl = $siteSettings->favicon ?? '/favicon.ico';
            $companyName = $siteSettings->company_name ?? config('app.name', 'Tech Dental');
            $legacySeo = $page['props']['legacy_seo'] ?? null;
        @endphp

        @if($legacySeo)
            {{-- Archived WordPress SEO, rendered server-side so crawlers and social
                 bots see the original title, description and schema. --}}
            <title>{{ $legacySeo['title'] }}</title>
            @if(!empty($legacySeo['description']))
                <meta name="description" content="{{ $legacySeo['description'] }}">
            @endif
            @if(!empty($legacySeo['keywords']))
                <meta name="keywords" content="{{ $legacySeo['keywords'] }}">
            @endif
            <meta name="robots" content="{{ $legacySeo['robots'] ?: 'index, follow' }}">
            <link rel="canonical" href="{{ $legacySeo['canonical'] }}">

            @foreach(($legacySeo['hreflang'] ?? []) as $alt)
                @if(!empty($alt['href']) && !empty($alt['lang']))
                    <link rel="alternate" hreflang="{{ $alt['lang'] }}" href="{{ $alt['href'] }}">
                @endif
            @endforeach

            <meta property="og:site_name" content="{{ $companyName }}">
            <meta property="og:locale" content="{{ ($legacySeo['lang'] ?? 'en') === 'bn' ? 'bn_BD' : 'en_US' }}">
            <meta property="og:type" content="{{ ($legacySeo['og']['og:type'] ?? '') ?: 'article' }}">
            <meta property="og:title" content="{{ ($legacySeo['og']['og:title'] ?? '') ?: $legacySeo['title'] }}">
            <meta property="og:description" content="{{ ($legacySeo['og']['og:description'] ?? '') ?: $legacySeo['description'] }}">
            <meta property="og:url" content="{{ ($legacySeo['og']['og:url'] ?? '') ?: $legacySeo['canonical'] }}">
            @foreach(($legacySeo['og'] ?? []) as $key => $value)
                @if(!in_array($key, ['og:type', 'og:title', 'og:description', 'og:url', 'og:site_name', 'og:locale']) && $value !== '')
                    <meta property="{{ $key }}" content="{{ $value }}">
                @endif
            @endforeach

            <meta name="twitter:card" content="{{ ($legacySeo['twitter']['twitter:card'] ?? '') ?: 'summary_large_image' }}">
            <meta name="twitter:title" content="{{ ($legacySeo['twitter']['twitter:title'] ?? '') ?: $legacySeo['title'] }}">
            <meta name="twitter:description" content="{{ ($legacySeo['twitter']['twitter:description'] ?? '') ?: $legacySeo['description'] }}">
            @foreach(($legacySeo['twitter'] ?? []) as $key => $value)
                @if(!in_array($key, ['twitter:card', 'twitter:title', 'twitter:description']) && $value !== '')
                    <meta name="{{ $key }}" content="{{ $value }}">
                @endif
            @endforeach

            @foreach(($legacySeo['schema'] ?? []) as $block)
                <script type="application/ld+json">{!! json_encode($block, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) !!}</script>
            @endforeach
        @else
            <title inertia>{{ $companyName }}</title>
        @endif

        <link rel="icon" type="image/x-icon" href="{{ $faviconUrl }}">
        <link rel="shortcut icon" href="{{ $faviconUrl }}">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <!-- Fonts & Icons -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Anek+Bangla:wght@400;500;600;700&family=Noto+Sans+Bengali:wght@400;500;600;700&family=Hind+Siliguri:wght@400;500;600;700&family=Inter:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,400..700;1,400..700&family=Plus+Jakarta+Sans:ital,wght@0,400..800;1,400..800&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="https://fonts.maateen.me/solaiman-lipi/font.css">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/dist/tabler-icons.min.css">

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.tsx'])
        @inertiaHead
    </head>
    <body class="bg-white text-gray-900 antialiased selection:bg-rose-900 selection:text-white font-sans">
        @inertia
    </body>
</html>
