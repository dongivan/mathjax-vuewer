import { createApp } from "vue";
import App from "./App.vue";
import MathJaxVuewer from "../packages";

const app = createApp(App);
app.use(MathJaxVuewer, {
  script: "https://cdnjs.cloudflare.com/ajax/libs/mathjax/3.2.1/es5/startup.js",
  options: {
    loader: {
      load: ["input/tex-base", "input/mml", "output/chtml", "[tex]/html"],
    },
    tex: {
      packages: {
        "[+]": ["base"],
      },
    },
    startup: {
      output: ["chtml"],
    },
  },
});
app.mount("#app");
