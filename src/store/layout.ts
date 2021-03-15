import { computed, CSSProperties, ref } from "vue";
import { streamIds } from ".";

export type Layout = "grid" | "vertical" | "horizontal";
export const layout = ref<Layout>("grid");

export const layoutStyle = computed(() => {
  const map: { [k in Layout]: () => CSSProperties } = {
    grid() {
      const count = streamIds.value.length;
      const gridTemplateRows = `repeat(${Math.ceil(
        count / Math.ceil(Math.sqrt(count))
      )},1fr)`;
      const gridTemplateColumns = `repeat(${Math.ceil(Math.sqrt(count))},1fr)`;

      return {
        gridTemplateRows,
        gridTemplateColumns,
      };
    },
    vertical() {
      return {};
    },
    horizontal() {
      return {
        gridAutoFlow: "column",
      };
    },
  };

  return map[layout.value]();
});
