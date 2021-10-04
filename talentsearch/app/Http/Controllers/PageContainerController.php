<?php

namespace App\Http\Controllers;

class PageContainerController extends Controller
{
    /**
     * Show the homepage.
     * @return \Illuminate\Http\Response
     *
     * @return void
     */
    public function index()
    {
        return view('page_container');
    }
}
