// import Vue from 'vue/dist/vue.esm';
// import router from './routes/router.js';
// import App from './app.vue';

// const app = new Vue({
//     router,
//     components:{App},
//     render:h=>h(App)
//   }).$mount('#app')

function activeObj(obj){
  var type = Object.prototype.toString.call(obj).slice(8,-1);
  console.log(type)
}
activeObj(x)