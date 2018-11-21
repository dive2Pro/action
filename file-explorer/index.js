var fs = require('fs')

function readDir(err, files) {
    if(err){

    } else {
        console.log(files)
        process.stdout.write(files.map( file => file.name).join(" ~ "))
        process.stdout.write(files.map( file => file.name).join(" 123 "))
    }
}
fs.readdir(__dirname, readDir)

process.stdin.setEncoding('utf8')

var write = process.stdout.write.bind(process.stdout)
var stdin = process.stdin
var stdout = process.stdout
function file_explorer(dir) {

    fs.readdir(dir, function(err, files) {
        if(err) {
            return
        }

        if(files.length === 0) {
            return console.error(' no files ')
        }

        console.log(' Select which file or directory you want to see \n ')

        function readFileContent(path) {
            fs.readFile(path, 'utf8', function (err, content) {
                if (err) {
                    console.error(' read file error')
                } else {
                    content.replace(/(.*)/g, '       $1')
                    console.log(content)
                }
            })
        }
        var stats = {
            dir: {},
            file: {}
        }
        function onOption(data) {
            const fileName = files[Number(data)]
            if(!fileName) {
                stdout.write('    \33[31mEnter your choice: \033[39m')
            } else {
                const path =  __dirname + '/' + fileName
                if(stats.dir[fileName]) {
                    // go to this dir
                    stdin.pause();
                    file_explorer(path)
                } else {
                   readFileContent(path);
                }
            }
        }

        function readUserInput() {
            console.log(' ');
            write(' \033[33mEnter your choice: \033[39m')
            stdin.resume()
            stdin.on('data', onOption)
        }

        function readFile(i) {
            var filename = files[i]
            fs.stat( dir + '/' +  files[i], function( err, stat ) {
                if(stat.isDirectory()){
                    stats.dir [filename] = stat
                    console.log('    ' + i + '    \033[36m' + filename + '/\033[39m')
                } else {
                    stats.file [filename] = stat
                    console.log('    ' + i + '    \033[90m' + filename + '\033[39m')
                }
                i ++;

                if( i === files.length) {
                    readUserInput();
                } else {
                    readFile(i)
                }
            })
        }

        console.log('     -1    \033[36m  ..  /\033[39m')
        readFile(0)
    })
}

file_explorer(process.cwd())
