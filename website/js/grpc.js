const {
  InputCoordinates,
  Coordinate,
  GetCoordinatesRequest,
  GetModelStatusRequest,
} = require("../commands_pb.js");
const { CommandsClient } = require("../commands_grpc_web_pb.js");

const client = new CommandsClient(
  "http://" + window.location.hostname + ":8080",
  null,
  null
);

const predict = (coords = []) => {
  const request = new InputCoordinates();

  request.setCoordinatesList(
    coords.map((c) => {
      const co = new Coordinate();
      co.setLat(c.lat);
      co.setLong(c.long);
      co.setWidth(c.width);
      co.setHeight(c.height);

      return co;
    })
  );

  return new Promise((resolve, reject) => {
    client.predict(request, {}, (err, response) => {
      if (err) {
        console.log(
          `Unexpected error for commands:predict: code = ${err.code}` +
            `, message = "${err.message}"`
        );
        return reject(err);
      }

      return resolve(response.array[0]);
    });
  });
};

const getCoordinates = () => {
  const request = new GetCoordinatesRequest();

  return new Promise((resolve, reject) => {
    client.getCoordinates(request, {}, (err, response) => {
      if (err) {
        console.log(
          `Unexpected error for commands:predict: code = ${err.code}` +
            `, message = "${err.message}"`
        );
        return reject(err);
      }

      return resolve(response.array[0]);
    });
  });
};

const getModelStatus = () => {
  const request = new GetModelStatusRequest();

  request.setToken("19406c8e-1779-472a-924a-b2faf728716e");

  return new Promise((resolve, reject) => {
    client.getModelStatus(request, {}, (err, response) => {
      if (err) {
        console.log(
          `Unexpected error for commands:predict: code = ${err.code}` +
            `, message = "${err.message}"`
        );
        return reject(err);
      }

      return resolve(response.array[0]);
    });
  });
};

const train = (coords) => {
  const request = new InputCoordinates();

  request.setCoordinatesList(
    coords.map((c) => {
      const co = new Coordinate();
      co.setLat(c.lat);
      co.setLong(c.long);
      co.setWidth(c.width);
      co.setHeight(c.height);

      return co;
    })
  );

  return new Promise((resolve, reject) => {
    client.train(request, {}, (err, response) => {
      if (err) {
        console.log(
          `Unexpected error for commands:predict: code = ${err.code}` +
            `, message = "${err.message}"`
        );
        return reject(err);
      }

      return resolve(response.array[0]);
    });
  });
};

module.exports = {
  predict,
  train,
  getCoordinates,
  getModelStatus,
};
