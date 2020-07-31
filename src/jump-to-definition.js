/**
 * 跳转到定义
 */
const vscode = require('vscode');
const path = require('path');
const fs = require('fs');
const { getRootPath, getFilePath } = require('../utils')

function provideDefinition(document, position, token) {
    const curFilePath = document.fileName;
    const line        = document.lineAt(position);
    const rootPath    = getRootPath(curFilePath);
    const exp         = /\brequire\((['"])(@[^'"]+?)\1\)|\bfrom\s+(['"])(@[^'"]+?)\3/;
    const match       = line.text.match(exp);

    if (match) {
        const relPath = match[2] || match[4];                         // @/a/b/c
        const fPath   = getFilePath(curFilePath, relPath, rootPath);

        if (!fPath) return;

        const ext = path.parse(fPath).ext;
        let filePath;
        let found;
        if (ext) {
            found = fs.existsSync(fPath);
            if (found) filePath = fPath;
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
