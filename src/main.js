import { createApp } from "vue";
import App from "./App.vue";
import { stateSymbol, createStore } from "./store";
import "./index.css";

createApp(App).provide(stateSymbol, createStore()).mount("#app");
