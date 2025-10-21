<template>
  <div class="slidev-layout layout-code-comparison w-full h-full">
    <div class="col-header">
      <slot />
    </div>
    <div class="comparison">
      <div class="col-left">
        <slot name="left" />
      </div>
      <div class="col-right">
        <slot name="right" />
      </div>
    </div>
  </div>
</template>
