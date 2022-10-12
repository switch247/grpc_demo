var PROTO_PATH = __dirname + '/../../protos/greeter.proto';

var grpc = require('@grpc/grpc-js');
var protoLoader = require('@grpc/proto-loader');
var packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });
var main_proto = grpc.loadPackageDefinition(packageDefinition).greeter;

/**
 * Implements the SayHello RPC method.
 */
function sayHello(call, callback) {
  console.log("SayHello Request Made:");
  console.log(call.request);
  callback(null, {message: `${call.request.greeting} ${call.request.name}`});
}

/**
 * Implements the ServerSaysHello RPC method.
 */
function serverSaysHello(call) {
  console.log("ServerSaysHello Request Made:");
  console.log(call.request);

  for (let i = 0; i < 3; i++) {
    call.write({ message: `${call.request.greeting} ${call.request.name} ${i + 1}` });
    // Simulate a delay (optional)
    setTimeout(() => {
      if (i === 2) {
        call.end();
      }
    }, 3000);
  }
}

/**
 * Implements the ClientSaysHello RPC method.
 */
async function clientSaysHello(call, callback) {
  let messages = [];

  call.on('data', function (request) {
    console.log("ClientSaysHello Request Made:");
    console.log(request);
    messages.push(request.name);
  });

  call.on('end', function () {
    const replyMessage = `You have sent ${len(messages)} messages: ${messages.join(', ')}. Please expect a delayed response.`;
    callback(null, { message: replyMessage });
  });

  call.on('error', function (err) {
    console.error(err);
  });
}

function len(arr){
    let length = 0
    for(let i in arr){
        length++
    }
    return length
}

/**
 * Implements the HybridHello RPC method.
 */
function hybridHello(call) {
  call.on('data', function (request) {
    console.log("HybridHello Request Made:");
    console.log(request);
    call.write({ message: `${request.greeting} ${request.name}` });
  });

  call.on('end', function () {
    call.end();
  });

  call.on('error', function (err) {
    console.error(err);
  });
}

/**
 * Starts an RPC server that receives requests for the Greeter service at the
 * sample server port
 */
function main() {
  var server = new grpc.Server();
  server.addService(main_proto.Greeter.service, {
    sayHello: sayHello,
    serverSaysHello: serverSaysHello,
    clientSaysHello: clientSaysHello,
    hybridHello: hybridHello,
  });
  server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
    server.start();
  });
  console.log('Server started on port 50051');
}

main();