var express = require("express");
var app = express();
var mqtt = require('mqtt');

app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views","./views");

var server = require("http").createServer(app);
var io = require("socket.io")(server);
server.listen(process.env.PORT||3000);
options={
  username:'cfypmyis',
  password:'7nU4dZ29Uh41',
  port:13334,
  clientId:'d5f18b20049c407b8d1d3087c838e926'
}



io.on('connection',function(socket){
    console.log("Someone has connected:"+socket.id);
    socket = mqtt.connect('mqtt://m11.cloudmqtt.com',options);
    socket.on('connect',function(){

      socket.subscribe('celcius');
      socket.subscribe('humid');
      socket.subscribe('press');
      socket.on('message', function(topic, message){
        switch (topic) {
          case 'celcius':
            io.sockets.emit("celcius",message);
            console.log("celcius:"+message); break;
          case 'press':
            io.sockets.emit("press",message);
            console.log("press:"+message); break;
          case 'humid':
            io.sockets.emit("humid",message);
            console.log("celcius:"+message);break;
        }
      });
  });

});

app.get('/',function(req,res){
  res.render('mainpage.ejs')
})
