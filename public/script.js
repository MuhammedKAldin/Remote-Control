var socket = null;
var startX;
var startY;
var startTime;
var marker = document.getElementById("marker");
var object1 = document.getElementById("object1");
var objects = [
  document.getElementById("marker"),
  document.getElementById("object1"),
  document.getElementById("object2"),
  document.getElementById("object3"),
  document.getElementById("object4"),
];

function round(v, scalar)
{
  return Math.round(v * scalar) / scalar;
}


if (document.readyState != 'loading') ready();
else document.addEventListener('DOMContentLoaded', ready);
function ready() 
{
  for(var i=0;i<objects.length;i++)
  {
    objects[i].dragInfo = {
      original_left: objects[i].style.left,
      original_top: objects[i].style.top
    }
  }
  // Note the resource URL should match the config in app.js
  const url = 'wss://' + location.host + '/ws';
  socket = new ReconnectingWebsocket(url);

  // Connection has been established
  socket.onopen = function(evt) {
    console.log('Web socket opened: ' + url);
  };

  // Received a message
  socket.onmessage = function(evt) {
    parseMessage(evt.data);
  };
}

function parseMessage(msg)
{
  var tokens = msg.split(",");
  var command = tokens[0];

  switch (command)
  {
    case "m": //move
      {
        var objectIndex = tokens[1] * 1;
        var x = tokens[2] * 100;
        var y = tokens[3] * 100;
        var o = objects[objectIndex];

        o.style.left = x + "%";
        o.style.top = y + "%";
        //marker.style.left = x + "%";
        //marker.style.top = y + "%";
        //o.style.left = "50%";
        //o.style.top = "50%";
      }
      break;
    case "k": //kill
      {
        var objectIndex = tokens[1] * 1;
        objects[objectIndex].style.left = "-1000%";
        objects[objectIndex].style.top = "-1000%";
        
        setTimeout(function()
        {
          objects[objectIndex].style.left = objects[objectIndex].dragInfo.original_left;
          objects[objectIndex].style.top = objects[objectIndex].dragInfo.original_top;
        }, 1000);
      }
      break;
    case"l": //log
      {
        console.log(msg);
      }
  }
}

function send(str) {
  console.log(new Date().toLocaleTimeString() +  '> ' + str);
  socket.send(str);
}
  
  /*r touchArea = document.querySelector("#touchArea");
  touchArea.addEventListener("touchstart", function(e)
  {
    var touch = e.changedTouches[0];

    startX = (touch.clientX - e.target.offsetLeft) / e.target.offsetWidth;
    startY = (touch.clientY - e.target.offsetTop) / e.target.offsetHeight;
    startTime = window.performance.now();
    
    //socket.send(x + " " + y);
    e.preventDefault();
  });
  
  touchArea.addEventListener("touchend", function(e)
  {
    var touch = e.changedTouches[0];
    var endX = (touch.clientX - e.target.offsetLeft) / e.target.offsetWidth;
    var endY = (touch.clientY - e.target.offsetTop) / e.target.offsetHeight;
    var deltaX = endX - startX;
    var deltaY = endY - startY;
    var deltaTime = window.performance.now() - startTime;
    var msg = round(deltaX, 100000) + "|" + round(deltaY, 100000) + "|" + Math.round(deltaTime);
    socket.send(msg);
    //socket.send("touch end");
    e.preventDefault();
  });*/
  ////////////////////////
  