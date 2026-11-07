<?php

namespace App\Http\Controllers;

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

        return Inertia::render('HowToPay/PublicShow', [
            'locations' => $locations,
            'nav_menu' => $navMenu,
            'canonical_url' => url('/how-to-pay'),
        ]);
    }
}
