<?php

namespace App\Http\Controllers;

use App\Http\Requests\MedicineRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MedicineController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $search = $request->string('search')->trim()->toString();

        if ($search === '') {
            $medicines = DB::select(
                'select id, name, category, price, quantity, expiry_date, description, created_at, updated_at
                 from medicines
                 order by name'
            );
        } else {
            $likeSearch = "%{$search}%";

            $medicines = DB::select(
                'select id, name, category, price, quantity, expiry_date, description, created_at, updated_at
                 from medicines
                 where name like ? or category like ?
                 order by name',
                [$likeSearch, $likeSearch]
            );
        }

        return response()->json($medicines);
    }

    public function store(MedicineRequest $request): JsonResponse
    {
        $data = $request->validated();
        $timestamp = now()->toDateTimeString();

        DB::insert(
            'insert into medicines (name, category, price, quantity, expiry_date, description, created_at, updated_at)
             values (?, ?, ?, ?, ?, ?, ?, ?)',
            [
                $data['name'],
                $data['category'],
                $data['price'],
                $data['quantity'],
                $data['expiry_date'],
                $data['description'] ?? null,
                $timestamp,
                $timestamp,
            ]
        );

        $medicine = DB::selectOne(
            'select id, name, category, price, quantity, expiry_date, description, created_at, updated_at
             from medicines
             where id = ?
             limit 1',
            [(int) DB::getPdo()->lastInsertId()]
        );

        return response()->json($medicine, 201);
    }

    public function show(int $id): JsonResponse
    {
        $medicine = DB::selectOne(
            'select id, name, category, price, quantity, expiry_date, description, created_at, updated_at
             from medicines
             where id = ?
             limit 1',
            [$id]
        );

        if (! $medicine) {
            return response()->json(['message' => 'Medicine not found.'], 404);
        }

        return response()->json($medicine);
    }

    public function update(MedicineRequest $request, int $id): JsonResponse
    {
        $existing = DB::selectOne('select id from medicines where id = ? limit 1', [$id]);

        if (! $existing) {
            return response()->json(['message' => 'Medicine not found.'], 404);
        }

        $data = $request->validated();

        DB::update(
            'update medicines
             set name = ?, category = ?, price = ?, quantity = ?, expiry_date = ?, description = ?, updated_at = ?
             where id = ?',
            [
                $data['name'],
                $data['category'],
                $data['price'],
                $data['quantity'],
                $data['expiry_date'],
                $data['description'] ?? null,
                now()->toDateTimeString(),
                $id,
            ]
        );

        $medicine = DB::selectOne(
            'select id, name, category, price, quantity, expiry_date, description, created_at, updated_at
             from medicines
             where id = ?
             limit 1',
            [$id]
        );

        return response()->json($medicine);
    }

    public function destroy(int $id): JsonResponse
    {
        $deleted = DB::delete('delete from medicines where id = ?', [$id]);

        if ($deleted === 0) {
            return response()->json(['message' => 'Medicine not found.'], 404);
        }

        return response()->json(['message' => 'Medicine deleted successfully.']);
    }
}