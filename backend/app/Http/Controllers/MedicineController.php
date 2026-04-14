<?php

namespace App\Http\Controllers;

use App\Http\Requests\MedicineRequest;
use App\Models\Medicine;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MedicineController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $search = $request->string('search')->trim()->toString();

        $medicines = Medicine::query()
            ->when($search !== '', function ($query) use ($search): void {
                $query->where(function ($subQuery) use ($search): void {
                    $subQuery->where('name', 'like', "%{$search}%")
                        ->orWhere('category', 'like', "%{$search}%");
                });
            })
            ->orderBy('name')
            ->get();

        return response()->json($medicines);
    }

    public function store(MedicineRequest $request): JsonResponse
    {
        $medicine = Medicine::create($request->validated());

        return response()->json($medicine, 201);
    }

    public function show(Medicine $medicine): JsonResponse
    {
        return response()->json($medicine);
    }

    public function update(MedicineRequest $request, Medicine $medicine): JsonResponse
    {
        $medicine->update($request->validated());

        return response()->json($medicine);
    }

    public function destroy(Medicine $medicine): JsonResponse
    {
        $medicine->delete();

        return response()->json(['message' => 'Medicine deleted successfully.']);
    }
}