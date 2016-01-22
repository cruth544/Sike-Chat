document.addEventListener("DOMContentLoaded", function() {
  var socket = io();
  $('form').submit(function(){
    socket.emit('chat-message', $('#m').val());
    $('#m').val('');
    return false;
  });

    socket.on('chat-message', function(msg){
      console.log('message: ' + msg);
    });

  socket.on('chat-message', function(data){
      // console.log(data)
  })
})


