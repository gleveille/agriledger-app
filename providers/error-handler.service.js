"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
require("rxjs/add/operator/do");
require("rxjs/add/operator/catch");
var Observable_1 = require("rxjs/Observable");
require("rxjs/add/observable/throw");
var ErrorHandlerService = (function () {
    function ErrorHandlerService() {
    }
    ErrorHandlerService.prototype.handle = function (res) {
        console.log(res);
        var msg = '';
        if (res.error) {
            try {
                var data = JSON.parse(res.error);
                if (data && data.error && data.error.message) {
                    msg = data.error.message;
                }
                else {
                    if (data && data.message) {
                        msg = data.message;
                    }
                }
            }
            catch (err) {
            }
            if (res.error.error) {
                msg = res.error.error.message || 'Server error.Try again';
            }
        }
        else {
            msg = res.statusText || 'Server error.Try again';
        }
        msg = msg ? msg : 'Something went wrong';
        return Observable_1.Observable.throw({ message: msg, status: res.status });
    };
    ErrorHandlerService = __decorate([
        core_1.Injectable()
    ], ErrorHandlerService);
    return ErrorHandlerService;
}());
exports.ErrorHandlerService = ErrorHandlerService;
