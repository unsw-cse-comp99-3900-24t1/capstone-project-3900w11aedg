"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LightColours = exports.DarkColours = void 0;
const native_1 = require("@react-navigation/native");
// Not worried about proper light mode colours for sprint 1
// Colours can be changed accordingly in future
const sharedColours = {
    gold: '#C99F58',
    buttonGrey: '#A7A7A7',
    popupGrey: '#606665',
    navbarGrey: '#495351',
    gradient1: '#0A1B34',
    gradient2: '#0C372A',
    gradient3: '#369C7E',
    black: '#000000',
    white: '#FFFFFF',
};
const DarkColours = Object.assign(Object.assign({}, native_1.DarkTheme), { colors: Object.assign({ primary: sharedColours.gold, background: '#081715', card: '', text: '#F2F2F2', border: '', notification: '' }, sharedColours) });
exports.DarkColours = DarkColours;
const LightColours = Object.assign(Object.assign({}, native_1.DefaultTheme), { colors: Object.assign({ primary: sharedColours.gold, background: '000000', card: '', text: sharedColours.black, border: '', notification: '' }, sharedColours) });
exports.LightColours = LightColours;
