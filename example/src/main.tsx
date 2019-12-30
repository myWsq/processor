import React from "react";
import ReactDOM from "react-dom";
import Vue from "vue";
// @ts-ignore
import ReactApp from "./App.tsx";
// @ts-ignore
import VueApp from "./App.vue";
import './style';

ReactDOM.render(<ReactApp />, document.getElementById("react-root"));
new Vue({
  render: h => h(VueApp)
}).$mount("#vue-root");
