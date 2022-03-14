<template>
  <Calendar width="700px" :data="dt" />
  <hr />
  <Test />
</template>

<script>
import Calendar from "./components/Calendar.vue";
import Test from "./test";
export default {
  name: "App",
  components: {
    Calendar,
    Test,
  },
  setup() {
    const dt = [
      {
        id: "1",
        title: "testing",
        start: "16:30",
        end: "17:30",
        date: "2022-03-15",
      },
      {
        id: "2",
        title: "testing !",
        date: "2022-03-15",
        start: "16:30",
        end: "17:30",
      },
      {
        id: "3",
        title: "testing",
        date: "2022-03-11",
        start: "11:30",
        end: "12:00",
      },
      {
        id: "4",
        title: "testing",
        date: "2022-03-01",
        start: "12:30",
        end: "13:30",
      },
    ];
    return {
      dt,
    };
  },
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
