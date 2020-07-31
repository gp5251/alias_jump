const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const { getRootPath } = require('../utils');

function provideCompletionItems(document, position, token, context) {
    const curFilePath     = document.fileName;
    const rootPath        = getRootPath(curFilePath);
    const line            = document.lineAt(position);
    const lineText        = line.text.substring(0, position.character);
    const aliasMap        = vscode.workspace.getConfiguration().get('aliasJump.alias');
    const completionItems = []

    Object.keys(aliasMap).forEach(aliasKey => {
        const getCompletion = function (aliasValue, aliasPath, subPath = '') {
            if (aliasValue.indexOf('/') != 0) aliasValue = '/' + aliasValue; // 兼容老版本 <= 1.0.5

            const prjPath = path.join(rootPath, aliasValue.split('/')[1]);
            if (curFilePath.indexOf(prjPath) === 0) {
                const dir = aliasPath.split('/').map(item =>  item === aliasKey ? aliasValue : item).join('/'); // @/a/b/c => src/a/b/c
                const files = fs.readdirSync(path.join(rootPath, dir, subPath))
                files.forEach(file => {
                    completionItems.push(new vscode.CompletionItem(file, vscode.CompletionItemKind.Field))
                })
            }
        }
        
        const exp = new RegExp('(' + aliasKey + ')((?:/\\w+)+)?/$');
        const match = lineText.match(exp);
        if (match) {
            const alias = aliasMap[aliasKey]
            if (Array.isArray(alias)) {
                alias.forEach(item => getCompletion(item, match[1], match[2]))
            } else {
                getCompletion(alias, match[1])
            }
        }
    });

    return completionItems;
}

/**
 * 光标选中当前自动补全item时触发动作，一般情况下无需处理
 * @param {*} item 
 * @param {*} token 
 */
function resolveCompletionItem(item, token) {
    return null;
}

module.exports = function (context) {
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider(['javascript', 'vue'], {
        provideCompletionItems,
        resolveCompletionItem
    }, '/'));
};
