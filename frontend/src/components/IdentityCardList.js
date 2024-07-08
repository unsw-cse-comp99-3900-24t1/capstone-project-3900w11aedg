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
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const IdentityCard_1 = __importDefault(require("./IdentityCard"));
const IdentityCardList = () => {
    const [cards, setCards] = (0, react_1.useState)([]);
    const [selectedCard, setSelectedCard] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        const fetchData = () => __awaiter(void 0, void 0, void 0, function* () {
            const data = [
                {
                    id: 1,
                    creationDate: '15 Nov 2024',
                    expiryDate: '15 Nov 2025',
                    name: 'Drivers License',
                    type: 'License',
                    credIssuedBy: 'NSW Government',
                    credNumber: '348203',
                    credType: 'C LRN',
                    credName: 'Lewis Hamilton',
                },
                {
                    id: 2,
                    creationDate: '23 Nov 2024',
                    expiryDate: '23 Nov 2025',
                    name: 'WCC',
                    type: 'Certificate',
                    credIssuedBy: 'NSW Government',
                    credNumber: '46543346',
                    credType: 'Employee',
                    credName: 'Duke Dennis',
                },
            ];
            setCards(data);
        });
        fetchData();
    }, []);
    const handleCardPress = (card) => {
        setSelectedCard(card);
    };
    const handleCloseModal = () => {
        setSelectedCard(null);
    };
    return (<react_native_1.View style={styles.list}>
      {cards.map((card) => (<react_native_1.View key={card.id} style={styles.cardContainer}>
          <IdentityCard_1.default card={card} onPress={() => handleCardPress(card)}/>
          <react_native_1.Modal visible={!!selectedCard} transparent={true} animationType="slide" onRequestClose={handleCloseModal}>
            <react_native_1.Pressable style={styles.modalOverlay} onPress={handleCloseModal}>
              <react_native_1.Pressable style={styles.modalContent} onPress={() => { }}>
                {selectedCard && (<>
                    <react_native_1.View style={styles.modalInsideContent}>
                      <react_native_1.View style={styles.cardDetails}>
                        <react_native_1.View style={styles.cardDetailsKey}>
                          <react_native_1.Text>Issued By</react_native_1.Text>
                          <react_native_1.Text>Created</react_native_1.Text>
                          <react_native_1.Text>Expiry</react_native_1.Text>
                        </react_native_1.View>
                        <react_native_1.View style={styles.cardDetailsValue}>
                          <react_native_1.Text>{selectedCard.credIssuedBy}</react_native_1.Text>
                          <react_native_1.Text>{selectedCard.creationDate}</react_native_1.Text>
                          <react_native_1.Text>{selectedCard.expiryDate}</react_native_1.Text>
                        </react_native_1.View>
                      </react_native_1.View>
                      <react_native_1.View style={styles.qrCodeBlock}/>
                    </react_native_1.View>
                  </>)}
              </react_native_1.Pressable>
            </react_native_1.Pressable>
          </react_native_1.Modal>
        </react_native_1.View>))}
    </react_native_1.View>);
};
const styles = react_native_1.StyleSheet.create({
    list: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    cardContainer: {
        margin: 8,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: 330,
        height: 400,
        padding: 20,
        backgroundColor: 'rgb(143, 149, 149)',
        borderRadius: 10,
        alignItems: 'center',
    },
    modalInsideContent: {
        padding: 20,
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'green',
    },
    modalText: {
        fontSize: 16,
        marginVertical: 10,
        color: 'green',
    },
    qrCodeBlock: {
        width: 100,
        height: 100,
        backgroundColor: 'white',
    },
    cardDetails: {
        height: 80,
        width: 270,
        flexDirection: 'row',
        paddingTop: 5,
        paddingLeft: 15,
        paddingRight: 15,
        backgroundColor: 'rgb(96, 102, 101)',
        borderRadius: 8,
        justifyContent: 'space-around',
    },
    cardDetailsKey: {},
    cardDetailsValue: {},
});
exports.default = IdentityCardList;
