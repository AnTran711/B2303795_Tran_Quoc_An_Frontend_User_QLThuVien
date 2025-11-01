<script setup>
  const modelValue = defineModel();

  const props = defineProps({
    length: Number
  })

</script>

<template>
  <div
    v-show="props.length > 1"
    class="text-center mt-12"
  >
    <v-pagination
      v-model="modelValue"
      active-color="primary"
      :length="props.length"
      :total-visible="7"
    />
  </div>
</template>