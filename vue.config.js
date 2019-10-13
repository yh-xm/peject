module.exports = {
    devServer:{
        proxy:{
            '/api':{
                target:"http://192.168.1.188:12",
                ws:true,
                changeOrigin:true
            }
        }
    }

}