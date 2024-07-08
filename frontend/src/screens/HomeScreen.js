"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("react-native");
const react_1 = __importStar(require("react"));
const async_storage_1 = __importDefault(require("@react-native-async-storage/async-storage"));
const axios_1 = __importDefault(require("axios"));
const react_native_keychain_1 = require("react-native-keychain");
const react_native_rsa_native_1 = require("react-native-rsa-native");
const IdentityCardList_tsx_1 = __importDefault(require("../components/IdentityCardList.tsx"));
function HomeScreen() {
    const [did, setDID] = (0, react_1.useState)(null);
    const fetchDid = () => __awaiter(this, void 0, void 0, function* () {
        const storedDid = yield async_storage_1.default.getItem('did');
        if (storedDid) {
            setDID(storedDid);
        }
        else {
            const keyPair = yield react_native_rsa_native_1.RSA.generateKeys(4096);
            const response = yield axios_1.default.post('http://10.0.2.2:3000/generate/did', {
                publicKey: keyPair.public,
            });
            const newDid = response.data.did;
            yield async_storage_1.default.setItem('did', newDid);
            yield (0, react_native_keychain_1.setGenericPassword)('privateKey', keyPair.private);
            setDID(newDid);
        }
    });
    (0, react_1.useEffect)(() => {
        fetchDid().catch((error) => {
            console.log(error);
            console.log(error.message);
        });
    }, []);
    return (<react_native_1.ScrollView>
      <react_native_1.Text>Your DID is {did}</react_native_1.Text>
      <react_native_1.Text style={styles.mainTitle}>Credentials</react_native_1.Text>
      <IdentityCardList_tsx_1.default />
    </react_native_1.ScrollView>);
}
const styles = react_native_1.StyleSheet.create({
    mainTitle: {
        fontSize: 28,
        padding: 30,
        fontWeight: 'bold',
    },
});
exports.default = HomeScreen;
