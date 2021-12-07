const { app, BrowserWindow, screen } = require("electron");

function mainWindow() {
    let window = new BrowserWindow({
        width: screen.getPrimaryDisplay().workArea.width,
        height: screen.getPrimaryDisplay().workArea.height,
        show: false,
        backgroundColor: "white"
    });

    const startUrl = "http://localhost:3000";

    window.loadURL(startUrl);

    window.once("ready-to-show", () => window.show());

    window.on("closed", () => {
        window = null;
    });
}

app.whenReady().then(() => {
    mainWindow();

    app.on("activate", () => {
        if (!BrowserWindow.getAllWindows().length) {
            mainWindow();
        }
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});