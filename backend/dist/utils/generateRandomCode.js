"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRandomCode = void 0;
function generateRandomCode() {
    const codeLength = 6;
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < codeLength; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters.charAt(randomIndex);
    }
    return code;
}
exports.generateRandomCode = generateRandomCode;
//# sourceMappingURL=generateRandomCode.js.map