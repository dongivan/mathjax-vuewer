<template>
  <div class="wrapper">
    <textarea v-model="refSource" class="container border" />
    <div class="container text-right">
      <label>
        <input v-model="refDisplay" type="checkbox" />display mode
      </label>
    </div>
    <div class="container border">
      <MathJaxVuewer
        :content="refSource"
        source-format="tex"
        target-format="html"
        :display="refDisplay"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import MathJaxVuewer from "../packages/components/MathJaxVuewer.vue";

const refDisplay = ref(true);
const refSource = ref(
  "\\Phi{_{\\mu,\\sigma}} (x) = \\int_{-\\infty}^x \\frac{1}{\\sqrt{2\\pi\\sigma}} e^{-\\frac{(t-\\mu)^2}{2\\sigma^2}} dt"
);
</script>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.container {
  width: 50vw;
  min-height: 10vh;
  margin: 5px;
}

.border {
  border: 1px solid black;
}

.text-right {
  text-align: right;
}
</style>
