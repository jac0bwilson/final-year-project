# API Automation

My project idea is to build a tool that allows users to create repeatable
workflows for interacting with APIs. These workflows will be able to be saved
and reused, and will be able to run in the style of Jupyter Notebooks.

## Running my Project

### Running the Electron Application

Web applications can be turned into standalone desktop applications using the
Electron framework. I have used GitHub Actions to create a build pipeline which
generates an executable file for each platform: Windows, macOS and Linux.

These executables are available here:
# TODO: add download URLs
- Windows
- macOS
- Linux

### Manual Setup

To run this project locally, from the source code, you need to have npm and
Node.js installed on your device. Instructions for how to do this can be found
[here](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).

With these tools installed, you can then navigate to the root of my project
directory, and instal dependencies via the following command.

```sh
npm install
```

With all dependencies installed, you can then run the application. This is done
with the following command.

```sh
npm start
```

If you wish to compile the Electron application yourself, you may run the
following command. The executable will be placed in the `dist/` directory.

```sh
npm run electron-build
```