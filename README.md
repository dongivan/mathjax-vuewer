# mathjax-vuewer

A Vue component which could render MathML / LaTeX codes by MathJax.

Based on Vue 3.2 & MathJax 3.

[[中文](./README_zhCN.md)]

## Demo
[formular](https://dongivan.github.io) uses this component to render expressions. You can see more details if you visit the link on a wide enough screen (width more than 540px).

## Installation
```bash
npm install @dongivan/mathjax-vuewer --save
```

## Usage
Firstly, register the component as a Vue plugin.
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

Then, use it in your template.
```html
<template>
  <MathJaxVuewer :content="content" source-format="tex" target-format="html" />
</template>
```

### Plugin Options
| Key | Type | Default | Description |
|:---:|:----:|:-------:|:------------|
| componentName | string | "MathJaxVuewer" | The component name used in template |
| script | string | undefined | The url of MathJax script. If it is not set, you should load mathjax script by yourself (use \<script> for example). |
| options | Object | undefined | The options needed by MathJax when it initializes. If it is not set, you should write the config object(`window.MathJax`) to initialize the MathJax. 

### Component Props
| Prop | Type | Default | Description |
|:----:|:----:|:-------:|:------------|
| content | string | required | The source content of expression. If you want to use a MathMLElement tree as content, you should render the MathMLElement tree as string first(use `ele.outerHTML` for example). |
| source-format | "mml" \| "mathml" \| "latex" \| "tex" | "tex" | The source format of expression. "mml" and "mathml" both mean using MathMLElement; "latex" and "tex" both mean using LaTex |
| target-format | "html" \| "chtml" \| "svg" | "chtml" | The target format of expression. "html" and "chtml" both mean that the result will be rendered as html, and "svg" means that the result will be SVG. |
| display | boolean | false | `display` will be used when MathJax renders the content while `source-format` is set to "tex"(or "latex"). The result would be a inline element if `display == false`, or a block element if `display == true`. When `source-format` is set to "mml"(or "mathml"), this prop will not be used (You should set an attribute named `display` and valued `block` of the root node of the MathMLElement tree if you want MathJax to render it as a block element). |

### Events emitted
| Event | Description |
|:-----:|:------------|
| math-jax-loaded | The component will detect whether the MathJax is loaded and emit this event after that. And the component WILL NOT render the `content` before this event emitted. |


## More
### Load MathJax script while registering plguin vs Load MathJax manually
MathJax is designed for render the whole page, and it will read the global variable `window.MathJax` and modify it when initializing. MathJaxVuewer will inject a `ready()` function (see [here](http://docs.mathjax.org/en/latest/web/configuration.html#configuring-mathjax-after-it-is-loaded)) into the `window.MathJax.startup` in order to know whether MathJax is ready, and this must be done before MathJax read `window.MathJax`.
That means, if you load MathJax manually (which means you leave `script` and `options` of the plugin option to `undefined`), things would be complicated: MathJax may read and modify `window.MathJax` before the `ready()` function is injected. In this situation, the component will test whether `window.MathJax.config` exists -- and emit "math-jax-loaded" if it does. However, even `window.MathJax.config` was set, the MathJax may not be ready at once, and the component may throw an error because it cannot find the render function like `tex2svgPromise()` before MathJax initialized.

### Multiple components
You should load all MathJax components which used by MathJaxVuewer in the `window.MathJax` options (or plugin option). For example, you have two MathJaxVuewer components, one is used to render LaTeX to html, and the other renders MathMLElement to SVG, then you should have an options like this:
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
Be careful, the `options.startup.output` is important. Please set it correctly, or the component may throw an error that it cannot find the render function.
