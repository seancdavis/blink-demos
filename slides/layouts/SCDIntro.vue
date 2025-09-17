<template>
  <div class="slidev-layout layout-scd-intro">
    <div class="content">
      <div class="head">
        <div class="name">
          <slot />
          <span class="title">
            <slot name="title" />
          </span>
        </div>
        <div class="image">
          <slot name="image" />
        </div>
      </div>
      <div class="links">
        <slot name="links" />
      </div>
    </div>
  </div>
</template>
