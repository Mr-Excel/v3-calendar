<script>
import { defineComponent } from "vue";
import V3Calendar from "@/v3-calendar.vue";

export default defineComponent({
  name: "ServeDev",
  components: {
    V3Calendar,
  },
  setup() {
    const test = (v) => {
      console.log(v);
    };
    return {
      test,
    };
  },
});
</script>

<template>
  <v3-calendar
    width="800px"
    type="events"
    @onClick="test"
    :data="[
      { id: 1, title: 'test', date: '2022-03-12' },
      { id: 2, title: 'test # 2', date: '2022-03-12' },
    ]"
  />
</template>
