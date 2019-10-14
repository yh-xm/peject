<template>
  <div>
    <el-select
      v-model="classId"
      filterable
      
      ref="txtClass"
      @change="handleChange"
    >
    <el-option :key="0" label="请选择班级" v-model="ovalue"	></el-option>
      <el-option
        v-for="item in options"
        :key="item.classId"
        :label="item.className"
        :value="item.classId">
      </el-option>
    </el-select>
  </div>
</template>
<script>
  export default {
    name:"classNameSelect",
    model:{
      prop:'classSe',//班级对象，使用v-model，给这个属性赋值
      event:'change',//触发事件，名称可自定义，作用：触发这个事件，将事件的值传递给prop属性 
    },
    props:{
       bothWay:{
        type:Object
      },
      //组件的属性,在父组件里，可以使用v-bind赋值，如果在model有定义使用v-model赋值
      classSe:{
        required:true,
        // type:Object
      },
     ovalue:0
    },
    data() {
      return {
        options:[
        ],//所有班级
        classId: "",//班级编号
      }
    },
    watch:{
      //监听classId的变化，从而改变当前选项
      'classSe.classId':function(value,old) {
        // console.log(this);
        this.classId=value
      },

    },
    methods:{
      focus(){
        this.$refs.txtClass.focus()
      },
      /**
     * 选项框改变事件，改变之后传给v-model绑定的对象
     */
      handleChange(){
         var _this=this;
         var classes =_this.options.find( p => p.classId==_this.classId)
         if (!classes) {
           classes={classes:0,className:"请选择课程"}
         } else {
          //  深度拷贝副本,目的防止被外界改变
             classes = { ...classes }
            
         }
 
          _this.$emit("change",classes)
          // _this.$emit('change1',Object1)

        
      }
  },
  created(){
      var _this = this;
      _this.axios.get("api/Class/GetAllClass").then(r => {
        _this.options=r.data
        // console.log(r.data)
        // console.log(r.data)
      // _this.options = r.data;
      _this.options=r.data.map(value=>{
        return{
          classId:value.classId,
          className:value.className
        }
      })
      //等待绑定的数据渲染后，重新改变当前选中的值
      _this.$nextTick(()=>{
        //使用v-model传进来的值，表示当前选中的项
        _this.classId=_this.classSe.classId
        _this.ovalue = _this.whoSelect
        // _this.classId=_this.polist
          })
        });
 

  },

  }
</script>
<style lang="less" scoped>

</style>