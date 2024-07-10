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
const Header_tsx_1 = __importDefault(require("../components/Header.tsx"));
const Footer_tsx_1 = __importDefault(require("../components/Footer.tsx"));
function HomeScreen() {
    const [did, setDID] = (0, react_1.useState)(null);
    console.log(did);
    const fetchDid = async () => {
        const storedDid = await async_storage_1.default.getItem('did');
        if (storedDid) {
            setDID(storedDid);
        }
        else {
            const keyPair = await react_native_rsa_native_1.RSA.generateKeys(4096);
            const response = await axios_1.default.post('http://10.0.2.2:3000/generate/did', {
                publicKey: keyPair.public,
            });
            const newDid = response.data.did;
            await async_storage_1.default.setItem('did', newDid);
            await (0, react_native_keychain_1.setGenericPassword)('privateKey', keyPair.private);
            setDID(newDid);
        }
    };
    (0, react_1.useEffect)(() => {
        fetchDid().catch((error) => {
            console.log(error);
            console.log(error.message);
        });
    }, []);
    return (<react_native_1.View className="flex flex-col h-[100%] w-[100%] bg-white dark:bg-dark-green">
      <Header_tsx_1.default />
      <react_native_1.ScrollView>
        <react_native_1.Text className="text-[28px] p-[30] font-bold text-text-grey dark:text-white">
          Credentials
        </react_native_1.Text>
        <IdentityCardList_tsx_1.default />
      </react_native_1.ScrollView>
      <Footer_tsx_1.default />
    </react_native_1.View>);
}
exports.default = HomeScreen;
