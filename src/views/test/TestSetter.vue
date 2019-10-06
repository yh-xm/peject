<template>
<div id="TestSetter">
    <test-drop-down-box></test-drop-down-box>
    <test-time></test-time>


</div>
</template>
<script>
import TestDropDownBox from '@/components/TestSetter/TestDropDownBox';//试卷下拉框
import TestTime from '@/components/TestSetter/TestTime';//考试时间
export default {
    data(){
        return{

        }
    },
    //定义组件
    components:{
        TestDropDownBox,
        TestTime

    },
    //定义方法
    methods:{

    }
    
}
</script>
<style lang="less" scoped>

</style>