const { sum } = require("lodash");

class MockModel {
  status = "ACTIVE";
  constructor(id, name) {
    this.id = id;
    this.name = name;
  }

  train(data, callback) {
    console.log("Modal starts training with data ", data);
    this.status = "TRAINING";

    // done training
    setTimeout(() => {
      this.status = "ACTIVE";

      if (callback) {
        callback(null, { success: true });
      }
    }, 10000);
  }

  /**
   * Simulate next coordinate prediction from input coordinates
   *
   * @param {*} coordinates
   * @returns
   */
  predict(coordinates, callback) {
    setTimeout(() => {
      this.train(coordinates);
      callback(null, {
        predictedCoordinate: {
          lat:
            sum(coordinates.map((c) => c.lat)) / coordinates.length +
            Math.floor(Math.random() * 3),
          long:
            sum(coordinates.map((c) => c.long)) / coordinates.length +
            Math.floor(Math.random() * 3),
          width:
            sum(coordinates.map((c) => c.width)) / coordinates.length +
            Math.floor(Math.random() * 3),
          height:
            sum(coordinates.map((c) => c.height)) / coordinates.length +
            Math.floor(Math.random() * 3),
        },
      });
    }, 200);
  }
}

module.exports = {
  MockModel,
};
