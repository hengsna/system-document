<?php
namespace App\Models;
use MongoDB\Laravel\Eloquent\Model;
class Village extends Model {
    public function commune() { return $this->belongsTo(Commune::class); }
}
