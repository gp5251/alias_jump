const vscode = require('vscode');
const path = require('path');
const utils = {}

utils.getCurPrj = function (curFilePath, rootPath) {
    let curPrjName;
    let curPrjPath;
    const projects = vscode.workspace.getConfiguration().get('aliasJump.projects');

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

module.exports = utils;