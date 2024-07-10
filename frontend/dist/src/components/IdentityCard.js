"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const react_native_flip_card_1 = __importDefault(require("react-native-flip-card"));
const IdentityCard = ({ card, onPress }) => {
    return (<react_native_flip_card_1.default>
      <react_native_1.View style={styles.frontCardContainer}>
        <react_native_1.View style={styles.frontCardContainerTop}>
          <react_native_1.Text style={styles.frontCardTitle}>{card.name}</react_native_1.Text>
          <react_native_1.View style={styles.frontCardContainerFlip}>
            <react_native_1.Image source={require('../assets/fliparrow.png')} className="w-[100%] h-[100%]" resizeMode="contain"/>
          </react_native_1.View>
        </react_native_1.View>
        <react_native_1.Pressable onPress={onPress}>
          <react_native_1.View style={styles.frontCardContainerBottom}>
            <react_native_1.Text style={styles.text}>{card.type}</react_native_1.Text>
          </react_native_1.View>
        </react_native_1.Pressable>
      </react_native_1.View>
      <react_native_1.View style={styles.backCardContainer}>
        <react_native_1.View style={styles.backCardContainerTop}>
          <react_native_1.Text style={styles.frontCardTitle}>{card.name}</react_native_1.Text>
          <react_native_1.View style={styles.frontCardContainerFlip}>
            <react_native_1.Image source={require('../assets/fliparrow.png')} className="w-[100%] h-[100%]" resizeMode="contain"/>
          </react_native_1.View>
        </react_native_1.View>
        <react_native_1.Text style={styles.backCardContainerIssuedBy}>{card.credIssuedBy}</react_native_1.Text>
        <react_native_1.Pressable onPress={onPress}>
          <react_native_1.View style={styles.backCardContainerBottom}>
            <react_native_1.View style={styles.backCardContainerKey}>
              <react_native_1.Text>Name</react_native_1.Text>
              <react_native_1.Text>{card.type} No.</react_native_1.Text>
              <react_native_1.Text>{card.type} Type</react_native_1.Text>
            </react_native_1.View>
            <react_native_1.View style={styles.backCardContainerValue}>
              <react_native_1.Text>{card.credName}</react_native_1.Text>
              <react_native_1.Text>{card.credNumber}</react_native_1.Text>
              <react_native_1.Text>{card.credType}</react_native_1.Text>
            </react_native_1.View>
          </react_native_1.View>
        </react_native_1.Pressable>
      </react_native_1.View>
    </react_native_flip_card_1.default>);
};
const styles = react_native_1.StyleSheet.create({
    frontCardContainer: {
        height: 160,
        width: 320,
        backgroundColor: 'rgb(82, 126, 120)',
        borderRadius: 8,
    },
    frontCardTitle: {
        marginTop: 0,
        marginBottom: 8,
        fontSize: 18,
        fontWeight: 'bold',
        border: 2,
        height: 30,
    },
    frontCardContainerTop: {
        justifyContent: 'space-between',
        flex: 1,
        flexDirection: 'row',
        padding: 15,
    },
    frontCardContainerBottom: {
        height: 80,
        paddingLeft: 20,
    },
    frontCardContainerFlip: {
        width: 30,
        height: 30,
    },
    backCardContainer: {
        height: 160,
        width: 320,
        borderRadius: 8,
        backgroundColor: 'rgb(108, 114, 114)',
    },
    backCardContainerIssuedBy: {
        paddingLeft: 15,
    },
    backCardContainerBottom: {
        height: 80,
        flexDirection: 'row',
        paddingTop: 5,
        paddingLeft: 15,
        paddingRight: 15,
        justifyContent: 'space-around',
    },
    backCardContainerTop: {
        justifyContent: 'space-between',
        flex: 1,
        flexDirection: 'row',
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 15,
        height: 30,
    },
    backCardContainerKey: {
        fontSize: 12,
    },
    backCardContainerValue: {
        fontSize: 12,
    },
});
exports.default = IdentityCard;
