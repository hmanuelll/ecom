C:\xampp\php\php.exe -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
C:\xampp\php\php.exe composer-setup.php
del composer-setup.php
C:\xampp\php\php.exe composer.phar create-project laravel/laravel:^9.0 backend
