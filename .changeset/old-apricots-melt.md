---
"@bbob/cli": major
"@bbob/core": major
"@bbob/html": major
"@bbob/parser": major
"@bbob/plugin-helper": major
"@bbob/preset": major
"@bbob/preset-html5": major
"@bbob/preset-react": major
"@bbob/preset-vue": major
"@bbob/react": major
"@bbob/vue2": major
"@bbob/vue3": major
---

# Vue3 support

Now you can use `@bbob` parser in `vue3`

Example usage 

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
  import { defineComponent } from 'vue'
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
