<template>
  <chart
    :height="height"
    :width="width"
    :links="links"
    :nodes="nodes"
  >
  </chart>
</template>

<script>
import chart from './chart/chart.vue';

export default {
  props: [
    'height',
    'width',
    'links',
    'nodes',
  ],
  components: {
    'chart': chart,
  }
}
</script>
