# API Automation

<img src="public/icons/Icon-2048x2048.png" align="center" width="512" height="512">

Over the course of this project I have been building a tool to allow users to
create repeatable workflows by chaining together HTTP requests. Users are able
to save values from responses, and use these throughout the workflow. When
referencing these values, users are able to substitute the contents by using
regular expressions, all using the syntax which I have built on top of JSON.
The workflows are able to be saved and opened at a later point.

## Running my Project

### Running the Electron Application

Web applications can be turned into standalone desktop applications using the
Electron framework. I have used GitHub Actions to create a build pipeline which
generates an executable file for each platform: Windows, macOS and Linux.

These executables are then pushed to DigitalOcean, where they are made
available to be downloaded using the following links:

| Platform | Download URL | SHA256 Hash |
| -------- | ------------ | ----------- |
| Windows  | https://download.jacobw.uk/Final%20Year%20Project%200.1.0.exe | d95eb0017b934279e17eddfc6cf2bfd987ba5280e6595ba817bff73291c5dce7 |
| Linux    | https://download.jacobw.uk/Final%20Year%20Project-0.1.0.AppImage | 407f7f1167fe9d43299b9ac59cdfc34f5e2554d78e3cc617ba7b81e05511f0b8 |
| macOS    | https://download.jacobw.uk/Final%20Year%20Project-0.1.0.dmg | 9c82de2cb4c4de57cbb0edc8c99ec931e545f7436c745c8b799e8a1fc4c44c36 |

When opening the application on macOS or Windows, you may have to take an extra
step to allow the application to be executed. This is because the executable
has not been notarized and signed.

- On Windows you must manually allow the application to execute in the
*SmartScreen* prompt.
- On macOS, instructions are available on Apple's support pages,
[here](https://support.apple.com/en-us/HT202491).

On Linux you will likely have to set the downloaded file to be executed. This
can be done in the permissions settings for the file (right click -> Properties
-> Permissions).

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