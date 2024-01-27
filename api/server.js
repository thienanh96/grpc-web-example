const PROTO_PATH = __dirname + "/commands.proto";

const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const assert = require("assert");
const { MockModel } = require("./models");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const commands_proto = grpc.loadPackageDefinition(packageDefinition).commands;

let coordinates = [];

const mockModel = new MockModel(
  "19406c8e-1779-472a-924a-b2faf728716e",
  "Simulated AI Model"
);

/**
 * Implements the RPC methods.
 */
const predict = (call, callback) => {
  coordinates = call.request.coordinates;
  mockModel.predict(coordinates, callback);
};

const train = (call, callback) => {
  coordinates.push(...call.request.coordinates);
  mockModel.train(coordinates, callback);
};

const getCoordinates = (call, callback) => {
  callback(null, { coordinates });
};

const getModelStatus = (call, callback) => {
  if (call.request.token !== mockModel.id) {
    return callback("Model not found");
  }

  callback(null, { status: mockModel.status });
};

/**
 * Starts an RPC server that receives requests for the Greeter service at the
 * sample server port
 */
function main() {
  const server = new grpc.Server();
  server.addService(commands_proto.Commands.service, {
    predict: predict,
    getCoordinates,
    getModelStatus,
    train,
  });
  server.bindAsync(
    "0.0.0.0:9090",
    grpc.ServerCredentials.createInsecure(),
    (err, port) => {
      console.log("Server started at port " + port);
      assert.ifError(err);
      server.start();
    }
  );
}

main();
