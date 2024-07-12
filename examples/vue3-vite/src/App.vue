<script setup lang="ts">
import preset from '@bbob/preset-vue'
import Avatar from "./components/Avatar.vue";

const myPreset = preset.extend(defTags => ({
  ...defTags,
  // bbcode tags always lowercased
  avatar: (node) => ({
    ...node,
    tag: Avatar,
  })
}))

const bbcode = 'Text [b]bolded[/b] and [avatar]Some Name[/avatar]'
const plugins = [
  myPreset()
]
</script>

<template>
  <div id="app">
    <div>
      <a href="https://vitejs.dev" target="_blank">
        <img src="/vite.svg" class="logo" alt="Vite logo" />
      </a>
      <a href="https://vuejs.org/" target="_blank">
        <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
      </a>
    </div>
    <div class="data">
      <div class="bbcode">
        <h2>Raw BB Code here</h2>
        <textarea name="bbcode" id="bbcode" cols="30" rows="10" v-model="bbcode"></textarea>
      </div>
      <div class="html">
        <h2>Generated HTML here</h2>
        <bbob-bbcode container="div" :plugins="plugins">{{ bbcode }}</bbob-bbcode>
      </div>
    </div>
    <pre class="code"></pre>
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
