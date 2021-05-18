<?php

namespace App\Http\Controllers;

class HomePageController extends Controller
{
    /**
     * Show the homepage.
     * @return \Illuminate\Http\Response
     *
     * @return void
     */
    public function index()
    {
        return view('home');
    }
}
