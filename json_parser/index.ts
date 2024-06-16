   

   import { JsonParser } from './json_parser';

  // let input = '"hello"';
   let input = '{"name" : "juthi"}';
console.log("inputtttttttttttttttt");

   const output = new JsonParser(input).parse();