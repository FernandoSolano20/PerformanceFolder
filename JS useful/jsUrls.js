var sprint = "http://sprint-api.newhomesource.com//api/V2/Media/Gallery?algorithm=md5&client=runscope&commid={{commid}}&includesphericalimages=1&partnerid=1&sessiontoken=NewHomeSource&setsphericalattheend=1&sortby=Random&Random={{random}};";
function exec(){
    a.forEach(x=>{
        console.log(sprint.replace("{{commid}}",x).replace("{{random}}", Math.floor(Math.random() * 10000)))
    })
}
exec();