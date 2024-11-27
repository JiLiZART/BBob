# @bbob/vue3

[![install size](https://packagephobia.now.sh/badge?p=@bbob/vue3)](https://packagephobia.now.sh/result?p=@bbob/vue3) [![Known Vulnerabilities](https://snyk.io/test/github/JiLiZART/bbob/badge.svg?targetFile=packages%2Fbbob-vue3%2Fpackage.json)](https://snyk.io/test/github/JiLiZART/bbob?targetFile=packages%2Fbbob-vue3%2Fpackage.json)

> Converts @bbob/parser AST tree to Vue 3

```shell
npm i @bbob/vue3 @bbob/preset-vue
```

```js
import { defineComponent } from 'vue'
import VueBbob from '@bbob/vue3';

Vue.use(VueBbob);
```

```html
<template>
  <div class="vue3">
    <h2>Generated vue3 here</h2>
    <bbob-bbcode container="div" :plugins="plugins">{{ bbcode }}</bbob-bbcode>
  </div>
</template>
<script>
  import Vue from 'vue'
  import preset from '@bbob/preset-vue'
  
  export default defineComponent({
    name: 'App',
    data() {
      return {
        bbcode: 'Text [b]bolded[/b] and [i]Some Name[/i]',
        plugins: [
          preset()
        ],
      }
    }
  })
</script>
```
