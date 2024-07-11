<template>
  <span class="my-tag"><span class="avatar"/> <slot></slot></span>
</template>

<script lang="ts">
export default {
  name: "MyTag"
}
</script>

<style scoped>
.my-tag {
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
