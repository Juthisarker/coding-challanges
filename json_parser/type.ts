

type JSONValue = string | number | boolean | null | JSONObject | JSONArray;

type JSONObject = { [key: string]: JSONValue };

type JSONArray = JSONValue[];

export { JSONValue, JSONObject, JSONArray };