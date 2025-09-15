"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.functions = exports.auth = exports.db = void 0;
const app_1 = require("firebase/app");
const analytics_1 = require("firebase/analytics");
const firestore_1 = require("firebase/firestore");
const auth_1 = require("firebase/auth");
const functions_1 = require("firebase/functions");
const firebaseConfig = {
    apiKey: "AIzaSyDpY1J38Mf5V-XC3U3CgwlBT_mNexdYM2o",
    authDomain: "villa-altona-goa.firebaseapp.com",
    databaseURL: "https://villa-altona-goa-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "villa-altona-goa",
    storageBucket: "villa-altona-goa.firebasestorage.app",
    messagingSenderId: "686251298348",
    appId: "1:686251298348:web:d801992f8c1bbc1918cb89",
    measurementId: "G-XY8PM1G620"
};
// Initialize Firebase
const app = (0, app_1.initializeApp)(firebaseConfig);
const analytics = (0, analytics_1.getAnalytics)(app);
exports.db = (0, firestore_1.getFirestore)(app);
exports.auth = (0, auth_1.getAuth)(app);
exports.functions = (0, functions_1.getFunctions)(app, 'asia-south1');
exports.default = app;
