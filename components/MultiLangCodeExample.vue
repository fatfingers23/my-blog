<script setup lang="ts">
defineProps< {
  codingLanguages: string[]
}>();

const whichPanelToShow = ref(0);

</script>

<template>

  <div class="w-full md:w-1/2">
    <div
      role="tablist"
      class="tabs tabs-bordered">
      <span
        role="tab"
        :class="[{'tab cursor-pointer': true}, {'tab-active': whichPanelToShow == 0}]"
        @click="() => whichPanelToShow = 0"
      >

        {{codingLanguages[0]}}
      </span>
      <div
        role="tabpanel"
        :class="[{'tab-content': true}, {'block': whichPanelToShow == 0}]">
        <ContentSlot
          :use="$slots.one"
        /></div>

      <span
        role="tab"
        :class="[{'tab cursor-pointer': true}, {'tab-active': whichPanelToShow == 1}]"
        @click="() => whichPanelToShow = 1"
      >
        {{codingLanguages[1]}}
      </span>
      <div
        role="tabpanel"
        :class="[{'tab-content': true}, {'block': whichPanelToShow == 1}]">
        <ContentSlot
          :use="$slots.two"
        />
      </div>

    </div>
  </div>

</template>

<style scoped>

</style>
