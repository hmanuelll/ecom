<?php

$models = [
    'User' => <<<PHP
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected \$guarded = [];

    protected \$hidden = [
        'password',
        'remember_token',
    ];

    protected \$casts = [
        'email_verified_at' => 'datetime',
    ];

    public function orders() { return \$this->hasMany(Order::class); }
    public function addresses() { return \$this->hasMany(Address::class); }
}
PHP,
    'Category' => <<<PHP
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;
    protected \$guarded = [];

    public function parent() { return \$this->belongsTo(Category::class, 'parent_id'); }
    public function children() { return \$this->hasMany(Category::class, 'parent_id'); }
    public function products() { return \$this->hasMany(Product::class); }
}
PHP,
    'Product' => <<<PHP
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;
    protected \$guarded = [];

    public function category() { return \$this->belongsTo(Category::class); }
    public function images() { return \$this->hasMany(ProductImage::class); }
}
PHP,
    'ProductImage' => <<<PHP
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductImage extends Model
{
    use HasFactory;
    protected \$guarded = [];

    public function product() { return \$this->belongsTo(Product::class); }
}
PHP,
    'Address' => <<<PHP
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Address extends Model
{
    use HasFactory;
    protected \$guarded = [];

    public function user() { return \$this->belongsTo(User::class); }
}
PHP,
    'Order' => <<<PHP
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;
    protected \$guarded = [];

    public function user() { return \$this->belongsTo(User::class); }
    public function items() { return \$this->hasMany(OrderItem::class); }
    public function shippingAddress() { return \$this->belongsTo(Address::class, 'shipping_address_id'); }
}
PHP,
    'OrderItem' => <<<PHP
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    use HasFactory;
    protected \$guarded = [];

    public function order() { return \$this->belongsTo(Order::class); }
    public function product() { return \$this->belongsTo(Product::class); }
}
PHP
];

foreach (\$models as \$name => \$content) {
    file_put_contents(__DIR__ . "/app/Models/{\$name}.php", \$content);
}
echo "Models updated successfully.";
