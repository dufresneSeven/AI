<template>
    <div>
        <div>
            {{titles[4]}}
        </div>
        <router-view></router-view>
    </div> 
</template>
<script>
export default {
    name:'App',
    data(){
        return {
            titles:[1,2,3,4,5]
        }
    },
    mounted(){
        this.titles.forEach(item=>item+1);
    }
}
</script>