/**
 * 插件被激活时触发，所有代码总入口
 */
exports.activate = function(context) {
    require('./jump-to-definition')(context); // 跳转到定义
    require('./completion')(context); // 自动补全
};