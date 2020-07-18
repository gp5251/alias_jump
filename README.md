# alias-jump

主要为了解决在项目中因定义alias（如‘@’）导致文件之间不能跳转的问题，支持一个目录一个项目，以及一个目录中存在多个子项目的情况。

默认开启单项目 @ => 'src‘ 的alias映射

如果存在其他alisa，如@pages, @components，或者有多个项目，则需要单独配置

### 配置规则

`cmd+,`打开配置项，找到aliasJump配置组,参考如下配置。

```json
{
  // 子项目目录名，没有则留空
  "aliasJump.projects": [
      "projectA",
      "projectB",
      "projectC"
  ],
  // alias映射,映射路径相对于根目录
  "aliasJump.alias": {
      // 多个子项目
      "@": [
          "projectA/src",
          "projectB/src",
          "projectC/src"
      ],
      // 配置单个项目，如这里只配置 projectC 下 @pages 到 src/pagges 的alias映射
      "@pages": "projectC/src/pages"
  }
}
```