var gulp   = require('gulp');
var prompt = require('gulp-prompt');

gulp.task('prompt', function(){
    gulp.src('app/scripts/main.js')
        .pipe(prompt.prompt([
            {
                type: "list"
                ,name: "task-selected"
                ,default: "Server"
                ,message: "Choose a task"
                ,choices: [
                     { name: 'Server',            value: 'server' }
                    ,{ name: 'Compile and watch', value: 'compile-and-watch' }
                    ,{ name: 'Compile',           value: 'compile' }
                    ,{ name: 'Build',             value: 'build' }
                ]
            }
        ], function(answers) {
            gulp.start(answers['task-selected']);
        }));
});
