<?php
$dir = __DIR__ . '/app/Models/';

$province = "<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Province extends Model {
    public function districts() { return \$this->hasMany(District::class); }
}";
file_put_contents($dir . 'Province.php', $province);

$district = "<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class District extends Model {
    public function communes() { return \$this->hasMany(Commune::class); }
    public function province() { return \$this->belongsTo(Province::class); }
}";
file_put_contents($dir . 'District.php', $district);

$commune = "<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Commune extends Model {
    public function villages() { return \$this->hasMany(Village::class); }
    public function district() { return \$this->belongsTo(District::class); }
}";
file_put_contents($dir . 'Commune.php', $commune);

$village = "<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Village extends Model {
    public function commune() { return \$this->belongsTo(Commune::class); }
}";
file_put_contents($dir . 'Village.php', $village);

echo 'Models updated';
