<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Commune extends Model {
    public function villages() { return $this->hasMany(Village::class); }
    public function district() { return $this->belongsTo(District::class); }
}