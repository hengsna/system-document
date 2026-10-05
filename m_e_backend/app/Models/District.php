<?php
namespace App\Models;
use MongoDB\Laravel\Eloquent\Model;
class District extends Model {
    public function communes() { return $this->hasMany(Commune::class); }
    public function province() { return $this->belongsTo(Province::class); }
}
