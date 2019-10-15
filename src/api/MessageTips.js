
       /**
     * 二次封装提示信息
     * 
     * @param {object} that  this的指向全局vue实例
     * @param {object} type  1 成功 -1错误 其他警告
     * @param {object} message  this的指向全局vue实例
     * 使用实例
     * this.$msg(this,1,'66666') //成功提示 66666
     * this.$msg(this,-1,'66666') //错误提示 66666
     * this.$msg(this,0,'66666') //警告提示 66666
     */
export  const message = (that,type,message) => {
    if(type==1){
        type="success";
    }else{
        type="warning";
    }
    that.$message({
        message: message,
        type: type
      })
}