<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Village extends Model {
    public function commune() { return $this->belongsTo(Commune::class); }
}