const { io } = require('../index');
const Band = require('../models/band');
const Bands = require('../models/bands');

const bands = new Bands();
bands.addBand( new Band('Daddy Yanke') );
bands.addBand( new Band('Grupo Gale') );
bands.addBand( new Band('Daniela Darcourt') );
bands.addBand( new Band('Nklabe') );

// Mensajes de Socket
io.on('connection', client => {

	console.log('Cliente Conectado');

	// Emit all bands to all clients connect to server
	client.emit('active-bands', bands.getBands());
	
  client.on('disconnect', () => { 
		console.log('Cliene Desconectado');
	 });

	//  client.on('mensaje', (payload) => {
	// 	 console.log('Mensaje:', payload);

	// 	 io.emit('mensaje', { admin: "Nuevo mensaje" });

	//  });

	//  client.on('emitir nuevo mensaje', ( payload ) => {
	// 	//  console.log(payload);
	// 	//  io.emit('nuevo-mensaje', payload); emite a todos lo clientes 
	// 	client.broadcast.emit('nuevo-mensaje', payload); // emite a todos los clientes menos al que lo emitio
	//  });

	client.on('vote-band', (payload) => {
		bands.voteBand(payload['id']);
		// Una vez que se hace el voto, necesito emitir e informar 
		// a todos los clientes conectados, incluso al cliente que ejecuto la emision 
		// Para que pueda ver su voto
		io.emit('active-bands', bands.getBands());
	});

	client.on('add-band', (payload) => {
		const newBand = new Band(payload.name)
		bands.addBand(newBand);
		io.emit('active-bands', bands.getBands());
	});

	client.on('delete-band', (payload) => {
		bands.deleteBand( payload.id );
		io.emit('active-bands', bands.getBands() );
	})
});
