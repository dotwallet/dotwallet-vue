import Login from './src/components/Login.vue';
import Pay from './src/components/Pay.vue';
import _vue from 'vue';

const components = [Login, Pay];

for (const component of components) {
  component.install = Vue => {
    if (!Vue) {
      window.Vue = Vue = _vue;
    }
    Vue.component(component.name, component);
  };
}

// Login.install = Vue => {
//   if (!Vue) {
//     window.Vue = Vue = _Vue;
//   }
//   Vue.component(Login.name, Login);
// };

export { Login as DotwalletLogin };
export { Pay as DotwalletPay };

// export default Login;
