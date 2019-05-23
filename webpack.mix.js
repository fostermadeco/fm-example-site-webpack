const mix = require('laravel-mix');

const host = 'fm-example-site.dev';
const vagrantIP = '192.168.202.153';

mix.setPublicPath('./public');

// be sure to use mix.js - not mix.scripts or mix.babel
mix.js(['resources/js/lib/modernizr.js', 'resources/js/main.js'], 'public/assets/main.js');

// order matters, before scss to set sass variable
mix.copy('node_modules/@fortawesome/fontawesome-free/webfonts', 'public/assets/fonts/@fortawesome/fontawesome-free');

// Mix doesn't support use of .browserlistrc file so need to specify them here
mix.sass('resources/scss/main.scss', 'public/assets').options({
    autoprefixer: {
        options: {
            browsers: ['last 1 version', '> 1%'],
        },
    },
});

// Makes $ available globally, no need to import it
mix.autoload({
    jquery: ['$', 'window.jQuery', 'jQuery'],
});

mix.copyDirectory('resources/images', 'public/assets/images');
mix.copyDirectory('resources/fonts', 'public/assets/fonts');

if (!mix.config.production) {
    mix.browserSync({
        proxy: `https://${host}`,
        // compiled files in public or templates
        files: ['public/assets/**/*', 'public/index.php'],
        host: vagrantIP,
        port: 3000,
        open: false,
        https: {
            key: `/etc/ssl/private/${host}.key`,
            cert: `/etc/ssl/certs/${host}.crt`,
        },
        watchOptions: {
            usePolling: true,
            interval: 500,
        },
    });
}

if (mix.config.production) {
    mix.version();
}