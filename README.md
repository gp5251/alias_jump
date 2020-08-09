# Alias Jump

主要为了解决vscode 不能跳转*alias别名文件*的问题（如‘@/components/componentA’），支持单个项目，或者一个项目中存在多个子项目的情况

默认开启 @ => 'src‘ 的alias映射

如果存在其他alias，如@pages, @components，或者有多个子项目，则需要额外配置。请参考：

### 配置规则

```js
{
  // alias映射, 映射路径相对于主项目根目录
  "aliasJump.alias": {
      // 多个子项目使用数组配置
      "@": [
          "/projectA/src", //子项目A下 @ => /src 的映射
          "/projectB/src", // ...
          "/projectC/src", // ...
          "/src" // 主项目下 @ => /src 的映射
      ],
      // 配置 子项目A, 子项目C 下 @components 到各自 src/components 的映射
      "@components": ["/projectA/src/components", "/projectC/src/components"],
      // 单独配置 子项目C 下 @pages 到 src/pagges 的映射
      "@pages": "/projectC/src/pages"
  }
}
```

Mainly to solve the problem that vscode cannot jump to a *alias file* (such as ‘@/components/componentA’), to support a single project, or there are multiple sub-projects in a project

By default @ =>'src' alias mapping is enabled

If there are other aliases, such as @pages, @components, or multiple sub-projects, additional configuration is required. Please refer to:

```js
{
  // alias map, the path is relative to the root path
  "aliasJump.alias": {
      // use array to config multi projects
      "@": [
          "/projectA/src", // @ => /src in project A
          "/projectB/src", // ...
          "/projectC/src", // ...
          "/src" // @ => /src in main project
      ],
      // @components => src/components in project A and C
      "@components": ["/projectA/src/components", "/projectC/src/components"],
      // @pages => src/pagges in just project C
      "@pages": "/projectC/src/pages"
  }
}
```