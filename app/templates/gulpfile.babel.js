// generated on <%= date %> using <%= name %> <%= version %>
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import browserSync from 'browser-sync';
import del from 'del';

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

gulp.task('styles', () => {<% if (includeSass) { %>
  return gulp.src('app/styles/*.scss')
    .pipe($.plumber())
    .pipe($.sass.sync({
      outputStyle: 'expanded',
      precision: 10,
      includePaths: ['.']
    }).on('error', $.sass.logError))<% } else { %>
  return gulp.src('app/styles/*.css')
    <% } %>
    .pipe(gulp.dest('.tmp/styles'))
    .pipe(reload({stream: true}));
});

<% if (includeBabel) { -%>
gulp.task('scripts', () => {
  return gulp.src('app/scripts/**/*.js')
    .pipe($.plumber())
    .pipe($.babel())
    .pipe(gulp.dest('.tmp/scripts'))
    .pipe(reload({stream: true}));
});
<% } -%>


<% if (includeBabel) { -%>
gulp.task('html', ['styles', 'scripts'], () => {
<% } else { -%>
gulp.task('html', ['styles'], () => {
<% } -%>
  return gulp.src('app/*.html')
    .pipe($.useref({searchPath: ['.tmp', 'app', '.']}))
    .pipe($.if('*.html', $.htmlmin({collapseWhitespace: true})))
    .pipe(gulp.dest('dist'));
});

gulp.task('images', () => {
  return gulp.src('app/images/**/*')
    .pipe($.cache($.imagemin({
      progressive: true,
      interlaced: true,
      // don't remove IDs from SVGs, they are often used
      // as hooks for embedding and styling
      svgoPlugins: [{cleanupIDs: false}]
    })))
    .pipe(gulp.dest('dist/images'));
});

gulp.task('extras', () => {
  return gulp.src([
    'app/*.*',
    '!app/*.html'
  ], {
    dot: true
  }).pipe(gulp.dest('dist'));
});

gulp.task('clean', del.bind(null, ['.tmp', 'dist']));

<% if (includeBabel) { -%>
gulp.task('serve', ['styles', 'scripts'], () => {
<% } else { -%>
gulp.task('serve', ['styles'], () => {
<% } -%>
  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['.tmp', 'app'],
      routes: {
        '/bower_components': 'bower_components'
      }
    }
  });

  gulp.watch([
    'app/*.html',
<% if (!includeBabel) { -%>
    'app/scripts/**/*.js',
<% } -%>
    'app/images/**/*'
  ]).on('change', reload);

  gulp.watch('app/styles/**/*.<%= includeSass ? 'scss' : 'css' %>', ['styles']);
<% if (includeBabel) { -%>
  gulp.watch('app/scripts/**/*.js', ['scripts']);
<% } -%>
});

gulp.task('serve:dist', () => {
  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['dist']
    }
  });
});


gulp.task('build', ['html', 'images', 'extras'], () => {
  return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('default', ['clean'], () => {
  gulp.start('build');
});
