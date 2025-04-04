"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtSecret = void 0;
exports.jwtSecret = process.env.KEY || process.exit(1);
