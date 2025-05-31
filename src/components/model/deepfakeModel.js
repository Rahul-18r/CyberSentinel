import * as tf from '@tensorflow/tfjs';

export const createModel = () => {
  const model = tf.sequential();

  // Input layer
  model.add(tf.layers.conv2d({
    inputShape: [128, 128, 3],
    filters: 32,
    kernelSize: 3,
    activation: 'relu',
    padding: 'same'
  }));

  // Convolutional blocks
  addConvBlock(model, 32);
  addConvBlock(model, 64);
  addConvBlock(model, 128);

  // Dense layers
  model.add(tf.layers.flatten());
  addDenseBlock(model, 512);
  addDenseBlock(model, 128);
  model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));

  model.compile({
    optimizer: 'adam',
    loss: 'binaryCrossentropy',
    metrics: ['accuracy']
  });

  return model;
};

const addConvBlock = (model, filters) => {
  model.add(tf.layers.conv2d({
    filters,
    kernelSize: 3,
    activation: 'relu',
    padding: 'same'
  }));
  model.add(tf.layers.batchNormalization());
  model.add(tf.layers.maxPooling2d({ poolSize: 2 }));
  model.add(tf.layers.dropout({ rate: 0.25 }));
};

const addDenseBlock = (model, units) => {
  model.add(tf.layers.dense({ units, activation: 'relu' }));
  model.add(tf.layers.batchNormalization());
  model.add(tf.layers.dropout({ rate: 0.5 }));
};