import Login from './src/components/Login.vue';
import _vue from 'vue';

Login.install = Vue => {
  if (!Vue) {
    window.Vue = Vue = _Vue;
  }
  Vue.component(Login.name, Login);
};

export { Login as DotwalletLogin };
export default Login;
