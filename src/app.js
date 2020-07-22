
import deepClone from './utils/tool.js'


// class Observe{
//   constructor(obj){
//     var keys = Object.keys(obj);
//     for(var i=0;i<keys.length;i++){
//       defineReactive(obj,keys[i]);
//     }
//   }
// }

// function defineReactive(obj,prop){
//   let value = obj[prop]
//   Object.defineProperty(obj,prop,{
//     configurable:true,
//     enumerable:true,
//     get(){
//       console.log('获取属性:',prop)
//       return value
//     },
//     set(val){
//       console.log('重新设值:',val)
//       value = val;
//     }
//   })
// }

// var car = {brand:'greely',price:300};
// new Observe(car)
// car.price = 5000;
// console.log(car)

// class Watcher{
//   constructor(obj,prop,computed,callback){

//   }
// }

// class Dep{
//   constructor(){
//     this.deps=[]
//   }
//   getDeps(){
//     if(Dep.target){
//       this.deps.push(Dep.target);
//       Dep.target = null;
//     }
//   }
//   notify(){
//     this.deps.forEach(fn=>{
//       fn();
//     })
//   }
// }


// import Vue from 'vue/dist/vue.esm';
// import router from './routes/router.js';
// import App from './app.vue';

// const app = new Vue({
//     router,
//     components:{App},
//     render:h=>h(App)
//   }).$mount('#app')

// function Observe(obj){
//   let type = obj ? Object.prototype.toString.call(obj).slice(8,-1):""
//   if(type === 'Array' || type === 'Object'){
//     let keys = Object.keys(obj);
//     for(let i=0;i<keys.length;i++){
//       defineActivePro(obj,keys[i])
//     }
//   }
// }

// function defineActivePro(obj,key){
//   let val = obj[key]
//   Object.defineProperty(obj,key,{
//     configurable:true,
//     enumerable:true,
//     get(){
//       console.log('获取到属性值为:'+val);
//       return val
//     },
//     set(value){
//       console.log('设置值为:'+value);
//       console.log(`${key}:${value}`);
//       val = value;
//     }
//   })
// }



// var car = {brand:'geely',price:3000}
// Observe(car)
// car.price = 5000;
// var x =car.price;
// console.log(car)