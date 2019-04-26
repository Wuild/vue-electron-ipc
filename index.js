module.exports = {
    main: process.type !== "renderer" ? require("./src/main") : undefined,
    renderer: process.type === "renderer" ? require("./src/renderer") : undefined
};
