/**
 * 跳转到定义
 */
const vscode = require('vscode');
const path = require('path');
const fs = require('fs');

function provideDefinition(document, position, token) {
    const curFilePath = document.fileName;
    const line        = document.lineAt(position);
    const folders     = vscode.workspace.workspaceFolders;
    let rootPath      = vscode.workspace.rootPath;
    if (folders.length > 1) {
        for (let i = 0; i < folders.length; i++) {
            let folder = folders[i];
            if (curFilePath.indexOf(folder.uri.path) === 0) {
                rootPath = folder.uri.path
                break;
            }
        }
    }

    const exp = /\brequire\((['"])(@[^'"]+?)\1\)|\bfrom\s+(['"])(@[^'"]+?)\3/;
    const match = line.text.match(exp);

    if (match) {
        const aliasMap = vscode.workspace.getConfiguration().get('aliasJump.alias');
        const projects = vscode.workspace.getConfiguration().get('aliasJump.projects');
        let curPrjName;
        let curPrjPath;

        if (projects.length) {
            // 多项目
            projects.some(prj => {
                let prjPath = path.join(rootPath, prj);
                if (curFilePath.indexOf(prjPath) === 0) {
                    curPrjName = prj
                    curPrjPath = prjPath
                    return true
                }
            })
        } else {
            // 单项目
            curPrjPath = rootPath
            curPrjName = '/'
        }

        const relPath = match[2] || match[4]; // @/a/b/c
        let fPath = '';
        const findPath = function (aliaKey, aliaValue){ // => "@", "src"
            const dirArr = relPath.split('/').map(item =>  item === aliaKey ? aliaValue : item).join('/').split('/'); // @/a/b/c => src/a/b/c
            if (
                curPrjName === dirArr[0] || 
                dirArr[0] === '' // 单项目 或者主项目
            ){
                fPath = path.join(rootPath, dirArr.join('/'));
                return true
            }
        }; 
        Object.keys(aliasMap)
        .some(key => { // => "@"
            if (key === relPath.split('/')[0]) {// 存在映射关系
                const alias = aliasMap[key] // => ["a/src", "b/src", ...]
                if (Array.isArray(alias)) {
                    return alias.some(item => findPath(key, item))
                } else {
                    return findPath(key, alias)
                }
            }
        });

        if (!fPath) return;

        const ext = path.parse(fPath).ext;
        let filePath;
        let found;
        if (ext) {
            found = fs.existsSync(fPath);
        } else {
            const exts = ['js', 'vue', 'json', 'jsx', 'css', 'less']; 

            found = exts.some(ext => {
                if (fs.existsSync(fPath + '.' + ext)) {
                    filePath = fPath + '.' + ext;
                    return true
                } else {
                    let fp = path.join(fPath, 'index.' + ext);
                    if (fs.existsSync(fp)) {
                        filePath = fp;
                        return true
                    } 
                }
            })
        }

        if (found) return new vscode.Location(vscode.Uri.file(filePath), new vscode.Position(0, 0));
    }
}

module.exports = function(context) {
    context.subscriptions.push(vscode.languages.registerDefinitionProvider(['javascript', 'vue', 'jsx'], {
        provideDefinition
    }));
};