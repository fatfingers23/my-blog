<script setup lang="ts">
defineProps< {
  codingLanguages: string[]
}>();

const whichPanelToShow = ref(0);

</script>

<template>

  <div class="w-full ">
    <div
      class="tabs tabs-bordered max-w-prose">
      <span
        role="tab"
        :class="[{'tab cursor-pointer': true}, {'tab-active': whichPanelToShow == 0}]"
        @click="() => whichPanelToShow = 0"
      >

        {{codingLanguages[0]}}
      </span>
      <span
        role="tab"
        :class="[{'tab cursor-pointer': true}, {'tab-active': whichPanelToShow == 1}]"
        @click="() => whichPanelToShow = 1"
      >
        {{codingLanguages[1]}}
      </span>
    </div>

    <ContentSlot
      v-if="whichPanelToShow == 0"
      :use="$slots.one"
    />
    <ContentSlot
      v-if="whichPanelToShow == 1"
      :use="$slots.two"
    />
  </div>


</template>

<style scoped>

</style>
