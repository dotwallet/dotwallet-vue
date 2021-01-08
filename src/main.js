import Vue from 'vue';
import App from './App.vue';

// uncomment to use staging api
// process.env.DOT_ENV = 'dot-development';

new Vue({
  el: '#app',
  render: h => h(App),
});
