<?php

namespace App\Http\Controllers;

use App\Models\HomeContent;
use App\Models\Location;
use App\Models\NavMenu;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PaymentMethodsController extends Controller
{
    /**
     * Show the public How to Pay / Payment methods by branch page
     */
    public function publicShow(Request $request)
    {
        $locations = Location::orderBy('sort_order')->get();
        $navMenu = NavMenu::first();
        $homeContent = HomeContent::first();

        return Inertia::render('HowToPay/PublicShow', [
            'locations' => $locations,
            'nav_menu' => $navMenu,
            'home_content' => $homeContent,
            'initial_branch' => $request->query('branch', ''),
            'canonical_url' => url('/how-to-pay'),
        ]);
    }
}
