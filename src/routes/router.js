import  Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

const Foo = {name:'Foo',template:'<div>foo</div>'}
const Hw ={template:'<div>这里是hw</div>'}
const routes = [{
    path:'/foo',
    component:Foo
},
{
    path:'/hw',
    component:Hw
},
]
const appRouter = new VueRouter({
    routes
})

export default appRouter;