"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storage = exports.auth = exports.db = void 0;
const app_1 = require("firebase/app");
const firestore_1 = require("firebase/firestore");
const auth_1 = require("firebase/auth");
const storage_1 = require("firebase/storage");
const firebaseConfig = {
    apiKey: "AIzaSyDpY1J38Mf5V-XC3U3CgwlBT_mNexdYM2o",
    authDomain: "villa-altona-goa.firebaseapp.com",
    projectId: "villa-altona-goa",
    storageBucket: "villa-altona-goa.firebasestorage.app",
    messagingSenderId: "686251298348",
    appId: "1:686251298348:web:d6a0c708b19556fd18cb89",
    measurementId: "G-M6B1E4HFGP"
};
const app = (0, app_1.initializeApp)(firebaseConfig);
exports.db = (0, firestore_1.getFirestore)(app);
exports.auth = (0, auth_1.getAuth)(app);
exports.storage = (0, storage_1.getStorage)(app);
exports.default = app;
