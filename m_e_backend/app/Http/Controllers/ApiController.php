<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Role;
use App\Models\Province;
use App\Models\District;
use App\Models\Commune;
use App\Models\Village;
use Illuminate\Support\Facades\Hash;

class ApiController extends Controller
{
    // --- AUTH ---
    public function setupAdmin() {
        $user = User::where('name', 'admin')->first();
        if (!$user) {
            $user = new User();
        }
        $user->name = 'admin';
        $user->email = 'admin@example.com';
        $user->password = Hash::make('admin123@');
        $user->status = 'Active';
        $user->permissions = json_encode(['create', 'edit', 'delete', 'modify']);
        $user->save();
        return response()->json(['success' => true, 'message' => 'Admin user created or updated!']);
    }

    public function login(Request $request) {
        $user = User::where('name', $request->username)->first();
        if ($user && Hash::check($request->password, $user->password)) {
            return response()->json(['success' => true, 'user' => $user]);
        }
        return response()->json(['success' => false, 'message' => 'Invalid credentials'], 401);
    }

    // --- USERS ---
    public function getUsers() {
        $users = User::leftJoin('roles', 'users.role_id', '=', 'roles.id')
            ->select('users.*', 'roles.name as role')
            ->get();
        // Decode JSON manually if needed, but Laravel does it if we cast it. We can just parse it here.
        foreach($users as $u) {
            $u->permissions = json_decode($u->permissions, true) ?? [];
        }
        return $users;
    }
    public function saveUser(Request $request) {
        $user = $request->id ? User::find($request->id) : new User();
        $user->name = $request->name;
        $user->email = $request->email;
        if(!$request->id) {
            $user->password = Hash::make('password'); // default
        }
        if ($request->role) {
            $role = Role::where('name', $request->role)->first();
            if ($role) $user->role_id = $role->id;
        }
        $user->status = $request->status ?? 'Active';
        $user->permissions = json_encode($request->permissions ?? []);
        $user->save();
        return response()->json(['success' => true]);
    }
    public function deleteUser($id) {
        User::destroy($id);
        return response()->json(['success' => true]);
    }

    // --- ROLES ---
    public function getRoles() {
        $roles = Role::all();
        foreach($roles as $role) {
            $role->count = User::where('role_id', $role->id)->count();
            $role->users = User::where('role_id', $role->id)->pluck('id');
        }
        return $roles;
    }
    
    public function assignUsersToRole(Request $request, $id) {
        // Unassign anyone who currently has this role
        User::where('role_id', $id)->update(['role_id' => null]);
        // Assign new users
        if(!empty($request->user_ids)) {
            User::whereIn('id', $request->user_ids)->update(['role_id' => $id]);
        }
        return response()->json(['success' => true]);
    }
    public function saveRole(Request $request) {
        $role = $request->id ? Role::find($request->id) : new Role();
        $role->name = $request->name;
        $role->description = $request->desc;
        $role->save();
        return response()->json(['success' => true]);
    }
    public function deleteRole($id) {
        Role::destroy($id);
        return response()->json(['success' => true]);
    }

    // --- LOCATIONS ---
    public function getLocations() {
        $provinces = Province::with(['districts.communes.villages'])->get();
        $db = [];
        foreach ($provinces as $p) {
            $p_key = strtolower(str_replace(' ', '_', $p->name));
            $db[$p_key] = ['id' => $p->id, 'name' => $p->name, 'districts' => []];
            foreach ($p->districts as $d) {
                $d_key = strtolower(str_replace(' ', '_', $d->name));
                $db[$p_key]['districts'][$d_key] = ['id' => $d->id, 'name' => $d->name, 'communes' => []];
                foreach ($d->communes as $c) {
                    $c_key = strtolower(str_replace(' ', '_', $c->name));
                    $db[$p_key]['districts'][$d_key]['communes'][$c_key] = ['id' => $c->id, 'name' => $c->name, 'villages' => []];
                    foreach ($c->villages as $v) {
                        $db[$p_key]['districts'][$d_key]['communes'][$c_key]['villages'][] = $v->name;
                    }
                }
            }
        }
        return $db;
    }

    public function saveLocation(Request $request) {
        $type = $request->type;
        $name = $request->name;

        if ($type === 'province') {
            $p = new Province();
            $p->name = $name;
            $p->save();
        } elseif ($type === 'district') {
            $p = Province::where('name', $request->parentName)->first();
            $d = new District();
            $d->name = $name;
            $d->province_id = $p->id;
            $d->save();
        } elseif ($type === 'commune') {
            $d = District::where('name', $request->parentName)->first();
            $c = new Commune();
            $c->name = $name;
            $c->district_id = $d->id;
            $c->save();
        } elseif ($type === 'village') {
            $c = Commune::where('name', $request->parentName)->first();
            $v = new Village();
            $v->name = $name;
            $v->commune_id = $c->id;
            $v->save();
        }
        return response()->json(['success' => true]);
    }
}
