<script lang="ts">
  import svelteLogo from './assets/svelte.svg'
  // import viteLogo from '/vite.svg'
  import './lib/Avatar.svelte';

  import preset from '@bbob/preset-html5'
  import html from '@bbob/html'

  const myPreset = preset.extend(defTags => {
    return ({
      ...defTags,
      avatar: (node) => {
        return ({
          ...node,
          tag: 'bb-avatar',
        })
      }
    })
  });

  let input = 'Text [b]bolded[/b] and [avatar]Some Name[/avatar]'
  let bbcode = html(input, myPreset())
</script>

<main>
  <div>
    <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
      <img src="/vite.svg" class="logo" alt="Vite Logo" />
    </a>
    <a href="https://svelte.dev" target="_blank" rel="noreferrer">
      <img src={svelteLogo} class="logo svelte" alt="Svelte Logo" />
    </a>
  </div>
    <div class="data">
        <div class="bbcode">
            <h2>Raw BB Code here</h2>
            <textarea name="bbcode" id="bbcode" cols="30" rows="10" bind:value={input}></textarea>
        </div>
        <div class="html">
            <h2>Generated HTML here</h2>
            <div>{@html bbcode}</div>
        </div>
    </div>
</main>

<style>
  .logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 300ms;
  }
  .logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
  }
  .logo.svelte:hover {
    filter: drop-shadow(0 0 2em #ff3e00aa);
  }
</style>
