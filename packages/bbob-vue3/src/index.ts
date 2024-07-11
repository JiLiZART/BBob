import type { App } from "vue";
import Component from "./Component";

export { render } from "./render";
export { Component };

export default function VueBbob(app: App): any {
  app.component("bbob-bbcode", Component);

  return app
}
