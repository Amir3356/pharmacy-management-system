<?php

namespace Database\Seeders;

use App\Models\Medicine;
use Illuminate\Database\Seeder;

class MedicineSeeder extends Seeder
{
    public function run(): void
    {
        $medicines = [
            [
                'name' => 'Paracetamol',
                'category' => 'Pain Relief',
                'price' => 2.50,
                'quantity' => 120,
                'expiry_date' => '2026-12-31',
                'description' => 'Used for fever and mild pain relief.',
            ],
            [
                'name' => 'Amoxicillin',
                'category' => 'Antibiotic',
                'price' => 5.75,
                'quantity' => 40,
                'expiry_date' => '2026-09-30',
                'description' => 'Common antibiotic for bacterial infections.',
            ],
            [
                'name' => 'Cetirizine',
                'category' => 'Allergy',
                'price' => 3.20,
                'quantity' => 18,
                'expiry_date' => '2026-07-15',
                'description' => 'Helps with seasonal allergy symptoms.',
            ],
            [
                'name' => 'Omeprazole',
                'category' => 'Digestive',
                'price' => 4.10,
                'quantity' => 0,
                'expiry_date' => '2026-05-20',
                'description' => 'Reduces stomach acid and heartburn.',
            ],
        ];

        foreach ($medicines as $medicine) {
            Medicine::updateOrCreate(['name' => $medicine['name']], $medicine);
        }
    }
}