# Node.js server for offline export of ApexChart graphs

This repository contains a Node.js application that starts a server which can
render [ECharts](https://echarts.apache.org/) graphs to PNG images.

## Requirements

This application needs the following prerequisites:

* Node.js 18 or later (preferably the latest LTS version)
* internet connection to download required dependencies (only once before
  first start)

### Installation of Node.js

The installation of Node.js is covered in a [separate document](./documentation/installation-node-js.md).

## Initial setup: install Node.js dependency packages

The application requires a package for canvas-based rendering. To install that,
type

    npm install


## Start the application

You can simply start the application via

    npm start

which fires up the Node.js application. The server will then listen on
<http://localhost:3000/> for incoming connections.

If you want the server to listen on a different port, then you can set the
environment variable `PORT` accordingly. On Linux-like systems you can do

``` bash
export PORT=4000
npm start
```

The equivalent on Windows command prompt would be

``` cmd
SET PORT=4000
npm start
```

In these cases the server will bind to port 4000 instead of the default port
3000.

The hostname can be changed, too, by setting the `HOST` environment variable in
the same manner, e. g.:

``` bash
export HOST=0.0.0.0
npm start
```

If `HOST` is not set, then `localhost` will be used as hostname.

## Usage

To generate a PNG file of an ECharts plot, just send an HTTP POST request to the
running Node.js server on <http://localhost:3000/> containing the data for the
plot as JSON in its body.

For example, POSTing the following JSON code to the server

    {
          "options": {
            "chart": {
              "type": "bar",
              "height": 400,
              "width": 600
            },
            "title": {
              "text": "Sample Bar Chart"
            },
            "xaxis": {
              "categories": ["Category 1", "Category 2", "Category 3"]
            }
          },
          "series": [
            {
              "name": "Series 1",
              "data": [30, 50, 80]
            }
          ],
          "type": "bar"
        }

will generate a PNG image that looks like this: