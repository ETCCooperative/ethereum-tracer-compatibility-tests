# Testing compatibility of Tracer across different clients on Ethereum networks

This test suite evaluates the interoperability of the Tracer APIs across a variety of Ethereum client implementations, specifically utilizing **go-ethereum** and **core-geth**.

## Requirements

  - Node.js version 14

## Installation

  ```bash
    $ npm install
  ```

## Configuration

  You can set the RPC endpoints and other options at `./config/index.js`.

## Usage

To run the test suite execute the following command:

  ```bash
    npm test
  ```

  or

  ```bash
    node test/traceBlock.js
  ```
