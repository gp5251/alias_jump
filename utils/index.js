const vscode = require('vscode');
const path = require('path');
const utils = {}

utils.getCurPrj = function (curFilePath, rootPath) {
    let curPrjName;
    let curPrjPath;
    const projects = vscode.workspace.getConfiguration().get('aliasJump.projects');
    // const alias = vscode.workspace.getConfiguration().get('aliasJump.alias');

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

    return {
        curPrjPath,
        curPrjName
    }
}

utils.getRootPath = function (curFilePath) {
    let rootPath = vscode.workspace.rootPath;
    const folders = vscode.workspace.workspaceFolders;
    if (folders.length > 1) {
        for (let i = 0; i < folders.length; i++) {
            let folder = folders[i];
            if (curFilePath.indexOf(folder.uri.path) === 0) {
                rootPath = folder.uri.path
                break;
            }
        }
    }

    return rootPath
}

utils.getFilePath = function (curFilePath, relPath, rootPath, {alias} = {}) {
    let filePath;
    const aliasMap = alias || vscode.workspace.getConfiguration().get('aliasJump.alias');
    const findPath = function (aliaKey, aliaValue) { // => "@", "/src"
        if (aliaValue.indexOf('/') != 0) aliaValue = '/' + aliaValue; // 兼容老版本 <= 1.0.5

        const prjPath = path.join(rootPath, aliaValue.split('/')[1]);
        if (curFilePath.indexOf(prjPath) === 0) {
            const dir = relPath.split('/').map(item => item === aliaKey ? aliaValue : item).join('/'); // @/a/b/c => /src/a/b/c
            filePath = path.join(rootPath, dir);
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

    return filePath
}

module.exports = utils;