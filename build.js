
const fs = require('fs')
const path = require('path')
var ejs = require('ejs');

const distDir = 'dist'

const assetsFilename = [ 'resources' , 'image' ];
const ignoreFilename = [ distDir , 'node_modules' , '.vscode' , '.git' ];
var viewsFilename = [];

build()
 



function build(){

     
    deleteDirectory(distDir);
    fs.mkdirSync(distDir);
    run('./')
    var itemList = getAllFile(distDir)


    ejs.renderFile('index.ejs', { itemList }, function(err, str){
        fs.writeFileSync(distDir + '/index.html', str);
    });


}



function run(src){
    if (fs.existsSync(src) == false) {
        return false;
    }

    var dirs = fs.readdirSync(src);
    dirs = dirs.filter( str => ignoreFilename.indexOf(str) === -1  )

    dirs.forEach(function(item){
        var item_path = path.join(src, item);
        var dest_path = path.join(distDir, item);
        var temp = fs.statSync(item_path);
        if (temp.isDirectory()   ){ // 是目录
            copyDirectory(item_path , dest_path );
        }

        if( assetsFilename.indexOf(item) === -1 ){
            viewsFilename.push(dest_path)
        }
    });

}


function copyDirectory(src, dest) {
    if (fs.existsSync(dest) == false) {
        fs.mkdirSync(dest);
    }
    if (fs.existsSync(src) == false) {
        return false;
    }
    // console.log("src:" + src + ", dest:" + dest);
    // 拷贝新的内容进去
    var dirs = fs.readdirSync(src);
    dirs.forEach(function(item){
        var item_path = path.join(src, item);
        var temp = fs.statSync(item_path);
        if (temp.isFile()) { // 是文件
           // console.log("Item Is File:" + item);
            fs.copyFileSync(item_path, path.join(dest, item));
        } else if (temp.isDirectory()){ // 是目录
            // console.log("Item Is Directory:" + item);
            copyDirectory(item_path, path.join(dest, item));
        }
    });
}
 

function deleteDirectory(dir) {
    if (fs.existsSync(dir) == true) {
        var files = fs.readdirSync(dir);
        files.forEach(function(item){
            var item_path = path.join(dir, item);
           // console.log(item_path);
            if (fs.statSync(item_path).isDirectory()) {
                deleteDirectory(item_path);
            }
            else {
                fs.unlinkSync(item_path);
            }
        });
        fs.rmdirSync(dir);
    }
}


function getAllFile (dir){
    let res=[]
    function traverse(dir){
        fs.readdirSync(dir).forEach((file)=>{
            const pathname=path.join(dir,file)
            if(fs.statSync(pathname).isDirectory()){
                traverse(pathname)
            }else{

                if(viewsFilename.some(path=>pathname.indexOf(path)>-1  ) ){
                    res.push(pathname.replace('dist' , '.' ).replace(/\\/g,'/'))
                }
            }
        })
    }
    traverse(dir)
    //console.log(res);
    return res;
}


module.exports = {
    build , assetsFilename , ignoreFilename , viewsFilename

}