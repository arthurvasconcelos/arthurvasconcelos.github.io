import mitt, { Emitter } from "mitt";
import { App } from "vue";
const eventBus = mitt();

interface EventBusPluginOptions {
  global: boolean;
  inject: boolean;
}

const defaultOptions: EventBusPluginOptions = {
  global: true,
  inject: true
};

function install(app: App, options: Partial<EventBusPluginOptions>): Emitter {
  const opt: EventBusPluginOptions = {
    ...defaultOptions,
    ...options
  };

  if (opt.global) {
    app.config.globalProperties.$eventBus = eventBus;
  }

  if (opt.inject) {
    app.provide("eventBus", eventBus);
  }

  return eventBus;
}

declare module "@vue/runtime-core" {
  export interface ComponentCustomProperties {
    $eventBus: Emitter;
  }
}

export default { install };
export const bus = eventBus;
