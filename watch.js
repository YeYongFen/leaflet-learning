var watch = require( 'watch');
var {build , ignoreFilename} = require('./build.js');
const fs = require('fs')
const path = require('path')

var timer = null;





function getCheckDir(src){
    var arr = [];
    if (fs.existsSync(src) == false) {
        return false;
    }
    var dirs = fs.readdirSync(src);
    dirs = dirs.filter( str => ignoreFilename.indexOf(str) === -1  )

    dirs.forEach(function(item){
        var item_path = path.join(src, item);
        var temp = fs.statSync(item_path);
        if (temp.isDirectory()   ){ // 是目录
            arr.push( item_path )
        }
    });
    return arr;
}


var checkfileList = getCheckDir('./')

console.log(checkfileList, 111)


checkfileList.forEach(root=>{
    watch.watchTree(root , function (f, curr, prev) {
        clearTimeout(timer);
        timer = setTimeout(function(){
            build();
            console.log('重新构建')
        },100)
    })
})


