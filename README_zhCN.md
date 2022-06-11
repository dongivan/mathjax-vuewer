# mathjax-vuewer

使用MathJax渲染 MathML / LaTeX 的 Vue 控件。

基于 Vue 3.2 与 MathJax 3 。

[[Eng](./README.md)]

## Demo
[formular](https://dongivan.github.io) 在渲染表达式时使用了这个控件。在足够宽的屏幕（宽度不低于540px）上可以获得更多细节。

## 安装
```bash
npm install @dongivan/mathjax-vuewer --save
```

## 使用
首先在 Vue 中注册为插件。
```ts
import MathJaxVuewer from "@dongivan/mathjax-vuewer"
import { createApp } from "vue";

const app = createApp(...);
app.use(MathJaxVuewer, {
  componentName: ...,
  script: ...,
  options: ...,
})
```

然后在模板中使用。
```html
<template>
  <MathJaxVuewer :content="content" source-format="tex" target-format="html" />
</template>
```

### 插件选项
| 键 | 类型 | 默认值 | 说明 |
|:---:|:----:|:-------:|:------------|
| componentName | string | "MathJaxVuewer" | 控件在模板中使用的名称 |
| script | string | undefined | MathJax 脚本的 URL 地址。如果未设置，你需要自行载入MathJax脚本（例如使用 \<script>）。 |
| options | Object | undefined | MathJax 初始化时所使用的参数。如果未设置，你需要编写一个配置对象 (`window.MathJax`) 以备 MathJax 进行初始化。

### 组件 Props
| Prop | 类型 | 默认值 | 说明 |
|:----:|:----:|:-------:|:------------|
| content | string | 必须 | 表达式的源内容。如果你的源内容的形式是一个 MathMLElement 树，你需要先将其渲染为字符串格式（例如使用 `ele.outerHTML`）。 |
| source-format | "mml" \| "mathml" \| "latex" \| "tex" | "tex" | 表达式源格式。"mml"与"mathml"均表示格式为 MathMLElement；"latex"与"tex"均表示格式为LaTeX。 |
| target-format | "html" \| "chtml" \| "svg" | "chtml" | 表达式的目标格式。"html"与"chtml"均表示结果被渲染为html，而"svg"表示结果被渲染为SVG。 |
| display | boolean | false | `display` 参数仅在 `source-format` 被设置为"tex"（或"latex"）时起作用。如果 `display == false`，那么目标将被渲染为一个行内元素；否则，结果将被渲染为一个块元素。如果 `source-format` 被设置为"mml"（或"mathml"），这个 prop 不会起作用（如果此事你希望 MathJax 将 MathMLElement 树渲染为块元素，请在这个树的根元素上添加一个名为 `display` 、值为 `block` 的属性）。 |

### 事件
| 事件名 | 说明 |
|:-----:|:------------|
| math-jax-loaded | 组件将检测 MathJax 是否载入，并在其载入后发出此事件。组件在发出此事件之间不会执行渲染 `content` 的操作。 |


## 更多
### 在注册插件时载入 MathJax 脚本，还是手动载入 MathJax 脚本
MathJax 一般用来渲染整个页面，它会在初始化时读取 `window.MathJax` 并改变该对象。为了检测 MathJax 是否已经初始化完毕，MathJaxVuewer 会在 `window.MathJax.startup` 中插入一个 `ready()` 函数（参见 [这里](http://docs.mathjax.org/en/latest/web/configuration.html#configuring-mathjax-after-it-is-loaded)），而且这个插入函数的行为需要在 MathJax 读取 `window.MathJax` 之前完成。这意味着如果手动载入 MathJax 脚本（此时插件选项 `script` 和 `options` 被设置为 `undefined` ），事情就会变得复杂：在 `ready()` 函数被插入之间，MathJax 有可能就已经读取并改变了 `window.MathJax` 对象。在这种情况下，组件只能检测 `window.MathJax.config` 对象是否存在——并且在其存在的时候发出 "math-jax-loaded" 事件。但是，即使 `window.MathJax.config` 已经存在了，MathJax 也不一定已经完全初始化，那么组件就有可能会抛出异常，因为它在 MathJax 初始化完毕前没有办法使用渲染函数（如 `tex2svgPromise()` ）。

### 同页面多个组件
你需要在 `window.MathJax` （或者插件选项）中将所有 MathJaxVuewer 需要的 MathJax 组件全部载入。例如，你有两个 MathJaxVuewer 组件，一个用来将 LaTeX 渲染为 html，另一个用来将 MathMLElement 渲染为 SVG，那么你需要设置一个类似这样的选项：
```ts
{
  loader: {
    load: ["input/tex-base", "input/mml", "output/chtml", "output/svg", "[tex]/html"],
  },
  tex: {
    packages: {
      "[+]": ["base"],
    },
  },
  startup: {
    output: ["chtml", "svg"],
  },
}
```
注意，`options.startup.output` 非常重要。请一定要正确设置这个参数，否则组件可能会抛出一个无法找到渲染函数的异常。
