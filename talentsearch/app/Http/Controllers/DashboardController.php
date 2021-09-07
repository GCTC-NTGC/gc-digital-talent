<?php

namespace App\Http\Controllers;

class DashboardController extends Controller
{
    /**
     * Show the homepage.
     * @return \Illuminate\Http\Response
     *
     * @return void
     */
    public function index()
    {
        return view('dashboard');
    }
}
