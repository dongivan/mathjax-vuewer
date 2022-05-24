<template>
  <div ref="refContainer"></div>
</template>

<script lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { refIsMathJaxLoaded } from "./plugin";
const MATH_JAX_LOADED_EVENT = "math-jax-loaded";

export default {};
</script>

<script setup lang="ts">
const props = defineProps({
  sourceFormat: {
    type: String,
    default: "tex",
    validator(val: string) {
      return ["mml", "mathml", "latex", "tex"].includes(val.toLowerCase());
    },
  },
  targetFormat: {
    type: String,
    default: "chtml",
    validator(val: string) {
      return ["html", "chtml", "svg"].includes(val.toLowerCase());
    },
  },
  content: { type: String, required: true },
  display: { type: Boolean, default: false },
});
const emit = defineEmits([MATH_JAX_LOADED_EVENT]);

const refSourceFormat = computed(() => props.sourceFormat.toLowerCase())
const refTargetFormat = computed(() => props.targetFormat.toLowerCase())

const refMathJaxFunctionName = computed(() => {
  const source =
    {
      mml: "mathml",
      latex: "tex",
    }[refSourceFormat.value] || refSourceFormat.value;
  const target =
    {
      html: "chtml",
    }[refTargetFormat.value] || refTargetFormat.value;
  return `${source}2${target}Promise`;
});

watch(
  refIsMathJaxLoaded,
  (loaded) => {
    if (loaded) {
      emit(MATH_JAX_LOADED_EVENT);
    }
  },
  { immediate: true }
);

const refIsMounted = ref(false);
const refContainer = ref();
onMounted(() => {
  refIsMounted.value = true;
});

watch(
  [() => props.content, () => props.display, refIsMounted, refIsMathJaxLoaded],
  async ([content, display, isMounted, isMathJaxLoaded]) => {
    if (!isMounted || !isMathJaxLoaded) {
      return;
    }
    const MathJax = window.MathJax,
      MathJaxFunction = MathJax[refMathJaxFunctionName.value];
    if (typeof MathJaxFunction == "function") {
      const el = refContainer.value;
      el.innerHTML = "";
      MathJax.texReset();
      const options = MathJax.getMetricsFor(el) as { display: boolean };
      options.display = display;
      el.appendChild(await MathJaxFunction(content, options));
      MathJax.startup?.document?.clear();
      MathJax.startup?.document?.updateDocument();
    } else {
      throw new Error(
        `MathJax function \`${refMathJaxFunctionName.value}\` does not exist.`
      );
    }
  }
);
</script>
