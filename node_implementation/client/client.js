var path = require("path");
// var PROTO_PATH ="./greater.proto";
//  __dirname  +
const PROTO_PATH = path.join(__dirname, '..', 'protos', 'greeter.proto');
var parseArgs = require("minimist");
var grpc = require("@grpc/grpc-js");
var protoLoader = require("@grpc/proto-loader");

var packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: false,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

var main_proto = grpc.loadPackageDefinition(packageDefinition).greeter;

function getClientStreamRequests() {
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    const requests = [];
    const askForName = () => {
      readline.question("Please enter a name (or nothing to stop chatting): ", (name) => {
        if (name === "") {
          readline.close();
          resolve(requests);
          return;
        }

        const helloRequest = { greeting: "Hello", name: name };
        requests.push(helloRequest);
        // Simulate a delay (optional)
        setTimeout(askForName, 1000);
      });
    };

    askForName();
  });
}


async function main() {
  Port = 50051;
  Host = "localhost";
  var argv = parseArgs(process.argv.slice(2), {
    string: "target",
  });
  var target;
  if (argv.target) {
    target = argv.target;
  } else {
    target = `${Host}:${Port}`;
  }
  var client = new main_proto.Greeter(
    target,
    grpc.credentials.createInsecure()
  );

  console.log("1. SayHello - Unary");
  console.log("2. ServerSaysHello - Server Side Streaming");
  console.log("3. ClientSaysHello - Client Side Streaming");
  console.log("4. HybridHello - Both Streaming");

  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  readline.question("Which rpc would you like to make: ", async (rpcCall) => {
    let call; // Declare call outside the if/else blocks
    if (rpcCall === "1") {
      const helloRequest = { greeting: "herro", name: "switch" };
      client.sayHello(helloRequest, function (err, response) {
        if (err) {
          console.error(err);
          readline.close(); // Close on error
          return;
        }
        console.log("SayHello Response Received:");
        console.log(response.message);
        readline.close(); // Close after response
      });
    } else if (rpcCall === "2") {
      const helloRequest = { greeting: "hero", name: "scream reference" };
      call = client.serverSaysHello(helloRequest);

      call.on('data', function (response) {
        console.log("ServerSaysHello Response Received:");
        console.log(response.message);
      });

      call.on('end', function () {
        console.log("ServerSaysHello Done");
        readline.close(); // Close after 'end'
      });

      call.on('error', function (e) {
        console.error(e);
        readline.close(); // Close on error
      });
    } else if (rpcCall === "3") {
      const requests = await getClientStreamRequests();
      call = client.clientSaysHello(function (err, response) {
        if (err) {
          console.error(err);
          readline.close(); // Close on error
          return;
        }
        readline.close(); // Close after response
        console.log("ClientSaysHello Response Received:");
        console.log(response.message);
      });

      requests.forEach(request => {
        call.write(request);
      });

      call.end();
    } else if (rpcCall === "4") {
      const requests = await getClientStreamRequests();
      call = client.hybridHello();

      call.on('data', function (response) {
        console.log("HybridHello Response Received: ");
        console.log(response.message);
      });

      call.on('end', function () {
        console.log("HybridHello Done");
        readline.close(); // Close after 'end'
      });

      call.on('error', function (e) {
        console.error(e);
        readline.close(); // Close on error
      });

      requests.forEach(request => {
        call.write(request);
      });

      call.end();
    } else {
      readline.close(); // Also close if the choice is invalid
    }
  });
}

main();