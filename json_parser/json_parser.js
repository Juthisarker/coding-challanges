"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonParser = void 0;
var JsonParser = /** @class */ (function () {
    function JsonParser(input) {
        this.pos = 0;
        this.input = input;
    }
    JsonParser.prototype.parse = function () {
        this.consumeWhitespace();
        var result = this.parseValue();
        this.consumeWhitespace();
        if (this.hasNext()) {
            throw new Error("Unexpected token at position ".concat(this.pos, "-").concat(this.currentToken()));
        }
        console.log("result", result);
        return result;
    };
    JsonParser.prototype.consumeWhitespace = function () {
        while (/\s/.test(this.currentToken())) {
            this.consume();
        }
    };
    JsonParser.prototype.hasNext = function () {
        return this.currentToken() !== "";
    };
    JsonParser.prototype.currentToken = function () {
        return this.input.charAt(this.pos);
    };
    JsonParser.prototype.consume = function (expected) {
        if (expected && this.currentToken() !== expected) {
            throw new Error("Expected ".concat(expected, " at position ").concat(this.pos));
        }
        this.pos++;
        console.log(this.input.charAt(this.pos));
        // Skip over any whitespace characters
        while (this.currentToken() === " " ||
            this.currentToken() === "\t" ||
            this.currentToken() === "\n" ||
            this.currentToken() === "\r") {
            this.pos++;
        }
    };
    JsonParser.prototype.optionalConsume = function (expected) {
        if (this.currentToken() === expected) {
            this.pos++;
            // Skip over any whitespace characters
            while (this.currentToken() === " " ||
                this.currentToken() === "\t" ||
                this.currentToken() === "\n" ||
                this.currentToken() === "\r") {
                this.pos++;
            }
            return true;
        }
        return false;
    };
    JsonParser.prototype.parseValue = function () {
        switch (this.currentToken()) {
            // If the current token is an opening brace, parse an object
            case "{":
                return this.parseObject();
            // If the current token is an opening bracket, parse an array
            case "[":
                return this.parseArray();
            // If the current token is a string literal, parse a string
            case '"':
                return this.parseString();
            // If the current token is a minus sign or a digit, parse a number
            case "-":
            case "0":
            case "1":
            case "2":
            case "3":
            case "4":
            case "5":
            case "6":
            case "7":
            case "8":
            case "9":
                return this.parseNumber();
            // If the current token is the 'true' literal, return true
            case "t":
                return this.parseTrue();
            // If the current token is the 'false' literal, return false
            case "f":
                return this.parseFalse();
            // If the current token is the 'null' literal, return null
            case "n":
                return this.parseNull();
            // Otherwise, the JSON value is invalid
            default:
                throw new Error("Invalid JSON value at position ".concat(this.pos));
        }
    };
    JsonParser.prototype.parseObject = function () {
        var obj = {};
        // Consume opening curly brace
        this.consume("{");
        // Parse key-value pairs
        while (this.currentToken() !== "}") {
            var pair = this.parsePair();
            obj[pair.key] = pair.value;
            // Check if there is another pair
            if (this.currentToken() === ",") {
                this.consume(",");
            }
            else if (this.currentToken() !== "}") {
                throw new Error("Invalid object at position ".concat(this.pos));
            }
        }
        // Consume closing curly brace
        this.consume("}");
        return obj;
    };
    JsonParser.prototype.parsePair = function () {
        var key = this.parseString();
        // Consume colon
        this.consume(":");
        var value = this.parseValue();
        return { key: key, value: value };
    };
    JsonParser.prototype.parseArray = function () {
        var arr = [];
        // Consume opening square bracket
        this.consume("[");
        // Parse values
        while (this.currentToken() !== "]") {
            var value = this.parseValue();
            arr.push(value);
            // Check if there is another value
            if (this.currentToken() === ",") {
                this.consume(",");
            }
            else if (this.currentToken() !== "]") {
                throw new Error("Invalid array at position ".concat(this.pos));
            }
        }
        // Consume closing square bracket
        this.consume("]");
        return arr;
    };
    JsonParser.prototype.parseString = function () {
        var str = "";
        // Consume opening quote
        this.consume('"');
        // Parse string characters
        while (this.currentToken() !== '"') {
            if (this.currentToken() === "\\") {
                str += this.parseEscape();
            }
            else {
                str += this.currentToken();
                this.pos++;
            }
        }
        // Consume closing quote
        this.consume('"');
        return str;
    };
    JsonParser.prototype.parseNumber = function () {
        var str = "";
        // If the number is negative, add the minus sign to the string and consume the token
        if (this.currentToken() === "-") {
            str += "-";
            this.consume("-");
        }
        // Parse the integer part of the number
        str += this.parseDigits();
        // If the number has a fractional part, parse it
        if (this.currentToken() === ".") {
            str += ".";
            this.consume(".");
            str += this.parseDigits();
        }
        // If the number has an exponent, parse it
        if (this.currentToken() === "e" || this.currentToken() === "E") {
            str += this.currentToken();
            this.consume();
            if (this.currentToken() === "+" || this.currentToken() === "-") {
                str += this.currentToken();
                this.consume();
            }
            str += this.parseDigits();
        }
        // Convert the parsed string to a number and return it
        return parseFloat(str);
    };
    JsonParser.prototype.parseDigits = function () {
        var str = "";
        // If the first digit is zero, add it to the string and consume the token
        if (this.currentToken() === "0") {
            str += this.currentToken();
            this.consume();
        }
        // If the first digit is between 1 and 9, parse the rest of the digits
        else if (this.currentToken() >= "1" && this.currentToken() <= "9") {
            str += this.currentToken();
            this.consume();
            while (this.currentToken() >= "0" && this.currentToken() <= "9") {
                str += this.currentToken();
                this.consume();
            }
        }
        // Otherwise, the JSON number is invalid
        else {
            throw new Error("Invalid JSON number at position ".concat(this.pos));
        }
        // Return the parsed string of digits
        return str;
    };
    JsonParser.prototype.parseEscape = function () {
        // Consume the backslash
        this.consume("\\");
        switch (this.currentToken()) {
            // If the escape sequence is a double quote, backslash, or forward slash, return the corresponding character
            case '"':
            case "\\":
            case "/":
                var c = this.currentToken();
                this.consume();
                return c;
            // If the escape sequence is a backspace, return the corresponding character
            case "b":
                this.consume();
                return "\b";
            // If the escape sequence is a form feed, return the corresponding character
            case "f":
                this.consume();
                return "\f";
            // If the escape sequence is a newline, return the corresponding character
            case "n":
                this.consume();
                return "\n";
            // If the escape sequence is a carriage return, return the corresponding character
            case "r":
                this.consume();
                return "\r";
            // If the escape sequence is a tab, return the corresponding character
            case "t":
                this.consume();
                return "\t";
            // If the escape sequence is a Unicode code point, parse it and return the corresponding character
            case "u":
                this.consume();
                var code = parseInt(this.input.substr(this.pos, 4), 16);
                if (isNaN(code)) {
                    throw new Error("Invalid Unicode escape sequence at position ".concat(this.pos));
                }
                this.pos += 4;
                return String.fromCharCode(code);
            // Otherwise, the JSON escape sequence is invalid
            default:
                throw new Error("Invalid escape sequence at position ".concat(this.pos));
        }
    };
    JsonParser.prototype.parseTrue = function () {
        this.consume("t");
        this.consume("r");
        this.consume("u");
        this.consume("e");
        return true;
    };
    JsonParser.prototype.parseFalse = function () {
        this.consume("f");
        this.consume("a");
        this.consume("l");
        this.consume("s");
        this.consume("e");
        return false;
    };
    JsonParser.prototype.parseNull = function () {
        this.consume("n");
        this.consume("u");
        this.consume("l");
        this.consume("l");
        return null;
    };
    return JsonParser;
}());
exports.JsonParser = JsonParser;
