<svelte:options customElement="bb-avatar" />

<script>
  let name = 'bb avatar';
</script>

<style>
    .tag {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        color: black;
        background: #ccc;
        border-radius: 6px;
        padding: 2px 4px;
    }

    .avatar {
        margin-right: 8px;
        display: inline-block;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: teal;
    }
</style>

<span class="tag"><span class="avatar"/><slot /></span>
