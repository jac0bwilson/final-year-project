const { app, BrowserWindow, screen, nativeImage } = require("electron");
const isDev = require("electron-is-dev");
const path = require("path");

function mainWindow(options) {
    let window = new BrowserWindow(options);

    const startUrl = isDev ? "http://localhost:3000": `file://${path.join(__dirname, "../build/index.html")}`;

    window.loadURL(startUrl);

    window.once("ready-to-show", () => window.show());

    window.on("closed", () => {
        window = null;
    });
}

app.whenReady().then(() => {
    let options = {
        width: screen.getPrimaryDisplay().workArea.width,
        height: screen.getPrimaryDisplay().workArea.height,
        show: false,
        backgroundColor: "white"
    }

    if (process.platform === "linux") {
        let image = nativeImage.createFromPath(path.join(__dirname, "../public/icons/Icon-2048x2048.png"));
        options.icon = image;
    }

    mainWindow(options);

    app.on("activate", () => {
        if (!BrowserWindow.getAllWindows().length) {
            mainWindow(options);
        }
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});