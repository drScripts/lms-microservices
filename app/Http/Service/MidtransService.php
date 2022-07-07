<?php

namespace App\Http\Service;

use Midtrans\Config;
use Midtrans\Snap;

trait MidtransService
{

    protected function setConfig()
    {
        Config::$isProduction = env('MIDTRANS_IS_PRODUCTION') == 'true';
        Config::$clientKey = env("MIDTRANS_CLIENT_KEY");
        Config::$serverKey = env("MIDTRANS_SERVER_KEY");
    }

    public function getMidtransSnap(array $payload)
    {
        $this->setConfig();

        return Snap::getSnapUrl($payload);
    }
}
