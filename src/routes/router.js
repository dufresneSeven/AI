
const Foo = {template:'<div>foo</div>'}

const router = [{
    path:'/foo',
    component:Foo
}]

const Router = new VueRouter({
    router
})

export default Router;