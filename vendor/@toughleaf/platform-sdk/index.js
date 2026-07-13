/*! @toughleaf/platform-sdk v0.3.2
 * Browser bundle (self-contained)
 * https://github.com/toughleaf/toughleaf-platform-sdk
 */
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

// node_modules/@sinclair/typebox/build/esm/value/guard/guard.mjs
function IsAsyncIterator(value) {
  return IsObject(value) && globalThis.Symbol.asyncIterator in value;
}
function IsIterator(value) {
  return IsObject(value) && globalThis.Symbol.iterator in value;
}
function IsPromise(value) {
  return value instanceof globalThis.Promise;
}
function IsDate(value) {
  return value instanceof Date && globalThis.Number.isFinite(value.getTime());
}
function IsUint8Array(value) {
  return value instanceof globalThis.Uint8Array;
}
function IsObject(value) {
  return value !== null && typeof value === "object";
}
function IsArray(value) {
  return globalThis.Array.isArray(value) && !globalThis.ArrayBuffer.isView(value);
}
function IsUndefined(value) {
  return value === void 0;
}
function IsNull(value) {
  return value === null;
}
function IsBoolean(value) {
  return typeof value === "boolean";
}
function IsNumber(value) {
  return typeof value === "number";
}
function IsInteger(value) {
  return globalThis.Number.isInteger(value);
}
function IsBigInt(value) {
  return typeof value === "bigint";
}
function IsString(value) {
  return typeof value === "string";
}
function IsFunction(value) {
  return typeof value === "function";
}
function IsSymbol(value) {
  return typeof value === "symbol";
}

// node_modules/@sinclair/typebox/build/esm/system/policy.mjs
var TypeSystemPolicy;
(function(TypeSystemPolicy2) {
  TypeSystemPolicy2.InstanceMode = "default";
  TypeSystemPolicy2.ExactOptionalPropertyTypes = false;
  TypeSystemPolicy2.AllowArrayObject = false;
  TypeSystemPolicy2.AllowNaN = false;
  TypeSystemPolicy2.AllowNullVoid = false;
  function IsExactOptionalProperty(value, key) {
    return TypeSystemPolicy2.ExactOptionalPropertyTypes ? key in value : value[key] !== void 0;
  }
  TypeSystemPolicy2.IsExactOptionalProperty = IsExactOptionalProperty;
  function IsObjectLike(value) {
    const isObject = IsObject(value);
    return TypeSystemPolicy2.AllowArrayObject ? isObject : isObject && !IsArray(value);
  }
  TypeSystemPolicy2.IsObjectLike = IsObjectLike;
  function IsRecordLike(value) {
    return IsObjectLike(value) && !(value instanceof Date) && !(value instanceof Uint8Array);
  }
  TypeSystemPolicy2.IsRecordLike = IsRecordLike;
  function IsNumberLike(value) {
    return TypeSystemPolicy2.AllowNaN ? IsNumber(value) : Number.isFinite(value);
  }
  TypeSystemPolicy2.IsNumberLike = IsNumberLike;
  function IsVoidLike(value) {
    const isUndefined = IsUndefined(value);
    return TypeSystemPolicy2.AllowNullVoid ? isUndefined || value === null : isUndefined;
  }
  TypeSystemPolicy2.IsVoidLike = IsVoidLike;
})(TypeSystemPolicy || (TypeSystemPolicy = {}));

// node_modules/@sinclair/typebox/build/esm/type/registry/format.mjs
var format_exports = {};
__export(format_exports, {
  Clear: () => Clear,
  Delete: () => Delete,
  Entries: () => Entries,
  Get: () => Get,
  Has: () => Has,
  Set: () => Set2
});
var map = /* @__PURE__ */ new Map();
function Entries() {
  return new Map(map);
}
function Clear() {
  return map.clear();
}
function Delete(format) {
  return map.delete(format);
}
function Has(format) {
  return map.has(format);
}
function Set2(format, func) {
  map.set(format, func);
}
function Get(format) {
  return map.get(format);
}

// node_modules/@sinclair/typebox/build/esm/type/registry/type.mjs
var type_exports = {};
__export(type_exports, {
  Clear: () => Clear2,
  Delete: () => Delete2,
  Entries: () => Entries2,
  Get: () => Get2,
  Has: () => Has2,
  Set: () => Set3
});
var map2 = /* @__PURE__ */ new Map();
function Entries2() {
  return new Map(map2);
}
function Clear2() {
  return map2.clear();
}
function Delete2(kind) {
  return map2.delete(kind);
}
function Has2(kind) {
  return map2.has(kind);
}
function Set3(kind, func) {
  map2.set(kind, func);
}
function Get2(kind) {
  return map2.get(kind);
}

// node_modules/@sinclair/typebox/build/esm/type/guard/value.mjs
var value_exports = {};
__export(value_exports, {
  HasPropertyKey: () => HasPropertyKey,
  IsArray: () => IsArray2,
  IsAsyncIterator: () => IsAsyncIterator2,
  IsBigInt: () => IsBigInt2,
  IsBoolean: () => IsBoolean2,
  IsDate: () => IsDate2,
  IsFunction: () => IsFunction2,
  IsIterator: () => IsIterator2,
  IsNull: () => IsNull2,
  IsNumber: () => IsNumber2,
  IsObject: () => IsObject2,
  IsRegExp: () => IsRegExp,
  IsString: () => IsString2,
  IsSymbol: () => IsSymbol2,
  IsUint8Array: () => IsUint8Array2,
  IsUndefined: () => IsUndefined2
});
function HasPropertyKey(value, key) {
  return key in value;
}
function IsAsyncIterator2(value) {
  return IsObject2(value) && !IsArray2(value) && !IsUint8Array2(value) && Symbol.asyncIterator in value;
}
function IsArray2(value) {
  return Array.isArray(value);
}
function IsBigInt2(value) {
  return typeof value === "bigint";
}
function IsBoolean2(value) {
  return typeof value === "boolean";
}
function IsDate2(value) {
  return value instanceof globalThis.Date;
}
function IsFunction2(value) {
  return typeof value === "function";
}
function IsIterator2(value) {
  return IsObject2(value) && !IsArray2(value) && !IsUint8Array2(value) && Symbol.iterator in value;
}
function IsNull2(value) {
  return value === null;
}
function IsNumber2(value) {
  return typeof value === "number";
}
function IsObject2(value) {
  return typeof value === "object" && value !== null;
}
function IsRegExp(value) {
  return value instanceof globalThis.RegExp;
}
function IsString2(value) {
  return typeof value === "string";
}
function IsSymbol2(value) {
  return typeof value === "symbol";
}
function IsUint8Array2(value) {
  return value instanceof globalThis.Uint8Array;
}
function IsUndefined2(value) {
  return value === void 0;
}

// node_modules/@sinclair/typebox/build/esm/type/create/immutable.mjs
function ImmutableArray(value) {
  return globalThis.Object.freeze(value).map((value2) => Immutable(value2));
}
function ImmutableDate(value) {
  return value;
}
function ImmutableUint8Array(value) {
  return value;
}
function ImmutableRegExp(value) {
  return value;
}
function ImmutableObject(value) {
  const result = {};
  for (const key of Object.getOwnPropertyNames(value)) {
    result[key] = Immutable(value[key]);
  }
  for (const key of Object.getOwnPropertySymbols(value)) {
    result[key] = Immutable(value[key]);
  }
  return globalThis.Object.freeze(result);
}
function Immutable(value) {
  return IsArray2(value) ? ImmutableArray(value) : IsDate2(value) ? ImmutableDate(value) : IsUint8Array2(value) ? ImmutableUint8Array(value) : IsRegExp(value) ? ImmutableRegExp(value) : IsObject2(value) ? ImmutableObject(value) : value;
}

// node_modules/@sinclair/typebox/build/esm/type/clone/value.mjs
function ArrayType(value) {
  return value.map((value2) => Visit(value2));
}
function DateType(value) {
  return new Date(value.getTime());
}
function Uint8ArrayType(value) {
  return new Uint8Array(value);
}
function RegExpType(value) {
  return new RegExp(value.source, value.flags);
}
function ObjectType(value) {
  const result = {};
  for (const key of Object.getOwnPropertyNames(value)) {
    result[key] = Visit(value[key]);
  }
  for (const key of Object.getOwnPropertySymbols(value)) {
    result[key] = Visit(value[key]);
  }
  return result;
}
function Visit(value) {
  return IsArray2(value) ? ArrayType(value) : IsDate2(value) ? DateType(value) : IsUint8Array2(value) ? Uint8ArrayType(value) : IsRegExp(value) ? RegExpType(value) : IsObject2(value) ? ObjectType(value) : value;
}
function Clone(value) {
  return Visit(value);
}

// node_modules/@sinclair/typebox/build/esm/type/create/type.mjs
function CreateType(schema, options) {
  const result = options !== void 0 ? { ...options, ...schema } : schema;
  switch (TypeSystemPolicy.InstanceMode) {
    case "freeze":
      return Immutable(result);
    case "clone":
      return Clone(result);
    default:
      return result;
  }
}

// node_modules/@sinclair/typebox/build/esm/type/symbols/symbols.mjs
var TransformKind = Symbol.for("TypeBox.Transform");
var ReadonlyKind = Symbol.for("TypeBox.Readonly");
var OptionalKind = Symbol.for("TypeBox.Optional");
var Hint = Symbol.for("TypeBox.Hint");
var Kind = Symbol.for("TypeBox.Kind");

// node_modules/@sinclair/typebox/build/esm/type/unsafe/unsafe.mjs
function Unsafe(options = {}) {
  return CreateType({ [Kind]: options[Kind] ?? "Unsafe" }, options);
}

// node_modules/@sinclair/typebox/build/esm/type/error/error.mjs
var TypeBoxError = class extends Error {
  constructor(message) {
    super(message);
  }
};

// node_modules/@sinclair/typebox/build/esm/type/mapped/mapped-result.mjs
function MappedResult(properties) {
  return CreateType({
    [Kind]: "MappedResult",
    properties
  });
}

// node_modules/@sinclair/typebox/build/esm/type/discard/discard.mjs
function DiscardKey(value, key) {
  const { [key]: _, ...rest } = value;
  return rest;
}
function Discard(value, keys) {
  return keys.reduce((acc, key) => DiscardKey(acc, key), value);
}

// node_modules/@sinclair/typebox/build/esm/type/array/array.mjs
function Array2(items, options) {
  return CreateType({ [Kind]: "Array", type: "array", items }, options);
}

// node_modules/@sinclair/typebox/build/esm/type/async-iterator/async-iterator.mjs
function AsyncIterator2(items, options) {
  return CreateType({ [Kind]: "AsyncIterator", type: "AsyncIterator", items }, options);
}

// node_modules/@sinclair/typebox/build/esm/type/constructor/constructor.mjs
function Constructor(parameters, returns, options) {
  return CreateType({ [Kind]: "Constructor", type: "Constructor", parameters, returns }, options);
}

// node_modules/@sinclair/typebox/build/esm/type/function/function.mjs
function Function2(parameters, returns, options) {
  return CreateType({ [Kind]: "Function", type: "Function", parameters, returns }, options);
}

// node_modules/@sinclair/typebox/build/esm/type/computed/computed.mjs
function Computed(target, parameters, options) {
  return CreateType({ [Kind]: "Computed", target, parameters }, options);
}

// node_modules/@sinclair/typebox/build/esm/type/never/never.mjs
function Never(options) {
  return CreateType({ [Kind]: "Never", not: {} }, options);
}

// node_modules/@sinclair/typebox/build/esm/type/guard/kind.mjs
function IsReadonly(value) {
  return IsObject2(value) && value[ReadonlyKind] === "Readonly";
}
function IsOptional(value) {
  return IsObject2(value) && value[OptionalKind] === "Optional";
}
function IsAny(value) {
  return IsKindOf(value, "Any");
}
function IsArgument(value) {
  return IsKindOf(value, "Argument");
}
function IsArray3(value) {
  return IsKindOf(value, "Array");
}
function IsAsyncIterator3(value) {
  return IsKindOf(value, "AsyncIterator");
}
function IsBigInt3(value) {
  return IsKindOf(value, "BigInt");
}
function IsBoolean3(value) {
  return IsKindOf(value, "Boolean");
}
function IsComputed(value) {
  return IsKindOf(value, "Computed");
}
function IsConstructor(value) {
  return IsKindOf(value, "Constructor");
}
function IsDate3(value) {
  return IsKindOf(value, "Date");
}
function IsFunction3(value) {
  return IsKindOf(value, "Function");
}
function IsInteger2(value) {
  return IsKindOf(value, "Integer");
}
function IsIntersect(value) {
  return IsKindOf(value, "Intersect");
}
function IsIterator3(value) {
  return IsKindOf(value, "Iterator");
}
function IsKindOf(value, kind) {
  return IsObject2(value) && Kind in value && value[Kind] === kind;
}
function IsLiteralValue(value) {
  return IsBoolean2(value) || IsNumber2(value) || IsString2(value);
}
function IsLiteral(value) {
  return IsKindOf(value, "Literal");
}
function IsMappedKey(value) {
  return IsKindOf(value, "MappedKey");
}
function IsMappedResult(value) {
  return IsKindOf(value, "MappedResult");
}
function IsNever(value) {
  return IsKindOf(value, "Never");
}
function IsNot(value) {
  return IsKindOf(value, "Not");
}
function IsNull3(value) {
  return IsKindOf(value, "Null");
}
function IsNumber3(value) {
  return IsKindOf(value, "Number");
}
function IsObject3(value) {
  return IsKindOf(value, "Object");
}
function IsPromise2(value) {
  return IsKindOf(value, "Promise");
}
function IsRecord(value) {
  return IsKindOf(value, "Record");
}
function IsRef(value) {
  return IsKindOf(value, "Ref");
}
function IsRegExp2(value) {
  return IsKindOf(value, "RegExp");
}
function IsString3(value) {
  return IsKindOf(value, "String");
}
function IsSymbol3(value) {
  return IsKindOf(value, "Symbol");
}
function IsTemplateLiteral(value) {
  return IsKindOf(value, "TemplateLiteral");
}
function IsThis(value) {
  return IsKindOf(value, "This");
}
function IsTransform(value) {
  return IsObject2(value) && TransformKind in value;
}
function IsTuple(value) {
  return IsKindOf(value, "Tuple");
}
function IsUndefined3(value) {
  return IsKindOf(value, "Undefined");
}
function IsUnion(value) {
  return IsKindOf(value, "Union");
}
function IsUint8Array3(value) {
  return IsKindOf(value, "Uint8Array");
}
function IsUnknown(value) {
  return IsKindOf(value, "Unknown");
}
function IsUnsafe(value) {
  return IsKindOf(value, "Unsafe");
}
function IsVoid(value) {
  return IsKindOf(value, "Void");
}
function IsKind(value) {
  return IsObject2(value) && Kind in value && IsString2(value[Kind]);
}
function IsSchema(value) {
  return IsAny(value) || IsArgument(value) || IsArray3(value) || IsBoolean3(value) || IsBigInt3(value) || IsAsyncIterator3(value) || IsComputed(value) || IsConstructor(value) || IsDate3(value) || IsFunction3(value) || IsInteger2(value) || IsIntersect(value) || IsIterator3(value) || IsLiteral(value) || IsMappedKey(value) || IsMappedResult(value) || IsNever(value) || IsNot(value) || IsNull3(value) || IsNumber3(value) || IsObject3(value) || IsPromise2(value) || IsRecord(value) || IsRef(value) || IsRegExp2(value) || IsString3(value) || IsSymbol3(value) || IsTemplateLiteral(value) || IsThis(value) || IsTuple(value) || IsUndefined3(value) || IsUnion(value) || IsUint8Array3(value) || IsUnknown(value) || IsUnsafe(value) || IsVoid(value) || IsKind(value);
}

// node_modules/@sinclair/typebox/build/esm/type/optional/optional.mjs
function RemoveOptional(schema) {
  return CreateType(Discard(schema, [OptionalKind]));
}
function AddOptional(schema) {
  return CreateType({ ...schema, [OptionalKind]: "Optional" });
}
function OptionalWithFlag(schema, F) {
  return F === false ? RemoveOptional(schema) : AddOptional(schema);
}
function Optional(schema, enable) {
  const F = enable ?? true;
  return IsMappedResult(schema) ? OptionalFromMappedResult(schema, F) : OptionalWithFlag(schema, F);
}

// node_modules/@sinclair/typebox/build/esm/type/optional/optional-from-mapped-result.mjs
function FromProperties(P, F) {
  const Acc = {};
  for (const K2 of globalThis.Object.getOwnPropertyNames(P))
    Acc[K2] = Optional(P[K2], F);
  return Acc;
}
function FromMappedResult(R, F) {
  return FromProperties(R.properties, F);
}
function OptionalFromMappedResult(R, F) {
  const P = FromMappedResult(R, F);
  return MappedResult(P);
}

// node_modules/@sinclair/typebox/build/esm/type/intersect/intersect-create.mjs
function IntersectCreate(T, options = {}) {
  const allObjects = T.every((schema) => IsObject3(schema));
  const clonedUnevaluatedProperties = IsSchema(options.unevaluatedProperties) ? { unevaluatedProperties: options.unevaluatedProperties } : {};
  return CreateType(options.unevaluatedProperties === false || IsSchema(options.unevaluatedProperties) || allObjects ? { ...clonedUnevaluatedProperties, [Kind]: "Intersect", type: "object", allOf: T } : { ...clonedUnevaluatedProperties, [Kind]: "Intersect", allOf: T }, options);
}

// node_modules/@sinclair/typebox/build/esm/type/intersect/intersect-evaluated.mjs
function IsIntersectOptional(types) {
  return types.every((left) => IsOptional(left));
}
function RemoveOptionalFromType(type) {
  return Discard(type, [OptionalKind]);
}
function RemoveOptionalFromRest(types) {
  return types.map((left) => IsOptional(left) ? RemoveOptionalFromType(left) : left);
}
function ResolveIntersect(types, options) {
  return IsIntersectOptional(types) ? Optional(IntersectCreate(RemoveOptionalFromRest(types), options)) : IntersectCreate(RemoveOptionalFromRest(types), options);
}
function IntersectEvaluated(types, options = {}) {
  if (types.length === 1)
    return CreateType(types[0], options);
  if (types.length === 0)
    return Never(options);
  if (types.some((schema) => IsTransform(schema)))
    throw new Error("Cannot intersect transform types");
  return ResolveIntersect(types, options);
}

// node_modules/@sinclair/typebox/build/esm/type/intersect/intersect.mjs
function Intersect(types, options) {
  if (types.length === 1)
    return CreateType(types[0], options);
  if (types.length === 0)
    return Never(options);
  if (types.some((schema) => IsTransform(schema)))
    throw new Error("Cannot intersect transform types");
  return IntersectCreate(types, options);
}

// node_modules/@sinclair/typebox/build/esm/type/union/union-create.mjs
function UnionCreate(T, options) {
  return CreateType({ [Kind]: "Union", anyOf: T }, options);
}

// node_modules/@sinclair/typebox/build/esm/type/union/union-evaluated.mjs
function IsUnionOptional(types) {
  return types.some((type) => IsOptional(type));
}
function RemoveOptionalFromRest2(types) {
  return types.map((left) => IsOptional(left) ? RemoveOptionalFromType2(left) : left);
}
function RemoveOptionalFromType2(T) {
  return Discard(T, [OptionalKind]);
}
function ResolveUnion(types, options) {
  const isOptional = IsUnionOptional(types);
  return isOptional ? Optional(UnionCreate(RemoveOptionalFromRest2(types), options)) : UnionCreate(RemoveOptionalFromRest2(types), options);
}
function UnionEvaluated(T, options) {
  return T.length === 1 ? CreateType(T[0], options) : T.length === 0 ? Never(options) : ResolveUnion(T, options);
}

// node_modules/@sinclair/typebox/build/esm/type/union/union.mjs
function Union(types, options) {
  return types.length === 0 ? Never(options) : types.length === 1 ? CreateType(types[0], options) : UnionCreate(types, options);
}

// node_modules/@sinclair/typebox/build/esm/type/template-literal/parse.mjs
var TemplateLiteralParserError = class extends TypeBoxError {
};
function Unescape(pattern) {
  return pattern.replace(/\\\$/g, "$").replace(/\\\*/g, "*").replace(/\\\^/g, "^").replace(/\\\|/g, "|").replace(/\\\(/g, "(").replace(/\\\)/g, ")");
}
function IsNonEscaped(pattern, index, char) {
  return pattern[index] === char && pattern.charCodeAt(index - 1) !== 92;
}
function IsOpenParen(pattern, index) {
  return IsNonEscaped(pattern, index, "(");
}
function IsCloseParen(pattern, index) {
  return IsNonEscaped(pattern, index, ")");
}
function IsSeparator(pattern, index) {
  return IsNonEscaped(pattern, index, "|");
}
function IsGroup(pattern) {
  if (!(IsOpenParen(pattern, 0) && IsCloseParen(pattern, pattern.length - 1)))
    return false;
  let count = 0;
  for (let index = 0; index < pattern.length; index++) {
    if (IsOpenParen(pattern, index))
      count += 1;
    if (IsCloseParen(pattern, index))
      count -= 1;
    if (count === 0 && index !== pattern.length - 1)
      return false;
  }
  return true;
}
function InGroup(pattern) {
  return pattern.slice(1, pattern.length - 1);
}
function IsPrecedenceOr(pattern) {
  let count = 0;
  for (let index = 0; index < pattern.length; index++) {
    if (IsOpenParen(pattern, index))
      count += 1;
    if (IsCloseParen(pattern, index))
      count -= 1;
    if (IsSeparator(pattern, index) && count === 0)
      return true;
  }
  return false;
}
function IsPrecedenceAnd(pattern) {
  for (let index = 0; index < pattern.length; index++) {
    if (IsOpenParen(pattern, index))
      return true;
  }
  return false;
}
function Or(pattern) {
  let [count, start] = [0, 0];
  const expressions = [];
  for (let index = 0; index < pattern.length; index++) {
    if (IsOpenParen(pattern, index))
      count += 1;
    if (IsCloseParen(pattern, index))
      count -= 1;
    if (IsSeparator(pattern, index) && count === 0) {
      const range2 = pattern.slice(start, index);
      if (range2.length > 0)
        expressions.push(TemplateLiteralParse(range2));
      start = index + 1;
    }
  }
  const range = pattern.slice(start);
  if (range.length > 0)
    expressions.push(TemplateLiteralParse(range));
  if (expressions.length === 0)
    return { type: "const", const: "" };
  if (expressions.length === 1)
    return expressions[0];
  return { type: "or", expr: expressions };
}
function And(pattern) {
  function Group(value, index) {
    if (!IsOpenParen(value, index))
      throw new TemplateLiteralParserError(`TemplateLiteralParser: Index must point to open parens`);
    let count = 0;
    for (let scan = index; scan < value.length; scan++) {
      if (IsOpenParen(value, scan))
        count += 1;
      if (IsCloseParen(value, scan))
        count -= 1;
      if (count === 0)
        return [index, scan];
    }
    throw new TemplateLiteralParserError(`TemplateLiteralParser: Unclosed group parens in expression`);
  }
  function Range(pattern2, index) {
    for (let scan = index; scan < pattern2.length; scan++) {
      if (IsOpenParen(pattern2, scan))
        return [index, scan];
    }
    return [index, pattern2.length];
  }
  const expressions = [];
  for (let index = 0; index < pattern.length; index++) {
    if (IsOpenParen(pattern, index)) {
      const [start, end] = Group(pattern, index);
      const range = pattern.slice(start, end + 1);
      expressions.push(TemplateLiteralParse(range));
      index = end;
    } else {
      const [start, end] = Range(pattern, index);
      const range = pattern.slice(start, end);
      if (range.length > 0)
        expressions.push(TemplateLiteralParse(range));
      index = end - 1;
    }
  }
  return expressions.length === 0 ? { type: "const", const: "" } : expressions.length === 1 ? expressions[0] : { type: "and", expr: expressions };
}
function TemplateLiteralParse(pattern) {
  return IsGroup(pattern) ? TemplateLiteralParse(InGroup(pattern)) : IsPrecedenceOr(pattern) ? Or(pattern) : IsPrecedenceAnd(pattern) ? And(pattern) : { type: "const", const: Unescape(pattern) };
}
function TemplateLiteralParseExact(pattern) {
  return TemplateLiteralParse(pattern.slice(1, pattern.length - 1));
}

// node_modules/@sinclair/typebox/build/esm/type/template-literal/finite.mjs
var TemplateLiteralFiniteError = class extends TypeBoxError {
};
function IsNumberExpression(expression) {
  return expression.type === "or" && expression.expr.length === 2 && expression.expr[0].type === "const" && expression.expr[0].const === "0" && expression.expr[1].type === "const" && expression.expr[1].const === "[1-9][0-9]*";
}
function IsBooleanExpression(expression) {
  return expression.type === "or" && expression.expr.length === 2 && expression.expr[0].type === "const" && expression.expr[0].const === "true" && expression.expr[1].type === "const" && expression.expr[1].const === "false";
}
function IsStringExpression(expression) {
  return expression.type === "const" && expression.const === ".*";
}
function IsTemplateLiteralExpressionFinite(expression) {
  return IsNumberExpression(expression) || IsStringExpression(expression) ? false : IsBooleanExpression(expression) ? true : expression.type === "and" ? expression.expr.every((expr) => IsTemplateLiteralExpressionFinite(expr)) : expression.type === "or" ? expression.expr.every((expr) => IsTemplateLiteralExpressionFinite(expr)) : expression.type === "const" ? true : (() => {
    throw new TemplateLiteralFiniteError(`Unknown expression type`);
  })();
}
function IsTemplateLiteralFinite(schema) {
  const expression = TemplateLiteralParseExact(schema.pattern);
  return IsTemplateLiteralExpressionFinite(expression);
}

// node_modules/@sinclair/typebox/build/esm/type/template-literal/generate.mjs
var TemplateLiteralGenerateError = class extends TypeBoxError {
};
function* GenerateReduce(buffer) {
  if (buffer.length === 1)
    return yield* buffer[0];
  for (const left of buffer[0]) {
    for (const right of GenerateReduce(buffer.slice(1))) {
      yield `${left}${right}`;
    }
  }
}
function* GenerateAnd(expression) {
  return yield* GenerateReduce(expression.expr.map((expr) => [...TemplateLiteralExpressionGenerate(expr)]));
}
function* GenerateOr(expression) {
  for (const expr of expression.expr)
    yield* TemplateLiteralExpressionGenerate(expr);
}
function* GenerateConst(expression) {
  return yield expression.const;
}
function* TemplateLiteralExpressionGenerate(expression) {
  return expression.type === "and" ? yield* GenerateAnd(expression) : expression.type === "or" ? yield* GenerateOr(expression) : expression.type === "const" ? yield* GenerateConst(expression) : (() => {
    throw new TemplateLiteralGenerateError("Unknown expression");
  })();
}
function TemplateLiteralGenerate(schema) {
  const expression = TemplateLiteralParseExact(schema.pattern);
  return IsTemplateLiteralExpressionFinite(expression) ? [...TemplateLiteralExpressionGenerate(expression)] : [];
}

// node_modules/@sinclair/typebox/build/esm/type/literal/literal.mjs
function Literal(value, options) {
  return CreateType({
    [Kind]: "Literal",
    const: value,
    type: typeof value
  }, options);
}

// node_modules/@sinclair/typebox/build/esm/type/boolean/boolean.mjs
function Boolean(options) {
  return CreateType({ [Kind]: "Boolean", type: "boolean" }, options);
}

// node_modules/@sinclair/typebox/build/esm/type/bigint/bigint.mjs
function BigInt2(options) {
  return CreateType({ [Kind]: "BigInt", type: "bigint" }, options);
}

// node_modules/@sinclair/typebox/build/esm/type/number/number.mjs
function Number2(options) {
  return CreateType({ [Kind]: "Number", type: "number" }, options);
}

// node_modules/@sinclair/typebox/build/esm/type/string/string.mjs
function String2(options) {
  return CreateType({ [Kind]: "String", type: "string" }, options);
}

// node_modules/@sinclair/typebox/build/esm/type/template-literal/syntax.mjs
function* FromUnion(syntax) {
  const trim = syntax.trim().replace(/"|'/g, "");
  return trim === "boolean" ? yield Boolean() : trim === "number" ? yield Number2() : trim === "bigint" ? yield BigInt2() : trim === "string" ? yield String2() : yield (() => {
    const literals = trim.split("|").map((literal) => Literal(literal.trim()));
    return literals.length === 0 ? Never() : literals.length === 1 ? literals[0] : UnionEvaluated(literals);
  })();
}
function* FromTerminal(syntax) {
  if (syntax[1] !== "{") {
    const L = Literal("$");
    const R = FromSyntax(syntax.slice(1));
    return yield* [L, ...R];
  }
  for (let i = 2; i < syntax.length; i++) {
    if (syntax[i] === "}") {
      const L = FromUnion(syntax.slice(2, i));
      const R = FromSyntax(syntax.slice(i + 1));
      return yield* [...L, ...R];
    }
  }
  yield Literal(syntax);
}
function* FromSyntax(syntax) {
  for (let i = 0; i < syntax.length; i++) {
    if (syntax[i] === "$") {
      const L = Literal(syntax.slice(0, i));
      const R = FromTerminal(syntax.slice(i));
      return yield* [L, ...R];
    }
  }
  yield Literal(syntax);
}
function TemplateLiteralSyntax(syntax) {
  return [...FromSyntax(syntax)];
}

// node_modules/@sinclair/typebox/build/esm/type/patterns/patterns.mjs
var PatternBoolean = "(true|false)";
var PatternNumber = "(0|[1-9][0-9]*)";
var PatternString = "(.*)";
var PatternNever = "(?!.*)";
var PatternBooleanExact = `^${PatternBoolean}$`;
var PatternNumberExact = `^${PatternNumber}$`;
var PatternStringExact = `^${PatternString}$`;
var PatternNeverExact = `^${PatternNever}$`;

// node_modules/@sinclair/typebox/build/esm/type/template-literal/pattern.mjs
var TemplateLiteralPatternError = class extends TypeBoxError {
};
function Escape(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function Visit2(schema, acc) {
  return IsTemplateLiteral(schema) ? schema.pattern.slice(1, schema.pattern.length - 1) : IsUnion(schema) ? `(${schema.anyOf.map((schema2) => Visit2(schema2, acc)).join("|")})` : IsNumber3(schema) ? `${acc}${PatternNumber}` : IsInteger2(schema) ? `${acc}${PatternNumber}` : IsBigInt3(schema) ? `${acc}${PatternNumber}` : IsString3(schema) ? `${acc}${PatternString}` : IsLiteral(schema) ? `${acc}${Escape(schema.const.toString())}` : IsBoolean3(schema) ? `${acc}${PatternBoolean}` : (() => {
    throw new TemplateLiteralPatternError(`Unexpected Kind '${schema[Kind]}'`);
  })();
}
function TemplateLiteralPattern(kinds) {
  return `^${kinds.map((schema) => Visit2(schema, "")).join("")}$`;
}

// node_modules/@sinclair/typebox/build/esm/type/template-literal/union.mjs
function TemplateLiteralToUnion(schema) {
  const R = TemplateLiteralGenerate(schema);
  const L = R.map((S) => Literal(S));
  return UnionEvaluated(L);
}

// node_modules/@sinclair/typebox/build/esm/type/template-literal/template-literal.mjs
function TemplateLiteral(unresolved, options) {
  const pattern = IsString2(unresolved) ? TemplateLiteralPattern(TemplateLiteralSyntax(unresolved)) : TemplateLiteralPattern(unresolved);
  return CreateType({ [Kind]: "TemplateLiteral", type: "string", pattern }, options);
}

// node_modules/@sinclair/typebox/build/esm/type/indexed/indexed-property-keys.mjs
function FromTemplateLiteral(templateLiteral) {
  const keys = TemplateLiteralGenerate(templateLiteral);
  return keys.map((key) => key.toString());
}
function FromUnion2(types) {
  const result = [];
  for (const type of types)
    result.push(...IndexPropertyKeys(type));
  return result;
}
function FromLiteral(literalValue) {
  return [literalValue.toString()];
}
function IndexPropertyKeys(type) {
  return [...new Set(IsTemplateLiteral(type) ? FromTemplateLiteral(type) : IsUnion(type) ? FromUnion2(type.anyOf) : IsLiteral(type) ? FromLiteral(type.const) : IsNumber3(type) ? ["[number]"] : IsInteger2(type) ? ["[number]"] : [])];
}

// node_modules/@sinclair/typebox/build/esm/type/indexed/indexed-from-mapped-result.mjs
function FromProperties2(type, properties, options) {
  const result = {};
  for (const K2 of Object.getOwnPropertyNames(properties)) {
    result[K2] = Index(type, IndexPropertyKeys(properties[K2]), options);
  }
  return result;
}
function FromMappedResult2(type, mappedResult, options) {
  return FromProperties2(type, mappedResult.properties, options);
}
function IndexFromMappedResult(type, mappedResult, options) {
  const properties = FromMappedResult2(type, mappedResult, options);
  return MappedResult(properties);
}

// node_modules/@sinclair/typebox/build/esm/type/indexed/indexed.mjs
function FromRest(types, key) {
  return types.map((type) => IndexFromPropertyKey(type, key));
}
function FromIntersectRest(types) {
  return types.filter((type) => !IsNever(type));
}
function FromIntersect(types, key) {
  return IntersectEvaluated(FromIntersectRest(FromRest(types, key)));
}
function FromUnionRest(types) {
  return types.some((L) => IsNever(L)) ? [] : types;
}
function FromUnion3(types, key) {
  return UnionEvaluated(FromUnionRest(FromRest(types, key)));
}
function FromTuple(types, key) {
  return key in types ? types[key] : key === "[number]" ? UnionEvaluated(types) : Never();
}
function FromArray(type, key) {
  return key === "[number]" ? type : Never();
}
function FromProperty(properties, propertyKey) {
  return propertyKey in properties ? properties[propertyKey] : Never();
}
function IndexFromPropertyKey(type, propertyKey) {
  return IsIntersect(type) ? FromIntersect(type.allOf, propertyKey) : IsUnion(type) ? FromUnion3(type.anyOf, propertyKey) : IsTuple(type) ? FromTuple(type.items ?? [], propertyKey) : IsArray3(type) ? FromArray(type.items, propertyKey) : IsObject3(type) ? FromProperty(type.properties, propertyKey) : Never();
}
function IndexFromPropertyKeys(type, propertyKeys) {
  return propertyKeys.map((propertyKey) => IndexFromPropertyKey(type, propertyKey));
}
function FromSchema(type, propertyKeys) {
  return UnionEvaluated(IndexFromPropertyKeys(type, propertyKeys));
}
function Index(type, key, options) {
  if (IsRef(type) || IsRef(key)) {
    const error = `Index types using Ref parameters require both Type and Key to be of TSchema`;
    if (!IsSchema(type) || !IsSchema(key))
      throw new TypeBoxError(error);
    return Computed("Index", [type, key]);
  }
  if (IsMappedResult(key))
    return IndexFromMappedResult(type, key, options);
  if (IsMappedKey(key))
    return IndexFromMappedKey(type, key, options);
  return CreateType(IsSchema(key) ? FromSchema(type, IndexPropertyKeys(key)) : FromSchema(type, key), options);
}

// node_modules/@sinclair/typebox/build/esm/type/indexed/indexed-from-mapped-key.mjs
function MappedIndexPropertyKey(type, key, options) {
  return { [key]: Index(type, [key], Clone(options)) };
}
function MappedIndexPropertyKeys(type, propertyKeys, options) {
  return propertyKeys.reduce((result, left) => {
    return { ...result, ...MappedIndexPropertyKey(type, left, options) };
  }, {});
}
function MappedIndexProperties(type, mappedKey, options) {
  return MappedIndexPropertyKeys(type, mappedKey.keys, options);
}
function IndexFromMappedKey(type, mappedKey, options) {
  const properties = MappedIndexProperties(type, mappedKey, options);
  return MappedResult(properties);
}

// node_modules/@sinclair/typebox/build/esm/type/iterator/iterator.mjs
function Iterator2(items, options) {
  return CreateType({ [Kind]: "Iterator", type: "Iterator", items }, options);
}

// node_modules/@sinclair/typebox/build/esm/type/object/object.mjs
function RequiredArray(properties) {
  return globalThis.Object.keys(properties).filter((key) => !IsOptional(properties[key]));
}
function _Object(properties, options) {
  const required = RequiredArray(properties);
  const schema = required.length > 0 ? { [Kind]: "Object", type: "object", required, properties } : { [Kind]: "Object", type: "object", properties };
  return CreateType(schema, options);
}
var Object2 = _Object;

// node_modules/@sinclair/typebox/build/esm/type/promise/promise.mjs
function Promise2(item, options) {
  return CreateType({ [Kind]: "Promise", type: "Promise", item }, options);
}

// node_modules/@sinclair/typebox/build/esm/type/readonly/readonly.mjs
function RemoveReadonly(schema) {
  return CreateType(Discard(schema, [ReadonlyKind]));
}
function AddReadonly(schema) {
  return CreateType({ ...schema, [ReadonlyKind]: "Readonly" });
}
function ReadonlyWithFlag(schema, F) {
  return F === false ? RemoveReadonly(schema) : AddReadonly(schema);
}
function Readonly(schema, enable) {
  const F = enable ?? true;
  return IsMappedResult(schema) ? ReadonlyFromMappedResult(schema, F) : ReadonlyWithFlag(schema, F);
}

// node_modules/@sinclair/typebox/build/esm/type/readonly/readonly-from-mapped-result.mjs
function FromProperties3(K, F) {
  const Acc = {};
  for (const K2 of globalThis.Object.getOwnPropertyNames(K))
    Acc[K2] = Readonly(K[K2], F);
  return Acc;
}
function FromMappedResult3(R, F) {
  return FromProperties3(R.properties, F);
}
function ReadonlyFromMappedResult(R, F) {
  const P = FromMappedResult3(R, F);
  return MappedResult(P);
}

// node_modules/@sinclair/typebox/build/esm/type/tuple/tuple.mjs
function Tuple(types, options) {
  return CreateType(types.length > 0 ? { [Kind]: "Tuple", type: "array", items: types, additionalItems: false, minItems: types.length, maxItems: types.length } : { [Kind]: "Tuple", type: "array", minItems: types.length, maxItems: types.length }, options);
}

// node_modules/@sinclair/typebox/build/esm/type/sets/set.mjs
function SetIncludes(T, S) {
  return T.includes(S);
}
function SetDistinct(T) {
  return [...new Set(T)];
}
function SetIntersect(T, S) {
  return T.filter((L) => S.includes(L));
}
function SetIntersectManyResolve(T, Init) {
  return T.reduce((Acc, L) => {
    return SetIntersect(Acc, L);
  }, Init);
}
function SetIntersectMany(T) {
  return T.length === 1 ? T[0] : T.length > 1 ? SetIntersectManyResolve(T.slice(1), T[0]) : [];
}
function SetUnionMany(T) {
  const Acc = [];
  for (const L of T)
    Acc.push(...L);
  return Acc;
}

// node_modules/@sinclair/typebox/build/esm/type/mapped/mapped.mjs
function FromMappedResult4(K, P) {
  return K in P ? FromSchemaType(K, P[K]) : MappedResult(P);
}
function MappedKeyToKnownMappedResultProperties(K) {
  return { [K]: Literal(K) };
}
function MappedKeyToUnknownMappedResultProperties(P) {
  const Acc = {};
  for (const L of P)
    Acc[L] = Literal(L);
  return Acc;
}
function MappedKeyToMappedResultProperties(K, P) {
  return SetIncludes(P, K) ? MappedKeyToKnownMappedResultProperties(K) : MappedKeyToUnknownMappedResultProperties(P);
}
function FromMappedKey(K, P) {
  const R = MappedKeyToMappedResultProperties(K, P);
  return FromMappedResult4(K, R);
}
function FromRest2(K, T) {
  return T.map((L) => FromSchemaType(K, L));
}
function FromProperties4(K, T) {
  const Acc = {};
  for (const K2 of globalThis.Object.getOwnPropertyNames(T))
    Acc[K2] = FromSchemaType(K, T[K2]);
  return Acc;
}
function FromSchemaType(K, T) {
  const options = { ...T };
  return (
    // unevaluated modifier types
    IsOptional(T) ? Optional(FromSchemaType(K, Discard(T, [OptionalKind]))) : IsReadonly(T) ? Readonly(FromSchemaType(K, Discard(T, [ReadonlyKind]))) : (
      // unevaluated mapped types
      IsMappedResult(T) ? FromMappedResult4(K, T.properties) : IsMappedKey(T) ? FromMappedKey(K, T.keys) : (
        // unevaluated types
        IsConstructor(T) ? Constructor(FromRest2(K, T.parameters), FromSchemaType(K, T.returns), options) : IsFunction3(T) ? Function2(FromRest2(K, T.parameters), FromSchemaType(K, T.returns), options) : IsAsyncIterator3(T) ? AsyncIterator2(FromSchemaType(K, T.items), options) : IsIterator3(T) ? Iterator2(FromSchemaType(K, T.items), options) : IsIntersect(T) ? Intersect(FromRest2(K, T.allOf), options) : IsUnion(T) ? Union(FromRest2(K, T.anyOf), options) : IsTuple(T) ? Tuple(FromRest2(K, T.items ?? []), options) : IsObject3(T) ? Object2(FromProperties4(K, T.properties), options) : IsArray3(T) ? Array2(FromSchemaType(K, T.items), options) : IsPromise2(T) ? Promise2(FromSchemaType(K, T.item), options) : T
      )
    )
  );
}
function MappedFunctionReturnType(K, T) {
  const Acc = {};
  for (const L of K)
    Acc[L] = FromSchemaType(L, T);
  return Acc;
}
function Mapped(key, map3, options) {
  const K = IsSchema(key) ? IndexPropertyKeys(key) : key;
  const RT = map3({ [Kind]: "MappedKey", keys: K });
  const R = MappedFunctionReturnType(K, RT);
  return Object2(R, options);
}

// node_modules/@sinclair/typebox/build/esm/type/ref/ref.mjs
function Ref(...args) {
  const [$ref, options] = typeof args[0] === "string" ? [args[0], args[1]] : [args[0].$id, args[1]];
  if (typeof $ref !== "string")
    throw new TypeBoxError("Ref: $ref must be a string");
  return CreateType({ [Kind]: "Ref", $ref }, options);
}

// node_modules/@sinclair/typebox/build/esm/type/keyof/keyof-property-keys.mjs
function FromRest3(types) {
  const result = [];
  for (const L of types)
    result.push(KeyOfPropertyKeys(L));
  return result;
}
function FromIntersect2(types) {
  const propertyKeysArray = FromRest3(types);
  const propertyKeys = SetUnionMany(propertyKeysArray);
  return propertyKeys;
}
function FromUnion4(types) {
  const propertyKeysArray = FromRest3(types);
  const propertyKeys = SetIntersectMany(propertyKeysArray);
  return propertyKeys;
}
function FromTuple2(types) {
  return types.map((_, indexer) => indexer.toString());
}
function FromArray2(_) {
  return ["[number]"];
}
function FromProperties5(T) {
  return globalThis.Object.getOwnPropertyNames(T);
}
function FromPatternProperties(patternProperties) {
  if (!includePatternProperties)
    return [];
  const patternPropertyKeys = globalThis.Object.getOwnPropertyNames(patternProperties);
  return patternPropertyKeys.map((key) => {
    return key[0] === "^" && key[key.length - 1] === "$" ? key.slice(1, key.length - 1) : key;
  });
}
function KeyOfPropertyKeys(type) {
  return IsIntersect(type) ? FromIntersect2(type.allOf) : IsUnion(type) ? FromUnion4(type.anyOf) : IsTuple(type) ? FromTuple2(type.items ?? []) : IsArray3(type) ? FromArray2(type.items) : IsObject3(type) ? FromProperties5(type.properties) : IsRecord(type) ? FromPatternProperties(type.patternProperties) : [];
}
var includePatternProperties = false;
function KeyOfPattern(schema) {
  includePatternProperties = true;
  const keys = KeyOfPropertyKeys(schema);
  includePatternProperties = false;
  const pattern = keys.map((key) => `(${key})`);
  return `^(${pattern.join("|")})$`;
}

// node_modules/@sinclair/typebox/build/esm/type/keyof/keyof.mjs
function FromComputed(target, parameters) {
  return Computed("KeyOf", [Computed(target, parameters)]);
}
function FromRef($ref) {
  return Computed("KeyOf", [Ref($ref)]);
}
function KeyOfFromType(type, options) {
  const propertyKeys = KeyOfPropertyKeys(type);
  const propertyKeyTypes = KeyOfPropertyKeysToRest(propertyKeys);
  const result = UnionEvaluated(propertyKeyTypes);
  return CreateType(result, options);
}
function KeyOfPropertyKeysToRest(propertyKeys) {
  return propertyKeys.map((L) => L === "[number]" ? Number2() : Literal(L));
}
function KeyOf(type, options) {
  return IsComputed(type) ? FromComputed(type.target, type.parameters) : IsRef(type) ? FromRef(type.$ref) : IsMappedResult(type) ? KeyOfFromMappedResult(type, options) : KeyOfFromType(type, options);
}

// node_modules/@sinclair/typebox/build/esm/type/keyof/keyof-from-mapped-result.mjs
function FromProperties6(properties, options) {
  const result = {};
  for (const K2 of globalThis.Object.getOwnPropertyNames(properties))
    result[K2] = KeyOf(properties[K2], Clone(options));
  return result;
}
function FromMappedResult5(mappedResult, options) {
  return FromProperties6(mappedResult.properties, options);
}
function KeyOfFromMappedResult(mappedResult, options) {
  const properties = FromMappedResult5(mappedResult, options);
  return MappedResult(properties);
}

// node_modules/@sinclair/typebox/build/esm/type/extends/extends-undefined.mjs
function Intersect2(schema) {
  return schema.allOf.every((schema2) => ExtendsUndefinedCheck(schema2));
}
function Union2(schema) {
  return schema.anyOf.some((schema2) => ExtendsUndefinedCheck(schema2));
}
function Not(schema) {
  return !ExtendsUndefinedCheck(schema.not);
}
function ExtendsUndefinedCheck(schema) {
  return schema[Kind] === "Intersect" ? Intersect2(schema) : schema[Kind] === "Union" ? Union2(schema) : schema[Kind] === "Not" ? Not(schema) : schema[Kind] === "Undefined" ? true : false;
}

// node_modules/@sinclair/typebox/build/esm/errors/function.mjs
function DefaultErrorFunction(error) {
  switch (error.errorType) {
    case ValueErrorType.ArrayContains:
      return "Expected array to contain at least one matching value";
    case ValueErrorType.ArrayMaxContains:
      return `Expected array to contain no more than ${error.schema.maxContains} matching values`;
    case ValueErrorType.ArrayMinContains:
      return `Expected array to contain at least ${error.schema.minContains} matching values`;
    case ValueErrorType.ArrayMaxItems:
      return `Expected array length to be less or equal to ${error.schema.maxItems}`;
    case ValueErrorType.ArrayMinItems:
      return `Expected array length to be greater or equal to ${error.schema.minItems}`;
    case ValueErrorType.ArrayUniqueItems:
      return "Expected array elements to be unique";
    case ValueErrorType.Array:
      return "Expected array";
    case ValueErrorType.AsyncIterator:
      return "Expected AsyncIterator";
    case ValueErrorType.BigIntExclusiveMaximum:
      return `Expected bigint to be less than ${error.schema.exclusiveMaximum}`;
    case ValueErrorType.BigIntExclusiveMinimum:
      return `Expected bigint to be greater than ${error.schema.exclusiveMinimum}`;
    case ValueErrorType.BigIntMaximum:
      return `Expected bigint to be less or equal to ${error.schema.maximum}`;
    case ValueErrorType.BigIntMinimum:
      return `Expected bigint to be greater or equal to ${error.schema.minimum}`;
    case ValueErrorType.BigIntMultipleOf:
      return `Expected bigint to be a multiple of ${error.schema.multipleOf}`;
    case ValueErrorType.BigInt:
      return "Expected bigint";
    case ValueErrorType.Boolean:
      return "Expected boolean";
    case ValueErrorType.DateExclusiveMinimumTimestamp:
      return `Expected Date timestamp to be greater than ${error.schema.exclusiveMinimumTimestamp}`;
    case ValueErrorType.DateExclusiveMaximumTimestamp:
      return `Expected Date timestamp to be less than ${error.schema.exclusiveMaximumTimestamp}`;
    case ValueErrorType.DateMinimumTimestamp:
      return `Expected Date timestamp to be greater or equal to ${error.schema.minimumTimestamp}`;
    case ValueErrorType.DateMaximumTimestamp:
      return `Expected Date timestamp to be less or equal to ${error.schema.maximumTimestamp}`;
    case ValueErrorType.DateMultipleOfTimestamp:
      return `Expected Date timestamp to be a multiple of ${error.schema.multipleOfTimestamp}`;
    case ValueErrorType.Date:
      return "Expected Date";
    case ValueErrorType.Function:
      return "Expected function";
    case ValueErrorType.IntegerExclusiveMaximum:
      return `Expected integer to be less than ${error.schema.exclusiveMaximum}`;
    case ValueErrorType.IntegerExclusiveMinimum:
      return `Expected integer to be greater than ${error.schema.exclusiveMinimum}`;
    case ValueErrorType.IntegerMaximum:
      return `Expected integer to be less or equal to ${error.schema.maximum}`;
    case ValueErrorType.IntegerMinimum:
      return `Expected integer to be greater or equal to ${error.schema.minimum}`;
    case ValueErrorType.IntegerMultipleOf:
      return `Expected integer to be a multiple of ${error.schema.multipleOf}`;
    case ValueErrorType.Integer:
      return "Expected integer";
    case ValueErrorType.IntersectUnevaluatedProperties:
      return "Unexpected property";
    case ValueErrorType.Intersect:
      return "Expected all values to match";
    case ValueErrorType.Iterator:
      return "Expected Iterator";
    case ValueErrorType.Literal:
      return `Expected ${typeof error.schema.const === "string" ? `'${error.schema.const}'` : error.schema.const}`;
    case ValueErrorType.Never:
      return "Never";
    case ValueErrorType.Not:
      return "Value should not match";
    case ValueErrorType.Null:
      return "Expected null";
    case ValueErrorType.NumberExclusiveMaximum:
      return `Expected number to be less than ${error.schema.exclusiveMaximum}`;
    case ValueErrorType.NumberExclusiveMinimum:
      return `Expected number to be greater than ${error.schema.exclusiveMinimum}`;
    case ValueErrorType.NumberMaximum:
      return `Expected number to be less or equal to ${error.schema.maximum}`;
    case ValueErrorType.NumberMinimum:
      return `Expected number to be greater or equal to ${error.schema.minimum}`;
    case ValueErrorType.NumberMultipleOf:
      return `Expected number to be a multiple of ${error.schema.multipleOf}`;
    case ValueErrorType.Number:
      return "Expected number";
    case ValueErrorType.Object:
      return "Expected object";
    case ValueErrorType.ObjectAdditionalProperties:
      return "Unexpected property";
    case ValueErrorType.ObjectMaxProperties:
      return `Expected object to have no more than ${error.schema.maxProperties} properties`;
    case ValueErrorType.ObjectMinProperties:
      return `Expected object to have at least ${error.schema.minProperties} properties`;
    case ValueErrorType.ObjectRequiredProperty:
      return "Expected required property";
    case ValueErrorType.Promise:
      return "Expected Promise";
    case ValueErrorType.RegExp:
      return "Expected string to match regular expression";
    case ValueErrorType.StringFormatUnknown:
      return `Unknown format '${error.schema.format}'`;
    case ValueErrorType.StringFormat:
      return `Expected string to match '${error.schema.format}' format`;
    case ValueErrorType.StringMaxLength:
      return `Expected string length less or equal to ${error.schema.maxLength}`;
    case ValueErrorType.StringMinLength:
      return `Expected string length greater or equal to ${error.schema.minLength}`;
    case ValueErrorType.StringPattern:
      return `Expected string to match '${error.schema.pattern}'`;
    case ValueErrorType.String:
      return "Expected string";
    case ValueErrorType.Symbol:
      return "Expected symbol";
    case ValueErrorType.TupleLength:
      return `Expected tuple to have ${error.schema.maxItems || 0} elements`;
    case ValueErrorType.Tuple:
      return "Expected tuple";
    case ValueErrorType.Uint8ArrayMaxByteLength:
      return `Expected byte length less or equal to ${error.schema.maxByteLength}`;
    case ValueErrorType.Uint8ArrayMinByteLength:
      return `Expected byte length greater or equal to ${error.schema.minByteLength}`;
    case ValueErrorType.Uint8Array:
      return "Expected Uint8Array";
    case ValueErrorType.Undefined:
      return "Expected undefined";
    case ValueErrorType.Union:
      return "Expected union value";
    case ValueErrorType.Void:
      return "Expected void";
    case ValueErrorType.Kind:
      return `Expected kind '${error.schema[Kind]}'`;
    default:
      return "Unknown error type";
  }
}
var errorFunction = DefaultErrorFunction;
function GetErrorFunction() {
  return errorFunction;
}

// node_modules/@sinclair/typebox/build/esm/value/deref/deref.mjs
var TypeDereferenceError = class extends TypeBoxError {
  constructor(schema) {
    super(`Unable to dereference schema with $id '${schema.$ref}'`);
    this.schema = schema;
  }
};
function Resolve(schema, references) {
  const target = references.find((target2) => target2.$id === schema.$ref);
  if (target === void 0)
    throw new TypeDereferenceError(schema);
  return Deref(target, references);
}
function Pushref(schema, references) {
  if (!IsString(schema.$id) || references.some((target) => target.$id === schema.$id))
    return references;
  references.push(schema);
  return references;
}
function Deref(schema, references) {
  return schema[Kind] === "This" || schema[Kind] === "Ref" ? Resolve(schema, references) : schema;
}

// node_modules/@sinclair/typebox/build/esm/value/hash/hash.mjs
var ValueHashError = class extends TypeBoxError {
  constructor(value) {
    super(`Unable to hash value`);
    this.value = value;
  }
};
var ByteMarker;
(function(ByteMarker2) {
  ByteMarker2[ByteMarker2["Undefined"] = 0] = "Undefined";
  ByteMarker2[ByteMarker2["Null"] = 1] = "Null";
  ByteMarker2[ByteMarker2["Boolean"] = 2] = "Boolean";
  ByteMarker2[ByteMarker2["Number"] = 3] = "Number";
  ByteMarker2[ByteMarker2["String"] = 4] = "String";
  ByteMarker2[ByteMarker2["Object"] = 5] = "Object";
  ByteMarker2[ByteMarker2["Array"] = 6] = "Array";
  ByteMarker2[ByteMarker2["Date"] = 7] = "Date";
  ByteMarker2[ByteMarker2["Uint8Array"] = 8] = "Uint8Array";
  ByteMarker2[ByteMarker2["Symbol"] = 9] = "Symbol";
  ByteMarker2[ByteMarker2["BigInt"] = 10] = "BigInt";
})(ByteMarker || (ByteMarker = {}));
var Accumulator = BigInt("14695981039346656037");
var [Prime, Size] = [BigInt("1099511628211"), BigInt(
  "18446744073709551616"
  /* 2 ^ 64 */
)];
var Bytes = Array.from({ length: 256 }).map((_, i) => BigInt(i));
var F64 = new Float64Array(1);
var F64In = new DataView(F64.buffer);
var F64Out = new Uint8Array(F64.buffer);
function* NumberToBytes(value) {
  const byteCount = value === 0 ? 1 : Math.ceil(Math.floor(Math.log2(value) + 1) / 8);
  for (let i = 0; i < byteCount; i++) {
    yield value >> 8 * (byteCount - 1 - i) & 255;
  }
}
function ArrayType2(value) {
  FNV1A64(ByteMarker.Array);
  for (const item of value) {
    Visit3(item);
  }
}
function BooleanType(value) {
  FNV1A64(ByteMarker.Boolean);
  FNV1A64(value ? 1 : 0);
}
function BigIntType(value) {
  FNV1A64(ByteMarker.BigInt);
  F64In.setBigInt64(0, value);
  for (const byte of F64Out) {
    FNV1A64(byte);
  }
}
function DateType2(value) {
  FNV1A64(ByteMarker.Date);
  Visit3(value.getTime());
}
function NullType(value) {
  FNV1A64(ByteMarker.Null);
}
function NumberType(value) {
  FNV1A64(ByteMarker.Number);
  F64In.setFloat64(0, value);
  for (const byte of F64Out) {
    FNV1A64(byte);
  }
}
function ObjectType2(value) {
  FNV1A64(ByteMarker.Object);
  for (const key of globalThis.Object.getOwnPropertyNames(value).sort()) {
    Visit3(key);
    Visit3(value[key]);
  }
}
function StringType(value) {
  FNV1A64(ByteMarker.String);
  for (let i = 0; i < value.length; i++) {
    for (const byte of NumberToBytes(value.charCodeAt(i))) {
      FNV1A64(byte);
    }
  }
}
function SymbolType(value) {
  FNV1A64(ByteMarker.Symbol);
  Visit3(value.description);
}
function Uint8ArrayType2(value) {
  FNV1A64(ByteMarker.Uint8Array);
  for (let i = 0; i < value.length; i++) {
    FNV1A64(value[i]);
  }
}
function UndefinedType(value) {
  return FNV1A64(ByteMarker.Undefined);
}
function Visit3(value) {
  if (IsArray(value))
    return ArrayType2(value);
  if (IsBoolean(value))
    return BooleanType(value);
  if (IsBigInt(value))
    return BigIntType(value);
  if (IsDate(value))
    return DateType2(value);
  if (IsNull(value))
    return NullType(value);
  if (IsNumber(value))
    return NumberType(value);
  if (IsObject(value))
    return ObjectType2(value);
  if (IsString(value))
    return StringType(value);
  if (IsSymbol(value))
    return SymbolType(value);
  if (IsUint8Array(value))
    return Uint8ArrayType2(value);
  if (IsUndefined(value))
    return UndefinedType(value);
  throw new ValueHashError(value);
}
function FNV1A64(byte) {
  Accumulator = Accumulator ^ Bytes[byte];
  Accumulator = Accumulator * Prime % Size;
}
function Hash(value) {
  Accumulator = BigInt("14695981039346656037");
  Visit3(value);
  return Accumulator;
}

// node_modules/@sinclair/typebox/build/esm/type/any/any.mjs
function Any(options) {
  return CreateType({ [Kind]: "Any" }, options);
}

// node_modules/@sinclair/typebox/build/esm/type/unknown/unknown.mjs
function Unknown(options) {
  return CreateType({ [Kind]: "Unknown" }, options);
}

// node_modules/@sinclair/typebox/build/esm/type/guard/type.mjs
var type_exports2 = {};
__export(type_exports2, {
  IsAny: () => IsAny2,
  IsArgument: () => IsArgument2,
  IsArray: () => IsArray4,
  IsAsyncIterator: () => IsAsyncIterator4,
  IsBigInt: () => IsBigInt4,
  IsBoolean: () => IsBoolean4,
  IsComputed: () => IsComputed2,
  IsConstructor: () => IsConstructor2,
  IsDate: () => IsDate4,
  IsFunction: () => IsFunction4,
  IsImport: () => IsImport,
  IsInteger: () => IsInteger3,
  IsIntersect: () => IsIntersect2,
  IsIterator: () => IsIterator4,
  IsKind: () => IsKind2,
  IsKindOf: () => IsKindOf2,
  IsLiteral: () => IsLiteral2,
  IsLiteralBoolean: () => IsLiteralBoolean,
  IsLiteralNumber: () => IsLiteralNumber,
  IsLiteralString: () => IsLiteralString,
  IsLiteralValue: () => IsLiteralValue2,
  IsMappedKey: () => IsMappedKey2,
  IsMappedResult: () => IsMappedResult2,
  IsNever: () => IsNever2,
  IsNot: () => IsNot2,
  IsNull: () => IsNull4,
  IsNumber: () => IsNumber4,
  IsObject: () => IsObject4,
  IsOptional: () => IsOptional2,
  IsPromise: () => IsPromise3,
  IsProperties: () => IsProperties,
  IsReadonly: () => IsReadonly2,
  IsRecord: () => IsRecord2,
  IsRecursive: () => IsRecursive,
  IsRef: () => IsRef2,
  IsRegExp: () => IsRegExp3,
  IsSchema: () => IsSchema2,
  IsString: () => IsString4,
  IsSymbol: () => IsSymbol4,
  IsTemplateLiteral: () => IsTemplateLiteral2,
  IsThis: () => IsThis2,
  IsTransform: () => IsTransform2,
  IsTuple: () => IsTuple2,
  IsUint8Array: () => IsUint8Array4,
  IsUndefined: () => IsUndefined4,
  IsUnion: () => IsUnion2,
  IsUnionLiteral: () => IsUnionLiteral,
  IsUnknown: () => IsUnknown2,
  IsUnsafe: () => IsUnsafe2,
  IsVoid: () => IsVoid2,
  TypeGuardUnknownTypeError: () => TypeGuardUnknownTypeError
});
var TypeGuardUnknownTypeError = class extends TypeBoxError {
};
var KnownTypes = [
  "Argument",
  "Any",
  "Array",
  "AsyncIterator",
  "BigInt",
  "Boolean",
  "Computed",
  "Constructor",
  "Date",
  "Enum",
  "Function",
  "Integer",
  "Intersect",
  "Iterator",
  "Literal",
  "MappedKey",
  "MappedResult",
  "Not",
  "Null",
  "Number",
  "Object",
  "Promise",
  "Record",
  "Ref",
  "RegExp",
  "String",
  "Symbol",
  "TemplateLiteral",
  "This",
  "Tuple",
  "Undefined",
  "Union",
  "Uint8Array",
  "Unknown",
  "Void"
];
function IsPattern(value) {
  try {
    new RegExp(value);
    return true;
  } catch {
    return false;
  }
}
function IsControlCharacterFree(value) {
  if (!IsString2(value))
    return false;
  for (let i = 0; i < value.length; i++) {
    const code = value.charCodeAt(i);
    if (code >= 7 && code <= 13 || code === 27 || code === 127) {
      return false;
    }
  }
  return true;
}
function IsAdditionalProperties(value) {
  return IsOptionalBoolean(value) || IsSchema2(value);
}
function IsOptionalBigInt(value) {
  return IsUndefined2(value) || IsBigInt2(value);
}
function IsOptionalNumber(value) {
  return IsUndefined2(value) || IsNumber2(value);
}
function IsOptionalBoolean(value) {
  return IsUndefined2(value) || IsBoolean2(value);
}
function IsOptionalString(value) {
  return IsUndefined2(value) || IsString2(value);
}
function IsOptionalPattern(value) {
  return IsUndefined2(value) || IsString2(value) && IsControlCharacterFree(value) && IsPattern(value);
}
function IsOptionalFormat(value) {
  return IsUndefined2(value) || IsString2(value) && IsControlCharacterFree(value);
}
function IsOptionalSchema(value) {
  return IsUndefined2(value) || IsSchema2(value);
}
function IsReadonly2(value) {
  return IsObject2(value) && value[ReadonlyKind] === "Readonly";
}
function IsOptional2(value) {
  return IsObject2(value) && value[OptionalKind] === "Optional";
}
function IsAny2(value) {
  return IsKindOf2(value, "Any") && IsOptionalString(value.$id);
}
function IsArgument2(value) {
  return IsKindOf2(value, "Argument") && IsNumber2(value.index);
}
function IsArray4(value) {
  return IsKindOf2(value, "Array") && value.type === "array" && IsOptionalString(value.$id) && IsSchema2(value.items) && IsOptionalNumber(value.minItems) && IsOptionalNumber(value.maxItems) && IsOptionalBoolean(value.uniqueItems) && IsOptionalSchema(value.contains) && IsOptionalNumber(value.minContains) && IsOptionalNumber(value.maxContains);
}
function IsAsyncIterator4(value) {
  return IsKindOf2(value, "AsyncIterator") && value.type === "AsyncIterator" && IsOptionalString(value.$id) && IsSchema2(value.items);
}
function IsBigInt4(value) {
  return IsKindOf2(value, "BigInt") && value.type === "bigint" && IsOptionalString(value.$id) && IsOptionalBigInt(value.exclusiveMaximum) && IsOptionalBigInt(value.exclusiveMinimum) && IsOptionalBigInt(value.maximum) && IsOptionalBigInt(value.minimum) && IsOptionalBigInt(value.multipleOf);
}
function IsBoolean4(value) {
  return IsKindOf2(value, "Boolean") && value.type === "boolean" && IsOptionalString(value.$id);
}
function IsComputed2(value) {
  return IsKindOf2(value, "Computed") && IsString2(value.target) && IsArray2(value.parameters) && value.parameters.every((schema) => IsSchema2(schema));
}
function IsConstructor2(value) {
  return IsKindOf2(value, "Constructor") && value.type === "Constructor" && IsOptionalString(value.$id) && IsArray2(value.parameters) && value.parameters.every((schema) => IsSchema2(schema)) && IsSchema2(value.returns);
}
function IsDate4(value) {
  return IsKindOf2(value, "Date") && value.type === "Date" && IsOptionalString(value.$id) && IsOptionalNumber(value.exclusiveMaximumTimestamp) && IsOptionalNumber(value.exclusiveMinimumTimestamp) && IsOptionalNumber(value.maximumTimestamp) && IsOptionalNumber(value.minimumTimestamp) && IsOptionalNumber(value.multipleOfTimestamp);
}
function IsFunction4(value) {
  return IsKindOf2(value, "Function") && value.type === "Function" && IsOptionalString(value.$id) && IsArray2(value.parameters) && value.parameters.every((schema) => IsSchema2(schema)) && IsSchema2(value.returns);
}
function IsImport(value) {
  return IsKindOf2(value, "Import") && HasPropertyKey(value, "$defs") && IsObject2(value.$defs) && IsProperties(value.$defs) && HasPropertyKey(value, "$ref") && IsString2(value.$ref) && value.$ref in value.$defs;
}
function IsInteger3(value) {
  return IsKindOf2(value, "Integer") && value.type === "integer" && IsOptionalString(value.$id) && IsOptionalNumber(value.exclusiveMaximum) && IsOptionalNumber(value.exclusiveMinimum) && IsOptionalNumber(value.maximum) && IsOptionalNumber(value.minimum) && IsOptionalNumber(value.multipleOf);
}
function IsProperties(value) {
  return IsObject2(value) && Object.entries(value).every(([key, schema]) => IsControlCharacterFree(key) && IsSchema2(schema));
}
function IsIntersect2(value) {
  return IsKindOf2(value, "Intersect") && (IsString2(value.type) && value.type !== "object" ? false : true) && IsArray2(value.allOf) && value.allOf.every((schema) => IsSchema2(schema) && !IsTransform2(schema)) && IsOptionalString(value.type) && (IsOptionalBoolean(value.unevaluatedProperties) || IsOptionalSchema(value.unevaluatedProperties)) && IsOptionalString(value.$id);
}
function IsIterator4(value) {
  return IsKindOf2(value, "Iterator") && value.type === "Iterator" && IsOptionalString(value.$id) && IsSchema2(value.items);
}
function IsKindOf2(value, kind) {
  return IsObject2(value) && Kind in value && value[Kind] === kind;
}
function IsLiteralString(value) {
  return IsLiteral2(value) && IsString2(value.const);
}
function IsLiteralNumber(value) {
  return IsLiteral2(value) && IsNumber2(value.const);
}
function IsLiteralBoolean(value) {
  return IsLiteral2(value) && IsBoolean2(value.const);
}
function IsLiteral2(value) {
  return IsKindOf2(value, "Literal") && IsOptionalString(value.$id) && IsLiteralValue2(value.const);
}
function IsLiteralValue2(value) {
  return IsBoolean2(value) || IsNumber2(value) || IsString2(value);
}
function IsMappedKey2(value) {
  return IsKindOf2(value, "MappedKey") && IsArray2(value.keys) && value.keys.every((key) => IsNumber2(key) || IsString2(key));
}
function IsMappedResult2(value) {
  return IsKindOf2(value, "MappedResult") && IsProperties(value.properties);
}
function IsNever2(value) {
  return IsKindOf2(value, "Never") && IsObject2(value.not) && Object.getOwnPropertyNames(value.not).length === 0;
}
function IsNot2(value) {
  return IsKindOf2(value, "Not") && IsSchema2(value.not);
}
function IsNull4(value) {
  return IsKindOf2(value, "Null") && value.type === "null" && IsOptionalString(value.$id);
}
function IsNumber4(value) {
  return IsKindOf2(value, "Number") && value.type === "number" && IsOptionalString(value.$id) && IsOptionalNumber(value.exclusiveMaximum) && IsOptionalNumber(value.exclusiveMinimum) && IsOptionalNumber(value.maximum) && IsOptionalNumber(value.minimum) && IsOptionalNumber(value.multipleOf);
}
function IsObject4(value) {
  return IsKindOf2(value, "Object") && value.type === "object" && IsOptionalString(value.$id) && IsProperties(value.properties) && IsAdditionalProperties(value.additionalProperties) && IsOptionalNumber(value.minProperties) && IsOptionalNumber(value.maxProperties);
}
function IsPromise3(value) {
  return IsKindOf2(value, "Promise") && value.type === "Promise" && IsOptionalString(value.$id) && IsSchema2(value.item);
}
function IsRecord2(value) {
  return IsKindOf2(value, "Record") && value.type === "object" && IsOptionalString(value.$id) && IsAdditionalProperties(value.additionalProperties) && IsObject2(value.patternProperties) && ((schema) => {
    const keys = Object.getOwnPropertyNames(schema.patternProperties);
    return keys.length === 1 && IsPattern(keys[0]) && IsObject2(schema.patternProperties) && IsSchema2(schema.patternProperties[keys[0]]);
  })(value);
}
function IsRecursive(value) {
  return IsObject2(value) && Hint in value && value[Hint] === "Recursive";
}
function IsRef2(value) {
  return IsKindOf2(value, "Ref") && IsOptionalString(value.$id) && IsString2(value.$ref);
}
function IsRegExp3(value) {
  return IsKindOf2(value, "RegExp") && IsOptionalString(value.$id) && IsString2(value.source) && IsString2(value.flags) && IsOptionalNumber(value.maxLength) && IsOptionalNumber(value.minLength);
}
function IsString4(value) {
  return IsKindOf2(value, "String") && value.type === "string" && IsOptionalString(value.$id) && IsOptionalNumber(value.minLength) && IsOptionalNumber(value.maxLength) && IsOptionalPattern(value.pattern) && IsOptionalFormat(value.format);
}
function IsSymbol4(value) {
  return IsKindOf2(value, "Symbol") && value.type === "symbol" && IsOptionalString(value.$id);
}
function IsTemplateLiteral2(value) {
  return IsKindOf2(value, "TemplateLiteral") && value.type === "string" && IsString2(value.pattern) && value.pattern[0] === "^" && value.pattern[value.pattern.length - 1] === "$";
}
function IsThis2(value) {
  return IsKindOf2(value, "This") && IsOptionalString(value.$id) && IsString2(value.$ref);
}
function IsTransform2(value) {
  return IsObject2(value) && TransformKind in value;
}
function IsTuple2(value) {
  return IsKindOf2(value, "Tuple") && value.type === "array" && IsOptionalString(value.$id) && IsNumber2(value.minItems) && IsNumber2(value.maxItems) && value.minItems === value.maxItems && // empty
  (IsUndefined2(value.items) && IsUndefined2(value.additionalItems) && value.minItems === 0 || IsArray2(value.items) && value.items.every((schema) => IsSchema2(schema)));
}
function IsUndefined4(value) {
  return IsKindOf2(value, "Undefined") && value.type === "undefined" && IsOptionalString(value.$id);
}
function IsUnionLiteral(value) {
  return IsUnion2(value) && value.anyOf.every((schema) => IsLiteralString(schema) || IsLiteralNumber(schema));
}
function IsUnion2(value) {
  return IsKindOf2(value, "Union") && IsOptionalString(value.$id) && IsObject2(value) && IsArray2(value.anyOf) && value.anyOf.every((schema) => IsSchema2(schema));
}
function IsUint8Array4(value) {
  return IsKindOf2(value, "Uint8Array") && value.type === "Uint8Array" && IsOptionalString(value.$id) && IsOptionalNumber(value.minByteLength) && IsOptionalNumber(value.maxByteLength);
}
function IsUnknown2(value) {
  return IsKindOf2(value, "Unknown") && IsOptionalString(value.$id);
}
function IsUnsafe2(value) {
  return IsKindOf2(value, "Unsafe");
}
function IsVoid2(value) {
  return IsKindOf2(value, "Void") && value.type === "void" && IsOptionalString(value.$id);
}
function IsKind2(value) {
  return IsObject2(value) && Kind in value && IsString2(value[Kind]) && !KnownTypes.includes(value[Kind]);
}
function IsSchema2(value) {
  return IsObject2(value) && (IsAny2(value) || IsArgument2(value) || IsArray4(value) || IsBoolean4(value) || IsBigInt4(value) || IsAsyncIterator4(value) || IsComputed2(value) || IsConstructor2(value) || IsDate4(value) || IsFunction4(value) || IsInteger3(value) || IsIntersect2(value) || IsIterator4(value) || IsLiteral2(value) || IsMappedKey2(value) || IsMappedResult2(value) || IsNever2(value) || IsNot2(value) || IsNull4(value) || IsNumber4(value) || IsObject4(value) || IsPromise3(value) || IsRecord2(value) || IsRef2(value) || IsRegExp3(value) || IsString4(value) || IsSymbol4(value) || IsTemplateLiteral2(value) || IsThis2(value) || IsTuple2(value) || IsUndefined4(value) || IsUnion2(value) || IsUint8Array4(value) || IsUnknown2(value) || IsUnsafe2(value) || IsVoid2(value) || IsKind2(value));
}

// node_modules/@sinclair/typebox/build/esm/type/extends/extends-check.mjs
var ExtendsResolverError = class extends TypeBoxError {
};
var ExtendsResult;
(function(ExtendsResult2) {
  ExtendsResult2[ExtendsResult2["Union"] = 0] = "Union";
  ExtendsResult2[ExtendsResult2["True"] = 1] = "True";
  ExtendsResult2[ExtendsResult2["False"] = 2] = "False";
})(ExtendsResult || (ExtendsResult = {}));
function IntoBooleanResult(result) {
  return result === ExtendsResult.False ? result : ExtendsResult.True;
}
function Throw(message) {
  throw new ExtendsResolverError(message);
}
function IsStructuralRight(right) {
  return type_exports2.IsNever(right) || type_exports2.IsIntersect(right) || type_exports2.IsUnion(right) || type_exports2.IsUnknown(right) || type_exports2.IsAny(right);
}
function StructuralRight(left, right) {
  return type_exports2.IsNever(right) ? FromNeverRight(left, right) : type_exports2.IsIntersect(right) ? FromIntersectRight(left, right) : type_exports2.IsUnion(right) ? FromUnionRight(left, right) : type_exports2.IsUnknown(right) ? FromUnknownRight(left, right) : type_exports2.IsAny(right) ? FromAnyRight(left, right) : Throw("StructuralRight");
}
function FromAnyRight(left, right) {
  return ExtendsResult.True;
}
function FromAny(left, right) {
  return type_exports2.IsIntersect(right) ? FromIntersectRight(left, right) : type_exports2.IsUnion(right) && right.anyOf.some((schema) => type_exports2.IsAny(schema) || type_exports2.IsUnknown(schema)) ? ExtendsResult.True : type_exports2.IsUnion(right) ? ExtendsResult.Union : type_exports2.IsUnknown(right) ? ExtendsResult.True : type_exports2.IsAny(right) ? ExtendsResult.True : ExtendsResult.Union;
}
function FromArrayRight(left, right) {
  return type_exports2.IsUnknown(left) ? ExtendsResult.False : type_exports2.IsAny(left) ? ExtendsResult.Union : type_exports2.IsNever(left) ? ExtendsResult.True : ExtendsResult.False;
}
function FromArray3(left, right) {
  return type_exports2.IsObject(right) && IsObjectArrayLike(right) ? ExtendsResult.True : IsStructuralRight(right) ? StructuralRight(left, right) : !type_exports2.IsArray(right) ? ExtendsResult.False : IntoBooleanResult(Visit4(left.items, right.items));
}
function FromAsyncIterator(left, right) {
  return IsStructuralRight(right) ? StructuralRight(left, right) : !type_exports2.IsAsyncIterator(right) ? ExtendsResult.False : IntoBooleanResult(Visit4(left.items, right.items));
}
function FromBigInt(left, right) {
  return IsStructuralRight(right) ? StructuralRight(left, right) : type_exports2.IsObject(right) ? FromObjectRight(left, right) : type_exports2.IsRecord(right) ? FromRecordRight(left, right) : type_exports2.IsBigInt(right) ? ExtendsResult.True : ExtendsResult.False;
}
function FromBooleanRight(left, right) {
  return type_exports2.IsLiteralBoolean(left) ? ExtendsResult.True : type_exports2.IsBoolean(left) ? ExtendsResult.True : ExtendsResult.False;
}
function FromBoolean(left, right) {
  return IsStructuralRight(right) ? StructuralRight(left, right) : type_exports2.IsObject(right) ? FromObjectRight(left, right) : type_exports2.IsRecord(right) ? FromRecordRight(left, right) : type_exports2.IsBoolean(right) ? ExtendsResult.True : ExtendsResult.False;
}
function FromConstructor(left, right) {
  return IsStructuralRight(right) ? StructuralRight(left, right) : type_exports2.IsObject(right) ? FromObjectRight(left, right) : !type_exports2.IsConstructor(right) ? ExtendsResult.False : left.parameters.length > right.parameters.length ? ExtendsResult.False : !left.parameters.every((schema, index) => IntoBooleanResult(Visit4(right.parameters[index], schema)) === ExtendsResult.True) ? ExtendsResult.False : IntoBooleanResult(Visit4(left.returns, right.returns));
}
function FromDate(left, right) {
  return IsStructuralRight(right) ? StructuralRight(left, right) : type_exports2.IsObject(right) ? FromObjectRight(left, right) : type_exports2.IsRecord(right) ? FromRecordRight(left, right) : type_exports2.IsDate(right) ? ExtendsResult.True : ExtendsResult.False;
}
function FromFunction(left, right) {
  return IsStructuralRight(right) ? StructuralRight(left, right) : type_exports2.IsObject(right) ? FromObjectRight(left, right) : !type_exports2.IsFunction(right) ? ExtendsResult.False : left.parameters.length > right.parameters.length ? ExtendsResult.False : !left.parameters.every((schema, index) => IntoBooleanResult(Visit4(right.parameters[index], schema)) === ExtendsResult.True) ? ExtendsResult.False : IntoBooleanResult(Visit4(left.returns, right.returns));
}
function FromIntegerRight(left, right) {
  return type_exports2.IsLiteral(left) && value_exports.IsNumber(left.const) ? ExtendsResult.True : type_exports2.IsNumber(left) || type_exports2.IsInteger(left) ? ExtendsResult.True : ExtendsResult.False;
}
function FromInteger(left, right) {
  return type_exports2.IsInteger(right) || type_exports2.IsNumber(right) ? ExtendsResult.True : IsStructuralRight(right) ? StructuralRight(left, right) : type_exports2.IsObject(right) ? FromObjectRight(left, right) : type_exports2.IsRecord(right) ? FromRecordRight(left, right) : ExtendsResult.False;
}
function FromIntersectRight(left, right) {
  return right.allOf.every((schema) => Visit4(left, schema) === ExtendsResult.True) ? ExtendsResult.True : ExtendsResult.False;
}
function FromIntersect3(left, right) {
  return left.allOf.some((schema) => Visit4(schema, right) === ExtendsResult.True) ? ExtendsResult.True : ExtendsResult.False;
}
function FromIterator(left, right) {
  return IsStructuralRight(right) ? StructuralRight(left, right) : !type_exports2.IsIterator(right) ? ExtendsResult.False : IntoBooleanResult(Visit4(left.items, right.items));
}
function FromLiteral2(left, right) {
  return type_exports2.IsLiteral(right) && right.const === left.const ? ExtendsResult.True : IsStructuralRight(right) ? StructuralRight(left, right) : type_exports2.IsObject(right) ? FromObjectRight(left, right) : type_exports2.IsRecord(right) ? FromRecordRight(left, right) : type_exports2.IsString(right) ? FromStringRight(left, right) : type_exports2.IsNumber(right) ? FromNumberRight(left, right) : type_exports2.IsInteger(right) ? FromIntegerRight(left, right) : type_exports2.IsBoolean(right) ? FromBooleanRight(left, right) : ExtendsResult.False;
}
function FromNeverRight(left, right) {
  return ExtendsResult.False;
}
function FromNever(left, right) {
  return ExtendsResult.True;
}
function UnwrapTNot(schema) {
  let [current, depth] = [schema, 0];
  while (true) {
    if (!type_exports2.IsNot(current))
      break;
    current = current.not;
    depth += 1;
  }
  return depth % 2 === 0 ? current : Unknown();
}
function FromNot(left, right) {
  return type_exports2.IsNot(left) ? Visit4(UnwrapTNot(left), right) : type_exports2.IsNot(right) ? Visit4(left, UnwrapTNot(right)) : Throw("Invalid fallthrough for Not");
}
function FromNull(left, right) {
  return IsStructuralRight(right) ? StructuralRight(left, right) : type_exports2.IsObject(right) ? FromObjectRight(left, right) : type_exports2.IsRecord(right) ? FromRecordRight(left, right) : type_exports2.IsNull(right) ? ExtendsResult.True : ExtendsResult.False;
}
function FromNumberRight(left, right) {
  return type_exports2.IsLiteralNumber(left) ? ExtendsResult.True : type_exports2.IsNumber(left) || type_exports2.IsInteger(left) ? ExtendsResult.True : ExtendsResult.False;
}
function FromNumber(left, right) {
  return IsStructuralRight(right) ? StructuralRight(left, right) : type_exports2.IsObject(right) ? FromObjectRight(left, right) : type_exports2.IsRecord(right) ? FromRecordRight(left, right) : type_exports2.IsInteger(right) || type_exports2.IsNumber(right) ? ExtendsResult.True : ExtendsResult.False;
}
function IsObjectPropertyCount(schema, count) {
  return Object.getOwnPropertyNames(schema.properties).length === count;
}
function IsObjectStringLike(schema) {
  return IsObjectArrayLike(schema);
}
function IsObjectSymbolLike(schema) {
  return IsObjectPropertyCount(schema, 0) || IsObjectPropertyCount(schema, 1) && "description" in schema.properties && type_exports2.IsUnion(schema.properties.description) && schema.properties.description.anyOf.length === 2 && (type_exports2.IsString(schema.properties.description.anyOf[0]) && type_exports2.IsUndefined(schema.properties.description.anyOf[1]) || type_exports2.IsString(schema.properties.description.anyOf[1]) && type_exports2.IsUndefined(schema.properties.description.anyOf[0]));
}
function IsObjectNumberLike(schema) {
  return IsObjectPropertyCount(schema, 0);
}
function IsObjectBooleanLike(schema) {
  return IsObjectPropertyCount(schema, 0);
}
function IsObjectBigIntLike(schema) {
  return IsObjectPropertyCount(schema, 0);
}
function IsObjectDateLike(schema) {
  return IsObjectPropertyCount(schema, 0);
}
function IsObjectUint8ArrayLike(schema) {
  return IsObjectArrayLike(schema);
}
function IsObjectFunctionLike(schema) {
  const length = Number2();
  return IsObjectPropertyCount(schema, 0) || IsObjectPropertyCount(schema, 1) && "length" in schema.properties && IntoBooleanResult(Visit4(schema.properties["length"], length)) === ExtendsResult.True;
}
function IsObjectConstructorLike(schema) {
  return IsObjectPropertyCount(schema, 0);
}
function IsObjectArrayLike(schema) {
  const length = Number2();
  return IsObjectPropertyCount(schema, 0) || IsObjectPropertyCount(schema, 1) && "length" in schema.properties && IntoBooleanResult(Visit4(schema.properties["length"], length)) === ExtendsResult.True;
}
function IsObjectPromiseLike(schema) {
  const then = Function2([Any()], Any());
  return IsObjectPropertyCount(schema, 0) || IsObjectPropertyCount(schema, 1) && "then" in schema.properties && IntoBooleanResult(Visit4(schema.properties["then"], then)) === ExtendsResult.True;
}
function Property(left, right) {
  return Visit4(left, right) === ExtendsResult.False ? ExtendsResult.False : type_exports2.IsOptional(left) && !type_exports2.IsOptional(right) ? ExtendsResult.False : ExtendsResult.True;
}
function FromObjectRight(left, right) {
  return type_exports2.IsUnknown(left) ? ExtendsResult.False : type_exports2.IsAny(left) ? ExtendsResult.Union : type_exports2.IsNever(left) || type_exports2.IsLiteralString(left) && IsObjectStringLike(right) || type_exports2.IsLiteralNumber(left) && IsObjectNumberLike(right) || type_exports2.IsLiteralBoolean(left) && IsObjectBooleanLike(right) || type_exports2.IsSymbol(left) && IsObjectSymbolLike(right) || type_exports2.IsBigInt(left) && IsObjectBigIntLike(right) || type_exports2.IsString(left) && IsObjectStringLike(right) || type_exports2.IsSymbol(left) && IsObjectSymbolLike(right) || type_exports2.IsNumber(left) && IsObjectNumberLike(right) || type_exports2.IsInteger(left) && IsObjectNumberLike(right) || type_exports2.IsBoolean(left) && IsObjectBooleanLike(right) || type_exports2.IsUint8Array(left) && IsObjectUint8ArrayLike(right) || type_exports2.IsDate(left) && IsObjectDateLike(right) || type_exports2.IsConstructor(left) && IsObjectConstructorLike(right) || type_exports2.IsFunction(left) && IsObjectFunctionLike(right) ? ExtendsResult.True : type_exports2.IsRecord(left) && type_exports2.IsString(RecordKey(left)) ? (() => {
    return right[Hint] === "Record" ? ExtendsResult.True : ExtendsResult.False;
  })() : type_exports2.IsRecord(left) && type_exports2.IsNumber(RecordKey(left)) ? (() => {
    return IsObjectPropertyCount(right, 0) ? ExtendsResult.True : ExtendsResult.False;
  })() : ExtendsResult.False;
}
function FromObject(left, right) {
  return IsStructuralRight(right) ? StructuralRight(left, right) : type_exports2.IsRecord(right) ? FromRecordRight(left, right) : !type_exports2.IsObject(right) ? ExtendsResult.False : (() => {
    for (const key of Object.getOwnPropertyNames(right.properties)) {
      if (!(key in left.properties) && !type_exports2.IsOptional(right.properties[key])) {
        return ExtendsResult.False;
      }
      if (type_exports2.IsOptional(right.properties[key])) {
        return ExtendsResult.True;
      }
      if (Property(left.properties[key], right.properties[key]) === ExtendsResult.False) {
        return ExtendsResult.False;
      }
    }
    return ExtendsResult.True;
  })();
}
function FromPromise(left, right) {
  return IsStructuralRight(right) ? StructuralRight(left, right) : type_exports2.IsObject(right) && IsObjectPromiseLike(right) ? ExtendsResult.True : !type_exports2.IsPromise(right) ? ExtendsResult.False : IntoBooleanResult(Visit4(left.item, right.item));
}
function RecordKey(schema) {
  return PatternNumberExact in schema.patternProperties ? Number2() : PatternStringExact in schema.patternProperties ? String2() : Throw("Unknown record key pattern");
}
function RecordValue(schema) {
  return PatternNumberExact in schema.patternProperties ? schema.patternProperties[PatternNumberExact] : PatternStringExact in schema.patternProperties ? schema.patternProperties[PatternStringExact] : Throw("Unable to get record value schema");
}
function FromRecordRight(left, right) {
  const [Key, Value] = [RecordKey(right), RecordValue(right)];
  return type_exports2.IsLiteralString(left) && type_exports2.IsNumber(Key) && IntoBooleanResult(Visit4(left, Value)) === ExtendsResult.True ? ExtendsResult.True : type_exports2.IsUint8Array(left) && type_exports2.IsNumber(Key) ? Visit4(left, Value) : type_exports2.IsString(left) && type_exports2.IsNumber(Key) ? Visit4(left, Value) : type_exports2.IsArray(left) && type_exports2.IsNumber(Key) ? Visit4(left, Value) : type_exports2.IsObject(left) ? (() => {
    for (const key of Object.getOwnPropertyNames(left.properties)) {
      if (Property(Value, left.properties[key]) === ExtendsResult.False) {
        return ExtendsResult.False;
      }
    }
    return ExtendsResult.True;
  })() : ExtendsResult.False;
}
function FromRecord(left, right) {
  return IsStructuralRight(right) ? StructuralRight(left, right) : type_exports2.IsObject(right) ? FromObjectRight(left, right) : !type_exports2.IsRecord(right) ? ExtendsResult.False : Visit4(RecordValue(left), RecordValue(right));
}
function FromRegExp(left, right) {
  const L = type_exports2.IsRegExp(left) ? String2() : left;
  const R = type_exports2.IsRegExp(right) ? String2() : right;
  return Visit4(L, R);
}
function FromStringRight(left, right) {
  return type_exports2.IsLiteral(left) && value_exports.IsString(left.const) ? ExtendsResult.True : type_exports2.IsString(left) ? ExtendsResult.True : ExtendsResult.False;
}
function FromString(left, right) {
  return IsStructuralRight(right) ? StructuralRight(left, right) : type_exports2.IsObject(right) ? FromObjectRight(left, right) : type_exports2.IsRecord(right) ? FromRecordRight(left, right) : type_exports2.IsString(right) ? ExtendsResult.True : ExtendsResult.False;
}
function FromSymbol(left, right) {
  return IsStructuralRight(right) ? StructuralRight(left, right) : type_exports2.IsObject(right) ? FromObjectRight(left, right) : type_exports2.IsRecord(right) ? FromRecordRight(left, right) : type_exports2.IsSymbol(right) ? ExtendsResult.True : ExtendsResult.False;
}
function FromTemplateLiteral2(left, right) {
  return type_exports2.IsTemplateLiteral(left) ? Visit4(TemplateLiteralToUnion(left), right) : type_exports2.IsTemplateLiteral(right) ? Visit4(left, TemplateLiteralToUnion(right)) : Throw("Invalid fallthrough for TemplateLiteral");
}
function IsArrayOfTuple(left, right) {
  return type_exports2.IsArray(right) && left.items !== void 0 && left.items.every((schema) => Visit4(schema, right.items) === ExtendsResult.True);
}
function FromTupleRight(left, right) {
  return type_exports2.IsNever(left) ? ExtendsResult.True : type_exports2.IsUnknown(left) ? ExtendsResult.False : type_exports2.IsAny(left) ? ExtendsResult.Union : ExtendsResult.False;
}
function FromTuple3(left, right) {
  return IsStructuralRight(right) ? StructuralRight(left, right) : type_exports2.IsObject(right) && IsObjectArrayLike(right) ? ExtendsResult.True : type_exports2.IsArray(right) && IsArrayOfTuple(left, right) ? ExtendsResult.True : !type_exports2.IsTuple(right) ? ExtendsResult.False : value_exports.IsUndefined(left.items) && !value_exports.IsUndefined(right.items) || !value_exports.IsUndefined(left.items) && value_exports.IsUndefined(right.items) ? ExtendsResult.False : value_exports.IsUndefined(left.items) && !value_exports.IsUndefined(right.items) ? ExtendsResult.True : left.items.every((schema, index) => Visit4(schema, right.items[index]) === ExtendsResult.True) ? ExtendsResult.True : ExtendsResult.False;
}
function FromUint8Array(left, right) {
  return IsStructuralRight(right) ? StructuralRight(left, right) : type_exports2.IsObject(right) ? FromObjectRight(left, right) : type_exports2.IsRecord(right) ? FromRecordRight(left, right) : type_exports2.IsUint8Array(right) ? ExtendsResult.True : ExtendsResult.False;
}
function FromUndefined(left, right) {
  return IsStructuralRight(right) ? StructuralRight(left, right) : type_exports2.IsObject(right) ? FromObjectRight(left, right) : type_exports2.IsRecord(right) ? FromRecordRight(left, right) : type_exports2.IsVoid(right) ? FromVoidRight(left, right) : type_exports2.IsUndefined(right) ? ExtendsResult.True : ExtendsResult.False;
}
function FromUnionRight(left, right) {
  return right.anyOf.some((schema) => Visit4(left, schema) === ExtendsResult.True) ? ExtendsResult.True : ExtendsResult.False;
}
function FromUnion5(left, right) {
  return left.anyOf.every((schema) => Visit4(schema, right) === ExtendsResult.True) ? ExtendsResult.True : ExtendsResult.False;
}
function FromUnknownRight(left, right) {
  return ExtendsResult.True;
}
function FromUnknown(left, right) {
  return type_exports2.IsNever(right) ? FromNeverRight(left, right) : type_exports2.IsIntersect(right) ? FromIntersectRight(left, right) : type_exports2.IsUnion(right) ? FromUnionRight(left, right) : type_exports2.IsAny(right) ? FromAnyRight(left, right) : type_exports2.IsString(right) ? FromStringRight(left, right) : type_exports2.IsNumber(right) ? FromNumberRight(left, right) : type_exports2.IsInteger(right) ? FromIntegerRight(left, right) : type_exports2.IsBoolean(right) ? FromBooleanRight(left, right) : type_exports2.IsArray(right) ? FromArrayRight(left, right) : type_exports2.IsTuple(right) ? FromTupleRight(left, right) : type_exports2.IsObject(right) ? FromObjectRight(left, right) : type_exports2.IsUnknown(right) ? ExtendsResult.True : ExtendsResult.False;
}
function FromVoidRight(left, right) {
  return type_exports2.IsUndefined(left) ? ExtendsResult.True : type_exports2.IsUndefined(left) ? ExtendsResult.True : ExtendsResult.False;
}
function FromVoid(left, right) {
  return type_exports2.IsIntersect(right) ? FromIntersectRight(left, right) : type_exports2.IsUnion(right) ? FromUnionRight(left, right) : type_exports2.IsUnknown(right) ? FromUnknownRight(left, right) : type_exports2.IsAny(right) ? FromAnyRight(left, right) : type_exports2.IsObject(right) ? FromObjectRight(left, right) : type_exports2.IsVoid(right) ? ExtendsResult.True : ExtendsResult.False;
}
function Visit4(left, right) {
  return (
    // resolvable
    type_exports2.IsTemplateLiteral(left) || type_exports2.IsTemplateLiteral(right) ? FromTemplateLiteral2(left, right) : type_exports2.IsRegExp(left) || type_exports2.IsRegExp(right) ? FromRegExp(left, right) : type_exports2.IsNot(left) || type_exports2.IsNot(right) ? FromNot(left, right) : (
      // standard
      type_exports2.IsAny(left) ? FromAny(left, right) : type_exports2.IsArray(left) ? FromArray3(left, right) : type_exports2.IsBigInt(left) ? FromBigInt(left, right) : type_exports2.IsBoolean(left) ? FromBoolean(left, right) : type_exports2.IsAsyncIterator(left) ? FromAsyncIterator(left, right) : type_exports2.IsConstructor(left) ? FromConstructor(left, right) : type_exports2.IsDate(left) ? FromDate(left, right) : type_exports2.IsFunction(left) ? FromFunction(left, right) : type_exports2.IsInteger(left) ? FromInteger(left, right) : type_exports2.IsIntersect(left) ? FromIntersect3(left, right) : type_exports2.IsIterator(left) ? FromIterator(left, right) : type_exports2.IsLiteral(left) ? FromLiteral2(left, right) : type_exports2.IsNever(left) ? FromNever(left, right) : type_exports2.IsNull(left) ? FromNull(left, right) : type_exports2.IsNumber(left) ? FromNumber(left, right) : type_exports2.IsObject(left) ? FromObject(left, right) : type_exports2.IsRecord(left) ? FromRecord(left, right) : type_exports2.IsString(left) ? FromString(left, right) : type_exports2.IsSymbol(left) ? FromSymbol(left, right) : type_exports2.IsTuple(left) ? FromTuple3(left, right) : type_exports2.IsPromise(left) ? FromPromise(left, right) : type_exports2.IsUint8Array(left) ? FromUint8Array(left, right) : type_exports2.IsUndefined(left) ? FromUndefined(left, right) : type_exports2.IsUnion(left) ? FromUnion5(left, right) : type_exports2.IsUnknown(left) ? FromUnknown(left, right) : type_exports2.IsVoid(left) ? FromVoid(left, right) : Throw(`Unknown left type operand '${left[Kind]}'`)
    )
  );
}
function ExtendsCheck(left, right) {
  return Visit4(left, right);
}

// node_modules/@sinclair/typebox/build/esm/type/extends/extends-from-mapped-result.mjs
function FromProperties7(P, Right, True, False, options) {
  const Acc = {};
  for (const K2 of globalThis.Object.getOwnPropertyNames(P))
    Acc[K2] = Extends(P[K2], Right, True, False, Clone(options));
  return Acc;
}
function FromMappedResult6(Left, Right, True, False, options) {
  return FromProperties7(Left.properties, Right, True, False, options);
}
function ExtendsFromMappedResult(Left, Right, True, False, options) {
  const P = FromMappedResult6(Left, Right, True, False, options);
  return MappedResult(P);
}

// node_modules/@sinclair/typebox/build/esm/type/extends/extends.mjs
function ExtendsResolve(left, right, trueType, falseType) {
  const R = ExtendsCheck(left, right);
  return R === ExtendsResult.Union ? Union([trueType, falseType]) : R === ExtendsResult.True ? trueType : falseType;
}
function Extends(L, R, T, F, options) {
  return IsMappedResult(L) ? ExtendsFromMappedResult(L, R, T, F, options) : IsMappedKey(L) ? CreateType(ExtendsFromMappedKey(L, R, T, F, options)) : CreateType(ExtendsResolve(L, R, T, F), options);
}

// node_modules/@sinclair/typebox/build/esm/type/extends/extends-from-mapped-key.mjs
function FromPropertyKey(K, U, L, R, options) {
  return {
    [K]: Extends(Literal(K), U, L, R, Clone(options))
  };
}
function FromPropertyKeys(K, U, L, R, options) {
  return K.reduce((Acc, LK) => {
    return { ...Acc, ...FromPropertyKey(LK, U, L, R, options) };
  }, {});
}
function FromMappedKey2(K, U, L, R, options) {
  return FromPropertyKeys(K.keys, U, L, R, options);
}
function ExtendsFromMappedKey(T, U, L, R, options) {
  const P = FromMappedKey2(T, U, L, R, options);
  return MappedResult(P);
}

// node_modules/@sinclair/typebox/build/esm/value/check/check.mjs
var ValueCheckUnknownTypeError = class extends TypeBoxError {
  constructor(schema) {
    super(`Unknown type`);
    this.schema = schema;
  }
};
function IsAnyOrUnknown(schema) {
  return schema[Kind] === "Any" || schema[Kind] === "Unknown";
}
function IsDefined(value) {
  return value !== void 0;
}
function FromAny2(schema, references, value) {
  return true;
}
function FromArgument(schema, references, value) {
  return true;
}
function FromArray4(schema, references, value) {
  if (!IsArray(value))
    return false;
  if (IsDefined(schema.minItems) && !(value.length >= schema.minItems)) {
    return false;
  }
  if (IsDefined(schema.maxItems) && !(value.length <= schema.maxItems)) {
    return false;
  }
  for (const element of value) {
    if (!Visit5(schema.items, references, element))
      return false;
  }
  if (schema.uniqueItems === true && !function() {
    const set = /* @__PURE__ */ new Set();
    for (const element of value) {
      const hashed = Hash(element);
      if (set.has(hashed)) {
        return false;
      } else {
        set.add(hashed);
      }
    }
    return true;
  }()) {
    return false;
  }
  if (!(IsDefined(schema.contains) || IsNumber(schema.minContains) || IsNumber(schema.maxContains))) {
    return true;
  }
  const containsSchema = IsDefined(schema.contains) ? schema.contains : Never();
  const containsCount = value.reduce((acc, value2) => Visit5(containsSchema, references, value2) ? acc + 1 : acc, 0);
  if (containsCount === 0) {
    return false;
  }
  if (IsNumber(schema.minContains) && containsCount < schema.minContains) {
    return false;
  }
  if (IsNumber(schema.maxContains) && containsCount > schema.maxContains) {
    return false;
  }
  return true;
}
function FromAsyncIterator2(schema, references, value) {
  return IsAsyncIterator(value);
}
function FromBigInt2(schema, references, value) {
  if (!IsBigInt(value))
    return false;
  if (IsDefined(schema.exclusiveMaximum) && !(value < schema.exclusiveMaximum)) {
    return false;
  }
  if (IsDefined(schema.exclusiveMinimum) && !(value > schema.exclusiveMinimum)) {
    return false;
  }
  if (IsDefined(schema.maximum) && !(value <= schema.maximum)) {
    return false;
  }
  if (IsDefined(schema.minimum) && !(value >= schema.minimum)) {
    return false;
  }
  if (IsDefined(schema.multipleOf) && !(value % schema.multipleOf === BigInt(0))) {
    return false;
  }
  return true;
}
function FromBoolean2(schema, references, value) {
  return IsBoolean(value);
}
function FromConstructor2(schema, references, value) {
  return Visit5(schema.returns, references, value.prototype);
}
function FromDate2(schema, references, value) {
  if (!IsDate(value))
    return false;
  if (IsDefined(schema.exclusiveMaximumTimestamp) && !(value.getTime() < schema.exclusiveMaximumTimestamp)) {
    return false;
  }
  if (IsDefined(schema.exclusiveMinimumTimestamp) && !(value.getTime() > schema.exclusiveMinimumTimestamp)) {
    return false;
  }
  if (IsDefined(schema.maximumTimestamp) && !(value.getTime() <= schema.maximumTimestamp)) {
    return false;
  }
  if (IsDefined(schema.minimumTimestamp) && !(value.getTime() >= schema.minimumTimestamp)) {
    return false;
  }
  if (IsDefined(schema.multipleOfTimestamp) && !(value.getTime() % schema.multipleOfTimestamp === 0)) {
    return false;
  }
  return true;
}
function FromFunction2(schema, references, value) {
  return IsFunction(value);
}
function FromImport(schema, references, value) {
  const definitions = globalThis.Object.values(schema.$defs);
  const target = schema.$defs[schema.$ref];
  return Visit5(target, [...references, ...definitions], value);
}
function FromInteger2(schema, references, value) {
  if (!IsInteger(value)) {
    return false;
  }
  if (IsDefined(schema.exclusiveMaximum) && !(value < schema.exclusiveMaximum)) {
    return false;
  }
  if (IsDefined(schema.exclusiveMinimum) && !(value > schema.exclusiveMinimum)) {
    return false;
  }
  if (IsDefined(schema.maximum) && !(value <= schema.maximum)) {
    return false;
  }
  if (IsDefined(schema.minimum) && !(value >= schema.minimum)) {
    return false;
  }
  if (IsDefined(schema.multipleOf) && !(value % schema.multipleOf === 0)) {
    return false;
  }
  return true;
}
function FromIntersect4(schema, references, value) {
  const check1 = schema.allOf.every((schema2) => Visit5(schema2, references, value));
  if (schema.unevaluatedProperties === false) {
    const keyPattern = new RegExp(KeyOfPattern(schema));
    const check2 = Object.getOwnPropertyNames(value).every((key) => keyPattern.test(key));
    return check1 && check2;
  } else if (IsSchema(schema.unevaluatedProperties)) {
    const keyCheck = new RegExp(KeyOfPattern(schema));
    const check2 = Object.getOwnPropertyNames(value).every((key) => keyCheck.test(key) || Visit5(schema.unevaluatedProperties, references, value[key]));
    return check1 && check2;
  } else {
    return check1;
  }
}
function FromIterator2(schema, references, value) {
  return IsIterator(value);
}
function FromLiteral3(schema, references, value) {
  return value === schema.const;
}
function FromNever2(schema, references, value) {
  return false;
}
function FromNot2(schema, references, value) {
  return !Visit5(schema.not, references, value);
}
function FromNull2(schema, references, value) {
  return IsNull(value);
}
function FromNumber2(schema, references, value) {
  if (!TypeSystemPolicy.IsNumberLike(value))
    return false;
  if (IsDefined(schema.exclusiveMaximum) && !(value < schema.exclusiveMaximum)) {
    return false;
  }
  if (IsDefined(schema.exclusiveMinimum) && !(value > schema.exclusiveMinimum)) {
    return false;
  }
  if (IsDefined(schema.minimum) && !(value >= schema.minimum)) {
    return false;
  }
  if (IsDefined(schema.maximum) && !(value <= schema.maximum)) {
    return false;
  }
  if (IsDefined(schema.multipleOf) && !(value % schema.multipleOf === 0)) {
    return false;
  }
  return true;
}
function FromObject2(schema, references, value) {
  if (!TypeSystemPolicy.IsObjectLike(value))
    return false;
  if (IsDefined(schema.minProperties) && !(Object.getOwnPropertyNames(value).length >= schema.minProperties)) {
    return false;
  }
  if (IsDefined(schema.maxProperties) && !(Object.getOwnPropertyNames(value).length <= schema.maxProperties)) {
    return false;
  }
  const knownKeys = Object.getOwnPropertyNames(schema.properties);
  for (const knownKey of knownKeys) {
    const property = schema.properties[knownKey];
    if (schema.required && schema.required.includes(knownKey)) {
      if (!Visit5(property, references, value[knownKey])) {
        return false;
      }
      if ((ExtendsUndefinedCheck(property) || IsAnyOrUnknown(property)) && !(knownKey in value)) {
        return false;
      }
    } else {
      if (TypeSystemPolicy.IsExactOptionalProperty(value, knownKey) && !Visit5(property, references, value[knownKey])) {
        return false;
      }
    }
  }
  if (schema.additionalProperties === false) {
    const valueKeys = Object.getOwnPropertyNames(value);
    if (schema.required && schema.required.length === knownKeys.length && valueKeys.length === knownKeys.length) {
      return true;
    } else {
      return valueKeys.every((valueKey) => knownKeys.includes(valueKey));
    }
  } else if (typeof schema.additionalProperties === "object") {
    const valueKeys = Object.getOwnPropertyNames(value);
    return valueKeys.every((key) => knownKeys.includes(key) || Visit5(schema.additionalProperties, references, value[key]));
  } else {
    return true;
  }
}
function FromPromise2(schema, references, value) {
  return IsPromise(value);
}
function FromRecord2(schema, references, value) {
  if (!TypeSystemPolicy.IsRecordLike(value)) {
    return false;
  }
  if (IsDefined(schema.minProperties) && !(Object.getOwnPropertyNames(value).length >= schema.minProperties)) {
    return false;
  }
  if (IsDefined(schema.maxProperties) && !(Object.getOwnPropertyNames(value).length <= schema.maxProperties)) {
    return false;
  }
  const [patternKey, patternSchema] = Object.entries(schema.patternProperties)[0];
  const regex = new RegExp(patternKey);
  const check1 = Object.entries(value).every(([key, value2]) => {
    return regex.test(key) ? Visit5(patternSchema, references, value2) : true;
  });
  const check2 = typeof schema.additionalProperties === "object" ? Object.entries(value).every(([key, value2]) => {
    return !regex.test(key) ? Visit5(schema.additionalProperties, references, value2) : true;
  }) : true;
  const check3 = schema.additionalProperties === false ? Object.getOwnPropertyNames(value).every((key) => {
    return regex.test(key);
  }) : true;
  return check1 && check2 && check3;
}
function FromRef2(schema, references, value) {
  return Visit5(Deref(schema, references), references, value);
}
function FromRegExp2(schema, references, value) {
  const regex = new RegExp(schema.source, schema.flags);
  if (IsDefined(schema.minLength)) {
    if (!(value.length >= schema.minLength))
      return false;
  }
  if (IsDefined(schema.maxLength)) {
    if (!(value.length <= schema.maxLength))
      return false;
  }
  return regex.test(value);
}
function FromString2(schema, references, value) {
  if (!IsString(value)) {
    return false;
  }
  if (IsDefined(schema.minLength)) {
    if (!(value.length >= schema.minLength))
      return false;
  }
  if (IsDefined(schema.maxLength)) {
    if (!(value.length <= schema.maxLength))
      return false;
  }
  if (IsDefined(schema.pattern)) {
    const regex = new RegExp(schema.pattern);
    if (!regex.test(value))
      return false;
  }
  if (IsDefined(schema.format)) {
    if (!format_exports.Has(schema.format))
      return false;
    const func = format_exports.Get(schema.format);
    return func(value);
  }
  return true;
}
function FromSymbol2(schema, references, value) {
  return IsSymbol(value);
}
function FromTemplateLiteral3(schema, references, value) {
  return IsString(value) && new RegExp(schema.pattern).test(value);
}
function FromThis(schema, references, value) {
  return Visit5(Deref(schema, references), references, value);
}
function FromTuple4(schema, references, value) {
  if (!IsArray(value)) {
    return false;
  }
  if (schema.items === void 0 && !(value.length === 0)) {
    return false;
  }
  if (!(value.length === schema.maxItems)) {
    return false;
  }
  if (!schema.items) {
    return true;
  }
  for (let i = 0; i < schema.items.length; i++) {
    if (!Visit5(schema.items[i], references, value[i]))
      return false;
  }
  return true;
}
function FromUndefined2(schema, references, value) {
  return IsUndefined(value);
}
function FromUnion6(schema, references, value) {
  return schema.anyOf.some((inner) => Visit5(inner, references, value));
}
function FromUint8Array2(schema, references, value) {
  if (!IsUint8Array(value)) {
    return false;
  }
  if (IsDefined(schema.maxByteLength) && !(value.length <= schema.maxByteLength)) {
    return false;
  }
  if (IsDefined(schema.minByteLength) && !(value.length >= schema.minByteLength)) {
    return false;
  }
  return true;
}
function FromUnknown2(schema, references, value) {
  return true;
}
function FromVoid2(schema, references, value) {
  return TypeSystemPolicy.IsVoidLike(value);
}
function FromKind(schema, references, value) {
  if (!type_exports.Has(schema[Kind]))
    return false;
  const func = type_exports.Get(schema[Kind]);
  return func(schema, value);
}
function Visit5(schema, references, value) {
  const references_ = IsDefined(schema.$id) ? Pushref(schema, references) : references;
  const schema_ = schema;
  switch (schema_[Kind]) {
    case "Any":
      return FromAny2(schema_, references_, value);
    case "Argument":
      return FromArgument(schema_, references_, value);
    case "Array":
      return FromArray4(schema_, references_, value);
    case "AsyncIterator":
      return FromAsyncIterator2(schema_, references_, value);
    case "BigInt":
      return FromBigInt2(schema_, references_, value);
    case "Boolean":
      return FromBoolean2(schema_, references_, value);
    case "Constructor":
      return FromConstructor2(schema_, references_, value);
    case "Date":
      return FromDate2(schema_, references_, value);
    case "Function":
      return FromFunction2(schema_, references_, value);
    case "Import":
      return FromImport(schema_, references_, value);
    case "Integer":
      return FromInteger2(schema_, references_, value);
    case "Intersect":
      return FromIntersect4(schema_, references_, value);
    case "Iterator":
      return FromIterator2(schema_, references_, value);
    case "Literal":
      return FromLiteral3(schema_, references_, value);
    case "Never":
      return FromNever2(schema_, references_, value);
    case "Not":
      return FromNot2(schema_, references_, value);
    case "Null":
      return FromNull2(schema_, references_, value);
    case "Number":
      return FromNumber2(schema_, references_, value);
    case "Object":
      return FromObject2(schema_, references_, value);
    case "Promise":
      return FromPromise2(schema_, references_, value);
    case "Record":
      return FromRecord2(schema_, references_, value);
    case "Ref":
      return FromRef2(schema_, references_, value);
    case "RegExp":
      return FromRegExp2(schema_, references_, value);
    case "String":
      return FromString2(schema_, references_, value);
    case "Symbol":
      return FromSymbol2(schema_, references_, value);
    case "TemplateLiteral":
      return FromTemplateLiteral3(schema_, references_, value);
    case "This":
      return FromThis(schema_, references_, value);
    case "Tuple":
      return FromTuple4(schema_, references_, value);
    case "Undefined":
      return FromUndefined2(schema_, references_, value);
    case "Union":
      return FromUnion6(schema_, references_, value);
    case "Uint8Array":
      return FromUint8Array2(schema_, references_, value);
    case "Unknown":
      return FromUnknown2(schema_, references_, value);
    case "Void":
      return FromVoid2(schema_, references_, value);
    default:
      if (!type_exports.Has(schema_[Kind]))
        throw new ValueCheckUnknownTypeError(schema_);
      return FromKind(schema_, references_, value);
  }
}
function Check(...args) {
  return args.length === 3 ? Visit5(args[0], args[1], args[2]) : Visit5(args[0], [], args[1]);
}

// node_modules/@sinclair/typebox/build/esm/errors/errors.mjs
var ValueErrorType;
(function(ValueErrorType2) {
  ValueErrorType2[ValueErrorType2["ArrayContains"] = 0] = "ArrayContains";
  ValueErrorType2[ValueErrorType2["ArrayMaxContains"] = 1] = "ArrayMaxContains";
  ValueErrorType2[ValueErrorType2["ArrayMaxItems"] = 2] = "ArrayMaxItems";
  ValueErrorType2[ValueErrorType2["ArrayMinContains"] = 3] = "ArrayMinContains";
  ValueErrorType2[ValueErrorType2["ArrayMinItems"] = 4] = "ArrayMinItems";
  ValueErrorType2[ValueErrorType2["ArrayUniqueItems"] = 5] = "ArrayUniqueItems";
  ValueErrorType2[ValueErrorType2["Array"] = 6] = "Array";
  ValueErrorType2[ValueErrorType2["AsyncIterator"] = 7] = "AsyncIterator";
  ValueErrorType2[ValueErrorType2["BigIntExclusiveMaximum"] = 8] = "BigIntExclusiveMaximum";
  ValueErrorType2[ValueErrorType2["BigIntExclusiveMinimum"] = 9] = "BigIntExclusiveMinimum";
  ValueErrorType2[ValueErrorType2["BigIntMaximum"] = 10] = "BigIntMaximum";
  ValueErrorType2[ValueErrorType2["BigIntMinimum"] = 11] = "BigIntMinimum";
  ValueErrorType2[ValueErrorType2["BigIntMultipleOf"] = 12] = "BigIntMultipleOf";
  ValueErrorType2[ValueErrorType2["BigInt"] = 13] = "BigInt";
  ValueErrorType2[ValueErrorType2["Boolean"] = 14] = "Boolean";
  ValueErrorType2[ValueErrorType2["DateExclusiveMaximumTimestamp"] = 15] = "DateExclusiveMaximumTimestamp";
  ValueErrorType2[ValueErrorType2["DateExclusiveMinimumTimestamp"] = 16] = "DateExclusiveMinimumTimestamp";
  ValueErrorType2[ValueErrorType2["DateMaximumTimestamp"] = 17] = "DateMaximumTimestamp";
  ValueErrorType2[ValueErrorType2["DateMinimumTimestamp"] = 18] = "DateMinimumTimestamp";
  ValueErrorType2[ValueErrorType2["DateMultipleOfTimestamp"] = 19] = "DateMultipleOfTimestamp";
  ValueErrorType2[ValueErrorType2["Date"] = 20] = "Date";
  ValueErrorType2[ValueErrorType2["Function"] = 21] = "Function";
  ValueErrorType2[ValueErrorType2["IntegerExclusiveMaximum"] = 22] = "IntegerExclusiveMaximum";
  ValueErrorType2[ValueErrorType2["IntegerExclusiveMinimum"] = 23] = "IntegerExclusiveMinimum";
  ValueErrorType2[ValueErrorType2["IntegerMaximum"] = 24] = "IntegerMaximum";
  ValueErrorType2[ValueErrorType2["IntegerMinimum"] = 25] = "IntegerMinimum";
  ValueErrorType2[ValueErrorType2["IntegerMultipleOf"] = 26] = "IntegerMultipleOf";
  ValueErrorType2[ValueErrorType2["Integer"] = 27] = "Integer";
  ValueErrorType2[ValueErrorType2["IntersectUnevaluatedProperties"] = 28] = "IntersectUnevaluatedProperties";
  ValueErrorType2[ValueErrorType2["Intersect"] = 29] = "Intersect";
  ValueErrorType2[ValueErrorType2["Iterator"] = 30] = "Iterator";
  ValueErrorType2[ValueErrorType2["Kind"] = 31] = "Kind";
  ValueErrorType2[ValueErrorType2["Literal"] = 32] = "Literal";
  ValueErrorType2[ValueErrorType2["Never"] = 33] = "Never";
  ValueErrorType2[ValueErrorType2["Not"] = 34] = "Not";
  ValueErrorType2[ValueErrorType2["Null"] = 35] = "Null";
  ValueErrorType2[ValueErrorType2["NumberExclusiveMaximum"] = 36] = "NumberExclusiveMaximum";
  ValueErrorType2[ValueErrorType2["NumberExclusiveMinimum"] = 37] = "NumberExclusiveMinimum";
  ValueErrorType2[ValueErrorType2["NumberMaximum"] = 38] = "NumberMaximum";
  ValueErrorType2[ValueErrorType2["NumberMinimum"] = 39] = "NumberMinimum";
  ValueErrorType2[ValueErrorType2["NumberMultipleOf"] = 40] = "NumberMultipleOf";
  ValueErrorType2[ValueErrorType2["Number"] = 41] = "Number";
  ValueErrorType2[ValueErrorType2["ObjectAdditionalProperties"] = 42] = "ObjectAdditionalProperties";
  ValueErrorType2[ValueErrorType2["ObjectMaxProperties"] = 43] = "ObjectMaxProperties";
  ValueErrorType2[ValueErrorType2["ObjectMinProperties"] = 44] = "ObjectMinProperties";
  ValueErrorType2[ValueErrorType2["ObjectRequiredProperty"] = 45] = "ObjectRequiredProperty";
  ValueErrorType2[ValueErrorType2["Object"] = 46] = "Object";
  ValueErrorType2[ValueErrorType2["Promise"] = 47] = "Promise";
  ValueErrorType2[ValueErrorType2["RegExp"] = 48] = "RegExp";
  ValueErrorType2[ValueErrorType2["StringFormatUnknown"] = 49] = "StringFormatUnknown";
  ValueErrorType2[ValueErrorType2["StringFormat"] = 50] = "StringFormat";
  ValueErrorType2[ValueErrorType2["StringMaxLength"] = 51] = "StringMaxLength";
  ValueErrorType2[ValueErrorType2["StringMinLength"] = 52] = "StringMinLength";
  ValueErrorType2[ValueErrorType2["StringPattern"] = 53] = "StringPattern";
  ValueErrorType2[ValueErrorType2["String"] = 54] = "String";
  ValueErrorType2[ValueErrorType2["Symbol"] = 55] = "Symbol";
  ValueErrorType2[ValueErrorType2["TupleLength"] = 56] = "TupleLength";
  ValueErrorType2[ValueErrorType2["Tuple"] = 57] = "Tuple";
  ValueErrorType2[ValueErrorType2["Uint8ArrayMaxByteLength"] = 58] = "Uint8ArrayMaxByteLength";
  ValueErrorType2[ValueErrorType2["Uint8ArrayMinByteLength"] = 59] = "Uint8ArrayMinByteLength";
  ValueErrorType2[ValueErrorType2["Uint8Array"] = 60] = "Uint8Array";
  ValueErrorType2[ValueErrorType2["Undefined"] = 61] = "Undefined";
  ValueErrorType2[ValueErrorType2["Union"] = 62] = "Union";
  ValueErrorType2[ValueErrorType2["Void"] = 63] = "Void";
})(ValueErrorType || (ValueErrorType = {}));
var ValueErrorsUnknownTypeError = class extends TypeBoxError {
  constructor(schema) {
    super("Unknown type");
    this.schema = schema;
  }
};
function EscapeKey(key) {
  return key.replace(/~/g, "~0").replace(/\//g, "~1");
}
function IsDefined2(value) {
  return value !== void 0;
}
var ValueErrorIterator = class {
  constructor(iterator) {
    this.iterator = iterator;
  }
  [Symbol.iterator]() {
    return this.iterator;
  }
  /** Returns the first value error or undefined if no errors */
  First() {
    const next = this.iterator.next();
    return next.done ? void 0 : next.value;
  }
};
function Create(errorType, schema, path, value, errors = []) {
  return {
    type: errorType,
    schema,
    path,
    value,
    message: GetErrorFunction()({ errorType, path, schema, value, errors }),
    errors
  };
}
function* FromAny3(schema, references, path, value) {
}
function* FromArgument2(schema, references, path, value) {
}
function* FromArray5(schema, references, path, value) {
  if (!IsArray(value)) {
    return yield Create(ValueErrorType.Array, schema, path, value);
  }
  if (IsDefined2(schema.minItems) && !(value.length >= schema.minItems)) {
    yield Create(ValueErrorType.ArrayMinItems, schema, path, value);
  }
  if (IsDefined2(schema.maxItems) && !(value.length <= schema.maxItems)) {
    yield Create(ValueErrorType.ArrayMaxItems, schema, path, value);
  }
  for (let i = 0; i < value.length; i++) {
    yield* Visit6(schema.items, references, `${path}/${i}`, value[i]);
  }
  if (schema.uniqueItems === true && !function() {
    const set = /* @__PURE__ */ new Set();
    for (const element of value) {
      const hashed = Hash(element);
      if (set.has(hashed)) {
        return false;
      } else {
        set.add(hashed);
      }
    }
    return true;
  }()) {
    yield Create(ValueErrorType.ArrayUniqueItems, schema, path, value);
  }
  if (!(IsDefined2(schema.contains) || IsDefined2(schema.minContains) || IsDefined2(schema.maxContains))) {
    return;
  }
  const containsSchema = IsDefined2(schema.contains) ? schema.contains : Never();
  const containsCount = value.reduce((acc, value2, index) => Visit6(containsSchema, references, `${path}${index}`, value2).next().done === true ? acc + 1 : acc, 0);
  if (containsCount === 0) {
    yield Create(ValueErrorType.ArrayContains, schema, path, value);
  }
  if (IsNumber(schema.minContains) && containsCount < schema.minContains) {
    yield Create(ValueErrorType.ArrayMinContains, schema, path, value);
  }
  if (IsNumber(schema.maxContains) && containsCount > schema.maxContains) {
    yield Create(ValueErrorType.ArrayMaxContains, schema, path, value);
  }
}
function* FromAsyncIterator3(schema, references, path, value) {
  if (!IsAsyncIterator(value))
    yield Create(ValueErrorType.AsyncIterator, schema, path, value);
}
function* FromBigInt3(schema, references, path, value) {
  if (!IsBigInt(value))
    return yield Create(ValueErrorType.BigInt, schema, path, value);
  if (IsDefined2(schema.exclusiveMaximum) && !(value < schema.exclusiveMaximum)) {
    yield Create(ValueErrorType.BigIntExclusiveMaximum, schema, path, value);
  }
  if (IsDefined2(schema.exclusiveMinimum) && !(value > schema.exclusiveMinimum)) {
    yield Create(ValueErrorType.BigIntExclusiveMinimum, schema, path, value);
  }
  if (IsDefined2(schema.maximum) && !(value <= schema.maximum)) {
    yield Create(ValueErrorType.BigIntMaximum, schema, path, value);
  }
  if (IsDefined2(schema.minimum) && !(value >= schema.minimum)) {
    yield Create(ValueErrorType.BigIntMinimum, schema, path, value);
  }
  if (IsDefined2(schema.multipleOf) && !(value % schema.multipleOf === BigInt(0))) {
    yield Create(ValueErrorType.BigIntMultipleOf, schema, path, value);
  }
}
function* FromBoolean3(schema, references, path, value) {
  if (!IsBoolean(value))
    yield Create(ValueErrorType.Boolean, schema, path, value);
}
function* FromConstructor3(schema, references, path, value) {
  yield* Visit6(schema.returns, references, path, value.prototype);
}
function* FromDate3(schema, references, path, value) {
  if (!IsDate(value))
    return yield Create(ValueErrorType.Date, schema, path, value);
  if (IsDefined2(schema.exclusiveMaximumTimestamp) && !(value.getTime() < schema.exclusiveMaximumTimestamp)) {
    yield Create(ValueErrorType.DateExclusiveMaximumTimestamp, schema, path, value);
  }
  if (IsDefined2(schema.exclusiveMinimumTimestamp) && !(value.getTime() > schema.exclusiveMinimumTimestamp)) {
    yield Create(ValueErrorType.DateExclusiveMinimumTimestamp, schema, path, value);
  }
  if (IsDefined2(schema.maximumTimestamp) && !(value.getTime() <= schema.maximumTimestamp)) {
    yield Create(ValueErrorType.DateMaximumTimestamp, schema, path, value);
  }
  if (IsDefined2(schema.minimumTimestamp) && !(value.getTime() >= schema.minimumTimestamp)) {
    yield Create(ValueErrorType.DateMinimumTimestamp, schema, path, value);
  }
  if (IsDefined2(schema.multipleOfTimestamp) && !(value.getTime() % schema.multipleOfTimestamp === 0)) {
    yield Create(ValueErrorType.DateMultipleOfTimestamp, schema, path, value);
  }
}
function* FromFunction3(schema, references, path, value) {
  if (!IsFunction(value))
    yield Create(ValueErrorType.Function, schema, path, value);
}
function* FromImport2(schema, references, path, value) {
  const definitions = globalThis.Object.values(schema.$defs);
  const target = schema.$defs[schema.$ref];
  yield* Visit6(target, [...references, ...definitions], path, value);
}
function* FromInteger3(schema, references, path, value) {
  if (!IsInteger(value))
    return yield Create(ValueErrorType.Integer, schema, path, value);
  if (IsDefined2(schema.exclusiveMaximum) && !(value < schema.exclusiveMaximum)) {
    yield Create(ValueErrorType.IntegerExclusiveMaximum, schema, path, value);
  }
  if (IsDefined2(schema.exclusiveMinimum) && !(value > schema.exclusiveMinimum)) {
    yield Create(ValueErrorType.IntegerExclusiveMinimum, schema, path, value);
  }
  if (IsDefined2(schema.maximum) && !(value <= schema.maximum)) {
    yield Create(ValueErrorType.IntegerMaximum, schema, path, value);
  }
  if (IsDefined2(schema.minimum) && !(value >= schema.minimum)) {
    yield Create(ValueErrorType.IntegerMinimum, schema, path, value);
  }
  if (IsDefined2(schema.multipleOf) && !(value % schema.multipleOf === 0)) {
    yield Create(ValueErrorType.IntegerMultipleOf, schema, path, value);
  }
}
function* FromIntersect5(schema, references, path, value) {
  let hasError = false;
  for (const inner of schema.allOf) {
    for (const error of Visit6(inner, references, path, value)) {
      hasError = true;
      yield error;
    }
  }
  if (hasError) {
    return yield Create(ValueErrorType.Intersect, schema, path, value);
  }
  if (schema.unevaluatedProperties === false) {
    const keyCheck = new RegExp(KeyOfPattern(schema));
    for (const valueKey of Object.getOwnPropertyNames(value)) {
      if (!keyCheck.test(valueKey)) {
        yield Create(ValueErrorType.IntersectUnevaluatedProperties, schema, `${path}/${valueKey}`, value);
      }
    }
  }
  if (typeof schema.unevaluatedProperties === "object") {
    const keyCheck = new RegExp(KeyOfPattern(schema));
    for (const valueKey of Object.getOwnPropertyNames(value)) {
      if (!keyCheck.test(valueKey)) {
        const next = Visit6(schema.unevaluatedProperties, references, `${path}/${valueKey}`, value[valueKey]).next();
        if (!next.done)
          yield next.value;
      }
    }
  }
}
function* FromIterator3(schema, references, path, value) {
  if (!IsIterator(value))
    yield Create(ValueErrorType.Iterator, schema, path, value);
}
function* FromLiteral4(schema, references, path, value) {
  if (!(value === schema.const))
    yield Create(ValueErrorType.Literal, schema, path, value);
}
function* FromNever3(schema, references, path, value) {
  yield Create(ValueErrorType.Never, schema, path, value);
}
function* FromNot3(schema, references, path, value) {
  if (Visit6(schema.not, references, path, value).next().done === true)
    yield Create(ValueErrorType.Not, schema, path, value);
}
function* FromNull3(schema, references, path, value) {
  if (!IsNull(value))
    yield Create(ValueErrorType.Null, schema, path, value);
}
function* FromNumber3(schema, references, path, value) {
  if (!TypeSystemPolicy.IsNumberLike(value))
    return yield Create(ValueErrorType.Number, schema, path, value);
  if (IsDefined2(schema.exclusiveMaximum) && !(value < schema.exclusiveMaximum)) {
    yield Create(ValueErrorType.NumberExclusiveMaximum, schema, path, value);
  }
  if (IsDefined2(schema.exclusiveMinimum) && !(value > schema.exclusiveMinimum)) {
    yield Create(ValueErrorType.NumberExclusiveMinimum, schema, path, value);
  }
  if (IsDefined2(schema.maximum) && !(value <= schema.maximum)) {
    yield Create(ValueErrorType.NumberMaximum, schema, path, value);
  }
  if (IsDefined2(schema.minimum) && !(value >= schema.minimum)) {
    yield Create(ValueErrorType.NumberMinimum, schema, path, value);
  }
  if (IsDefined2(schema.multipleOf) && !(value % schema.multipleOf === 0)) {
    yield Create(ValueErrorType.NumberMultipleOf, schema, path, value);
  }
}
function* FromObject3(schema, references, path, value) {
  if (!TypeSystemPolicy.IsObjectLike(value))
    return yield Create(ValueErrorType.Object, schema, path, value);
  if (IsDefined2(schema.minProperties) && !(Object.getOwnPropertyNames(value).length >= schema.minProperties)) {
    yield Create(ValueErrorType.ObjectMinProperties, schema, path, value);
  }
  if (IsDefined2(schema.maxProperties) && !(Object.getOwnPropertyNames(value).length <= schema.maxProperties)) {
    yield Create(ValueErrorType.ObjectMaxProperties, schema, path, value);
  }
  const requiredKeys = Array.isArray(schema.required) ? schema.required : [];
  const knownKeys = Object.getOwnPropertyNames(schema.properties);
  const unknownKeys = Object.getOwnPropertyNames(value);
  for (const requiredKey of requiredKeys) {
    if (unknownKeys.includes(requiredKey))
      continue;
    yield Create(ValueErrorType.ObjectRequiredProperty, schema.properties[requiredKey], `${path}/${EscapeKey(requiredKey)}`, void 0);
  }
  if (schema.additionalProperties === false) {
    for (const valueKey of unknownKeys) {
      if (!knownKeys.includes(valueKey)) {
        yield Create(ValueErrorType.ObjectAdditionalProperties, schema, `${path}/${EscapeKey(valueKey)}`, value[valueKey]);
      }
    }
  }
  if (typeof schema.additionalProperties === "object") {
    for (const valueKey of unknownKeys) {
      if (knownKeys.includes(valueKey))
        continue;
      yield* Visit6(schema.additionalProperties, references, `${path}/${EscapeKey(valueKey)}`, value[valueKey]);
    }
  }
  for (const knownKey of knownKeys) {
    const property = schema.properties[knownKey];
    if (schema.required && schema.required.includes(knownKey)) {
      yield* Visit6(property, references, `${path}/${EscapeKey(knownKey)}`, value[knownKey]);
      if (ExtendsUndefinedCheck(schema) && !(knownKey in value)) {
        yield Create(ValueErrorType.ObjectRequiredProperty, property, `${path}/${EscapeKey(knownKey)}`, void 0);
      }
    } else {
      if (TypeSystemPolicy.IsExactOptionalProperty(value, knownKey)) {
        yield* Visit6(property, references, `${path}/${EscapeKey(knownKey)}`, value[knownKey]);
      }
    }
  }
}
function* FromPromise3(schema, references, path, value) {
  if (!IsPromise(value))
    yield Create(ValueErrorType.Promise, schema, path, value);
}
function* FromRecord3(schema, references, path, value) {
  if (!TypeSystemPolicy.IsRecordLike(value))
    return yield Create(ValueErrorType.Object, schema, path, value);
  if (IsDefined2(schema.minProperties) && !(Object.getOwnPropertyNames(value).length >= schema.minProperties)) {
    yield Create(ValueErrorType.ObjectMinProperties, schema, path, value);
  }
  if (IsDefined2(schema.maxProperties) && !(Object.getOwnPropertyNames(value).length <= schema.maxProperties)) {
    yield Create(ValueErrorType.ObjectMaxProperties, schema, path, value);
  }
  const [patternKey, patternSchema] = Object.entries(schema.patternProperties)[0];
  const regex = new RegExp(patternKey);
  for (const [propertyKey, propertyValue] of Object.entries(value)) {
    if (regex.test(propertyKey))
      yield* Visit6(patternSchema, references, `${path}/${EscapeKey(propertyKey)}`, propertyValue);
  }
  if (typeof schema.additionalProperties === "object") {
    for (const [propertyKey, propertyValue] of Object.entries(value)) {
      if (!regex.test(propertyKey))
        yield* Visit6(schema.additionalProperties, references, `${path}/${EscapeKey(propertyKey)}`, propertyValue);
    }
  }
  if (schema.additionalProperties === false) {
    for (const [propertyKey, propertyValue] of Object.entries(value)) {
      if (regex.test(propertyKey))
        continue;
      return yield Create(ValueErrorType.ObjectAdditionalProperties, schema, `${path}/${EscapeKey(propertyKey)}`, propertyValue);
    }
  }
}
function* FromRef3(schema, references, path, value) {
  yield* Visit6(Deref(schema, references), references, path, value);
}
function* FromRegExp3(schema, references, path, value) {
  if (!IsString(value))
    return yield Create(ValueErrorType.String, schema, path, value);
  if (IsDefined2(schema.minLength) && !(value.length >= schema.minLength)) {
    yield Create(ValueErrorType.StringMinLength, schema, path, value);
  }
  if (IsDefined2(schema.maxLength) && !(value.length <= schema.maxLength)) {
    yield Create(ValueErrorType.StringMaxLength, schema, path, value);
  }
  const regex = new RegExp(schema.source, schema.flags);
  if (!regex.test(value)) {
    return yield Create(ValueErrorType.RegExp, schema, path, value);
  }
}
function* FromString3(schema, references, path, value) {
  if (!IsString(value))
    return yield Create(ValueErrorType.String, schema, path, value);
  if (IsDefined2(schema.minLength) && !(value.length >= schema.minLength)) {
    yield Create(ValueErrorType.StringMinLength, schema, path, value);
  }
  if (IsDefined2(schema.maxLength) && !(value.length <= schema.maxLength)) {
    yield Create(ValueErrorType.StringMaxLength, schema, path, value);
  }
  if (IsString(schema.pattern)) {
    const regex = new RegExp(schema.pattern);
    if (!regex.test(value)) {
      yield Create(ValueErrorType.StringPattern, schema, path, value);
    }
  }
  if (IsString(schema.format)) {
    if (!format_exports.Has(schema.format)) {
      yield Create(ValueErrorType.StringFormatUnknown, schema, path, value);
    } else {
      const format = format_exports.Get(schema.format);
      if (!format(value)) {
        yield Create(ValueErrorType.StringFormat, schema, path, value);
      }
    }
  }
}
function* FromSymbol3(schema, references, path, value) {
  if (!IsSymbol(value))
    yield Create(ValueErrorType.Symbol, schema, path, value);
}
function* FromTemplateLiteral4(schema, references, path, value) {
  if (!IsString(value))
    return yield Create(ValueErrorType.String, schema, path, value);
  const regex = new RegExp(schema.pattern);
  if (!regex.test(value)) {
    yield Create(ValueErrorType.StringPattern, schema, path, value);
  }
}
function* FromThis2(schema, references, path, value) {
  yield* Visit6(Deref(schema, references), references, path, value);
}
function* FromTuple5(schema, references, path, value) {
  if (!IsArray(value))
    return yield Create(ValueErrorType.Tuple, schema, path, value);
  if (schema.items === void 0 && !(value.length === 0)) {
    return yield Create(ValueErrorType.TupleLength, schema, path, value);
  }
  if (!(value.length === schema.maxItems)) {
    return yield Create(ValueErrorType.TupleLength, schema, path, value);
  }
  if (!schema.items) {
    return;
  }
  for (let i = 0; i < schema.items.length; i++) {
    yield* Visit6(schema.items[i], references, `${path}/${i}`, value[i]);
  }
}
function* FromUndefined3(schema, references, path, value) {
  if (!IsUndefined(value))
    yield Create(ValueErrorType.Undefined, schema, path, value);
}
function* FromUnion7(schema, references, path, value) {
  if (Check(schema, references, value))
    return;
  const errors = schema.anyOf.map((variant) => new ValueErrorIterator(Visit6(variant, references, path, value)));
  yield Create(ValueErrorType.Union, schema, path, value, errors);
}
function* FromUint8Array3(schema, references, path, value) {
  if (!IsUint8Array(value))
    return yield Create(ValueErrorType.Uint8Array, schema, path, value);
  if (IsDefined2(schema.maxByteLength) && !(value.length <= schema.maxByteLength)) {
    yield Create(ValueErrorType.Uint8ArrayMaxByteLength, schema, path, value);
  }
  if (IsDefined2(schema.minByteLength) && !(value.length >= schema.minByteLength)) {
    yield Create(ValueErrorType.Uint8ArrayMinByteLength, schema, path, value);
  }
}
function* FromUnknown3(schema, references, path, value) {
}
function* FromVoid3(schema, references, path, value) {
  if (!TypeSystemPolicy.IsVoidLike(value))
    yield Create(ValueErrorType.Void, schema, path, value);
}
function* FromKind2(schema, references, path, value) {
  const check = type_exports.Get(schema[Kind]);
  if (!check(schema, value))
    yield Create(ValueErrorType.Kind, schema, path, value);
}
function* Visit6(schema, references, path, value) {
  const references_ = IsDefined2(schema.$id) ? [...references, schema] : references;
  const schema_ = schema;
  switch (schema_[Kind]) {
    case "Any":
      return yield* FromAny3(schema_, references_, path, value);
    case "Argument":
      return yield* FromArgument2(schema_, references_, path, value);
    case "Array":
      return yield* FromArray5(schema_, references_, path, value);
    case "AsyncIterator":
      return yield* FromAsyncIterator3(schema_, references_, path, value);
    case "BigInt":
      return yield* FromBigInt3(schema_, references_, path, value);
    case "Boolean":
      return yield* FromBoolean3(schema_, references_, path, value);
    case "Constructor":
      return yield* FromConstructor3(schema_, references_, path, value);
    case "Date":
      return yield* FromDate3(schema_, references_, path, value);
    case "Function":
      return yield* FromFunction3(schema_, references_, path, value);
    case "Import":
      return yield* FromImport2(schema_, references_, path, value);
    case "Integer":
      return yield* FromInteger3(schema_, references_, path, value);
    case "Intersect":
      return yield* FromIntersect5(schema_, references_, path, value);
    case "Iterator":
      return yield* FromIterator3(schema_, references_, path, value);
    case "Literal":
      return yield* FromLiteral4(schema_, references_, path, value);
    case "Never":
      return yield* FromNever3(schema_, references_, path, value);
    case "Not":
      return yield* FromNot3(schema_, references_, path, value);
    case "Null":
      return yield* FromNull3(schema_, references_, path, value);
    case "Number":
      return yield* FromNumber3(schema_, references_, path, value);
    case "Object":
      return yield* FromObject3(schema_, references_, path, value);
    case "Promise":
      return yield* FromPromise3(schema_, references_, path, value);
    case "Record":
      return yield* FromRecord3(schema_, references_, path, value);
    case "Ref":
      return yield* FromRef3(schema_, references_, path, value);
    case "RegExp":
      return yield* FromRegExp3(schema_, references_, path, value);
    case "String":
      return yield* FromString3(schema_, references_, path, value);
    case "Symbol":
      return yield* FromSymbol3(schema_, references_, path, value);
    case "TemplateLiteral":
      return yield* FromTemplateLiteral4(schema_, references_, path, value);
    case "This":
      return yield* FromThis2(schema_, references_, path, value);
    case "Tuple":
      return yield* FromTuple5(schema_, references_, path, value);
    case "Undefined":
      return yield* FromUndefined3(schema_, references_, path, value);
    case "Union":
      return yield* FromUnion7(schema_, references_, path, value);
    case "Uint8Array":
      return yield* FromUint8Array3(schema_, references_, path, value);
    case "Unknown":
      return yield* FromUnknown3(schema_, references_, path, value);
    case "Void":
      return yield* FromVoid3(schema_, references_, path, value);
    default:
      if (!type_exports.Has(schema_[Kind]))
        throw new ValueErrorsUnknownTypeError(schema);
      return yield* FromKind2(schema_, references_, path, value);
  }
}
function Errors(...args) {
  const iterator = args.length === 3 ? Visit6(args[0], args[1], "", args[2]) : Visit6(args[0], [], "", args[1]);
  return new ValueErrorIterator(iterator);
}

// src/contract/decode.ts
var ValidationError = class extends Error {
  constructor(message, issues) {
    super(message);
    __publicField(this, "issues");
    this.name = "ValidationError";
    this.issues = issues;
  }
};
function decode(schema, raw, label) {
  if (!Check(schema, raw)) {
    throw new ValidationError(`Invalid ${label} response`, [...Errors(schema, raw)]);
  }
  return raw;
}

// node_modules/@sinclair/typebox/build/esm/type/clone/type.mjs
function CloneType(schema, options) {
  return options === void 0 ? Clone(schema) : Clone({ ...options, ...schema });
}

// node_modules/@sinclair/typebox/build/esm/type/argument/argument.mjs
function Argument(index) {
  return CreateType({ [Kind]: "Argument", index });
}

// node_modules/@sinclair/typebox/build/esm/type/awaited/awaited.mjs
function FromComputed2(target, parameters) {
  return Computed("Awaited", [Computed(target, parameters)]);
}
function FromRef4($ref) {
  return Computed("Awaited", [Ref($ref)]);
}
function FromIntersect6(types) {
  return Intersect(FromRest4(types));
}
function FromUnion8(types) {
  return Union(FromRest4(types));
}
function FromPromise4(type) {
  return Awaited(type);
}
function FromRest4(types) {
  return types.map((type) => Awaited(type));
}
function Awaited(type, options) {
  return CreateType(IsComputed(type) ? FromComputed2(type.target, type.parameters) : IsIntersect(type) ? FromIntersect6(type.allOf) : IsUnion(type) ? FromUnion8(type.anyOf) : IsPromise2(type) ? FromPromise4(type.item) : IsRef(type) ? FromRef4(type.$ref) : type, options);
}

// node_modules/@sinclair/typebox/build/esm/type/composite/composite.mjs
function CompositeKeys(T) {
  const Acc = [];
  for (const L of T)
    Acc.push(...KeyOfPropertyKeys(L));
  return SetDistinct(Acc);
}
function FilterNever(T) {
  return T.filter((L) => !IsNever(L));
}
function CompositeProperty(T, K) {
  const Acc = [];
  for (const L of T)
    Acc.push(...IndexFromPropertyKeys(L, [K]));
  return FilterNever(Acc);
}
function CompositeProperties(T, K) {
  const Acc = {};
  for (const L of K) {
    Acc[L] = IntersectEvaluated(CompositeProperty(T, L));
  }
  return Acc;
}
function Composite(T, options) {
  const K = CompositeKeys(T);
  const P = CompositeProperties(T, K);
  const R = Object2(P, options);
  return R;
}

// node_modules/@sinclair/typebox/build/esm/type/date/date.mjs
function Date2(options) {
  return CreateType({ [Kind]: "Date", type: "Date" }, options);
}

// node_modules/@sinclair/typebox/build/esm/type/null/null.mjs
function Null(options) {
  return CreateType({ [Kind]: "Null", type: "null" }, options);
}

// node_modules/@sinclair/typebox/build/esm/type/symbol/symbol.mjs
function Symbol2(options) {
  return CreateType({ [Kind]: "Symbol", type: "symbol" }, options);
}

// node_modules/@sinclair/typebox/build/esm/type/undefined/undefined.mjs
function Undefined(options) {
  return CreateType({ [Kind]: "Undefined", type: "undefined" }, options);
}

// node_modules/@sinclair/typebox/build/esm/type/uint8array/uint8array.mjs
function Uint8Array2(options) {
  return CreateType({ [Kind]: "Uint8Array", type: "Uint8Array" }, options);
}

// node_modules/@sinclair/typebox/build/esm/type/const/const.mjs
function FromArray6(T) {
  return T.map((L) => FromValue(L, false));
}
function FromProperties8(value) {
  const Acc = {};
  for (const K of globalThis.Object.getOwnPropertyNames(value))
    Acc[K] = Readonly(FromValue(value[K], false));
  return Acc;
}
function ConditionalReadonly(T, root) {
  return root === true ? T : Readonly(T);
}
function FromValue(value, root) {
  return IsAsyncIterator2(value) ? ConditionalReadonly(Any(), root) : IsIterator2(value) ? ConditionalReadonly(Any(), root) : IsArray2(value) ? Readonly(Tuple(FromArray6(value))) : IsUint8Array2(value) ? Uint8Array2() : IsDate2(value) ? Date2() : IsObject2(value) ? ConditionalReadonly(Object2(FromProperties8(value)), root) : IsFunction2(value) ? ConditionalReadonly(Function2([], Unknown()), root) : IsUndefined2(value) ? Undefined() : IsNull2(value) ? Null() : IsSymbol2(value) ? Symbol2() : IsBigInt2(value) ? BigInt2() : IsNumber2(value) ? Literal(value) : IsBoolean2(value) ? Literal(value) : IsString2(value) ? Literal(value) : Object2({});
}
function Const(T, options) {
  return CreateType(FromValue(T, true), options);
}

// node_modules/@sinclair/typebox/build/esm/type/constructor-parameters/constructor-parameters.mjs
function ConstructorParameters(schema, options) {
  return IsConstructor(schema) ? Tuple(schema.parameters, options) : Never(options);
}

// node_modules/@sinclair/typebox/build/esm/type/enum/enum.mjs
function Enum(item, options) {
  if (IsUndefined2(item))
    throw new Error("Enum undefined or empty");
  const values1 = globalThis.Object.getOwnPropertyNames(item).filter((key) => isNaN(key)).map((key) => item[key]);
  const values2 = [...new Set(values1)];
  const anyOf = values2.map((value) => Literal(value));
  return Union(anyOf, { ...options, [Hint]: "Enum" });
}

// node_modules/@sinclair/typebox/build/esm/type/exclude/exclude-from-template-literal.mjs
function ExcludeFromTemplateLiteral(L, R) {
  return Exclude(TemplateLiteralToUnion(L), R);
}

// node_modules/@sinclair/typebox/build/esm/type/exclude/exclude.mjs
function ExcludeRest(L, R) {
  const excluded = L.filter((inner) => ExtendsCheck(inner, R) === ExtendsResult.False);
  return excluded.length === 1 ? excluded[0] : Union(excluded);
}
function Exclude(L, R, options = {}) {
  if (IsTemplateLiteral(L))
    return CreateType(ExcludeFromTemplateLiteral(L, R), options);
  if (IsMappedResult(L))
    return CreateType(ExcludeFromMappedResult(L, R), options);
  return CreateType(IsUnion(L) ? ExcludeRest(L.anyOf, R) : ExtendsCheck(L, R) !== ExtendsResult.False ? Never() : L, options);
}

// node_modules/@sinclair/typebox/build/esm/type/exclude/exclude-from-mapped-result.mjs
function FromProperties9(P, U) {
  const Acc = {};
  for (const K2 of globalThis.Object.getOwnPropertyNames(P))
    Acc[K2] = Exclude(P[K2], U);
  return Acc;
}
function FromMappedResult7(R, T) {
  return FromProperties9(R.properties, T);
}
function ExcludeFromMappedResult(R, T) {
  const P = FromMappedResult7(R, T);
  return MappedResult(P);
}

// node_modules/@sinclair/typebox/build/esm/type/extract/extract-from-template-literal.mjs
function ExtractFromTemplateLiteral(L, R) {
  return Extract(TemplateLiteralToUnion(L), R);
}

// node_modules/@sinclair/typebox/build/esm/type/extract/extract.mjs
function ExtractRest(L, R) {
  const extracted = L.filter((inner) => ExtendsCheck(inner, R) !== ExtendsResult.False);
  return extracted.length === 1 ? extracted[0] : Union(extracted);
}
function Extract(L, R, options) {
  if (IsTemplateLiteral(L))
    return CreateType(ExtractFromTemplateLiteral(L, R), options);
  if (IsMappedResult(L))
    return CreateType(ExtractFromMappedResult(L, R), options);
  return CreateType(IsUnion(L) ? ExtractRest(L.anyOf, R) : ExtendsCheck(L, R) !== ExtendsResult.False ? L : Never(), options);
}

// node_modules/@sinclair/typebox/build/esm/type/extract/extract-from-mapped-result.mjs
function FromProperties10(P, T) {
  const Acc = {};
  for (const K2 of globalThis.Object.getOwnPropertyNames(P))
    Acc[K2] = Extract(P[K2], T);
  return Acc;
}
function FromMappedResult8(R, T) {
  return FromProperties10(R.properties, T);
}
function ExtractFromMappedResult(R, T) {
  const P = FromMappedResult8(R, T);
  return MappedResult(P);
}

// node_modules/@sinclair/typebox/build/esm/type/instance-type/instance-type.mjs
function InstanceType(schema, options) {
  return IsConstructor(schema) ? CreateType(schema.returns, options) : Never(options);
}

// node_modules/@sinclair/typebox/build/esm/type/readonly-optional/readonly-optional.mjs
function ReadonlyOptional(schema) {
  return Readonly(Optional(schema));
}

// node_modules/@sinclair/typebox/build/esm/type/record/record.mjs
function RecordCreateFromPattern(pattern, T, options) {
  return CreateType({ [Kind]: "Record", type: "object", patternProperties: { [pattern]: T } }, options);
}
function RecordCreateFromKeys(K, T, options) {
  const result = {};
  for (const K2 of K)
    result[K2] = T;
  return Object2(result, { ...options, [Hint]: "Record" });
}
function FromTemplateLiteralKey(K, T, options) {
  return IsTemplateLiteralFinite(K) ? RecordCreateFromKeys(IndexPropertyKeys(K), T, options) : RecordCreateFromPattern(K.pattern, T, options);
}
function FromUnionKey(key, type, options) {
  return RecordCreateFromKeys(IndexPropertyKeys(Union(key)), type, options);
}
function FromLiteralKey(key, type, options) {
  return RecordCreateFromKeys([key.toString()], type, options);
}
function FromRegExpKey(key, type, options) {
  return RecordCreateFromPattern(key.source, type, options);
}
function FromStringKey(key, type, options) {
  const pattern = IsUndefined2(key.pattern) ? PatternStringExact : key.pattern;
  return RecordCreateFromPattern(pattern, type, options);
}
function FromAnyKey(_, type, options) {
  return RecordCreateFromPattern(PatternStringExact, type, options);
}
function FromNeverKey(_key, type, options) {
  return RecordCreateFromPattern(PatternNeverExact, type, options);
}
function FromBooleanKey(_key, type, options) {
  return Object2({ true: type, false: type }, options);
}
function FromIntegerKey(_key, type, options) {
  return RecordCreateFromPattern(PatternNumberExact, type, options);
}
function FromNumberKey(_, type, options) {
  return RecordCreateFromPattern(PatternNumberExact, type, options);
}
function Record(key, type, options = {}) {
  return IsUnion(key) ? FromUnionKey(key.anyOf, type, options) : IsTemplateLiteral(key) ? FromTemplateLiteralKey(key, type, options) : IsLiteral(key) ? FromLiteralKey(key.const, type, options) : IsBoolean3(key) ? FromBooleanKey(key, type, options) : IsInteger2(key) ? FromIntegerKey(key, type, options) : IsNumber3(key) ? FromNumberKey(key, type, options) : IsRegExp2(key) ? FromRegExpKey(key, type, options) : IsString3(key) ? FromStringKey(key, type, options) : IsAny(key) ? FromAnyKey(key, type, options) : IsNever(key) ? FromNeverKey(key, type, options) : Never(options);
}
function RecordPattern(record) {
  return globalThis.Object.getOwnPropertyNames(record.patternProperties)[0];
}
function RecordKey2(type) {
  const pattern = RecordPattern(type);
  return pattern === PatternStringExact ? String2() : pattern === PatternNumberExact ? Number2() : String2({ pattern });
}
function RecordValue2(type) {
  return type.patternProperties[RecordPattern(type)];
}

// node_modules/@sinclair/typebox/build/esm/type/instantiate/instantiate.mjs
function FromConstructor4(args, type) {
  type.parameters = FromTypes(args, type.parameters);
  type.returns = FromType(args, type.returns);
  return type;
}
function FromFunction4(args, type) {
  type.parameters = FromTypes(args, type.parameters);
  type.returns = FromType(args, type.returns);
  return type;
}
function FromIntersect7(args, type) {
  type.allOf = FromTypes(args, type.allOf);
  return type;
}
function FromUnion9(args, type) {
  type.anyOf = FromTypes(args, type.anyOf);
  return type;
}
function FromTuple6(args, type) {
  if (IsUndefined2(type.items))
    return type;
  type.items = FromTypes(args, type.items);
  return type;
}
function FromArray7(args, type) {
  type.items = FromType(args, type.items);
  return type;
}
function FromAsyncIterator4(args, type) {
  type.items = FromType(args, type.items);
  return type;
}
function FromIterator4(args, type) {
  type.items = FromType(args, type.items);
  return type;
}
function FromPromise5(args, type) {
  type.item = FromType(args, type.item);
  return type;
}
function FromObject4(args, type) {
  const mappedProperties = FromProperties11(args, type.properties);
  return { ...type, ...Object2(mappedProperties) };
}
function FromRecord4(args, type) {
  const mappedKey = FromType(args, RecordKey2(type));
  const mappedValue = FromType(args, RecordValue2(type));
  const result = Record(mappedKey, mappedValue);
  return { ...type, ...result };
}
function FromArgument3(args, argument) {
  return argument.index in args ? args[argument.index] : Unknown();
}
function FromProperty2(args, type) {
  const isReadonly = IsReadonly(type);
  const isOptional = IsOptional(type);
  const mapped = FromType(args, type);
  return isReadonly && isOptional ? ReadonlyOptional(mapped) : isReadonly && !isOptional ? Readonly(mapped) : !isReadonly && isOptional ? Optional(mapped) : mapped;
}
function FromProperties11(args, properties) {
  return globalThis.Object.getOwnPropertyNames(properties).reduce((result, key) => {
    return { ...result, [key]: FromProperty2(args, properties[key]) };
  }, {});
}
function FromTypes(args, types) {
  return types.map((type) => FromType(args, type));
}
function FromType(args, type) {
  return IsConstructor(type) ? FromConstructor4(args, type) : IsFunction3(type) ? FromFunction4(args, type) : IsIntersect(type) ? FromIntersect7(args, type) : IsUnion(type) ? FromUnion9(args, type) : IsTuple(type) ? FromTuple6(args, type) : IsArray3(type) ? FromArray7(args, type) : IsAsyncIterator3(type) ? FromAsyncIterator4(args, type) : IsIterator3(type) ? FromIterator4(args, type) : IsPromise2(type) ? FromPromise5(args, type) : IsObject3(type) ? FromObject4(args, type) : IsRecord(type) ? FromRecord4(args, type) : IsArgument(type) ? FromArgument3(args, type) : type;
}
function Instantiate(type, args) {
  return FromType(args, CloneType(type));
}

// node_modules/@sinclair/typebox/build/esm/type/integer/integer.mjs
function Integer(options) {
  return CreateType({ [Kind]: "Integer", type: "integer" }, options);
}

// node_modules/@sinclair/typebox/build/esm/type/intrinsic/intrinsic-from-mapped-key.mjs
function MappedIntrinsicPropertyKey(K, M, options) {
  return {
    [K]: Intrinsic(Literal(K), M, Clone(options))
  };
}
function MappedIntrinsicPropertyKeys(K, M, options) {
  const result = K.reduce((Acc, L) => {
    return { ...Acc, ...MappedIntrinsicPropertyKey(L, M, options) };
  }, {});
  return result;
}
function MappedIntrinsicProperties(T, M, options) {
  return MappedIntrinsicPropertyKeys(T["keys"], M, options);
}
function IntrinsicFromMappedKey(T, M, options) {
  const P = MappedIntrinsicProperties(T, M, options);
  return MappedResult(P);
}

// node_modules/@sinclair/typebox/build/esm/type/intrinsic/intrinsic.mjs
function ApplyUncapitalize(value) {
  const [first, rest] = [value.slice(0, 1), value.slice(1)];
  return [first.toLowerCase(), rest].join("");
}
function ApplyCapitalize(value) {
  const [first, rest] = [value.slice(0, 1), value.slice(1)];
  return [first.toUpperCase(), rest].join("");
}
function ApplyUppercase(value) {
  return value.toUpperCase();
}
function ApplyLowercase(value) {
  return value.toLowerCase();
}
function FromTemplateLiteral5(schema, mode, options) {
  const expression = TemplateLiteralParseExact(schema.pattern);
  const finite = IsTemplateLiteralExpressionFinite(expression);
  if (!finite)
    return { ...schema, pattern: FromLiteralValue(schema.pattern, mode) };
  const strings = [...TemplateLiteralExpressionGenerate(expression)];
  const literals = strings.map((value) => Literal(value));
  const mapped = FromRest5(literals, mode);
  const union = Union(mapped);
  return TemplateLiteral([union], options);
}
function FromLiteralValue(value, mode) {
  return typeof value === "string" ? mode === "Uncapitalize" ? ApplyUncapitalize(value) : mode === "Capitalize" ? ApplyCapitalize(value) : mode === "Uppercase" ? ApplyUppercase(value) : mode === "Lowercase" ? ApplyLowercase(value) : value : value.toString();
}
function FromRest5(T, M) {
  return T.map((L) => Intrinsic(L, M));
}
function Intrinsic(schema, mode, options = {}) {
  return (
    // Intrinsic-Mapped-Inference
    IsMappedKey(schema) ? IntrinsicFromMappedKey(schema, mode, options) : (
      // Standard-Inference
      IsTemplateLiteral(schema) ? FromTemplateLiteral5(schema, mode, options) : IsUnion(schema) ? Union(FromRest5(schema.anyOf, mode), options) : IsLiteral(schema) ? Literal(FromLiteralValue(schema.const, mode), options) : (
        // Default Type
        CreateType(schema, options)
      )
    )
  );
}

// node_modules/@sinclair/typebox/build/esm/type/intrinsic/capitalize.mjs
function Capitalize(T, options = {}) {
  return Intrinsic(T, "Capitalize", options);
}

// node_modules/@sinclair/typebox/build/esm/type/intrinsic/lowercase.mjs
function Lowercase(T, options = {}) {
  return Intrinsic(T, "Lowercase", options);
}

// node_modules/@sinclair/typebox/build/esm/type/intrinsic/uncapitalize.mjs
function Uncapitalize(T, options = {}) {
  return Intrinsic(T, "Uncapitalize", options);
}

// node_modules/@sinclair/typebox/build/esm/type/intrinsic/uppercase.mjs
function Uppercase(T, options = {}) {
  return Intrinsic(T, "Uppercase", options);
}

// node_modules/@sinclair/typebox/build/esm/type/omit/omit-from-mapped-result.mjs
function FromProperties12(properties, propertyKeys, options) {
  const result = {};
  for (const K2 of globalThis.Object.getOwnPropertyNames(properties))
    result[K2] = Omit(properties[K2], propertyKeys, Clone(options));
  return result;
}
function FromMappedResult9(mappedResult, propertyKeys, options) {
  return FromProperties12(mappedResult.properties, propertyKeys, options);
}
function OmitFromMappedResult(mappedResult, propertyKeys, options) {
  const properties = FromMappedResult9(mappedResult, propertyKeys, options);
  return MappedResult(properties);
}

// node_modules/@sinclair/typebox/build/esm/type/omit/omit.mjs
function FromIntersect8(types, propertyKeys) {
  return types.map((type) => OmitResolve(type, propertyKeys));
}
function FromUnion10(types, propertyKeys) {
  return types.map((type) => OmitResolve(type, propertyKeys));
}
function FromProperty3(properties, key) {
  const { [key]: _, ...R } = properties;
  return R;
}
function FromProperties13(properties, propertyKeys) {
  return propertyKeys.reduce((T, K2) => FromProperty3(T, K2), properties);
}
function FromObject5(type, propertyKeys, properties) {
  const options = Discard(type, [TransformKind, "$id", "required", "properties"]);
  const mappedProperties = FromProperties13(properties, propertyKeys);
  return Object2(mappedProperties, options);
}
function UnionFromPropertyKeys(propertyKeys) {
  const result = propertyKeys.reduce((result2, key) => IsLiteralValue(key) ? [...result2, Literal(key)] : result2, []);
  return Union(result);
}
function OmitResolve(type, propertyKeys) {
  return IsIntersect(type) ? Intersect(FromIntersect8(type.allOf, propertyKeys)) : IsUnion(type) ? Union(FromUnion10(type.anyOf, propertyKeys)) : IsObject3(type) ? FromObject5(type, propertyKeys, type.properties) : Object2({});
}
function Omit(type, key, options) {
  const typeKey = IsArray2(key) ? UnionFromPropertyKeys(key) : key;
  const propertyKeys = IsSchema(key) ? IndexPropertyKeys(key) : key;
  const isTypeRef = IsRef(type);
  const isKeyRef = IsRef(key);
  return IsMappedResult(type) ? OmitFromMappedResult(type, propertyKeys, options) : IsMappedKey(key) ? OmitFromMappedKey(type, key, options) : isTypeRef && isKeyRef ? Computed("Omit", [type, typeKey], options) : !isTypeRef && isKeyRef ? Computed("Omit", [type, typeKey], options) : isTypeRef && !isKeyRef ? Computed("Omit", [type, typeKey], options) : CreateType({ ...OmitResolve(type, propertyKeys), ...options });
}

// node_modules/@sinclair/typebox/build/esm/type/omit/omit-from-mapped-key.mjs
function FromPropertyKey2(type, key, options) {
  return { [key]: Omit(type, [key], Clone(options)) };
}
function FromPropertyKeys2(type, propertyKeys, options) {
  return propertyKeys.reduce((Acc, LK) => {
    return { ...Acc, ...FromPropertyKey2(type, LK, options) };
  }, {});
}
function FromMappedKey3(type, mappedKey, options) {
  return FromPropertyKeys2(type, mappedKey.keys, options);
}
function OmitFromMappedKey(type, mappedKey, options) {
  const properties = FromMappedKey3(type, mappedKey, options);
  return MappedResult(properties);
}

// node_modules/@sinclair/typebox/build/esm/type/pick/pick-from-mapped-result.mjs
function FromProperties14(properties, propertyKeys, options) {
  const result = {};
  for (const K2 of globalThis.Object.getOwnPropertyNames(properties))
    result[K2] = Pick(properties[K2], propertyKeys, Clone(options));
  return result;
}
function FromMappedResult10(mappedResult, propertyKeys, options) {
  return FromProperties14(mappedResult.properties, propertyKeys, options);
}
function PickFromMappedResult(mappedResult, propertyKeys, options) {
  const properties = FromMappedResult10(mappedResult, propertyKeys, options);
  return MappedResult(properties);
}

// node_modules/@sinclair/typebox/build/esm/type/pick/pick.mjs
function FromIntersect9(types, propertyKeys) {
  return types.map((type) => PickResolve(type, propertyKeys));
}
function FromUnion11(types, propertyKeys) {
  return types.map((type) => PickResolve(type, propertyKeys));
}
function FromProperties15(properties, propertyKeys) {
  const result = {};
  for (const K2 of propertyKeys)
    if (K2 in properties)
      result[K2] = properties[K2];
  return result;
}
function FromObject6(Type2, keys, properties) {
  const options = Discard(Type2, [TransformKind, "$id", "required", "properties"]);
  const mappedProperties = FromProperties15(properties, keys);
  return Object2(mappedProperties, options);
}
function UnionFromPropertyKeys2(propertyKeys) {
  const result = propertyKeys.reduce((result2, key) => IsLiteralValue(key) ? [...result2, Literal(key)] : result2, []);
  return Union(result);
}
function PickResolve(type, propertyKeys) {
  return IsIntersect(type) ? Intersect(FromIntersect9(type.allOf, propertyKeys)) : IsUnion(type) ? Union(FromUnion11(type.anyOf, propertyKeys)) : IsObject3(type) ? FromObject6(type, propertyKeys, type.properties) : Object2({});
}
function Pick(type, key, options) {
  const typeKey = IsArray2(key) ? UnionFromPropertyKeys2(key) : key;
  const propertyKeys = IsSchema(key) ? IndexPropertyKeys(key) : key;
  const isTypeRef = IsRef(type);
  const isKeyRef = IsRef(key);
  return IsMappedResult(type) ? PickFromMappedResult(type, propertyKeys, options) : IsMappedKey(key) ? PickFromMappedKey(type, key, options) : isTypeRef && isKeyRef ? Computed("Pick", [type, typeKey], options) : !isTypeRef && isKeyRef ? Computed("Pick", [type, typeKey], options) : isTypeRef && !isKeyRef ? Computed("Pick", [type, typeKey], options) : CreateType({ ...PickResolve(type, propertyKeys), ...options });
}

// node_modules/@sinclair/typebox/build/esm/type/pick/pick-from-mapped-key.mjs
function FromPropertyKey3(type, key, options) {
  return {
    [key]: Pick(type, [key], Clone(options))
  };
}
function FromPropertyKeys3(type, propertyKeys, options) {
  return propertyKeys.reduce((result, leftKey) => {
    return { ...result, ...FromPropertyKey3(type, leftKey, options) };
  }, {});
}
function FromMappedKey4(type, mappedKey, options) {
  return FromPropertyKeys3(type, mappedKey.keys, options);
}
function PickFromMappedKey(type, mappedKey, options) {
  const properties = FromMappedKey4(type, mappedKey, options);
  return MappedResult(properties);
}

// node_modules/@sinclair/typebox/build/esm/type/partial/partial.mjs
function FromComputed3(target, parameters) {
  return Computed("Partial", [Computed(target, parameters)]);
}
function FromRef5($ref) {
  return Computed("Partial", [Ref($ref)]);
}
function FromProperties16(properties) {
  const partialProperties = {};
  for (const K of globalThis.Object.getOwnPropertyNames(properties))
    partialProperties[K] = Optional(properties[K]);
  return partialProperties;
}
function FromObject7(type, properties) {
  const options = Discard(type, [TransformKind, "$id", "required", "properties"]);
  const mappedProperties = FromProperties16(properties);
  return Object2(mappedProperties, options);
}
function FromRest6(types) {
  return types.map((type) => PartialResolve(type));
}
function PartialResolve(type) {
  return (
    // Mappable
    IsComputed(type) ? FromComputed3(type.target, type.parameters) : IsRef(type) ? FromRef5(type.$ref) : IsIntersect(type) ? Intersect(FromRest6(type.allOf)) : IsUnion(type) ? Union(FromRest6(type.anyOf)) : IsObject3(type) ? FromObject7(type, type.properties) : (
      // Intrinsic
      IsBigInt3(type) ? type : IsBoolean3(type) ? type : IsInteger2(type) ? type : IsLiteral(type) ? type : IsNull3(type) ? type : IsNumber3(type) ? type : IsString3(type) ? type : IsSymbol3(type) ? type : IsUndefined3(type) ? type : (
        // Passthrough
        Object2({})
      )
    )
  );
}
function Partial(type, options) {
  if (IsMappedResult(type)) {
    return PartialFromMappedResult(type, options);
  } else {
    return CreateType({ ...PartialResolve(type), ...options });
  }
}

// node_modules/@sinclair/typebox/build/esm/type/partial/partial-from-mapped-result.mjs
function FromProperties17(K, options) {
  const Acc = {};
  for (const K2 of globalThis.Object.getOwnPropertyNames(K))
    Acc[K2] = Partial(K[K2], Clone(options));
  return Acc;
}
function FromMappedResult11(R, options) {
  return FromProperties17(R.properties, options);
}
function PartialFromMappedResult(R, options) {
  const P = FromMappedResult11(R, options);
  return MappedResult(P);
}

// node_modules/@sinclair/typebox/build/esm/type/required/required.mjs
function FromComputed4(target, parameters) {
  return Computed("Required", [Computed(target, parameters)]);
}
function FromRef6($ref) {
  return Computed("Required", [Ref($ref)]);
}
function FromProperties18(properties) {
  const requiredProperties = {};
  for (const K of globalThis.Object.getOwnPropertyNames(properties))
    requiredProperties[K] = Discard(properties[K], [OptionalKind]);
  return requiredProperties;
}
function FromObject8(type, properties) {
  const options = Discard(type, [TransformKind, "$id", "required", "properties"]);
  const mappedProperties = FromProperties18(properties);
  return Object2(mappedProperties, options);
}
function FromRest7(types) {
  return types.map((type) => RequiredResolve(type));
}
function RequiredResolve(type) {
  return (
    // Mappable
    IsComputed(type) ? FromComputed4(type.target, type.parameters) : IsRef(type) ? FromRef6(type.$ref) : IsIntersect(type) ? Intersect(FromRest7(type.allOf)) : IsUnion(type) ? Union(FromRest7(type.anyOf)) : IsObject3(type) ? FromObject8(type, type.properties) : (
      // Intrinsic
      IsBigInt3(type) ? type : IsBoolean3(type) ? type : IsInteger2(type) ? type : IsLiteral(type) ? type : IsNull3(type) ? type : IsNumber3(type) ? type : IsString3(type) ? type : IsSymbol3(type) ? type : IsUndefined3(type) ? type : (
        // Passthrough
        Object2({})
      )
    )
  );
}
function Required(type, options) {
  if (IsMappedResult(type)) {
    return RequiredFromMappedResult(type, options);
  } else {
    return CreateType({ ...RequiredResolve(type), ...options });
  }
}

// node_modules/@sinclair/typebox/build/esm/type/required/required-from-mapped-result.mjs
function FromProperties19(P, options) {
  const Acc = {};
  for (const K2 of globalThis.Object.getOwnPropertyNames(P))
    Acc[K2] = Required(P[K2], options);
  return Acc;
}
function FromMappedResult12(R, options) {
  return FromProperties19(R.properties, options);
}
function RequiredFromMappedResult(R, options) {
  const P = FromMappedResult12(R, options);
  return MappedResult(P);
}

// node_modules/@sinclair/typebox/build/esm/type/module/compute.mjs
function DereferenceParameters(moduleProperties, types) {
  return types.map((type) => {
    return IsRef(type) ? Dereference(moduleProperties, type.$ref) : FromType2(moduleProperties, type);
  });
}
function Dereference(moduleProperties, ref) {
  return ref in moduleProperties ? IsRef(moduleProperties[ref]) ? Dereference(moduleProperties, moduleProperties[ref].$ref) : FromType2(moduleProperties, moduleProperties[ref]) : Never();
}
function FromAwaited(parameters) {
  return Awaited(parameters[0]);
}
function FromIndex(parameters) {
  return Index(parameters[0], parameters[1]);
}
function FromKeyOf(parameters) {
  return KeyOf(parameters[0]);
}
function FromPartial(parameters) {
  return Partial(parameters[0]);
}
function FromOmit(parameters) {
  return Omit(parameters[0], parameters[1]);
}
function FromPick(parameters) {
  return Pick(parameters[0], parameters[1]);
}
function FromRequired(parameters) {
  return Required(parameters[0]);
}
function FromComputed5(moduleProperties, target, parameters) {
  const dereferenced = DereferenceParameters(moduleProperties, parameters);
  return target === "Awaited" ? FromAwaited(dereferenced) : target === "Index" ? FromIndex(dereferenced) : target === "KeyOf" ? FromKeyOf(dereferenced) : target === "Partial" ? FromPartial(dereferenced) : target === "Omit" ? FromOmit(dereferenced) : target === "Pick" ? FromPick(dereferenced) : target === "Required" ? FromRequired(dereferenced) : Never();
}
function FromArray8(moduleProperties, type) {
  return Array2(FromType2(moduleProperties, type));
}
function FromAsyncIterator5(moduleProperties, type) {
  return AsyncIterator2(FromType2(moduleProperties, type));
}
function FromConstructor5(moduleProperties, parameters, instanceType) {
  return Constructor(FromTypes2(moduleProperties, parameters), FromType2(moduleProperties, instanceType));
}
function FromFunction5(moduleProperties, parameters, returnType) {
  return Function2(FromTypes2(moduleProperties, parameters), FromType2(moduleProperties, returnType));
}
function FromIntersect10(moduleProperties, types) {
  return Intersect(FromTypes2(moduleProperties, types));
}
function FromIterator5(moduleProperties, type) {
  return Iterator2(FromType2(moduleProperties, type));
}
function FromObject9(moduleProperties, properties) {
  return Object2(globalThis.Object.keys(properties).reduce((result, key) => {
    return { ...result, [key]: FromType2(moduleProperties, properties[key]) };
  }, {}));
}
function FromRecord5(moduleProperties, type) {
  const [value, pattern] = [FromType2(moduleProperties, RecordValue2(type)), RecordPattern(type)];
  const result = CloneType(type);
  result.patternProperties[pattern] = value;
  return result;
}
function FromTransform(moduleProperties, transform) {
  return IsRef(transform) ? { ...Dereference(moduleProperties, transform.$ref), [TransformKind]: transform[TransformKind] } : transform;
}
function FromTuple7(moduleProperties, types) {
  return Tuple(FromTypes2(moduleProperties, types));
}
function FromUnion12(moduleProperties, types) {
  return Union(FromTypes2(moduleProperties, types));
}
function FromTypes2(moduleProperties, types) {
  return types.map((type) => FromType2(moduleProperties, type));
}
function FromType2(moduleProperties, type) {
  return (
    // Modifiers
    IsOptional(type) ? CreateType(FromType2(moduleProperties, Discard(type, [OptionalKind])), type) : IsReadonly(type) ? CreateType(FromType2(moduleProperties, Discard(type, [ReadonlyKind])), type) : (
      // Transform
      IsTransform(type) ? CreateType(FromTransform(moduleProperties, type), type) : (
        // Types
        IsArray3(type) ? CreateType(FromArray8(moduleProperties, type.items), type) : IsAsyncIterator3(type) ? CreateType(FromAsyncIterator5(moduleProperties, type.items), type) : IsComputed(type) ? CreateType(FromComputed5(moduleProperties, type.target, type.parameters)) : IsConstructor(type) ? CreateType(FromConstructor5(moduleProperties, type.parameters, type.returns), type) : IsFunction3(type) ? CreateType(FromFunction5(moduleProperties, type.parameters, type.returns), type) : IsIntersect(type) ? CreateType(FromIntersect10(moduleProperties, type.allOf), type) : IsIterator3(type) ? CreateType(FromIterator5(moduleProperties, type.items), type) : IsObject3(type) ? CreateType(FromObject9(moduleProperties, type.properties), type) : IsRecord(type) ? CreateType(FromRecord5(moduleProperties, type)) : IsTuple(type) ? CreateType(FromTuple7(moduleProperties, type.items || []), type) : IsUnion(type) ? CreateType(FromUnion12(moduleProperties, type.anyOf), type) : type
      )
    )
  );
}
function ComputeType(moduleProperties, key) {
  return key in moduleProperties ? FromType2(moduleProperties, moduleProperties[key]) : Never();
}
function ComputeModuleProperties(moduleProperties) {
  return globalThis.Object.getOwnPropertyNames(moduleProperties).reduce((result, key) => {
    return { ...result, [key]: ComputeType(moduleProperties, key) };
  }, {});
}

// node_modules/@sinclair/typebox/build/esm/type/module/module.mjs
var TModule = class {
  constructor($defs) {
    const computed = ComputeModuleProperties($defs);
    const identified = this.WithIdentifiers(computed);
    this.$defs = identified;
  }
  /** `[Json]` Imports a Type by Key. */
  Import(key, options) {
    const $defs = { ...this.$defs, [key]: CreateType(this.$defs[key], options) };
    return CreateType({ [Kind]: "Import", $defs, $ref: key });
  }
  // prettier-ignore
  WithIdentifiers($defs) {
    return globalThis.Object.getOwnPropertyNames($defs).reduce((result, key) => {
      return { ...result, [key]: { ...$defs[key], $id: key } };
    }, {});
  }
};
function Module(properties) {
  return new TModule(properties);
}

// node_modules/@sinclair/typebox/build/esm/type/not/not.mjs
function Not2(type, options) {
  return CreateType({ [Kind]: "Not", not: type }, options);
}

// node_modules/@sinclair/typebox/build/esm/type/parameters/parameters.mjs
function Parameters(schema, options) {
  return IsFunction3(schema) ? Tuple(schema.parameters, options) : Never();
}

// node_modules/@sinclair/typebox/build/esm/type/recursive/recursive.mjs
var Ordinal = 0;
function Recursive(callback, options = {}) {
  if (IsUndefined2(options.$id))
    options.$id = `T${Ordinal++}`;
  const thisType = CloneType(callback({ [Kind]: "This", $ref: `${options.$id}` }));
  thisType.$id = options.$id;
  return CreateType({ [Hint]: "Recursive", ...thisType }, options);
}

// node_modules/@sinclair/typebox/build/esm/type/regexp/regexp.mjs
function RegExp2(unresolved, options) {
  const expr = IsString2(unresolved) ? new globalThis.RegExp(unresolved) : unresolved;
  return CreateType({ [Kind]: "RegExp", type: "RegExp", source: expr.source, flags: expr.flags }, options);
}

// node_modules/@sinclair/typebox/build/esm/type/rest/rest.mjs
function RestResolve(T) {
  return IsIntersect(T) ? T.allOf : IsUnion(T) ? T.anyOf : IsTuple(T) ? T.items ?? [] : [];
}
function Rest(T) {
  return RestResolve(T);
}

// node_modules/@sinclair/typebox/build/esm/type/return-type/return-type.mjs
function ReturnType(schema, options) {
  return IsFunction3(schema) ? CreateType(schema.returns, options) : Never(options);
}

// node_modules/@sinclair/typebox/build/esm/type/transform/transform.mjs
var TransformDecodeBuilder = class {
  constructor(schema) {
    this.schema = schema;
  }
  Decode(decode2) {
    return new TransformEncodeBuilder(this.schema, decode2);
  }
};
var TransformEncodeBuilder = class {
  constructor(schema, decode2) {
    this.schema = schema;
    this.decode = decode2;
  }
  EncodeTransform(encode, schema) {
    const Encode = (value) => schema[TransformKind].Encode(encode(value));
    const Decode = (value) => this.decode(schema[TransformKind].Decode(value));
    const Codec = { Encode, Decode };
    return { ...schema, [TransformKind]: Codec };
  }
  EncodeSchema(encode, schema) {
    const Codec = { Decode: this.decode, Encode: encode };
    return { ...schema, [TransformKind]: Codec };
  }
  Encode(encode) {
    return IsTransform(this.schema) ? this.EncodeTransform(encode, this.schema) : this.EncodeSchema(encode, this.schema);
  }
};
function Transform(schema) {
  return new TransformDecodeBuilder(schema);
}

// node_modules/@sinclair/typebox/build/esm/type/void/void.mjs
function Void(options) {
  return CreateType({ [Kind]: "Void", type: "void" }, options);
}

// node_modules/@sinclair/typebox/build/esm/type/type/type.mjs
var type_exports3 = {};
__export(type_exports3, {
  Any: () => Any,
  Argument: () => Argument,
  Array: () => Array2,
  AsyncIterator: () => AsyncIterator2,
  Awaited: () => Awaited,
  BigInt: () => BigInt2,
  Boolean: () => Boolean,
  Capitalize: () => Capitalize,
  Composite: () => Composite,
  Const: () => Const,
  Constructor: () => Constructor,
  ConstructorParameters: () => ConstructorParameters,
  Date: () => Date2,
  Enum: () => Enum,
  Exclude: () => Exclude,
  Extends: () => Extends,
  Extract: () => Extract,
  Function: () => Function2,
  Index: () => Index,
  InstanceType: () => InstanceType,
  Instantiate: () => Instantiate,
  Integer: () => Integer,
  Intersect: () => Intersect,
  Iterator: () => Iterator2,
  KeyOf: () => KeyOf,
  Literal: () => Literal,
  Lowercase: () => Lowercase,
  Mapped: () => Mapped,
  Module: () => Module,
  Never: () => Never,
  Not: () => Not2,
  Null: () => Null,
  Number: () => Number2,
  Object: () => Object2,
  Omit: () => Omit,
  Optional: () => Optional,
  Parameters: () => Parameters,
  Partial: () => Partial,
  Pick: () => Pick,
  Promise: () => Promise2,
  Readonly: () => Readonly,
  ReadonlyOptional: () => ReadonlyOptional,
  Record: () => Record,
  Recursive: () => Recursive,
  Ref: () => Ref,
  RegExp: () => RegExp2,
  Required: () => Required,
  Rest: () => Rest,
  ReturnType: () => ReturnType,
  String: () => String2,
  Symbol: () => Symbol2,
  TemplateLiteral: () => TemplateLiteral,
  Transform: () => Transform,
  Tuple: () => Tuple,
  Uint8Array: () => Uint8Array2,
  Uncapitalize: () => Uncapitalize,
  Undefined: () => Undefined,
  Union: () => Union,
  Unknown: () => Unknown,
  Unsafe: () => Unsafe,
  Uppercase: () => Uppercase,
  Void: () => Void
});

// node_modules/@sinclair/typebox/build/esm/type/type/index.mjs
var Type = type_exports3;

// src/contract/schemas.ts
var ApiEnvelopeSchema = (dataSchema) => Type.Object({
  success: Type.Literal(true),
  data: dataSchema
});
var UserDataSchema = Type.Object(
  {
    id: Type.Number(),
    email: Type.String(),
    first_name: Type.String(),
    last_name: Type.String(),
    status: Type.Optional(Type.Number()),
    company_id: Type.Optional(Type.Number())
  },
  { additionalProperties: true }
);
var LoginResponseSchema = Type.Object({
  access_token: Type.String(),
  token_type: Type.Literal("Bearer"),
  id: Type.Number(),
  email: Type.String(),
  first_name: Type.String(),
  last_name: Type.String(),
  status: Type.Number(),
  company_id: Type.Number(),
  company_type: Type.Number()
});
var CompanyDataSchema = Type.Object(
  {
    id: Type.Number(),
    company_name: Type.Optional(Type.String()),
    company_type: Type.Optional(Type.Number())
  },
  { additionalProperties: true }
);
var NotificationPreferencesSchema = Type.Record(Type.String(), Type.Unknown());

// src/errors.ts
var ToughLeafApiError = class extends Error {
  constructor(status, message, body) {
    super(message);
    __publicField(this, "status");
    __publicField(this, "body");
    this.name = "ToughLeafApiError";
    this.status = status;
    this.body = body;
  }
  get isUnauthorized() {
    return this.status === 401;
  }
  get isValidationError() {
    return this.status === 422;
  }
  get isRateLimited() {
    return this.status === 429;
  }
};
async function parseApiError(response) {
  let body;
  try {
    const json = await response.json();
    body = json.error;
  } catch {
    body = void 0;
  }
  const message = body?.message ?? response.statusText ?? `HTTP ${response.status}`;
  return new ToughLeafApiError(response.status, message, body);
}

// src/transport/FetchTransport.ts
var FetchTransport = class {
  constructor(options) {
    __publicField(this, "baseUrl");
    __publicField(this, "getAccessToken");
    __publicField(this, "fetchImpl");
    __publicField(this, "onUnauthorized");
    __publicField(this, "activeAuthRequests", /* @__PURE__ */ new Set());
    const normalized = options.baseUrl.replace(/\/+$/, "");
    this.baseUrl = normalized.endsWith("/api/v1") ? normalized : `${normalized}/api/v1`;
    this.getAccessToken = options.getAccessToken;
    this.fetchImpl = options.fetchImpl ?? globalThis.fetch.bind(globalThis);
    this.onUnauthorized = options.onUnauthorized;
  }
  get apiBaseUrl() {
    return this.baseUrl;
  }
  abortAuthenticated(_reason) {
    for (const active of this.activeAuthRequests) {
      active.controller.abort();
    }
    this.activeAuthRequests.clear();
  }
  async request(spec) {
    const authRequired = spec.authRequired !== false;
    const controller = new AbortController();
    const linked = this.linkSignal(spec.signal, controller);
    if (authRequired) {
      const active = { controller };
      this.activeAuthRequests.add(active);
      try {
        return await this.executeRequest(spec, controller.signal);
      } finally {
        this.activeAuthRequests.delete(active);
      }
    }
    return this.executeRequest(spec, linked);
  }
  linkSignal(external, controller) {
    if (!external) {
      return controller.signal;
    }
    if (external.aborted) {
      controller.abort();
    } else {
      external.addEventListener("abort", () => controller.abort(), { once: true });
    }
    return controller.signal;
  }
  async executeRequest(spec, signal) {
    const hasBody = spec.body !== void 0 && spec.method !== "GET" && spec.method !== "DELETE";
    const url = this.buildUrl(spec.path, spec.params);
    let response;
    try {
      response = await this.fetchImpl(url, {
        method: spec.method,
        headers: await this.headers(hasBody),
        body: hasBody ? JSON.stringify(spec.body) : void 0,
        signal
      });
    } catch (err) {
      if (signal.aborted) {
        throw err;
      }
      throw err;
    }
    return this.handleResponse(response);
  }
  buildUrl(resource, params) {
    const path = resource.startsWith("/") ? resource : `/${resource}`;
    const joined = `${this.baseUrl}${path}`;
    if (/^https?:\/\//i.test(this.baseUrl)) {
      const url = new URL(joined);
      if (params) {
        for (const [key, value] of Object.entries(params)) {
          if (value !== void 0 && value !== null && value !== "") {
            url.searchParams.set(key, String(value));
          }
        }
      }
      return url.toString();
    }
    let urlStr = joined;
    if (params) {
      const search = new URLSearchParams();
      for (const [key, value] of Object.entries(params)) {
        if (value !== void 0 && value !== null && value !== "") {
          search.set(key, String(value));
        }
      }
      const qs = search.toString();
      if (qs) {
        urlStr += `${urlStr.includes("?") ? "&" : "?"}${qs}`;
      }
    }
    return urlStr;
  }
  async headers(hasBody) {
    const headers = {
      Accept: "application/json"
    };
    if (hasBody) {
      headers["Content-Type"] = "application/json";
    }
    const token = this.getAccessToken ? await this.getAccessToken() : void 0;
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    return headers;
  }
  async handleResponse(response) {
    if (!response.ok) {
      const err = await parseApiError(response);
      if (err.isUnauthorized && this.onUnauthorized) {
        await this.onUnauthorized();
      }
      throw err;
    }
    const text = await response.text();
    if (!text) {
      return void 0;
    }
    const json = JSON.parse(text);
    return json.data;
  }
  /** Convenience wrappers used by resources */
  get(path, params, options) {
    return this.request({ method: "GET", path, params, authRequired: true, ...options });
  }
  post(path, body, params, options) {
    return this.request({ method: "POST", path, body, params, authRequired: true, ...options });
  }
  put(path, body, params, options) {
    return this.request({ method: "PUT", path, body, params, authRequired: true, ...options });
  }
  delete(path, params, options) {
    return this.request({ method: "DELETE", path, params, authRequired: true, ...options });
  }
  getPublic(path, params, options) {
    return this.request({ method: "GET", path, params, authRequired: false, ...options });
  }
};

// src/http.ts
var HttpClient = class {
  constructor(options) {
    __publicField(this, "transport");
    this.transport = new FetchTransport(options);
  }
  get apiBaseUrl() {
    return this.transport.apiBaseUrl;
  }
  abortAuthenticated(reason) {
    this.transport.abortAuthenticated(reason);
  }
  async request(method, resource, options = {}) {
    const data = await this.transport.request({
      method,
      path: resource,
      params: options.params,
      body: options.body,
      signal: options.signal,
      authRequired: false
    });
    return { success: true, data };
  }
  get(resource, params, options) {
    return this.request("GET", resource, { params, signal: options?.signal });
  }
  post(resource, body, params, options) {
    return this.request("POST", resource, { body, params, signal: options?.signal });
  }
  put(resource, body, params, options) {
    return this.request("PUT", resource, { body, params, signal: options?.signal });
  }
  delete(resource, params, options) {
    return this.request("DELETE", resource, { params, signal: options?.signal });
  }
};

// node_modules/tslib/tslib.es6.mjs
var extendStatics = function(d, b) {
  extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
    d2.__proto__ = b2;
  } || function(d2, b2) {
    for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
  };
  return extendStatics(d, b);
};
function __extends(d, b) {
  if (typeof b !== "function" && b !== null)
    throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
  extendStatics(d, b);
  function __() {
    this.constructor = d;
  }
  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}
function __values(o) {
  var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
  if (m) return m.call(o);
  if (o && typeof o.length === "number") return {
    next: function() {
      if (o && i >= o.length) o = void 0;
      return { value: o && o[i++], done: !o };
    }
  };
  throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}
function __read(o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o), r, ar = [], e;
  try {
    while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
  } catch (error) {
    e = { error };
  } finally {
    try {
      if (r && !r.done && (m = i["return"])) m.call(i);
    } finally {
      if (e) throw e.error;
    }
  }
  return ar;
}
function __spreadArray(to, from, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
    if (ar || !(i in from)) {
      if (!ar) ar = Array.prototype.slice.call(from, 0, i);
      ar[i] = from[i];
    }
  }
  return to.concat(ar || Array.prototype.slice.call(from));
}

// node_modules/rxjs/dist/esm5/internal/util/isFunction.js
function isFunction(value) {
  return typeof value === "function";
}

// node_modules/rxjs/dist/esm5/internal/util/createErrorClass.js
function createErrorClass(createImpl) {
  var _super = function(instance) {
    Error.call(instance);
    instance.stack = new Error().stack;
  };
  var ctorFunc = createImpl(_super);
  ctorFunc.prototype = Object.create(Error.prototype);
  ctorFunc.prototype.constructor = ctorFunc;
  return ctorFunc;
}

// node_modules/rxjs/dist/esm5/internal/util/UnsubscriptionError.js
var UnsubscriptionError = createErrorClass(function(_super) {
  return function UnsubscriptionErrorImpl(errors) {
    _super(this);
    this.message = errors ? errors.length + " errors occurred during unsubscription:\n" + errors.map(function(err, i) {
      return i + 1 + ") " + err.toString();
    }).join("\n  ") : "";
    this.name = "UnsubscriptionError";
    this.errors = errors;
  };
});

// node_modules/rxjs/dist/esm5/internal/util/arrRemove.js
function arrRemove(arr, item) {
  if (arr) {
    var index = arr.indexOf(item);
    0 <= index && arr.splice(index, 1);
  }
}

// node_modules/rxjs/dist/esm5/internal/Subscription.js
var Subscription = function() {
  function Subscription2(initialTeardown) {
    this.initialTeardown = initialTeardown;
    this.closed = false;
    this._parentage = null;
    this._finalizers = null;
  }
  Subscription2.prototype.unsubscribe = function() {
    var e_1, _a, e_2, _b;
    var errors;
    if (!this.closed) {
      this.closed = true;
      var _parentage = this._parentage;
      if (_parentage) {
        this._parentage = null;
        if (Array.isArray(_parentage)) {
          try {
            for (var _parentage_1 = __values(_parentage), _parentage_1_1 = _parentage_1.next(); !_parentage_1_1.done; _parentage_1_1 = _parentage_1.next()) {
              var parent_1 = _parentage_1_1.value;
              parent_1.remove(this);
            }
          } catch (e_1_1) {
            e_1 = { error: e_1_1 };
          } finally {
            try {
              if (_parentage_1_1 && !_parentage_1_1.done && (_a = _parentage_1.return)) _a.call(_parentage_1);
            } finally {
              if (e_1) throw e_1.error;
            }
          }
        } else {
          _parentage.remove(this);
        }
      }
      var initialFinalizer = this.initialTeardown;
      if (isFunction(initialFinalizer)) {
        try {
          initialFinalizer();
        } catch (e) {
          errors = e instanceof UnsubscriptionError ? e.errors : [e];
        }
      }
      var _finalizers = this._finalizers;
      if (_finalizers) {
        this._finalizers = null;
        try {
          for (var _finalizers_1 = __values(_finalizers), _finalizers_1_1 = _finalizers_1.next(); !_finalizers_1_1.done; _finalizers_1_1 = _finalizers_1.next()) {
            var finalizer = _finalizers_1_1.value;
            try {
              execFinalizer(finalizer);
            } catch (err) {
              errors = errors !== null && errors !== void 0 ? errors : [];
              if (err instanceof UnsubscriptionError) {
                errors = __spreadArray(__spreadArray([], __read(errors)), __read(err.errors));
              } else {
                errors.push(err);
              }
            }
          }
        } catch (e_2_1) {
          e_2 = { error: e_2_1 };
        } finally {
          try {
            if (_finalizers_1_1 && !_finalizers_1_1.done && (_b = _finalizers_1.return)) _b.call(_finalizers_1);
          } finally {
            if (e_2) throw e_2.error;
          }
        }
      }
      if (errors) {
        throw new UnsubscriptionError(errors);
      }
    }
  };
  Subscription2.prototype.add = function(teardown) {
    var _a;
    if (teardown && teardown !== this) {
      if (this.closed) {
        execFinalizer(teardown);
      } else {
        if (teardown instanceof Subscription2) {
          if (teardown.closed || teardown._hasParent(this)) {
            return;
          }
          teardown._addParent(this);
        }
        (this._finalizers = (_a = this._finalizers) !== null && _a !== void 0 ? _a : []).push(teardown);
      }
    }
  };
  Subscription2.prototype._hasParent = function(parent) {
    var _parentage = this._parentage;
    return _parentage === parent || Array.isArray(_parentage) && _parentage.includes(parent);
  };
  Subscription2.prototype._addParent = function(parent) {
    var _parentage = this._parentage;
    this._parentage = Array.isArray(_parentage) ? (_parentage.push(parent), _parentage) : _parentage ? [_parentage, parent] : parent;
  };
  Subscription2.prototype._removeParent = function(parent) {
    var _parentage = this._parentage;
    if (_parentage === parent) {
      this._parentage = null;
    } else if (Array.isArray(_parentage)) {
      arrRemove(_parentage, parent);
    }
  };
  Subscription2.prototype.remove = function(teardown) {
    var _finalizers = this._finalizers;
    _finalizers && arrRemove(_finalizers, teardown);
    if (teardown instanceof Subscription2) {
      teardown._removeParent(this);
    }
  };
  Subscription2.EMPTY = function() {
    var empty = new Subscription2();
    empty.closed = true;
    return empty;
  }();
  return Subscription2;
}();
var EMPTY_SUBSCRIPTION = Subscription.EMPTY;
function isSubscription(value) {
  return value instanceof Subscription || value && "closed" in value && isFunction(value.remove) && isFunction(value.add) && isFunction(value.unsubscribe);
}
function execFinalizer(finalizer) {
  if (isFunction(finalizer)) {
    finalizer();
  } else {
    finalizer.unsubscribe();
  }
}

// node_modules/rxjs/dist/esm5/internal/config.js
var config = {
  onUnhandledError: null,
  onStoppedNotification: null,
  Promise: void 0,
  useDeprecatedSynchronousErrorHandling: false,
  useDeprecatedNextContext: false
};

// node_modules/rxjs/dist/esm5/internal/scheduler/timeoutProvider.js
var timeoutProvider = {
  setTimeout: function(handler, timeout) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
      args[_i - 2] = arguments[_i];
    }
    var delegate = timeoutProvider.delegate;
    if (delegate === null || delegate === void 0 ? void 0 : delegate.setTimeout) {
      return delegate.setTimeout.apply(delegate, __spreadArray([handler, timeout], __read(args)));
    }
    return setTimeout.apply(void 0, __spreadArray([handler, timeout], __read(args)));
  },
  clearTimeout: function(handle) {
    var delegate = timeoutProvider.delegate;
    return ((delegate === null || delegate === void 0 ? void 0 : delegate.clearTimeout) || clearTimeout)(handle);
  },
  delegate: void 0
};

// node_modules/rxjs/dist/esm5/internal/util/reportUnhandledError.js
function reportUnhandledError(err) {
  timeoutProvider.setTimeout(function() {
    var onUnhandledError = config.onUnhandledError;
    if (onUnhandledError) {
      onUnhandledError(err);
    } else {
      throw err;
    }
  });
}

// node_modules/rxjs/dist/esm5/internal/util/noop.js
function noop() {
}

// node_modules/rxjs/dist/esm5/internal/NotificationFactories.js
var COMPLETE_NOTIFICATION = function() {
  return createNotification("C", void 0, void 0);
}();
function errorNotification(error) {
  return createNotification("E", void 0, error);
}
function nextNotification(value) {
  return createNotification("N", value, void 0);
}
function createNotification(kind, value, error) {
  return {
    kind,
    value,
    error
  };
}

// node_modules/rxjs/dist/esm5/internal/util/errorContext.js
var context = null;
function errorContext(cb) {
  if (config.useDeprecatedSynchronousErrorHandling) {
    var isRoot = !context;
    if (isRoot) {
      context = { errorThrown: false, error: null };
    }
    cb();
    if (isRoot) {
      var _a = context, errorThrown = _a.errorThrown, error = _a.error;
      context = null;
      if (errorThrown) {
        throw error;
      }
    }
  } else {
    cb();
  }
}
function captureError(err) {
  if (config.useDeprecatedSynchronousErrorHandling && context) {
    context.errorThrown = true;
    context.error = err;
  }
}

// node_modules/rxjs/dist/esm5/internal/Subscriber.js
var Subscriber = function(_super) {
  __extends(Subscriber2, _super);
  function Subscriber2(destination) {
    var _this = _super.call(this) || this;
    _this.isStopped = false;
    if (destination) {
      _this.destination = destination;
      if (isSubscription(destination)) {
        destination.add(_this);
      }
    } else {
      _this.destination = EMPTY_OBSERVER;
    }
    return _this;
  }
  Subscriber2.create = function(next, error, complete) {
    return new SafeSubscriber(next, error, complete);
  };
  Subscriber2.prototype.next = function(value) {
    if (this.isStopped) {
      handleStoppedNotification(nextNotification(value), this);
    } else {
      this._next(value);
    }
  };
  Subscriber2.prototype.error = function(err) {
    if (this.isStopped) {
      handleStoppedNotification(errorNotification(err), this);
    } else {
      this.isStopped = true;
      this._error(err);
    }
  };
  Subscriber2.prototype.complete = function() {
    if (this.isStopped) {
      handleStoppedNotification(COMPLETE_NOTIFICATION, this);
    } else {
      this.isStopped = true;
      this._complete();
    }
  };
  Subscriber2.prototype.unsubscribe = function() {
    if (!this.closed) {
      this.isStopped = true;
      _super.prototype.unsubscribe.call(this);
      this.destination = null;
    }
  };
  Subscriber2.prototype._next = function(value) {
    this.destination.next(value);
  };
  Subscriber2.prototype._error = function(err) {
    try {
      this.destination.error(err);
    } finally {
      this.unsubscribe();
    }
  };
  Subscriber2.prototype._complete = function() {
    try {
      this.destination.complete();
    } finally {
      this.unsubscribe();
    }
  };
  return Subscriber2;
}(Subscription);
var _bind = Function.prototype.bind;
function bind(fn, thisArg) {
  return _bind.call(fn, thisArg);
}
var ConsumerObserver = function() {
  function ConsumerObserver2(partialObserver) {
    this.partialObserver = partialObserver;
  }
  ConsumerObserver2.prototype.next = function(value) {
    var partialObserver = this.partialObserver;
    if (partialObserver.next) {
      try {
        partialObserver.next(value);
      } catch (error) {
        handleUnhandledError(error);
      }
    }
  };
  ConsumerObserver2.prototype.error = function(err) {
    var partialObserver = this.partialObserver;
    if (partialObserver.error) {
      try {
        partialObserver.error(err);
      } catch (error) {
        handleUnhandledError(error);
      }
    } else {
      handleUnhandledError(err);
    }
  };
  ConsumerObserver2.prototype.complete = function() {
    var partialObserver = this.partialObserver;
    if (partialObserver.complete) {
      try {
        partialObserver.complete();
      } catch (error) {
        handleUnhandledError(error);
      }
    }
  };
  return ConsumerObserver2;
}();
var SafeSubscriber = function(_super) {
  __extends(SafeSubscriber2, _super);
  function SafeSubscriber2(observerOrNext, error, complete) {
    var _this = _super.call(this) || this;
    var partialObserver;
    if (isFunction(observerOrNext) || !observerOrNext) {
      partialObserver = {
        next: observerOrNext !== null && observerOrNext !== void 0 ? observerOrNext : void 0,
        error: error !== null && error !== void 0 ? error : void 0,
        complete: complete !== null && complete !== void 0 ? complete : void 0
      };
    } else {
      var context_1;
      if (_this && config.useDeprecatedNextContext) {
        context_1 = Object.create(observerOrNext);
        context_1.unsubscribe = function() {
          return _this.unsubscribe();
        };
        partialObserver = {
          next: observerOrNext.next && bind(observerOrNext.next, context_1),
          error: observerOrNext.error && bind(observerOrNext.error, context_1),
          complete: observerOrNext.complete && bind(observerOrNext.complete, context_1)
        };
      } else {
        partialObserver = observerOrNext;
      }
    }
    _this.destination = new ConsumerObserver(partialObserver);
    return _this;
  }
  return SafeSubscriber2;
}(Subscriber);
function handleUnhandledError(error) {
  if (config.useDeprecatedSynchronousErrorHandling) {
    captureError(error);
  } else {
    reportUnhandledError(error);
  }
}
function defaultErrorHandler(err) {
  throw err;
}
function handleStoppedNotification(notification, subscriber) {
  var onStoppedNotification = config.onStoppedNotification;
  onStoppedNotification && timeoutProvider.setTimeout(function() {
    return onStoppedNotification(notification, subscriber);
  });
}
var EMPTY_OBSERVER = {
  closed: true,
  next: noop,
  error: defaultErrorHandler,
  complete: noop
};

// node_modules/rxjs/dist/esm5/internal/symbol/observable.js
var observable = function() {
  return typeof Symbol === "function" && Symbol.observable || "@@observable";
}();

// node_modules/rxjs/dist/esm5/internal/util/identity.js
function identity(x) {
  return x;
}

// node_modules/rxjs/dist/esm5/internal/util/pipe.js
function pipeFromArray(fns) {
  if (fns.length === 0) {
    return identity;
  }
  if (fns.length === 1) {
    return fns[0];
  }
  return function piped(input) {
    return fns.reduce(function(prev, fn) {
      return fn(prev);
    }, input);
  };
}

// node_modules/rxjs/dist/esm5/internal/Observable.js
var Observable = function() {
  function Observable2(subscribe) {
    if (subscribe) {
      this._subscribe = subscribe;
    }
  }
  Observable2.prototype.lift = function(operator) {
    var observable2 = new Observable2();
    observable2.source = this;
    observable2.operator = operator;
    return observable2;
  };
  Observable2.prototype.subscribe = function(observerOrNext, error, complete) {
    var _this = this;
    var subscriber = isSubscriber(observerOrNext) ? observerOrNext : new SafeSubscriber(observerOrNext, error, complete);
    errorContext(function() {
      var _a = _this, operator = _a.operator, source = _a.source;
      subscriber.add(operator ? operator.call(subscriber, source) : source ? _this._subscribe(subscriber) : _this._trySubscribe(subscriber));
    });
    return subscriber;
  };
  Observable2.prototype._trySubscribe = function(sink) {
    try {
      return this._subscribe(sink);
    } catch (err) {
      sink.error(err);
    }
  };
  Observable2.prototype.forEach = function(next, promiseCtor) {
    var _this = this;
    promiseCtor = getPromiseCtor(promiseCtor);
    return new promiseCtor(function(resolve, reject) {
      var subscriber = new SafeSubscriber({
        next: function(value) {
          try {
            next(value);
          } catch (err) {
            reject(err);
            subscriber.unsubscribe();
          }
        },
        error: reject,
        complete: resolve
      });
      _this.subscribe(subscriber);
    });
  };
  Observable2.prototype._subscribe = function(subscriber) {
    var _a;
    return (_a = this.source) === null || _a === void 0 ? void 0 : _a.subscribe(subscriber);
  };
  Observable2.prototype[observable] = function() {
    return this;
  };
  Observable2.prototype.pipe = function() {
    var operations = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      operations[_i] = arguments[_i];
    }
    return pipeFromArray(operations)(this);
  };
  Observable2.prototype.toPromise = function(promiseCtor) {
    var _this = this;
    promiseCtor = getPromiseCtor(promiseCtor);
    return new promiseCtor(function(resolve, reject) {
      var value;
      _this.subscribe(function(x) {
        return value = x;
      }, function(err) {
        return reject(err);
      }, function() {
        return resolve(value);
      });
    });
  };
  Observable2.create = function(subscribe) {
    return new Observable2(subscribe);
  };
  return Observable2;
}();
function getPromiseCtor(promiseCtor) {
  var _a;
  return (_a = promiseCtor !== null && promiseCtor !== void 0 ? promiseCtor : config.Promise) !== null && _a !== void 0 ? _a : Promise;
}
function isObserver(value) {
  return value && isFunction(value.next) && isFunction(value.error) && isFunction(value.complete);
}
function isSubscriber(value) {
  return value && value instanceof Subscriber || isObserver(value) && isSubscription(value);
}

// node_modules/rxjs/dist/esm5/internal/util/ObjectUnsubscribedError.js
var ObjectUnsubscribedError = createErrorClass(function(_super) {
  return function ObjectUnsubscribedErrorImpl() {
    _super(this);
    this.name = "ObjectUnsubscribedError";
    this.message = "object unsubscribed";
  };
});

// node_modules/rxjs/dist/esm5/internal/Subject.js
var Subject = function(_super) {
  __extends(Subject2, _super);
  function Subject2() {
    var _this = _super.call(this) || this;
    _this.closed = false;
    _this.currentObservers = null;
    _this.observers = [];
    _this.isStopped = false;
    _this.hasError = false;
    _this.thrownError = null;
    return _this;
  }
  Subject2.prototype.lift = function(operator) {
    var subject = new AnonymousSubject(this, this);
    subject.operator = operator;
    return subject;
  };
  Subject2.prototype._throwIfClosed = function() {
    if (this.closed) {
      throw new ObjectUnsubscribedError();
    }
  };
  Subject2.prototype.next = function(value) {
    var _this = this;
    errorContext(function() {
      var e_1, _a;
      _this._throwIfClosed();
      if (!_this.isStopped) {
        if (!_this.currentObservers) {
          _this.currentObservers = Array.from(_this.observers);
        }
        try {
          for (var _b = __values(_this.currentObservers), _c = _b.next(); !_c.done; _c = _b.next()) {
            var observer = _c.value;
            observer.next(value);
          }
        } catch (e_1_1) {
          e_1 = { error: e_1_1 };
        } finally {
          try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
          } finally {
            if (e_1) throw e_1.error;
          }
        }
      }
    });
  };
  Subject2.prototype.error = function(err) {
    var _this = this;
    errorContext(function() {
      _this._throwIfClosed();
      if (!_this.isStopped) {
        _this.hasError = _this.isStopped = true;
        _this.thrownError = err;
        var observers = _this.observers;
        while (observers.length) {
          observers.shift().error(err);
        }
      }
    });
  };
  Subject2.prototype.complete = function() {
    var _this = this;
    errorContext(function() {
      _this._throwIfClosed();
      if (!_this.isStopped) {
        _this.isStopped = true;
        var observers = _this.observers;
        while (observers.length) {
          observers.shift().complete();
        }
      }
    });
  };
  Subject2.prototype.unsubscribe = function() {
    this.isStopped = this.closed = true;
    this.observers = this.currentObservers = null;
  };
  Object.defineProperty(Subject2.prototype, "observed", {
    get: function() {
      var _a;
      return ((_a = this.observers) === null || _a === void 0 ? void 0 : _a.length) > 0;
    },
    enumerable: false,
    configurable: true
  });
  Subject2.prototype._trySubscribe = function(subscriber) {
    this._throwIfClosed();
    return _super.prototype._trySubscribe.call(this, subscriber);
  };
  Subject2.prototype._subscribe = function(subscriber) {
    this._throwIfClosed();
    this._checkFinalizedStatuses(subscriber);
    return this._innerSubscribe(subscriber);
  };
  Subject2.prototype._innerSubscribe = function(subscriber) {
    var _this = this;
    var _a = this, hasError = _a.hasError, isStopped = _a.isStopped, observers = _a.observers;
    if (hasError || isStopped) {
      return EMPTY_SUBSCRIPTION;
    }
    this.currentObservers = null;
    observers.push(subscriber);
    return new Subscription(function() {
      _this.currentObservers = null;
      arrRemove(observers, subscriber);
    });
  };
  Subject2.prototype._checkFinalizedStatuses = function(subscriber) {
    var _a = this, hasError = _a.hasError, thrownError = _a.thrownError, isStopped = _a.isStopped;
    if (hasError) {
      subscriber.error(thrownError);
    } else if (isStopped) {
      subscriber.complete();
    }
  };
  Subject2.prototype.asObservable = function() {
    var observable2 = new Observable();
    observable2.source = this;
    return observable2;
  };
  Subject2.create = function(destination, source) {
    return new AnonymousSubject(destination, source);
  };
  return Subject2;
}(Observable);
var AnonymousSubject = function(_super) {
  __extends(AnonymousSubject2, _super);
  function AnonymousSubject2(destination, source) {
    var _this = _super.call(this) || this;
    _this.destination = destination;
    _this.source = source;
    return _this;
  }
  AnonymousSubject2.prototype.next = function(value) {
    var _a, _b;
    (_b = (_a = this.destination) === null || _a === void 0 ? void 0 : _a.next) === null || _b === void 0 ? void 0 : _b.call(_a, value);
  };
  AnonymousSubject2.prototype.error = function(err) {
    var _a, _b;
    (_b = (_a = this.destination) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.call(_a, err);
  };
  AnonymousSubject2.prototype.complete = function() {
    var _a, _b;
    (_b = (_a = this.destination) === null || _a === void 0 ? void 0 : _a.complete) === null || _b === void 0 ? void 0 : _b.call(_a);
  };
  AnonymousSubject2.prototype._subscribe = function(subscriber) {
    var _a, _b;
    return (_b = (_a = this.source) === null || _a === void 0 ? void 0 : _a.subscribe(subscriber)) !== null && _b !== void 0 ? _b : EMPTY_SUBSCRIPTION;
  };
  return AnonymousSubject2;
}(Subject);

// node_modules/rxjs/dist/esm5/internal/BehaviorSubject.js
var BehaviorSubject = function(_super) {
  __extends(BehaviorSubject2, _super);
  function BehaviorSubject2(_value) {
    var _this = _super.call(this) || this;
    _this._value = _value;
    return _this;
  }
  Object.defineProperty(BehaviorSubject2.prototype, "value", {
    get: function() {
      return this.getValue();
    },
    enumerable: false,
    configurable: true
  });
  BehaviorSubject2.prototype._subscribe = function(subscriber) {
    var subscription = _super.prototype._subscribe.call(this, subscriber);
    !subscription.closed && subscriber.next(this._value);
    return subscription;
  };
  BehaviorSubject2.prototype.getValue = function() {
    var _a = this, hasError = _a.hasError, thrownError = _a.thrownError, _value = _a._value;
    if (hasError) {
      throw thrownError;
    }
    this._throwIfClosed();
    return _value;
  };
  BehaviorSubject2.prototype.next = function(value) {
    _super.prototype.next.call(this, this._value = value);
  };
  return BehaviorSubject2;
}(Subject);

// src/cache/types.ts
var USER_ME_KEY = ["user", "me"];
var COMPANY_ME_KEY = ["company", "me"];
var NOTIFICATION_PREFS_KEY = ["company", "notification-preferences"];
var COMPANY_PREFIX_KEY = ["company"];
var INVITES_KEY = ["invites", "list"];
var COMPANY_PEOPLE_KEY = ["company", "people"];
var PROJECTS_LIST_KEY = ["projects", "list"];
var PROJECTS_PREFIX_KEY = ["projects"];
function projectsListKey(params) {
  if (!params) {
    return PROJECTS_LIST_KEY;
  }
  const normalized = Object.entries(params).filter(([, value]) => value !== void 0 && value !== null).sort(([a], [b]) => a.localeCompare(b));
  return normalized.length ? ["projects", "list", Object.fromEntries(normalized)] : PROJECTS_LIST_KEY;
}
function projectKey(projectId) {
  return ["projects", projectId];
}
function projectFullKey(projectId) {
  return ["projects", projectId, { full: true }];
}
function participantsKey(projectId) {
  return ["projects", projectId, "participants"];
}
function bidPackageKey(projectId, packageId) {
  return ["projects", projectId, "bid_package", packageId];
}
function serializeQueryKey(key) {
  return JSON.stringify(key);
}
function queryKeyMatchesPrefix(key, prefix) {
  if (prefix.length > key.length) {
    return false;
  }
  return prefix.every((part, index) => key[index] === part);
}
var AUTH_CACHE_PREFIXES = [
  ["user"],
  ["company"],
  ["projects"],
  ["invites"]
];
function isAuthScopedKey(key) {
  return AUTH_CACHE_PREFIXES.some((prefix) => queryKeyMatchesPrefix(key, prefix));
}

// src/cache/ResourceCache.ts
var DEFAULT_STALE_TIME = 0;
var DEFAULT_GC_TIME = 5 * 60 * 1e3;
function initialState() {
  return {
    status: "idle",
    isLoading: true,
    isFetching: false,
    isStale: false,
    updatedAt: 0
  };
}
function freezeState(state) {
  const data = state.data === void 0 ? void 0 : Array.isArray(state.data) ? Object.freeze([...state.data]) : Object.freeze({ ...state.data });
  const frozen = Object.freeze({
    ...state,
    data
  });
  return frozen;
}
var ResourceCache = class {
  constructor(transport) {
    __publicField(this, "entries", /* @__PURE__ */ new Map());
    __publicField(this, "transport");
    this.transport = transport;
  }
  async fetchQuery(key, queryFn, options = {}) {
    const entry = this.getOrCreateEntry(key, options);
    entry.queryFn = queryFn;
    entry.queryOptions = options;
    const now = Date.now();
    const staleTime = options.staleTime ?? DEFAULT_STALE_TIME;
    if (entry.state.status === "success" && entry.state.data !== void 0 && now - entry.state.updatedAt < staleTime && !entry.state.isStale) {
      return entry.state.data;
    }
    if (entry.inFlight) {
      return entry.inFlight;
    }
    const externalSignal = options.signal;
    return this.setInFlight(entry, this.runFetch(entry, queryFn, externalSignal, false));
  }
  observeQuery(key, queryFn, options = {}) {
    const entry = this.getOrCreateEntry(key, options);
    entry.queryFn = queryFn;
    entry.queryOptions = options;
    return {
      subscribe: (observer) => {
        entry.observerCount += 1;
        this.clearGcTimer(entry);
        const sub = entry.subject.subscribe(observer);
        void this.ensureObserveFetch(entry, queryFn, options);
        return {
          unsubscribe: () => {
            sub.unsubscribe();
            entry.observerCount -= 1;
            if (entry.observerCount <= 0) {
              entry.observerCount = 0;
              if (entry.controller) {
                entry.controller.abort();
                entry.controller = void 0;
              }
              this.scheduleGc(key, entry);
            }
          }
        };
      }
    };
  }
  invalidate(keys) {
    const list = Array.isArray(keys[0]) ? keys : [keys];
    for (const [serialized, entry] of this.entries) {
      const key = JSON.parse(serialized);
      if (list.some((prefix) => queryKeyMatchesPrefix(key, prefix))) {
        entry.state = freezeState({
          ...entry.state,
          isStale: true
        });
        entry.subject.next(entry.state);
        if (entry.controller) {
          entry.controller.abort();
          entry.controller = void 0;
        }
        if (entry.observerCount > 0 && entry.queryFn) {
          const previous = entry.inFlight;
          const queryFn = entry.queryFn;
          const refetch = (previous ? previous.catch(() => void 0) : Promise.resolve()).then(() => this.runFetch(entry, queryFn, void 0, true));
          this.setInFlight(entry, refetch);
        }
      }
    }
  }
  onAuthChange(authenticated) {
    if (authenticated) {
      return;
    }
    this.transport.abortAuthenticated("session ended");
    for (const [serialized, entry] of this.entries) {
      const key = JSON.parse(serialized);
      if (isAuthScopedKey(key)) {
        this.entries.delete(serialized);
        entry.subject.complete();
        if (entry.controller) {
          entry.controller.abort();
        }
      }
    }
  }
  getOrCreateEntry(key, options) {
    const serialized = serializeQueryKey(key);
    let entry = this.entries.get(serialized);
    if (!entry) {
      const subject = new BehaviorSubject(initialState());
      entry = {
        state: initialState(),
        subject,
        observerCount: 0,
        staleTime: options.staleTime ?? DEFAULT_STALE_TIME,
        gcTime: options.gcTime ?? DEFAULT_GC_TIME
      };
      this.entries.set(serialized, entry);
    }
    return entry;
  }
  async ensureObserveFetch(entry, queryFn, options) {
    const now = Date.now();
    const staleTime = options.staleTime ?? entry.staleTime;
    if (entry.state.status === "success" && entry.state.data !== void 0 && now - entry.state.updatedAt < staleTime && !entry.state.isStale) {
      entry.subject.next(entry.state);
      return;
    }
    if (entry.inFlight && !entry.controller) {
      await entry.inFlight.catch(() => void 0);
      return;
    }
    if (entry.inFlight && entry.controller) {
      return;
    }
    await this.setInFlight(entry, this.runFetch(entry, queryFn, void 0, true)).catch(
      () => void 0
    );
  }
  async runFetch(entry, queryFn, externalSignal, observeDriven) {
    const controller = new AbortController();
    if (observeDriven) {
      if (entry.controller) {
        entry.controller.abort();
      }
      entry.controller = controller;
    }
    if (externalSignal) {
      if (externalSignal.aborted) {
        controller.abort();
      } else {
        externalSignal.addEventListener("abort", () => controller.abort(), { once: true });
      }
    }
    this.setFetching(entry, true);
    try {
      const data = await queryFn(controller.signal);
      const next = freezeState({
        status: "success",
        data,
        isLoading: false,
        isFetching: false,
        isStale: false,
        updatedAt: Date.now()
      });
      entry.state = next;
      entry.subject.next(next);
      return data;
    } catch (err) {
      if (controller.signal.aborted) {
        this.setFetching(entry, false);
        throw err;
      }
      const error = err instanceof Error ? err : new Error(String(err));
      const next = freezeState({
        ...entry.state,
        status: "error",
        error,
        isLoading: false,
        isFetching: false,
        isStale: false,
        updatedAt: Date.now()
      });
      entry.state = next;
      entry.subject.next(next);
      throw error;
    } finally {
      if (observeDriven && entry.controller === controller) {
        entry.controller = void 0;
      }
    }
  }
  setFetching(entry, fetching) {
    const isLoading = entry.state.status !== "success" && fetching;
    const next = freezeState({
      ...entry.state,
      isLoading,
      isFetching: fetching,
      status: entry.state.status === "idle" && fetching ? "loading" : entry.state.status
    });
    entry.state = next;
    entry.subject.next(next);
  }
  setQueryData(key, data) {
    const entry = this.getOrCreateEntry(key, {});
    void entry.inFlight?.catch(() => void 0);
    entry.controller?.abort();
    entry.controller = void 0;
    entry.inFlight = void 0;
    const next = freezeState({
      status: "success",
      data,
      isLoading: false,
      isFetching: false,
      isStale: false,
      updatedAt: Date.now()
    });
    entry.state = next;
    entry.subject.next(next);
  }
  setInFlight(entry, promise) {
    const tracked = promise.finally(() => {
      if (entry.inFlight === tracked) entry.inFlight = void 0;
    });
    entry.inFlight = tracked;
    return tracked;
  }
  scheduleGc(key, entry) {
    this.clearGcTimer(entry);
    entry.gcTimer = setTimeout(() => {
      if (entry.observerCount === 0) {
        this.entries.delete(serializeQueryKey(key));
        entry.subject.complete();
      }
    }, entry.gcTime);
  }
  clearGcTimer(entry) {
    if (entry.gcTimer) {
      clearTimeout(entry.gcTimer);
      entry.gcTimer = void 0;
    }
  }
};

// src/resources/laravel-account-company.ts
function buildLaravelAccountCompanyPutBody(current, patch) {
  const physical = resolvePhysicalAddress(current, patch);
  const body = {
    company_type: pickField(patch, current, "company_type"),
    company_name: pickField(patch, current, "company_name"),
    owner_first: pickField(patch, current, "owner_first"),
    owner_last: pickField(patch, current, "owner_last"),
    email: pickField(patch, current, "email"),
    phone: pickField(patch, current, "phone"),
    website: pickField(patch, current, "website") ?? "",
    physical_address: physical
  };
  const missing = ["company_type", "company_name", "owner_first", "owner_last", "email", "phone"].filter(
    (key) => body[key] === void 0 || body[key] === null || String(body[key]).trim() === ""
  );
  if (missing.length) {
    throw new Error(
      `PUT /company missing required fields after merge with GET /company: ${missing.join(", ")}. Laravel AccountController requires a full company body \u2014 ensure the company record is complete (re-seed dev DB).`
    );
  }
  return body;
}
function pickField(patch, current, key) {
  if (Object.prototype.hasOwnProperty.call(patch, key)) {
    return patch[key];
  }
  const fromCurrent = current[key];
  if (fromCurrent !== void 0 && fromCurrent !== null && String(fromCurrent).trim() !== "") {
    return fromCurrent;
  }
  return void 0;
}
function resolvePhysicalAddress(current, patch) {
  const fromPatch = patch.physical_address;
  const fromCurrent = current.physical_address;
  const fromAddresses = physicalFromAddresses(current.addresses);
  const merged = {
    address: String(fromPatch?.address ?? fromCurrent?.address ?? fromAddresses?.address ?? ""),
    city: String(fromPatch?.city ?? fromCurrent?.city ?? fromAddresses?.city ?? ""),
    state: String(fromPatch?.state ?? fromCurrent?.state ?? fromAddresses?.state ?? ""),
    zip: String(fromPatch?.zip ?? fromCurrent?.zip ?? fromAddresses?.zip ?? "")
  };
  if (!merged.address || !merged.city || !merged.state || !merged.zip) {
    throw new Error(
      "PUT /company requires physical_address (address, city, state, zip). Call getCompany() first or include physical_address in the patch."
    );
  }
  return merged;
}
function physicalFromAddresses(addresses) {
  if (!Array.isArray(addresses)) {
    return void 0;
  }
  const physical = addresses.find((row2) => {
    if (!row2 || typeof row2 !== "object") return false;
    const type = row2.type;
    return type === 1 || type === "1";
  }) ?? addresses[0];
  if (!physical || typeof physical !== "object") {
    return void 0;
  }
  const row = physical;
  return {
    address: String(row.address ?? row.street ?? ""),
    city: String(row.city ?? ""),
    state: String(row.state ?? row.state_abbr ?? ""),
    zip: String(row.zip ?? "")
  };
}

// src/resources/account.ts
var CompanyPeopleSchema = Type.Array(UserDataSchema);
var AccountResource = class {
  constructor(http, cache) {
    this.http = http;
    this.cache = cache;
  }
  async getUser(options) {
    if (this.cache) {
      return this.cache.fetchQuery(USER_ME_KEY, (signal) => this.fetchUser(signal), options);
    }
    return (await this.http.get("/user")).data;
  }
  observeUser(options) {
    if (!this.cache) {
      throw new Error("observeUser requires a cache-enabled client");
    }
    return this.cache.observeQuery(USER_ME_KEY, (signal) => this.fetchUser(signal), options);
  }
  async updateUser(payload) {
    return this.mutateAndInvalidate(
      { method: "PUT", path: "/user", body: payload },
      UserDataSchema,
      "user",
      USER_ME_KEY,
      () => this.fetchUserFresh()
    );
  }
  async updatePassword(payload) {
    await this.http.transport.request({
      method: "PUT",
      path: "/user/password",
      body: payload,
      authRequired: true
    });
  }
  async getCompany(options) {
    if (this.cache) {
      return this.cache.fetchQuery(
        COMPANY_ME_KEY,
        (signal) => this.fetchCompany(signal),
        options
      );
    }
    return (await this.http.get("/company")).data;
  }
  observeCompany(options) {
    if (!this.cache) {
      throw new Error("observeCompany requires a cache-enabled client");
    }
    return this.cache.observeQuery(
      COMPANY_ME_KEY,
      (signal) => this.fetchCompany(signal),
      options
    );
  }
  async createCompany(payload) {
    return this.mutateAndInvalidate(
      { method: "POST", path: "/company", body: payload },
      CompanyDataSchema,
      "company",
      COMPANY_PREFIX_KEY,
      () => this.fetchCompanyFresh()
    );
  }
  async updateCompany(payload) {
    const current = await this.fetchCompanyForMutate();
    const body = buildLaravelAccountCompanyPutBody(current, payload);
    return this.mutateAndInvalidate(
      { method: "PUT", path: "/company", body },
      CompanyDataSchema,
      "company",
      COMPANY_PREFIX_KEY,
      () => this.fetchCompanyFresh()
    );
  }
  async getNotificationPreferences(options) {
    if (this.cache) {
      return this.cache.fetchQuery(
        NOTIFICATION_PREFS_KEY,
        (signal) => this.fetchNotificationPreferences(signal),
        options
      );
    }
    return (await this.http.get("/company/notification-preferences")).data;
  }
  async updateNotificationPreferences(payload) {
    return this.mutateAndInvalidate(
      { method: "PUT", path: "/company/notification-preferences", body: payload },
      NotificationPreferencesSchema,
      "notification-preferences",
      NOTIFICATION_PREFS_KEY,
      () => this.getNotificationPreferences()
    );
  }
  async listCompanyPeople(options) {
    if (this.cache) {
      return this.cache.fetchQuery(
        COMPANY_PEOPLE_KEY,
        (signal) => this.fetchCompanyPeople(signal),
        options
      );
    }
    const raw = await this.http.transport.request({
      method: "GET",
      path: "/company/people",
      authRequired: true
    });
    return decode(CompanyPeopleSchema, raw, "company-people");
  }
  async updateCompanyUser(userId, payload) {
    return this.mutateAndInvalidate(
      { method: "PUT", path: `/company/people/${userId}`, body: payload },
      UserDataSchema,
      "company-user",
      COMPANY_PEOPLE_KEY,
      async () => {
        const people = await this.listCompanyPeople();
        const match = people.find((u) => String(u.id) === String(userId));
        if (!match) {
          throw new Error(`Company user ${userId} not found after update`);
        }
        return match;
      }
    );
  }
  async fetchUser(signal) {
    const raw = await this.http.transport.request({
      method: "GET",
      path: "/user",
      authRequired: true,
      signal
    });
    return decode(UserDataSchema, raw, "user");
  }
  async fetchCompanyForMutate() {
    const raw = await this.http.transport.request({
      method: "GET",
      path: "/company",
      authRequired: true
    });
    return raw;
  }
  async fetchCompany(signal) {
    const raw = await this.http.transport.request({
      method: "GET",
      path: "/company",
      authRequired: true,
      signal
    });
    return decode(CompanyDataSchema, raw, "company");
  }
  async fetchNotificationPreferences(signal) {
    const raw = await this.http.transport.request({
      method: "GET",
      path: "/company/notification-preferences",
      authRequired: true,
      signal
    });
    return decode(NotificationPreferencesSchema, raw, "notification-preferences");
  }
  async fetchCompanyPeople(signal) {
    const raw = await this.http.transport.request({
      method: "GET",
      path: "/company/people",
      authRequired: true,
      signal
    });
    return decode(CompanyPeopleSchema, raw, "company-people");
  }
  async mutateAndInvalidate(spec, schema, label, invalidateKey, refetch) {
    const raw = await this.http.transport.request({
      ...spec,
      authRequired: true
    });
    const emptyBody = raw === void 0 || raw === null;
    if (emptyBody) {
      if (invalidateKey && this.cache) {
        this.cache.invalidate(invalidateKey);
      }
      if (refetch) {
        return refetch();
      }
      throw new Error(`Empty ${label} response (expected Laravel 204 with refetch)`);
    }
    const data = decode(schema, raw, label);
    if (invalidateKey && this.cache) {
      this.cache.invalidate(invalidateKey);
    }
    return data;
  }
  async fetchUserFresh() {
    const raw = await this.http.transport.request({
      method: "GET",
      path: "/user",
      params: { _sdk_refresh: Date.now() },
      authRequired: true
    });
    const data = decode(UserDataSchema, raw, "user");
    this.cache?.setQueryData(USER_ME_KEY, data);
    return data;
  }
  async fetchCompanyFresh() {
    const raw = await this.http.transport.request({
      method: "GET",
      path: "/company",
      params: { _sdk_refresh: Date.now() },
      authRequired: true
    });
    const data = decode(CompanyDataSchema, raw, "company");
    this.cache?.setQueryData(COMPANY_ME_KEY, data);
    return data;
  }
};

// src/resources/auth.ts
var AuthResource = class {
  constructor(http) {
    this.http = http;
  }
  async login(info) {
    const resp = await this.http.post("/auth/login", info);
    return resp.data;
  }
  async refresh() {
    const resp = await this.http.post("/auth/refresh");
    return resp.data;
  }
};

// src/resources/env.ts
var EnvResource = class {
  constructor(http) {
    this.http = http;
  }
  async getConfig() {
    const resp = await this.http.get("/env/config");
    return resp.data;
  }
  async getFeatures() {
    const resp = await this.http.get("/env/features");
    return resp.data;
  }
};

// src/resources/lookup.ts
var LookupResource = class {
  constructor(http) {
    this.http = http;
  }
  async listStates() {
    return (await this.http.get("/lookup/states")).data;
  }
  async listCapabilities(query) {
    return (await this.http.get("/lookup/capabilities", query)).data;
  }
  async listCertifications(query) {
    return (await this.http.get("/lookup/certifications", query)).data;
  }
  async listCertificationTree() {
    return (await this.http.get("/lookup/certification_tree")).data;
  }
  async listEthnicities() {
    return (await this.http.get("/lookup/ethnicities")).data;
  }
  async listUnions(query) {
    return (await this.http.get("/lookup/unions", query)).data;
  }
  async listCommodityCodes(query) {
    return (await this.http.get("/lookup/commodity_codes", query)).data;
  }
  async listBusinessSizes() {
    return (await this.http.get("/lookup/business_sizes")).data;
  }
  async listCategories() {
    return (await this.http.get("/lookup/categories")).data;
  }
};

// src/resources/projects.ts
var ProjectDataSchema = Type.Object(
  { id: Type.Number(), name: Type.Optional(Type.String()), slug: Type.Optional(Type.String()) },
  { additionalProperties: true }
);
var ProjectListSchema = Type.Array(ProjectDataSchema);
var ParticipantListSchema = Type.Array(
  Type.Object({ id: Type.Optional(Type.Number()), user_id: Type.Optional(Type.Number()) }, {
    additionalProperties: true
  })
);
var BidPackageSchema = Type.Object(
  { id: Type.Number(), name: Type.Optional(Type.String()) },
  { additionalProperties: true }
);
var ProjectUpdatePayloadSchema = Type.Object(
  { name: Type.Optional(Type.String({ minLength: 1, maxLength: 100 })) },
  { additionalProperties: true }
);
var ProjectCreatePayloadSchema = Type.Intersect([
  ProjectUpdatePayloadSchema,
  Type.Object({ name: Type.String({ minLength: 1, maxLength: 100 }) })
]);
var ProjectBatchPayloadSchema = Type.Object({
  projects: Type.Array(ProjectCreatePayloadSchema, { minItems: 1, maxItems: 200 }),
  client_id: Type.Optional(Type.Integer())
});
var ProjectContactPayloadSchema = Type.Object(
  {
    name: Type.Optional(Type.String({ minLength: 1 })),
    email: Type.Optional(Type.Union([Type.String(), Type.Null()])),
    primary: Type.Optional(Type.Boolean())
  },
  { additionalProperties: true }
);
var ProjectParticipantsPayloadSchema = Type.Array(
  Type.Object(
    {
      company_id: Type.Integer(),
      bid_package_ids: Type.Optional(Type.Array(Type.Integer())),
      bid_packages: Type.Optional(
        Type.Array(Type.Object({ id: Type.Integer() }, { additionalProperties: true }))
      )
    },
    { additionalProperties: false }
  ),
  { minItems: 1 }
);
var BidPackageUpdatePayloadSchema = Type.Object(
  { name: Type.Optional(Type.String({ minLength: 1, maxLength: 100 })) },
  { additionalProperties: true }
);
var BidPackageCreatePayloadSchema = Type.Intersect([
  BidPackageUpdatePayloadSchema,
  Type.Object({ name: Type.String({ minLength: 1, maxLength: 100 }) })
]);
var BidPackageBatchPayloadSchema = Type.Object({
  bid_packages: Type.Array(BidPackageCreatePayloadSchema, { minItems: 1, maxItems: 200 })
});
var ProjectsResource = class {
  constructor(http, cache) {
    this.http = http;
    this.cache = cache;
  }
  async list(params, options) {
    if (this.cache) {
      return this.cache.fetchQuery(
        projectsListKey(params),
        (signal) => this.fetchList(params, signal),
        options
      );
    }
    return (await this.http.get("/projects", params)).data;
  }
  async get(projectId, options) {
    const { full, ...queryOptions } = options ?? {};
    const params = full ? { full: true } : void 0;
    const key = full ? projectFullKey(projectId) : projectKey(projectId);
    if (this.cache) {
      return this.cache.fetchQuery(
        key,
        (signal) => this.fetchOne(projectId, params, signal),
        queryOptions
      );
    }
    return (await this.http.get(`/projects/${projectId}`, params)).data;
  }
  async createOrUpdate(payload, projectId) {
    if (projectId !== void 0) {
      decode(ProjectUpdatePayloadSchema, payload, "project-update-payload");
      return this.mutateAndInvalidate(
        { method: "PUT", path: `/projects/${projectId}`, body: payload },
        ProjectDataSchema,
        "project",
        [PROJECTS_PREFIX_KEY, projectKey(projectId)],
        () => this.get(projectId)
      );
    }
    decode(ProjectCreatePayloadSchema, payload, "project-create-payload");
    return this.mutateAndInvalidate(
      { method: "POST", path: "/projects", body: payload },
      ProjectDataSchema,
      "project",
      [PROJECTS_PREFIX_KEY]
    );
  }
  async delete(projectId) {
    await this.http.transport.request({
      method: "DELETE",
      path: `/projects/${projectId}`,
      authRequired: true
    });
    this.invalidateProject(projectId);
  }
  async batch(payload) {
    decode(ProjectBatchPayloadSchema, payload, "project-batch-payload");
    const result = await this.http.transport.request({
      method: "POST",
      path: "/projects/batch",
      body: payload,
      authRequired: true
    });
    this.cache?.invalidate(PROJECTS_PREFIX_KEY);
    return result;
  }
  async addOrUpdateContact(projectId, payload, contactId) {
    decode(ProjectContactPayloadSchema, payload, "project-contact-payload");
    const path = contactId !== void 0 ? `/projects/${projectId}/contacts/${contactId}` : `/projects/${projectId}/contacts`;
    const method = contactId !== void 0 ? "PUT" : "POST";
    const result = await this.http.transport.request({
      method,
      path,
      body: payload,
      authRequired: true
    });
    this.cache?.invalidate(projectKey(projectId));
    return result;
  }
  async deleteContact(projectId, contactId) {
    await this.http.transport.request({
      method: "DELETE",
      path: `/projects/${projectId}/contacts/${contactId}`,
      authRequired: true
    });
    this.cache?.invalidate(projectKey(projectId));
  }
  async listParticipants(projectId, options) {
    const key = participantsKey(projectId);
    if (this.cache) {
      return this.cache.fetchQuery(
        key,
        (signal) => this.fetchParticipants(projectId, signal),
        options
      );
    }
    return (await this.http.get(`/projects/${projectId}/participants`)).data;
  }
  async addParticipants(projectId, payload) {
    decode(ProjectParticipantsPayloadSchema, payload, "project-participants-add-payload");
    const result = await this.http.transport.request({
      method: "POST",
      path: `/projects/${projectId}/participants/add`,
      body: payload,
      authRequired: true
    });
    this.invalidateParticipants(projectId);
    return result;
  }
  async removeParticipants(projectId, payload) {
    decode(ProjectParticipantsPayloadSchema, payload, "project-participants-remove-payload");
    const result = await this.http.transport.request({
      method: "POST",
      path: `/projects/${projectId}/participants/remove`,
      body: payload,
      authRequired: true
    });
    this.invalidateParticipants(projectId);
    return result;
  }
  async getBidPackage(projectId, packageId, options) {
    const key = bidPackageKey(projectId, packageId);
    if (this.cache) {
      return this.cache.fetchQuery(
        key,
        (signal) => this.fetchBidPackage(projectId, packageId, signal),
        options
      );
    }
    return (await this.http.get(`/projects/${projectId}/bid_packages/${packageId}`)).data;
  }
  async createOrUpdateBidPackage(projectId, payload, packageId) {
    decode(
      packageId === void 0 ? BidPackageCreatePayloadSchema : BidPackageUpdatePayloadSchema,
      payload,
      packageId === void 0 ? "bid-package-create-payload" : "bid-package-update-payload"
    );
    const path = packageId !== void 0 ? `/projects/${projectId}/bid_packages/${packageId}` : `/projects/${projectId}/bid_packages`;
    const method = packageId !== void 0 ? "PUT" : "POST";
    const raw = await this.http.transport.request({
      method,
      path,
      body: payload,
      authRequired: true
    });
    if (raw === void 0 || raw === null) {
      if (packageId === void 0) {
        throw new Error("Laravel returned an empty response while creating a bid package");
      }
      this.invalidateBidPackage(projectId, packageId);
      return this.getBidPackage(projectId, packageId);
    }
    const data = decode(BidPackageSchema, raw, "bid-package");
    this.invalidateBidPackage(projectId, packageId ?? data.id);
    return data;
  }
  async deleteBidPackage(projectId, packageId) {
    await this.http.transport.request({
      method: "DELETE",
      path: `/projects/${projectId}/bid_packages/${packageId}`,
      authRequired: true
    });
    this.invalidateBidPackage(projectId, packageId);
  }
  async batchBidPackages(projectId, payload) {
    decode(BidPackageBatchPayloadSchema, payload, "bid-package-batch-payload");
    const result = await this.http.transport.request({
      method: "POST",
      path: `/projects/${projectId}/bid-packages/batch`,
      body: payload,
      authRequired: true
    });
    this.cache?.invalidate(projectKey(projectId));
    this.cache?.invalidate(PROJECTS_PREFIX_KEY);
    return result;
  }
  async fetchList(params, signal) {
    const raw = await this.http.transport.request({
      method: "GET",
      path: "/projects",
      params,
      authRequired: true,
      signal
    });
    return decode(ProjectListSchema, raw, "projects");
  }
  async fetchOne(projectId, params, signal) {
    const raw = await this.http.transport.request({
      method: "GET",
      path: `/projects/${projectId}`,
      params,
      authRequired: true,
      signal
    });
    return decode(ProjectDataSchema, raw, "project");
  }
  async fetchParticipants(projectId, signal) {
    const raw = await this.http.transport.request({
      method: "GET",
      path: `/projects/${projectId}/participants`,
      authRequired: true,
      signal
    });
    return decode(ParticipantListSchema, raw, "participants");
  }
  async fetchBidPackage(projectId, packageId, signal) {
    const raw = await this.http.transport.request({
      method: "GET",
      path: `/projects/${projectId}/bid_packages/${packageId}`,
      authRequired: true,
      signal
    });
    return decode(BidPackageSchema, raw, "bid-package");
  }
  async mutateAndInvalidate(spec, schema, label, invalidateKeys, refetchOnEmpty) {
    const raw = await this.http.transport.request({
      ...spec,
      authRequired: true
    });
    if (this.cache) {
      for (const key of invalidateKeys) {
        this.cache.invalidate(key);
      }
    }
    if (raw === void 0 || raw === null) {
      if (refetchOnEmpty) return refetchOnEmpty();
      throw new Error(`Empty ${label} response from Laravel`);
    }
    const data = decode(schema, raw, label);
    return data;
  }
  invalidateProject(projectId) {
    this.cache?.invalidate(PROJECTS_PREFIX_KEY);
    this.cache?.invalidate(projectKey(projectId));
    this.cache?.invalidate(projectFullKey(projectId));
  }
  invalidateParticipants(projectId) {
    this.cache?.invalidate(participantsKey(projectId));
    this.cache?.invalidate(projectKey(projectId));
    this.cache?.invalidate(projectFullKey(projectId));
  }
  invalidateBidPackage(projectId, packageId) {
    this.cache?.invalidate(bidPackageKey(projectId, packageId));
    this.cache?.invalidate(projectKey(projectId));
    this.cache?.invalidate(projectFullKey(projectId));
    this.cache?.invalidate(PROJECTS_PREFIX_KEY);
  }
};

// src/resources/invites.ts
var InviteDataSchema = Type.Object(
  {
    id: Type.Union([Type.String(), Type.Number()]),
    email: Type.Optional(Type.String()),
    status: Type.Optional(Type.String())
  },
  { additionalProperties: true }
);
var InviteListSchema = Type.Array(InviteDataSchema);
var CreateInvitePayloadSchema = Type.Object({
  email: Type.String({ minLength: 1 }),
  first_name: Type.String({ minLength: 1 }),
  last_name: Type.String({ minLength: 1 }),
  role_id: Type.Integer()
});
var InvitesResource = class {
  constructor(http, cache) {
    this.http = http;
    this.cache = cache;
    __publicField(this, "listRevision", 0);
  }
  async list(options) {
    if (this.cache) {
      return this.cache.fetchQuery(INVITES_KEY, (signal) => this.fetchList(signal), options);
    }
    return (await this.http.get("/invites")).data;
  }
  async get(inviteId) {
    const raw = await this.http.transport.request({
      method: "GET",
      path: `/invites/${inviteId}`,
      authRequired: true
    });
    return decode(InviteDataSchema, raw, "invite");
  }
  async create(payload) {
    decode(CreateInvitePayloadSchema, payload, "invite-create-payload");
    return this.mutateAndInvalidate(
      { method: "POST", path: "/invites", body: payload },
      InviteDataSchema,
      "invite",
      INVITES_KEY,
      async () => {
        const invites = await this.fetchList(new AbortController().signal);
        const normalizedEmail = payload.email.toLowerCase();
        const created = invites.find((invite) => invite.email?.toLowerCase() === normalizedEmail);
        if (!created) {
          throw new Error(`Invite for ${payload.email} was not found after Laravel returned 204`);
        }
        return created;
      }
    );
  }
  async resend(inviteId) {
    return this.mutateAndInvalidate(
      { method: "PUT", path: `/invites/${inviteId}`, body: {} },
      InviteDataSchema,
      "invite",
      INVITES_KEY,
      () => this.get(inviteId)
    );
  }
  async delete(inviteId) {
    await this.http.transport.request({
      method: "DELETE",
      path: `/invites/${inviteId}`,
      authRequired: true
    });
    this.invalidateList();
  }
  async accept(token, payload) {
    return this.http.transport.request({
      method: "POST",
      path: `/invites/${token}/accept`,
      body: payload,
      authRequired: false
    });
  }
  async fetchList(signal) {
    const raw = await this.http.transport.request({
      method: "GET",
      path: "/invites",
      params: { _tl_sdk_revision: this.listRevision },
      authRequired: true,
      signal
    });
    return decode(InviteListSchema, raw, "invites");
  }
  async mutateAndInvalidate(spec, schema, label, invalidateKey, refetchOnEmpty) {
    const raw = await this.http.transport.request({
      ...spec,
      authRequired: true
    });
    if (invalidateKey) {
      this.invalidateList();
    }
    if (raw === void 0 || raw === null) {
      if (refetchOnEmpty) return refetchOnEmpty();
      throw new Error(`Empty ${label} response from Laravel`);
    }
    const data = decode(schema, raw, label);
    return data;
  }
  /**
   * Laravel caches GET responses by full URL. Its invalidation timestamp has
   * second-level precision, so a mutation performed in the same second as a
   * list read can otherwise replay the pre-mutation response. Advancing a
   * stable per-client revision creates a fresh server cache key after each
   * successful mutation without disabling Laravel caching altogether.
   */
  invalidateList() {
    this.listRevision += 1;
    this.cache?.invalidate(INVITES_KEY);
  }
};

// src/session/SessionStore.ts
function freezeSession(session) {
  return Object.freeze({ ...session });
}
var SessionStore = class {
  constructor() {
    __publicField(this, "subject", new BehaviorSubject(null));
    __publicField(this, "lastEvent");
    __publicField(this, "state$", this.subject.asObservable());
  }
  getSession() {
    return this.subject.getValue();
  }
  setSession(session, event) {
    if (event) {
      this.lastEvent = event;
    }
    const next = session === null ? null : freezeSession({ ...session, event: event ?? session.event });
    this.subject.next(next);
  }
  subscribe(callback) {
    const sub = this.state$.subscribe((session) => {
      callback(session, session?.event ?? (session === null ? this.lastEvent : void 0));
    });
    return { unsubscribe: () => sub.unsubscribe() };
  }
};

// src/client.ts
var ToughLeafClient = class _ToughLeafClient {
  constructor(options) {
    __publicField(this, "http");
    __publicField(this, "session");
    __publicField(this, "auth");
    __publicField(this, "env");
    __publicField(this, "lookup");
    __publicField(this, "account");
    __publicField(this, "invites");
    __publicField(this, "projects");
    __publicField(this, "cache");
    __publicField(this, "accessToken");
    __publicField(this, "externalGetAccessToken");
    __publicField(this, "onLogin");
    this.onLogin = options.onLogin;
    this.externalGetAccessToken = options.getAccessToken;
    this.http = new HttpClient({
      baseUrl: options.baseUrl,
      fetchImpl: options.fetchImpl,
      getAccessToken: async () => this.resolveAccessToken(),
      onUnauthorized: async () => {
        await options.onUnauthorized?.();
        this.clearSession("SIGNED_OUT");
      }
    });
    this.session = new SessionStore();
    this.cache = new ResourceCache(this.http.transport);
    this.auth = new AuthResource(this.http);
    this.env = new EnvResource(this.http);
    this.lookup = new LookupResource(this.http);
    this.account = new AccountResource(this.http, this.cache);
    this.invites = new InvitesResource(this.http, this.cache);
    this.projects = new ProjectsResource(this.http, this.cache);
  }
  /** @deprecated Use createClient() — alias kept for v0.2 consumers */
  static create(options) {
    return new _ToughLeafClient(options);
  }
  setAccessToken(token) {
    this.accessToken = token;
  }
  getAccessToken() {
    return this.accessToken;
  }
  resource(key, queryFn, options) {
    return this.cache.observeQuery(key, queryFn, options);
  }
  invalidate(keys) {
    this.cache.invalidate(keys);
  }
  async login(info) {
    return this.applySession(await this.auth.login(info), "SIGNED_IN");
  }
  async refresh() {
    return this.applySession(await this.auth.refresh(), "TOKEN_REFRESHED");
  }
  logout() {
    this.clearSession("SIGNED_OUT");
  }
  async resolveAccessToken() {
    if (this.accessToken) {
      return this.accessToken;
    }
    return this.externalGetAccessToken ? await this.externalGetAccessToken() : void 0;
  }
  async applySession(raw, event) {
    const session = decode(LoginResponseSchema, raw, "login");
    this.setAccessToken(session.access_token);
    this.session.setSession(
      {
        access_token: session.access_token,
        user: {
          id: session.id,
          email: session.email,
          first_name: session.first_name,
          last_name: session.last_name,
          status: session.status,
          company_id: session.company_id
        },
        event
      },
      event
    );
    if (this.onLogin) {
      await this.onLogin(session);
    }
    return session;
  }
  clearSession(event) {
    this.setAccessToken(void 0);
    this.session.setSession(null, event);
    this.cache.onAuthChange(false);
    this.http.abortAuthenticated("session ended");
  }
};
function createClient(options) {
  return new ToughLeafClient(options);
}
export {
  AUTH_CACHE_PREFIXES,
  AccountResource,
  ApiEnvelopeSchema,
  AuthResource,
  COMPANY_ME_KEY,
  COMPANY_PEOPLE_KEY,
  COMPANY_PREFIX_KEY,
  CompanyDataSchema,
  EnvResource,
  FetchTransport,
  HttpClient,
  INVITES_KEY,
  InvitesResource,
  LoginResponseSchema,
  LookupResource,
  NOTIFICATION_PREFS_KEY,
  NotificationPreferencesSchema,
  PROJECTS_LIST_KEY,
  PROJECTS_PREFIX_KEY,
  ProjectsResource,
  ResourceCache,
  SessionStore,
  ToughLeafApiError,
  ToughLeafClient,
  USER_ME_KEY,
  UserDataSchema,
  ValidationError,
  bidPackageKey,
  createClient,
  decode,
  isAuthScopedKey,
  participantsKey,
  projectFullKey,
  projectKey,
  projectsListKey,
  queryKeyMatchesPrefix,
  serializeQueryKey
};
//# sourceMappingURL=toughleaf-platform-sdk.esm.js.map
