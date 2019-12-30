import React, { createElement } from "react";
import ReactDOM from "react-dom";
// @ts-ignore
import ReactApp from "./App.tsx";
window.React = React;

ReactDOM.render(createElement(ReactApp), document.getElementById("react-root"));

import Vue from "vue";
// @ts-ignore
import VueApp from "./App.vue";
import VueCompositionAPI from "@vue/composition-api";
import "./style";

Vue.use(VueCompositionAPI);

new Vue({
  render: h => h(VueApp)
}).$mount("#vue-root");
