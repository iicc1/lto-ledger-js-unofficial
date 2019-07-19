"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
var WAVES_CONFIG = {
    STATUS: {
        SW_OK: 0x9000,
        SW_USER_CANCELLED: 0x9100,
        SW_CONDITIONS_NOT_SATISFIED: 0x6985,
        SW_BUFFER_OVERFLOW: 0x6990,
        SW_INCORRECT_P1_P2: 0x6A86,
        SW_INS_NOT_SUPPORTED: 0x6D00,
        SW_CLA_NOT_SUPPORTED: 0x6E00,
        SW_SECURITY_STATUS_NOT_SATISFIED: 0x6982
    },
    SECRET: 'LTO',
    PUBLIC_KEY_LENGTH: 32,
    ADDRESS_LENGTH: 35,
    STATUS_LENGTH: 2,
    SIGNED_CODES: {
        ORDER: 0xFC,
        SOME_DATA: 0xFD,
        REQUEST: 0xFE,
        MESSAGE: 0xFF
    },
    MAX_SIZE: 128,
    WAVES_PRECISION: 8,
    MAIN_NET_CODE: 87,
    VERSIONS: [[0, 9, 6], [0, 9, 7]],
};
var Waves = (function () {
    function Waves(transport, networkCode) {
        if (networkCode === void 0) { networkCode = WAVES_CONFIG.MAIN_NET_CODE; }
        this._version = null;
        this.transport = transport;
        this.networkCode = networkCode;
        this.decorateClassByTransport();
    }
    Waves.prototype.decorateClassByTransport = function () {
        this.transport.decorateAppAPIMethods(this, [
            'getWalletPublicKey',
            '_signData',
            'getVersion',
        ], WAVES_CONFIG.SECRET);
    };
    Waves.prototype.getWalletPublicKey = function (path, verify) {
        if (verify === void 0) { verify = false; }
        return __awaiter(this, void 0, void 0, function () {
            var buffer, p1, response, publicKey, address, statusCode;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        buffer = Waves.splitPath(path);
                        p1 = verify ? 0x80 : 0x00;
                        return [4, this.transport.send(0x80, 0x04, p1, this.networkCode, buffer)];
                    case 1:
                        response = _a.sent();
                        publicKey = utils_1.base58Encode(response.slice(0, WAVES_CONFIG.PUBLIC_KEY_LENGTH));
                        address = response
                            .slice(WAVES_CONFIG.PUBLIC_KEY_LENGTH, WAVES_CONFIG.PUBLIC_KEY_LENGTH + WAVES_CONFIG.ADDRESS_LENGTH)
                            .toString('ascii');
                        statusCode = response
                            .slice(-WAVES_CONFIG.STATUS_LENGTH)
                            .toString('hex');
                        return [2, { publicKey: publicKey, address: address, statusCode: statusCode }];
                }
            });
        });
    };
    Waves.prototype.signTransaction = function (path, amountPrecession, txData, version) {
        if (version === void 0) { version = 2; }
        return __awaiter(this, void 0, void 0, function () {
            var transactionType, version2, type, prefixData, dataForSign;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        transactionType = txData[0];
                        version2 = [transactionType, version];
                        return [4, this._versionNum()];
                    case 1:
                        type = _a.sent();
                        if (!(transactionType === 4)) return [3, 3];
                        if (!(type === 0)) return [3, 3];
                        return [4, this.signSomeData(path, txData)];
                    case 2: return [2, _a.sent()];
                    case 3:
                        prefixData = Buffer.concat([
                            Waves.splitPath(path),
                            Buffer.from([
                                amountPrecession,
                                WAVES_CONFIG.WAVES_PRECISION,
                            ]),
                        ]);
                        return [4, this._fillData(prefixData, txData, version2)];
                    case 4:
                        dataForSign = _a.sent();
                        return [4, this._signData(dataForSign)];
                    case 5: return [2, _a.sent()];
                }
            });
        });
    };
    Waves.prototype.signOrder = function (path, amountPrecession, txData) {
        return __awaiter(this, void 0, void 0, function () {
            var prefixData, dataForSign;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        prefixData = Buffer.concat([
                            Waves.splitPath(path),
                            Buffer.from([
                                amountPrecession,
                                WAVES_CONFIG.WAVES_PRECISION,
                                WAVES_CONFIG.SIGNED_CODES.ORDER,
                            ])
                        ]);
                        return [4, this._fillData(prefixData, txData)];
                    case 1:
                        dataForSign = _a.sent();
                        return [4, this._signData(dataForSign)];
                    case 2: return [2, _a.sent()];
                }
            });
        });
    };
    Waves.prototype.signSomeData = function (path, msgBuffer) {
        return __awaiter(this, void 0, void 0, function () {
            var prefixData, dataForSign;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        prefixData = Buffer.concat([
                            Waves.splitPath(path),
                            Buffer.from([
                                WAVES_CONFIG.WAVES_PRECISION,
                                WAVES_CONFIG.WAVES_PRECISION,
                                WAVES_CONFIG.SIGNED_CODES.SOME_DATA,
                            ])
                        ]);
                        return [4, this._fillData(prefixData, msgBuffer)];
                    case 1:
                        dataForSign = _a.sent();
                        return [4, this._signData(dataForSign)];
                    case 2: return [2, _a.sent()];
                }
            });
        });
    };
    Waves.prototype.signRequest = function (path, msgBuffer) {
        return __awaiter(this, void 0, void 0, function () {
            var prefixData, dataForSign;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        prefixData = Buffer.concat([
                            Waves.splitPath(path),
                            Buffer.from([
                                WAVES_CONFIG.WAVES_PRECISION,
                                WAVES_CONFIG.WAVES_PRECISION,
                                WAVES_CONFIG.SIGNED_CODES.REQUEST,
                            ])
                        ]);
                        return [4, this._fillData(prefixData, msgBuffer)];
                    case 1:
                        dataForSign = _a.sent();
                        return [4, this._signData(dataForSign)];
                    case 2: return [2, _a.sent()];
                }
            });
        });
    };
    Waves.prototype.signMessage = function (path, msgBuffer) {
        return __awaiter(this, void 0, void 0, function () {
            var prefixData, dataForSign;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        prefixData = Buffer.concat([
                            Waves.splitPath(path),
                            Buffer.from([
                                WAVES_CONFIG.WAVES_PRECISION,
                                WAVES_CONFIG.WAVES_PRECISION,
                                WAVES_CONFIG.SIGNED_CODES.MESSAGE,
                            ])
                        ]);
                        return [4, this._fillData(prefixData, msgBuffer)];
                    case 1:
                        dataForSign = _a.sent();
                        return [4, this._signData(dataForSign)];
                    case 2: return [2, _a.sent()];
                }
            });
        });
    };
    Waves.prototype.getVersion = function () {
        return __awaiter(this, void 0, void 0, function () {
            var version, isError, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this._version) {
                            this._version = this.transport.send(0x80, 0x06, 0, 0);
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4, this._version];
                    case 2:
                        version = _a.sent();
                        isError = Waves.checkError(version.slice(-2));
                        if (isError) {
                            throw isError;
                        }
                        return [2, version.slice(0, -2)];
                    case 3:
                        e_1 = _a.sent();
                        this._version = null;
                        throw e_1;
                    case 4: return [2];
                }
            });
        });
    };
    Waves.prototype._versionNum = function () {
        return __awaiter(this, void 0, void 0, function () {
            var version;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.getVersion()];
                    case 1:
                        version = _a.sent();
                        return [2, WAVES_CONFIG.VERSIONS.reduce(function (acc, conf_version, index) {
                                var isMyVersion = !version.some(function (num, ind) { return conf_version[ind] > num; });
                                return isMyVersion ? index : acc;
                            }, 0)];
                }
            });
        });
    };
    Waves.prototype._fillData = function (prefixBuffer, dataBuffer, ver2) {
        if (ver2 === void 0) { ver2 = [0]; }
        return __awaiter(this, void 0, void 0, function () {
            var type;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this._versionNum()];
                    case 1:
                        type = _a.sent();
                        switch (type) {
                            case 0:
                                return [2, Buffer.concat([prefixBuffer, dataBuffer])];
                            case 1:
                            default:
                                return [2, Buffer.concat([prefixBuffer, Buffer.from(ver2), dataBuffer])];
                        }
                        return [2];
                }
            });
        });
    };
    Waves.prototype._signData = function (dataBufferAsync) {
        return __awaiter(this, void 0, void 0, function () {
            var dataBuffer, maxChunkLength, dataLength, sendBytes, result, chunkLength, isLastByte, chainId, txChunk, isError;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, dataBufferAsync];
                    case 1:
                        dataBuffer = _a.sent();
                        maxChunkLength = WAVES_CONFIG.MAX_SIZE - 5;
                        dataLength = dataBuffer.length;
                        sendBytes = 0;
                        _a.label = 2;
                    case 2:
                        if (!(dataLength > sendBytes)) return [3, 4];
                        chunkLength = Math.min(dataLength - sendBytes, maxChunkLength);
                        isLastByte = (dataLength - sendBytes > maxChunkLength) ? 0x00 : 0x80;
                        chainId = isLastByte ? this.networkCode : 0x00;
                        txChunk = dataBuffer.slice(sendBytes, chunkLength + sendBytes);
                        sendBytes += chunkLength;
                        return [4, this.transport.send(0x80, 0x02, isLastByte, chainId, txChunk)];
                    case 3:
                        result = _a.sent();
                        isError = Waves.checkError(result.slice(-2));
                        if (isError) {
                            throw isError;
                        }
                        return [3, 2];
                    case 4: return [2, utils_1.base58Encode(result.slice(0, -2))];
                }
            });
        });
    };
    Waves.checkError = function (data) {
        var statusCode = data[0] * 256 + data[1];
        if (statusCode === WAVES_CONFIG.STATUS.SW_OK) {
            return null;
        }
        return { error: 'Wrong data', status: statusCode };
    };
    Waves.splitPath = function (path) {
        var result = [];
        path.split('/').forEach(function (element) {
            var number = parseInt(element, 10);
            if (isNaN(number)) {
                return;
            }
            if (element.length > 1 && element[element.length - 1] === '\'') {
                number += 0x80000000;
            }
            result.push(number);
        });
        var buffer = new Buffer(result.length * 4);
        result.forEach(function (element, index) {
            buffer.writeUInt32BE(element, 4 * index);
        });
        return buffer;
    };
    return Waves;
}());
exports.Waves = Waves;
//# sourceMappingURL=Waves.js.map