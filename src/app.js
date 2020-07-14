
import Vue from 'vue/dist/vue.esm';
import router from './routes/router.js';
import App from './app.vue';

const app = new Vue({
    router,
    components:{App},
    render:h=>h(App)
  }).$mount('#app')

