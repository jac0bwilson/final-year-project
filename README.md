# API Automation

<img src="https://download.jacobw.uk/icon2048.png" align="center" width="512" height="512">

My project idea is to build a tool that allows users to create repeatable
workflows for interacting with APIs. These workflows will be able to be saved
and reused, and will be able to run in the style of Jupyter Notebooks.

## Running my Project

### Running the Electron Application

Web applications can be turned into standalone desktop applications using the
Electron framework. I have used GitHub Actions to create a build pipeline which
generates an executable file for each platform: Windows, macOS and Linux.

These executables are then pushed to DigitalOcean, where they are made
available to be downloaded using the following links:
# TODO: add file hashes & check versions
| Platform | Download URL | SHA256 Hash |
| -------- | ------------ | ----------- |
| Windows  | https://download.jacobw.uk/Final%20Year%20Project%200.1.0.exe | ... |
| Linux    | https://download.jacobw.uk/Final%20Year%20Project-0.1.0.AppImage | ... |
| macOS    | https://download.jacobw.uk/Final%20Year%20Project-0.1.0.dmg | ... |

When opening the application on macOS or Windows, you may have to take an extra
step to allow the application to be executed. This is because the executable
has not been notarized and signed.

- On Windows you must manually allow the application to execute in the
*SmartScreen* prompt.
- On macOS, instructions are available on Apple's support pages,
[here](https://support.apple.com/en-us/HT202491).

### Manual Setup

To run this project locally, from the source code, you need to have npm and
Node.js installed on your device. Instructions for how to do this can be found
[here](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).

With these tools installed, you can then navigate to the root of my project
directory, and instal dependencies via the following command.

```sh
npm install
```

With all dependencies installed, you can then run the application in the
browser, on http://localhost:3000. This is done with the following command.

```sh
npm start
```

If you wish to compile the Electron application yourself, you may run the
following command. The executable will be placed in the `dist/` directory.

```sh
npm run electron-build
```