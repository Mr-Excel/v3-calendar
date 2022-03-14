import { ref, h } from "vue";

export default {
  props: {
    msg: {
      type: String,
      default: "Yes",
    },
  },
  setup(props) {
    const count = ref(1);

    // return the render function
    return () => h("div", props.msg + count.value);
  },
};
