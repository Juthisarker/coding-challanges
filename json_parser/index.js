"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var json_parser_1 = require("./json_parser");
// let input = '"hello"';
var input = '{"name" : "juthi"}';
console.log("inputtttttttttttttttt");
var output = new json_parser_1.JsonParser(input).parse();
