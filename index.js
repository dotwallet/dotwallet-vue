import Login from './src/components/Login.vue';
import Pay from './src/components/Pay.vue';
import AutoPay from './src/components/AutoPay.vue';
import _vue from 'vue';

const components = [Login, Pay, AutoPay];

export default {
  install(Vue) {
    for (const component of components) {
      if (!Vue) {
        window.Vue = Vue = _vue;
      }
      Vue.component(component.name, component);
    }
  },
};

export { Login as DotwalletLogin };
export { Pay as DotwalletPay };
export { AutoPay as DotwalletAutopay };
