<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
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

<script>
import Vue from 'vue'
import preset from '@bbob/preset-vue'
import MyTag from './MyTagComponent'

const myPreset = preset.extend(defTags => ({
  ...defTags,
  // bbcode tags always lowercased
  mytag: (node) => ({
    ...node,
    tag: MyTag,
  })
}))

export default Vue.extend({
  name: 'App',
  data() {
    return {
      bbcode: 'Text [b]bolded[/b] and [myTag]Some Name[/myTag]',
      plugins: [
        myPreset()
      ],
    }
  }
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;

  width: 700px;
  margin: 60px auto 0;
}

.data {
  display: flex;
  justify-content: space-between;
}

.bbcode,
.html {
  border: 1px solid #ccc;
  width: 300px;
}
</style>
