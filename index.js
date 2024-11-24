const app = require('express')();
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer, {
  cors: { origin: '*' }
});

const port = 3200;
let clients = {}; // Để theo dõi các client

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Nhận đối tượng khách hàng từ client
  socket.on('register', (customer) => {
    // Thêm socket.id vào đối tượng khách hàng
    clients[socket.id] = { ...customer, socketId: socket.id, lastActive: Date.now() }; 
    io.emit('clients', Object.values(clients)); // Gửi danh sách khách hàng hiện tại
  });

  socket.on('message', (message) => {
    console.log(message);
    socket.broadcast.emit('message', message); // Phát message tới các client khác
  });
  

  socket.on('notification', (notification) => {
    console.log(notification);
    io.emit('notification', `${clients[socket.id]?.name}: ${notification}`); // Sử dụng tên khách hàng
  });

  socket.on('activity', () => {
    clients[socket.id].lastActive = Date.now(); // Cập nhật thời gian hoạt động
    io.emit('clients', Object.values(clients)); // Cập nhật danh sách khách hàng
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
    delete clients[socket.id]; // Xóa client khỏi danh sách
    io.emit('clients', Object.values(clients)); // Cập nhật danh sách khách hàng
  });
});


httpServer.listen(port, () => console.log(`Listening on port ${port}`));