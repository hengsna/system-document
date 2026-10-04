<?php
$dir = __DIR__ . '/database/migrations/';
$files = scandir($dir);

foreach ($files as $file) {
    if (strpos($file, 'create_roles_table') !== false) {
        $content = "<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('roles', function (Blueprint \$table) {
            \$table->id();
            \$table->string('name')->unique();
            \$table->text('description')->nullable();
            \$table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('roles'); }
};";
        file_put_contents($dir . $file, $content);
    }
    elseif (strpos($file, 'create_provinces_table') !== false) {
        $content = "<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('provinces', function (Blueprint \$table) {
            \$table->id();
            \$table->string('name')->unique();
            \$table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('provinces'); }
};";
        file_put_contents($dir . $file, $content);
    }
    elseif (strpos($file, 'create_districts_table') !== false) {
        $content = "<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('districts', function (Blueprint \$table) {
            \$table->id();
            \$table->string('name');
            \$table->foreignId('province_id')->constrained()->cascadeOnDelete();
            \$table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('districts'); }
};";
        file_put_contents($dir . $file, $content);
    }
    elseif (strpos($file, 'create_communes_table') !== false) {
        $content = "<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('communes', function (Blueprint \$table) {
            \$table->id();
            \$table->string('name');
            \$table->foreignId('district_id')->constrained()->cascadeOnDelete();
            \$table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('communes'); }
};";
        file_put_contents($dir . $file, $content);
    }
    elseif (strpos($file, 'create_villages_table') !== false) {
        $content = "<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('villages', function (Blueprint \$table) {
            \$table->id();
            \$table->string('name');
            \$table->foreignId('commune_id')->constrained()->cascadeOnDelete();
            \$table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('villages'); }
};";
        file_put_contents($dir . $file, $content);
    }
    elseif (strpos($file, 'add_role_and_status_to_users_table') !== false) {
        $content = "<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::table('users', function (Blueprint \$table) {
            \$table->foreignId('role_id')->nullable()->constrained()->nullOnDelete();
            \$table->string('status')->default('Active');
        });
    }
    public function down(): void {
        Schema::table('users', function (Blueprint \$table) {
            \$table->dropForeign(['role_id']);
            \$table->dropColumn(['role_id', 'status']);
        });
    }
};";
        file_put_contents($dir . $file, $content);
    }
}
echo 'Migrations Updated';
