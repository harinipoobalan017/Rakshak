let ioInstance;

function initSocket(io) {
  ioInstance = io;

  io.on('connection', (socket) => {
    console.log('🔌 Client connected:', socket.id);

    // Join a room based on role
    socket.on('join_room', (role) => {
      socket.join(role);
      console.log(`   └─ ${socket.id} joined room: ${role}`);
    });

    // Real-time location updates from responders
    socket.on('location_update', (data) => {
      // Broadcast to admin and responder rooms
      socket.to('admin').emit('responder_location', {
        userId: data.userId,
        latitude: data.latitude,
        longitude: data.longitude,
        heading: data.heading,
        speed: data.speed,
        updatedAt: new Date(),
      });
      socket.to('responder').emit('responder_location', {
        userId: data.userId,
        latitude: data.latitude,
        longitude: data.longitude,
        heading: data.heading,
        speed: data.speed,
        updatedAt: new Date(),
      });
    });

    // Typing indicator for chat (future feature)
    socket.on('typing', (data) => {
      socket.to(data.room).emit('user_typing', data);
    });

    socket.on('disconnect', () => {
      console.log('🔌 Client disconnected:', socket.id);
    });
  });
}

function emitNewIncident(incident) {
  if (ioInstance) {
    ioInstance.to('responder').emit('new_incident', incident);
    ioInstance.to('admin').emit('new_incident', incident);
  }
}

function emitStatusUpdate(id, status) {
  if (ioInstance) {
    ioInstance.emit(`incident_update_${id}`, { status });
  }
}

function emitNotification(userId, notification) {
  if (ioInstance) {
    ioInstance.emit(`notification_${userId}`, notification);
  }
}

module.exports = { initSocket, emitNewIncident, emitStatusUpdate, emitNotification };