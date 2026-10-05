<?php
namespace App\Models;
use MongoDB\Laravel\Eloquent\Model;
class Province extends Model {
    public function districts() { return $this->hasMany(District::class); }
}
