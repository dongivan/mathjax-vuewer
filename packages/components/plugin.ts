/* eslint-disable @typescript-eslint/no-explicit-any */
import { App, ref } from "vue";
import MathJaxVuewer from "./MathJaxVuewer.vue";

declare global {
  interface Window {
    MathJax: any;
  }
}

type MathJaxOptions = {
  loader?: {
    load?: string[];
    ready?: (name: string) => string | void;
    [name: string]: any;
  };
  tex: {
    packages: {
      [name: string]: any;
    };
    [name: string]: any;
  };
  startup: {
    input?: string[];
    output?: string;
    [name: string]: any;
  };
  [name: string]: any;
};
type MathJaxVuewerPluginOptions = {
  componentName: string;
  script?: string;
  options: MathJaxOptions;
};

async function loadScript(src: string) {
  return new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.async = true;
    script.src = src;

    const el = document.getElementsByTagName("head")[0];
    el.appendChild(script);

    script.addEventListener("load", () => {
      resolve();
    });

    script.addEventListener("error", () => {
      reject(new Error(`${src} failed to load.`));
    });
  });
}

const refIsMathJaxLoaded = ref(false);

async function loadMathJax(src?: string, options?: MathJaxOptions) {
  /* 
  MathJax is loaded if `MathJax.config` is set.
  see [link: http://docs.mathjax.org/en/latest/web/configuration.html#configuring-mathjax-after-it-is-loaded].
  */
  if (window.MathJax?.config) {
    refIsMathJaxLoaded.value = true;
    return Promise.resolve();
  }

  const ready = function () {
    if (window.MathJax.startup?.defaultReady) {
      window.MathJax.startup.defaultReady();
    }
    refIsMathJaxLoaded.value = true;
  };

  const _options = { ...window.MathJax, ...options };
  if (!_options.startup) {
    _options.startup = {};
  }
  if (typeof _options.startup.ready == "function") {
    const oldReady = _options.startup.ready;
    _options.startup.ready = () => {
      oldReady();
      ready();
    };
  } else {
    _options.startup.ready = ready;
  }
  _options.startup.typeset = false;

  window.MathJax = {
    ...window.MathJax,
    ..._options,
  };
  if (src) {
    return loadScript(src);
  } else {
    return Promise.resolve();
  }
}

let mathJaxInited = false;

async function install(app: App, options?: MathJaxVuewerPluginOptions) {
  app.component(options?.componentName || "MathJaxVuewer", MathJaxVuewer);
  if (!mathJaxInited) {
    await loadMathJax(options?.script, options?.options);
    mathJaxInited = true;
  }
}

export { install, refIsMathJaxLoaded };
