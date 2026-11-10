<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Public site identity used for SEO tags, canonical URLs and schema.org
    |--------------------------------------------------------------------------
    */
    'name' => 'Tech Dental Care',
    'url' => rtrim(env('SITE_URL', 'https://techdentalcare.com'), '/'),
    'logo' => '/images/tech-dental-logo.png',
    'default_image' => '/images/og-default.jpg',
    'phone' => '09638-000505',
    'email' => 'info@techdentalcare.com',
    'address' => '827 (2nd Floor), Shewrapara, Begum Rokeya Sarani, Mirpur, Dhaka 1216',
    'branches' => [
        'Mirpur' => '827 (2nd Floor), Shewrapara, Begum Rokeya Sarani, Mirpur, Dhaka 1216',
        'Uttara' => 'House 12, Road 7, Sector 4, Uttara, Dhaka 1230',
        'Badda' => 'Ka-42/1, Progati Sarani, Badda, Dhaka 1212',
        'Jatrabari' => 'Haji Mansion, Dhaka-Chattogram Highway, Jatrabari, Dhaka 1204',
    ],
];
