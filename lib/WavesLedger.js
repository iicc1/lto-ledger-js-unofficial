"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
require("babel-polyfill");
var Waves_1 = require("./Waves");
var hw_transport_u2f_1 = require("@ledgerhq/hw-transport-u2f");
var ADDRES_PREFIX = '44\'/353\'/0\'/0\'/';
var WavesLedger = (function () {
    function WavesLedger(options) {
        this.ready = false;
        this._networkCode = options.networkCode == null ? 87 : options.networkCode;
        this._wavesLibPromise = null;
        this._initTransportPromise = null;
        this._debug = options.debug == null ? false : options.debug;
        this._openTimeout = options.openTimeout;
        this._listenTimeout = options.listenTimeout;
        this._exchangeTimeout = options.exchangeTimeout;
        this._error = null;
        this._transport = options.transport || hw_transport_u2f_1.default;
        this.tryConnect();
    }
    WavesLedger.prototype.tryConnect = function () {
        return __awaiter(this, void 0, void 0, function () {
            var disconnectPromise;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        disconnectPromise = this.disconnect();
                        this._initU2FTransport();
                        this._setSettings();
                        this._initWavesLib();
                        return [4, disconnectPromise];
                    case 1:
                        _a.sent();
                        return [4, Promise.all([this._initTransportPromise, this._wavesLibPromise])];
                    case 2:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    WavesLedger.prototype.disconnect = function () {
        return __awaiter(this, void 0, void 0, function () {
            var transportpromise, transport, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        transportpromise = this._initTransportPromise;
                        this._initTransportPromise = null;
                        this._wavesLibPromise = null;
                        if (!transportpromise) return [3, 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4, transportpromise];
                    case 2:
                        transport = _a.sent();
                        transport.close();
                        return [3, 4];
                    case 3:
                        e_1 = _a.sent();
                        return [3, 4];
                    case 4: return [2];
                }
            });
        });
    };
    WavesLedger.prototype.getTransport = function () {
        return __awaiter(this, void 0, void 0, function () {
            var e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 5]);
                        return [4, this._wavesLibPromise];
                    case 1: return [2, _a.sent()];
                    case 2:
                        e_2 = _a.sent();
                        return [4, this.tryConnect()];
                    case 3:
                        _a.sent();
                        return [4, this._wavesLibPromise];
                    case 4: return [2, _a.sent()];
                    case 5: return [2];
                }
            });
        });
    };
    WavesLedger.prototype.getUserDataById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var waves, path, userData, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4, this.getTransport()];
                    case 1:
                        waves = _a.sent();
                        path = this.getPathById(id);
                        return [4, waves.getWalletPublicKey(path, false)];
                    case 2:
                        userData = _a.sent();
                        return [2, __assign({}, userData, { id: id, path: path })];
                    case 3:
                        e_3 = _a.sent();
                        this.tryConnect();
                        this._error = e_3;
                        throw e_3;
                    case 4: return [2];
                }
            });
        });
    };
    WavesLedger.prototype.getVersion = function () {
        return __awaiter(this, void 0, void 0, function () {
            var waves, e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4, this.getTransport()];
                    case 1:
                        waves = _a.sent();
                        return [4, waves.getVersion()];
                    case 2: return [2, _a.sent()];
                    case 3:
                        e_4 = _a.sent();
                        this.tryConnect();
                        this._error = e_4;
                        throw e_4;
                    case 4: return [2];
                }
            });
        });
    };
    WavesLedger.prototype.getPaginationUsersData = function (from, limit) {
        return __awaiter(this, void 0, void 0, function () {
            var usersData, id, userData, e_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        usersData = [];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, , 7]);
                        id = from;
                        _a.label = 2;
                    case 2:
                        if (!(id <= from + limit)) return [3, 5];
                        return [4, this.getUserDataById(id)];
                    case 3:
                        userData = _a.sent();
                        usersData.push(userData);
                        _a.label = 4;
                    case 4:
                        id++;
                        return [3, 2];
                    case 5: return [3, 7];
                    case 6:
                        e_5 = _a.sent();
                        this.tryConnect();
                        this._error = e_5;
                        throw e_5;
                    case 7: return [2, usersData];
                }
            });
        });
    };
    WavesLedger.prototype.signTransaction = function (userId, asset, txData, version) {
        if (version === void 0) { version = 2; }
        return __awaiter(this, void 0, void 0, function () {
            var path, msgData, waves, e_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        path = this.getPathById(userId);
                        msgData = new Buffer(txData);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4, this.getTransport()];
                    case 2:
                        waves = _a.sent();
                        return [4, waves.signTransaction(path, asset.precision, msgData, version)];
                    case 3: return [2, _a.sent()];
                    case 4:
                        e_6 = _a.sent();
                        this.tryConnect();
                        this._error = e_6;
                        throw e_6;
                    case 5: return [2];
                }
            });
        });
    };
    WavesLedger.prototype.signOrder = function (userId, asset, txData) {
        return __awaiter(this, void 0, void 0, function () {
            var path, msgData, waves, e_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        path = this.getPathById(userId);
                        msgData = new Buffer(txData);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4, this.getTransport()];
                    case 2:
                        waves = _a.sent();
                        return [4, waves.signOrder(path, asset.precision, msgData)];
                    case 3: return [2, _a.sent()];
                    case 4:
                        e_7 = _a.sent();
                        this.tryConnect();
                        this._error = e_7;
                        throw e_7;
                    case 5: return [2];
                }
            });
        });
    };
    WavesLedger.prototype.signSomeData = function (userId, dataBuffer) {
        return __awaiter(this, void 0, void 0, function () {
            var path, msgData, waves, e_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        path = this.getPathById(userId);
                        msgData = new Buffer(dataBuffer);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4, this.getTransport()];
                    case 2:
                        waves = _a.sent();
                        return [4, waves.signSomeData(path, msgData)];
                    case 3: return [2, _a.sent()];
                    case 4:
                        e_8 = _a.sent();
                        this.tryConnect();
                        this._error = e_8;
                        throw e_8;
                    case 5: return [2];
                }
            });
        });
    };
    WavesLedger.prototype.signRequest = function (userId, dataBuffer) {
        return __awaiter(this, void 0, void 0, function () {
            var path, msgData, waves, e_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        path = this.getPathById(userId);
                        msgData = new Buffer(dataBuffer);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4, this.getTransport()];
                    case 2:
                        waves = _a.sent();
                        return [4, waves.signRequest(path, msgData)];
                    case 3: return [2, _a.sent()];
                    case 4:
                        e_9 = _a.sent();
                        this.tryConnect();
                        this._error = e_9;
                        throw e_9;
                    case 5: return [2];
                }
            });
        });
    };
    WavesLedger.prototype.signMessage = function (userId, message) {
        return __awaiter(this, void 0, void 0, function () {
            var path, msgData, waves, e_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        path = this.getPathById(userId);
                        msgData = new Buffer(message, 'ascii');
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4, this.getTransport()];
                    case 2:
                        waves = _a.sent();
                        return [4, waves.signMessage(path, msgData)];
                    case 3: return [2, _a.sent()];
                    case 4:
                        e_10 = _a.sent();
                        this.tryConnect();
                        this._error = e_10;
                        throw e_10;
                    case 5: return [2];
                }
            });
        });
    };
    WavesLedger.prototype.getLastError = function () {
        return this._error;
    };
    WavesLedger.prototype.probeDevice = function () {
        return __awaiter(this, void 0, void 0, function () {
            var e_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.ready) return [3, 2];
                        return [4, this.tryConnect()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        this._error = null;
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 5, , 6]);
                        return [4, this.getUserDataById(1)];
                    case 4:
                        _a.sent();
                        return [3, 6];
                    case 5:
                        e_11 = _a.sent();
                        this._error = e_11;
                        return [2, false];
                    case 6: return [2, true];
                }
            });
        });
    };
    WavesLedger.prototype.getPathById = function (id) {
        return "" + ADDRES_PREFIX + id + "'";
    };
    WavesLedger.prototype._setSettings = function () {
        var _this = this;
        this._initTransportPromise.then(function (transport) {
            transport.setDebugMode(_this._debug);
            transport.setExchangeTimeout(_this._exchangeTimeout);
        });
    };
    WavesLedger.prototype._initU2FTransport = function () {
        this.ready = false;
        this._initTransportPromise = this._transport.create(this._openTimeout, this._listenTimeout);
        return this._initTransportPromise;
    };
    WavesLedger.prototype._initWavesLib = function () {
        var _this = this;
        this._wavesLibPromise = this._initTransportPromise.then(function (transport) {
            _this.ready = true;
            return new Waves_1.Waves(transport, _this._networkCode);
        });
        return this._wavesLibPromise;
    };
    return WavesLedger;
}());
exports.WavesLedger = WavesLedger;
//# sourceMappingURL=WavesLedger.js.map