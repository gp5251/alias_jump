# Alias Jump

主要为了解决vscode 不能跳转*alias别名文件*的问题（如‘@/components/componentA’），支持单个项目，或者一个项目中存在多个子项目的情况

默认开启主项目的 @ => 'src‘ 的alias映射

如果存在其他alias，如@pages, @components，或者有多个子项目，则需要额外配置。请参考：

### 配置规则

```js
{
  // 项目目录名
  "aliasJump.projects": [
      "projectA", // 子项目A
      "projectB", // 子项目B
      "projectC", // 子项目C
      "/" // 主项目, 如果没有子项目，则至少要保留主项目
  ],
  // alias映射,映射路径相对于根目录
  "aliasJump.alias": {
      // 多个子项目
      "@": [
          "projectA/src", //子项目A下 @ => /src 的映射
          "projectB/src", // ...
          "projectC/src", // ...
          "/src" // 主项目下 @ => /src 的映射
      ],
      // 单独配置 子项目A, 子项目C 下 @components 到各自 src/components 的映射
      "@components": ["projectA/src/components", "projectC/src/components"],
      // 单独配置 子项目C 下 @pages 到 src/pagges 的映射
      "@pages": "projectC/src/pages"
  }
}
```