import { computed, CSSProperties, ref } from "vue";
import { streamIds } from ".";

export type Layout = "grid" | "vertical" | "horizontal";
export const layout = ref<Layout>("grid");

export const layoutStyle = computed(() => {
  console.log("computing layoutStyle");
  const map: { [k in Layout]: () => CSSProperties } = {
    grid() {
      const count = streamIds.value.length;
      const gridTemplateRows = Array(Math.ceil(Math.sqrt(count)))
        .fill("1fr")
        .join(" ");

      const gridTemplateColumns = count
        ? Array(Math.ceil(count / Math.ceil(Math.sqrt(count))))
            .fill("1fr")
            .join(" ")
        : "";

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
