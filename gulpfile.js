'use strict';
 
var gulp = require('gulp');
var runSequence = require('run-sequence');
 
gulp.task('copy', function() {
    return gulp.src(
            [
                './**/*.php',
                './assets/dist/**',
                './style.css',
                "!./dist/**",
                "!./node_modules/**/*.*"
            ],
            { base: './' }
        )
        .pipe( gulp.dest( 'dist' ) );
} );
gulp.task('build:dist',function(){
    /* ここで、CSS とか JS をコンパイルする */
});
 
gulp.task('dist', function(cb){
    return runSequence( 'build:dist', 'copy', cb );
});