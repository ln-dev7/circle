/**
 * Client
 **/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types; // general types
import $Public = runtime.Types.Public;
import $Utils = runtime.Types.Utils;
import $Extensions = runtime.Types.Extensions;
import $Result = runtime.Types.Result;

export type PrismaPromise<T> = $Public.PrismaPromise<T>;

/**
 * Model User
 *
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>;
/**
 * Model Post
 *
 */
export type Post = $Result.DefaultSelection<Prisma.$PostPayload>;
/**
 * Model Company
 *
 */
export type Company = $Result.DefaultSelection<Prisma.$CompanyPayload>;
/**
 * Model Team
 *
 */
export type Team = $Result.DefaultSelection<Prisma.$TeamPayload>;
/**
 * Model Onboarding
 *
 */
export type Onboarding = $Result.DefaultSelection<Prisma.$OnboardingPayload>;

/**
 * Enums
 */
export namespace $Enums {
   export const OnboardingStatus: {
      PENDING: 'PENDING';
      IN_PROGRESS: 'IN_PROGRESS';
      COMPLETED: 'COMPLETED';
      CANCELLED: 'CANCELLED';
   };

   export type OnboardingStatus = (typeof OnboardingStatus)[keyof typeof OnboardingStatus];
}

export type OnboardingStatus = $Enums.OnboardingStatus;

export const OnboardingStatus: typeof $Enums.OnboardingStatus;

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
   ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
   U = 'log' extends keyof ClientOptions
      ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition>
         ? Prisma.GetEvents<ClientOptions['log']>
         : never
      : never,
   ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
> {
   [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] };

   /**
    * ##  Prisma Client ʲˢ
    *
    * Type-safe database client for TypeScript & Node.js
    * @example
    * ```
    * const prisma = new PrismaClient()
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    *
    *
    * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
    */

   constructor(optionsArg?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
   $on<V extends U>(
      eventType: V,
      callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void
   ): PrismaClient;

   /**
    * Connect with the database
    */
   $connect(): $Utils.JsPromise<void>;

   /**
    * Disconnect from the database
    */
   $disconnect(): $Utils.JsPromise<void>;

   /**
    * Add a middleware
    * @deprecated since 4.16.0. For new code, prefer client extensions instead.
    * @see https://pris.ly/d/extensions
    */
   $use(cb: Prisma.Middleware): void;

   /**
    * Executes a prepared raw query and returns the number of affected rows.
    * @example
    * ```
    * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
    * ```
    *
    * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
    */
   $executeRaw<T = unknown>(
      query: TemplateStringsArray | Prisma.Sql,
      ...values: any[]
   ): Prisma.PrismaPromise<number>;

   /**
    * Executes a raw query and returns the number of affected rows.
    * Susceptible to SQL injections, see documentation.
    * @example
    * ```
    * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
    * ```
    *
    * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
    */
   $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

   /**
    * Performs a prepared raw query and returns the `SELECT` data.
    * @example
    * ```
    * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
    * ```
    *
    * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
    */
   $queryRaw<T = unknown>(
      query: TemplateStringsArray | Prisma.Sql,
      ...values: any[]
   ): Prisma.PrismaPromise<T>;

   /**
    * Performs a raw query and returns the `SELECT` data.
    * Susceptible to SQL injections, see documentation.
    * @example
    * ```
    * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
    * ```
    *
    * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
    */
   $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;

   /**
    * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
    * @example
    * ```
    * const [george, bob, alice] = await prisma.$transaction([
    *   prisma.user.create({ data: { name: 'George' } }),
    *   prisma.user.create({ data: { name: 'Bob' } }),
    *   prisma.user.create({ data: { name: 'Alice' } }),
    * ])
    * ```
    *
    * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
    */
   $transaction<P extends Prisma.PrismaPromise<any>[]>(
      arg: [...P],
      options?: { isolationLevel?: Prisma.TransactionIsolationLevel }
   ): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>;

   $transaction<R>(
      fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>,
      options?: {
         maxWait?: number;
         timeout?: number;
         isolationLevel?: Prisma.TransactionIsolationLevel;
      }
   ): $Utils.JsPromise<R>;

   $extends: $Extensions.ExtendsHook<
      'extends',
      Prisma.TypeMapCb<ClientOptions>,
      ExtArgs,
      $Utils.Call<
         Prisma.TypeMapCb<ClientOptions>,
         {
            extArgs: ExtArgs;
         }
      >
   >;

   /**
    * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
   get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

   /**
    * `prisma.post`: Exposes CRUD operations for the **Post** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Posts
    * const posts = await prisma.post.findMany()
    * ```
    */
   get post(): Prisma.PostDelegate<ExtArgs, ClientOptions>;

   /**
    * `prisma.company`: Exposes CRUD operations for the **Company** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Companies
    * const companies = await prisma.company.findMany()
    * ```
    */
   get company(): Prisma.CompanyDelegate<ExtArgs, ClientOptions>;

   /**
    * `prisma.team`: Exposes CRUD operations for the **Team** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Teams
    * const teams = await prisma.team.findMany()
    * ```
    */
   get team(): Prisma.TeamDelegate<ExtArgs, ClientOptions>;

   /**
    * `prisma.onboarding`: Exposes CRUD operations for the **Onboarding** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Onboardings
    * const onboardings = await prisma.onboarding.findMany()
    * ```
    */
   get onboarding(): Prisma.OnboardingDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
   export import DMMF = runtime.DMMF;

   export type PrismaPromise<T> = $Public.PrismaPromise<T>;

   /**
    * Validator
    */
   export import validator = runtime.Public.validator;

   /**
    * Prisma Errors
    */
   export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError;
   export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError;
   export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError;
   export import PrismaClientInitializationError = runtime.PrismaClientInitializationError;
   export import PrismaClientValidationError = runtime.PrismaClientValidationError;

   /**
    * Re-export of sql-template-tag
    */
   export import sql = runtime.sqltag;
   export import empty = runtime.empty;
   export import join = runtime.join;
   export import raw = runtime.raw;
   export import Sql = runtime.Sql;

   /**
    * Decimal.js
    */
   export import Decimal = runtime.Decimal;

   export type DecimalJsLike = runtime.DecimalJsLike;

   /**
    * Metrics
    */
   export type Metrics = runtime.Metrics;
   export type Metric<T> = runtime.Metric<T>;
   export type MetricHistogram = runtime.MetricHistogram;
   export type MetricHistogramBucket = runtime.MetricHistogramBucket;

   /**
    * Extensions
    */
   export import Extension = $Extensions.UserArgs;
   export import getExtensionContext = runtime.Extensions.getExtensionContext;
   export import Args = $Public.Args;
   export import Payload = $Public.Payload;
   export import Result = $Public.Result;
   export import Exact = $Public.Exact;

   /**
    * Prisma Client JS version: 6.12.0
    * Query Engine version: 8047c96bbd92db98a2abc7c9323ce77c02c89dbc
    */
   export type PrismaVersion = {
      client: string;
   };

   export const prismaVersion: PrismaVersion;

   /**
    * Utility Types
    */

   export import JsonObject = runtime.JsonObject;
   export import JsonArray = runtime.JsonArray;
   export import JsonValue = runtime.JsonValue;
   export import InputJsonObject = runtime.InputJsonObject;
   export import InputJsonArray = runtime.InputJsonArray;
   export import InputJsonValue = runtime.InputJsonValue;

   /**
    * Types of the values used to represent different kinds of `null` values when working with JSON fields.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
   namespace NullTypes {
      /**
       * Type of `Prisma.DbNull`.
       *
       * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
       *
       * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
       */
      class DbNull {
         private DbNull: never;
         private constructor();
      }

      /**
       * Type of `Prisma.JsonNull`.
       *
       * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
       *
       * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
       */
      class JsonNull {
         private JsonNull: never;
         private constructor();
      }

      /**
       * Type of `Prisma.AnyNull`.
       *
       * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
       *
       * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
       */
      class AnyNull {
         private AnyNull: never;
         private constructor();
      }
   }

   /**
    * Helper for filtering JSON entries that have `null` on the database (empty on the db)
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
   export const DbNull: NullTypes.DbNull;

   /**
    * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
   export const JsonNull: NullTypes.JsonNull;

   /**
    * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
   export const AnyNull: NullTypes.AnyNull;

   type SelectAndInclude = {
      select: any;
      include: any;
   };

   type SelectAndOmit = {
      select: any;
      omit: any;
   };

   /**
    * Get the type of the value, that the Promise holds.
    */
   export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

   /**
    * Get the return type of a function which returns a Promise.
    */
   export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<
      ReturnType<T>
   >;

   /**
    * From T, pick a set of properties whose keys are in the union K
    */
   type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
   };

   export type Enumerable<T> = T | Array<T>;

   export type RequiredKeys<T> = {
      [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K;
   }[keyof T];

   export type TruthyKeys<T> = keyof {
      [K in keyof T as T[K] extends false | undefined | null ? never : K]: K;
   };

   export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>;

   /**
    * Subset
    * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
    */
   export type Subset<T, U> = {
      [key in keyof T]: key extends keyof U ? T[key] : never;
   };

   /**
    * SelectSubset
    * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
    * Additionally, it validates, if both select and include are present. If the case, it errors.
    */
   export type SelectSubset<T, U> = {
      [key in keyof T]: key extends keyof U ? T[key] : never;
   } & (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {});

   /**
    * Subset + Intersection
    * @desc From `T` pick properties that exist in `U` and intersect `K`
    */
   export type SubsetIntersection<T, U, K> = {
      [key in keyof T]: key extends keyof U ? T[key] : never;
   } & K;

   type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

   /**
    * XOR is needed to have a real mutually exclusive union type
    * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
    */
   type XOR<T, U> = T extends object
      ? U extends object
         ? (Without<T, U> & U) | (Without<U, T> & T)
         : U
      : T;

   /**
    * Is T a Record?
    */
   type IsObject<T extends any> =
      T extends Array<any>
         ? False
         : T extends Date
           ? False
           : T extends Uint8Array
             ? False
             : T extends BigInt
               ? False
               : T extends object
                 ? True
                 : False;

   /**
    * If it's T[], return T
    */
   export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T;

   /**
    * From ts-toolbelt
    */

   type __Either<O extends object, K extends Key> = Omit<O, K> &
      {
         // Merge all but K
         [P in K]: Prisma__Pick<O, P & keyof O>; // With K possibilities
      }[K];

   type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>;

   type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>;

   type _Either<O extends object, K extends Key, strict extends Boolean> = {
      1: EitherStrict<O, K>;
      0: EitherLoose<O, K>;
   }[strict];

   type Either<O extends object, K extends Key, strict extends Boolean = 1> = O extends unknown
      ? _Either<O, K, strict>
      : never;

   export type Union = any;

   type PatchUndefined<O extends object, O1 extends object> = {
      [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K];
   } & {};

   /** Helper Types for "Merge" **/
   export type IntersectOf<U extends Union> = (U extends unknown ? (k: U) => void : never) extends (
      k: infer I
   ) => void
      ? I
      : never;

   export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
   } & {};

   type _Merge<U extends object> = IntersectOf<
      Overwrite<
         U,
         {
            [K in keyof U]-?: At<U, K>;
         }
      >
   >;

   type Key = string | number | symbol;
   type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
   type AtStrict<O extends object, K extends Key> = O[K & keyof O];
   type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
   export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
   }[strict];

   export type ComputeRaw<A extends any> = A extends Function
      ? A
      : {
           [K in keyof A]: A[K];
        } & {};

   export type OptionalFlat<O> = {
      [K in keyof O]?: O[K];
   } & {};

   type _Record<K extends keyof any, T> = {
      [P in K]: T;
   };

   // cause typescript not to expand types and preserve names
   type NoExpand<T> = T extends unknown ? T : never;

   // this type assumes the passed object is entirely optional
   type AtLeast<O extends object, K extends string> = NoExpand<
      O extends unknown
         ?
              | (K extends keyof O ? { [P in K]: O[P] } & O : O)
              | ({ [P in keyof O as P extends K ? P : never]-?: O[P] } & O)
         : never
   >;

   type _Strict<U, _U = U> = U extends unknown
      ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>>
      : never;

   export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
   /** End Helper Types for "Merge" **/

   export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

   /**
  A [[Boolean]]
  */
   export type Boolean = True | False;

   // /**
   // 1
   // */
   export type True = 1;

   /**
  0
  */
   export type False = 0;

   export type Not<B extends Boolean> = {
      0: 1;
      1: 0;
   }[B];

   export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
      ? 0 // anything `never` is false
      : A1 extends A2
        ? 1
        : 0;

   export type Has<U extends Union, U1 extends Union> = Not<Extends<Exclude<U1, U>, U1>>;

   export type Or<B1 extends Boolean, B2 extends Boolean> = {
      0: {
         0: 0;
         1: 1;
      };
      1: {
         0: 1;
         1: 1;
      };
   }[B1][B2];

   export type Keys<U extends Union> = U extends unknown ? keyof U : never;

   type Cast<A, B> = A extends B ? A : B;

   export const type: unique symbol;

   /**
    * Used by group by
    */

   export type GetScalarType<T, O> = O extends object
      ? {
           [P in keyof T]: P extends keyof O ? O[P] : never;
        }
      : never;

   type FieldPaths<T, U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>> =
      IsObject<T> extends True ? U : T;

   type GetHavingFields<T> = {
      [K in keyof T]: Or<Or<Extends<'OR', K>, Extends<'AND', K>>, Extends<'NOT', K>> extends True
         ? // infer is only needed to not hit TS limit
           // based on the brilliant idea of Pierre-Antoine Mills
           // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
           T[K] extends infer TK
            ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
            : never
         : {} extends FieldPaths<T[K]>
           ? never
           : K;
   }[keyof T];

   /**
    * Convert tuple to union
    */
   type _TupleToUnion<T> = T extends (infer E)[] ? E : never;
   type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>;
   type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T;

   /**
    * Like `Pick`, but additionally can also accept an array of keys
    */
   type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<
      T,
      MaybeTupleToUnion<K>
   >;

   /**
    * Exclude all keys with underscores
    */
   type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T;

   export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>;

   type FieldRefInputType<Model, FieldType> = Model extends never
      ? never
      : FieldRef<Model, FieldType>;

   export const ModelName: {
      User: 'User';
      Post: 'Post';
      Company: 'Company';
      Team: 'Team';
      Onboarding: 'Onboarding';
   };

   export type ModelName = (typeof ModelName)[keyof typeof ModelName];

   export type Datasources = {
      db?: Datasource;
   };

   interface TypeMapCb<ClientOptions = {}>
      extends $Utils.Fn<{ extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
      returns: Prisma.TypeMap<
         this['params']['extArgs'],
         ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}
      >;
   }

   export type TypeMap<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
      GlobalOmitOptions = {},
   > = {
      globalOmitOptions: {
         omit: GlobalOmitOptions;
      };
      meta: {
         modelProps: 'user' | 'post' | 'company' | 'team' | 'onboarding';
         txIsolationLevel: Prisma.TransactionIsolationLevel;
      };
      model: {
         User: {
            payload: Prisma.$UserPayload<ExtArgs>;
            fields: Prisma.UserFieldRefs;
            operations: {
               findUnique: {
                  args: Prisma.UserFindUniqueArgs<ExtArgs>;
                  result: $Utils.PayloadToResult<Prisma.$UserPayload> | null;
               };
               findUniqueOrThrow: {
                  args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>;
                  result: $Utils.PayloadToResult<Prisma.$UserPayload>;
               };
               findFirst: {
                  args: Prisma.UserFindFirstArgs<ExtArgs>;
                  result: $Utils.PayloadToResult<Prisma.$UserPayload> | null;
               };
               findFirstOrThrow: {
                  args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>;
                  result: $Utils.PayloadToResult<Prisma.$UserPayload>;
               };
               findMany: {
                  args: Prisma.UserFindManyArgs<ExtArgs>;
                  result: $Utils.PayloadToResult<Prisma.$UserPayload>[];
               };
               create: {
                  args: Prisma.UserCreateArgs<ExtArgs>;
                  result: $Utils.PayloadToResult<Prisma.$UserPayload>;
               };
               createMany: {
                  args: Prisma.UserCreateManyArgs<ExtArgs>;
                  result: BatchPayload;
               };
               createManyAndReturn: {
                  args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>;
                  result: $Utils.PayloadToResult<Prisma.$UserPayload>[];
               };
               delete: {
                  args: Prisma.UserDeleteArgs<ExtArgs>;
                  result: $Utils.PayloadToResult<Prisma.$UserPayload>;
               };
               update: {
                  args: Prisma.UserUpdateArgs<ExtArgs>;
                  result: $Utils.PayloadToResult<Prisma.$UserPayload>;
               };
               deleteMany: {
                  args: Prisma.UserDeleteManyArgs<ExtArgs>;
                  result: BatchPayload;
               };
               updateMany: {
                  args: Prisma.UserUpdateManyArgs<ExtArgs>;
                  result: BatchPayload;
               };
               updateManyAndReturn: {
                  args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>;
                  result: $Utils.PayloadToResult<Prisma.$UserPayload>[];
               };
               upsert: {
                  args: Prisma.UserUpsertArgs<ExtArgs>;
                  result: $Utils.PayloadToResult<Prisma.$UserPayload>;
               };
               aggregate: {
                  args: Prisma.UserAggregateArgs<ExtArgs>;
                  result: $Utils.Optional<AggregateUser>;
               };
               groupBy: {
                  args: Prisma.UserGroupByArgs<ExtArgs>;
                  result: $Utils.Optional<UserGroupByOutputType>[];
               };
               count: {
                  args: Prisma.UserCountArgs<ExtArgs>;
                  result: $Utils.Optional<UserCountAggregateOutputType> | number;
               };
            };
         };
         Post: {
            payload: Prisma.$PostPayload<ExtArgs>;
            fields: Prisma.PostFieldRefs;
            operations: {
               findUnique: {
                  args: Prisma.PostFindUniqueArgs<ExtArgs>;
                  result: $Utils.PayloadToResult<Prisma.$PostPayload> | null;
               };
               findUniqueOrThrow: {
                  args: Prisma.PostFindUniqueOrThrowArgs<ExtArgs>;
                  result: $Utils.PayloadToResult<Prisma.$PostPayload>;
               };
               findFirst: {
                  args: Prisma.PostFindFirstArgs<ExtArgs>;
                  result: $Utils.PayloadToResult<Prisma.$PostPayload> | null;
               };
               findFirstOrThrow: {
                  args: Prisma.PostFindFirstOrThrowArgs<ExtArgs>;
                  result: $Utils.PayloadToResult<Prisma.$PostPayload>;
               };
               findMany: {
                  args: Prisma.PostFindManyArgs<ExtArgs>;
                  result: $Utils.PayloadToResult<Prisma.$PostPayload>[];
               };
               create: {
                  args: Prisma.PostCreateArgs<ExtArgs>;
                  result: $Utils.PayloadToResult<Prisma.$PostPayload>;
               };
               createMany: {
                  args: Prisma.PostCreateManyArgs<ExtArgs>;
                  result: BatchPayload;
               };
               createManyAndReturn: {
                  args: Prisma.PostCreateManyAndReturnArgs<ExtArgs>;
                  result: $Utils.PayloadToResult<Prisma.$PostPayload>[];
               };
               delete: {
                  args: Prisma.PostDeleteArgs<ExtArgs>;
                  result: $Utils.PayloadToResult<Prisma.$PostPayload>;
               };
               update: {
                  args: Prisma.PostUpdateArgs<ExtArgs>;
                  result: $Utils.PayloadToResult<Prisma.$PostPayload>;
               };
               deleteMany: {
                  args: Prisma.PostDeleteManyArgs<ExtArgs>;
                  result: BatchPayload;
               };
               updateMany: {
                  args: Prisma.PostUpdateManyArgs<ExtArgs>;
                  result: BatchPayload;
               };
               updateManyAndReturn: {
                  args: Prisma.PostUpdateManyAndReturnArgs<ExtArgs>;
                  result: $Utils.PayloadToResult<Prisma.$PostPayload>[];
               };
               upsert: {
                  args: Prisma.PostUpsertArgs<ExtArgs>;
                  result: $Utils.PayloadToResult<Prisma.$PostPayload>;
               };
               aggregate: {
                  args: Prisma.PostAggregateArgs<ExtArgs>;
                  result: $Utils.Optional<AggregatePost>;
               };
               groupBy: {
                  args: Prisma.PostGroupByArgs<ExtArgs>;
                  result: $Utils.Optional<PostGroupByOutputType>[];
               };
               count: {
                  args: Prisma.PostCountArgs<ExtArgs>;
                  result: $Utils.Optional<PostCountAggregateOutputType> | number;
               };
            };
         };
         Company: {
            payload: Prisma.$CompanyPayload<ExtArgs>;
            fields: Prisma.CompanyFieldRefs;
            operations: {
               findUnique: {
                  args: Prisma.CompanyFindUniqueArgs<ExtArgs>;
                  result: $Utils.PayloadToResult<Prisma.$CompanyPayload> | null;
               };
               findUniqueOrThrow: {
                  args: Prisma.CompanyFindUniqueOrThrowArgs<ExtArgs>;
                  result: $Utils.PayloadToResult<Prisma.$CompanyPayload>;
               };
               findFirst: {
                  args: Prisma.CompanyFindFirstArgs<ExtArgs>;
                  result: $Utils.PayloadToResult<Prisma.$CompanyPayload> | null;
               };
               findFirstOrThrow: {
                  args: Prisma.CompanyFindFirstOrThrowArgs<ExtArgs>;
                  result: $Utils.PayloadToResult<Prisma.$CompanyPayload>;
               };
               findMany: {
                  args: Prisma.CompanyFindManyArgs<ExtArgs>;
                  result: $Utils.PayloadToResult<Prisma.$CompanyPayload>[];
               };
               create: {
                  args: Prisma.CompanyCreateArgs<ExtArgs>;
                  result: $Utils.PayloadToResult<Prisma.$CompanyPayload>;
               };
               createMany: {
                  args: Prisma.CompanyCreateManyArgs<ExtArgs>;
                  result: BatchPayload;
               };
               createManyAndReturn: {
                  args: Prisma.CompanyCreateManyAndReturnArgs<ExtArgs>;
                  result: $Utils.PayloadToResult<Prisma.$CompanyPayload>[];
               };
               delete: {
                  args: Prisma.CompanyDeleteArgs<ExtArgs>;
                  result: $Utils.PayloadToResult<Prisma.$CompanyPayload>;
               };
               update: {
                  args: Prisma.CompanyUpdateArgs<ExtArgs>;
                  result: $Utils.PayloadToResult<Prisma.$CompanyPayload>;
               };
               deleteMany: {
                  args: Prisma.CompanyDeleteManyArgs<ExtArgs>;
                  result: BatchPayload;
               };
               updateMany: {
                  args: Prisma.CompanyUpdateManyArgs<ExtArgs>;
                  result: BatchPayload;
               };
               updateManyAndReturn: {
                  args: Prisma.CompanyUpdateManyAndReturnArgs<ExtArgs>;
                  result: $Utils.PayloadToResult<Prisma.$CompanyPayload>[];
               };
               upsert: {
                  args: Prisma.CompanyUpsertArgs<ExtArgs>;
                  result: $Utils.PayloadToResult<Prisma.$CompanyPayload>;
               };
               aggregate: {
                  args: Prisma.CompanyAggregateArgs<ExtArgs>;
                  result: $Utils.Optional<AggregateCompany>;
               };
               groupBy: {
                  args: Prisma.CompanyGroupByArgs<ExtArgs>;
                  result: $Utils.Optional<CompanyGroupByOutputType>[];
               };
               count: {
                  args: Prisma.CompanyCountArgs<ExtArgs>;
                  result: $Utils.Optional<CompanyCountAggregateOutputType> | number;
               };
            };
         };
         Team: {
            payload: Prisma.$TeamPayload<ExtArgs>;
            fields: Prisma.TeamFieldRefs;
            operations: {
               findUnique: {
                  args: Prisma.TeamFindUniqueArgs<ExtArgs>;
                  result: $Utils.PayloadToResult<Prisma.$TeamPayload> | null;
               };
               findUniqueOrThrow: {
                  args: Prisma.TeamFindUniqueOrThrowArgs<ExtArgs>;
                  result: $Utils.PayloadToResult<Prisma.$TeamPayload>;
               };
               findFirst: {
                  args: Prisma.TeamFindFirstArgs<ExtArgs>;
                  result: $Utils.PayloadToResult<Prisma.$TeamPayload> | null;
               };
               findFirstOrThrow: {
                  args: Prisma.TeamFindFirstOrThrowArgs<ExtArgs>;
                  result: $Utils.PayloadToResult<Prisma.$TeamPayload>;
               };
               findMany: {
                  args: Prisma.TeamFindManyArgs<ExtArgs>;
                  result: $Utils.PayloadToResult<Prisma.$TeamPayload>[];
               };
               create: {
                  args: Prisma.TeamCreateArgs<ExtArgs>;
                  result: $Utils.PayloadToResult<Prisma.$TeamPayload>;
               };
               createMany: {
                  args: Prisma.TeamCreateManyArgs<ExtArgs>;
                  result: BatchPayload;
               };
               createManyAndReturn: {
                  args: Prisma.TeamCreateManyAndReturnArgs<ExtArgs>;
                  result: $Utils.PayloadToResult<Prisma.$TeamPayload>[];
               };
               delete: {
                  args: Prisma.TeamDeleteArgs<ExtArgs>;
                  result: $Utils.PayloadToResult<Prisma.$TeamPayload>;
               };
               update: {
                  args: Prisma.TeamUpdateArgs<ExtArgs>;
                  result: $Utils.PayloadToResult<Prisma.$TeamPayload>;
               };
               deleteMany: {
                  args: Prisma.TeamDeleteManyArgs<ExtArgs>;
                  result: BatchPayload;
               };
               updateMany: {
                  args: Prisma.TeamUpdateManyArgs<ExtArgs>;
                  result: BatchPayload;
               };
               updateManyAndReturn: {
                  args: Prisma.TeamUpdateManyAndReturnArgs<ExtArgs>;
                  result: $Utils.PayloadToResult<Prisma.$TeamPayload>[];
               };
               upsert: {
                  args: Prisma.TeamUpsertArgs<ExtArgs>;
                  result: $Utils.PayloadToResult<Prisma.$TeamPayload>;
               };
               aggregate: {
                  args: Prisma.TeamAggregateArgs<ExtArgs>;
                  result: $Utils.Optional<AggregateTeam>;
               };
               groupBy: {
                  args: Prisma.TeamGroupByArgs<ExtArgs>;
                  result: $Utils.Optional<TeamGroupByOutputType>[];
               };
               count: {
                  args: Prisma.TeamCountArgs<ExtArgs>;
                  result: $Utils.Optional<TeamCountAggregateOutputType> | number;
               };
            };
         };
         Onboarding: {
            payload: Prisma.$OnboardingPayload<ExtArgs>;
            fields: Prisma.OnboardingFieldRefs;
            operations: {
               findUnique: {
                  args: Prisma.OnboardingFindUniqueArgs<ExtArgs>;
                  result: $Utils.PayloadToResult<Prisma.$OnboardingPayload> | null;
               };
               findUniqueOrThrow: {
                  args: Prisma.OnboardingFindUniqueOrThrowArgs<ExtArgs>;
                  result: $Utils.PayloadToResult<Prisma.$OnboardingPayload>;
               };
               findFirst: {
                  args: Prisma.OnboardingFindFirstArgs<ExtArgs>;
                  result: $Utils.PayloadToResult<Prisma.$OnboardingPayload> | null;
               };
               findFirstOrThrow: {
                  args: Prisma.OnboardingFindFirstOrThrowArgs<ExtArgs>;
                  result: $Utils.PayloadToResult<Prisma.$OnboardingPayload>;
               };
               findMany: {
                  args: Prisma.OnboardingFindManyArgs<ExtArgs>;
                  result: $Utils.PayloadToResult<Prisma.$OnboardingPayload>[];
               };
               create: {
                  args: Prisma.OnboardingCreateArgs<ExtArgs>;
                  result: $Utils.PayloadToResult<Prisma.$OnboardingPayload>;
               };
               createMany: {
                  args: Prisma.OnboardingCreateManyArgs<ExtArgs>;
                  result: BatchPayload;
               };
               createManyAndReturn: {
                  args: Prisma.OnboardingCreateManyAndReturnArgs<ExtArgs>;
                  result: $Utils.PayloadToResult<Prisma.$OnboardingPayload>[];
               };
               delete: {
                  args: Prisma.OnboardingDeleteArgs<ExtArgs>;
                  result: $Utils.PayloadToResult<Prisma.$OnboardingPayload>;
               };
               update: {
                  args: Prisma.OnboardingUpdateArgs<ExtArgs>;
                  result: $Utils.PayloadToResult<Prisma.$OnboardingPayload>;
               };
               deleteMany: {
                  args: Prisma.OnboardingDeleteManyArgs<ExtArgs>;
                  result: BatchPayload;
               };
               updateMany: {
                  args: Prisma.OnboardingUpdateManyArgs<ExtArgs>;
                  result: BatchPayload;
               };
               updateManyAndReturn: {
                  args: Prisma.OnboardingUpdateManyAndReturnArgs<ExtArgs>;
                  result: $Utils.PayloadToResult<Prisma.$OnboardingPayload>[];
               };
               upsert: {
                  args: Prisma.OnboardingUpsertArgs<ExtArgs>;
                  result: $Utils.PayloadToResult<Prisma.$OnboardingPayload>;
               };
               aggregate: {
                  args: Prisma.OnboardingAggregateArgs<ExtArgs>;
                  result: $Utils.Optional<AggregateOnboarding>;
               };
               groupBy: {
                  args: Prisma.OnboardingGroupByArgs<ExtArgs>;
                  result: $Utils.Optional<OnboardingGroupByOutputType>[];
               };
               count: {
                  args: Prisma.OnboardingCountArgs<ExtArgs>;
                  result: $Utils.Optional<OnboardingCountAggregateOutputType> | number;
               };
            };
         };
      };
   } & {
      other: {
         payload: any;
         operations: {
            $executeRaw: {
               args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]];
               result: any;
            };
            $executeRawUnsafe: {
               args: [query: string, ...values: any[]];
               result: any;
            };
            $queryRaw: {
               args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]];
               result: any;
            };
            $queryRawUnsafe: {
               args: [query: string, ...values: any[]];
               result: any;
            };
         };
      };
   };
   export const defineExtension: $Extensions.ExtendsHook<
      'define',
      Prisma.TypeMapCb,
      $Extensions.DefaultArgs
   >;
   export type DefaultPrismaClient = PrismaClient;
   export type ErrorFormat = 'pretty' | 'colorless' | 'minimal';
   export interface PrismaClientOptions {
      /**
       * Overwrites the datasource url from your schema.prisma file
       */
      datasources?: Datasources;
      /**
       * Overwrites the datasource url from your schema.prisma file
       */
      datasourceUrl?: string;
      /**
       * @default "colorless"
       */
      errorFormat?: ErrorFormat;
      /**
       * @example
       * ```
       * // Defaults to stdout
       * log: ['query', 'info', 'warn', 'error']
       *
       * // Emit as events
       * log: [
       *   { emit: 'stdout', level: 'query' },
       *   { emit: 'stdout', level: 'info' },
       *   { emit: 'stdout', level: 'warn' }
       *   { emit: 'stdout', level: 'error' }
       * ]
       * ```
       * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
       */
      log?: (LogLevel | LogDefinition)[];
      /**
       * The default values for transactionOptions
       * maxWait ?= 2000
       * timeout ?= 5000
       */
      transactionOptions?: {
         maxWait?: number;
         timeout?: number;
         isolationLevel?: Prisma.TransactionIsolationLevel;
      };
      /**
       * Global configuration for omitting model fields by default.
       *
       * @example
       * ```
       * const prisma = new PrismaClient({
       *   omit: {
       *     user: {
       *       password: true
       *     }
       *   }
       * })
       * ```
       */
      omit?: Prisma.GlobalOmitConfig;
   }
   export type GlobalOmitConfig = {
      user?: UserOmit;
      post?: PostOmit;
      company?: CompanyOmit;
      team?: TeamOmit;
      onboarding?: OnboardingOmit;
   };

   /* Types for Logging */
   export type LogLevel = 'info' | 'query' | 'warn' | 'error';
   export type LogDefinition = {
      level: LogLevel;
      emit: 'stdout' | 'event';
   };

   export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition
      ? T['emit'] extends 'event'
         ? T['level']
         : never
      : never;
   export type GetEvents<T extends any> =
      T extends Array<LogLevel | LogDefinition>
         ? GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
         : never;

   export type QueryEvent = {
      timestamp: Date;
      query: string;
      params: string;
      duration: number;
      target: string;
   };

   export type LogEvent = {
      timestamp: Date;
      message: string;
      target: string;
   };
   /* End Types for Logging */

   export type PrismaAction =
      | 'findUnique'
      | 'findUniqueOrThrow'
      | 'findMany'
      | 'findFirst'
      | 'findFirstOrThrow'
      | 'create'
      | 'createMany'
      | 'createManyAndReturn'
      | 'update'
      | 'updateMany'
      | 'updateManyAndReturn'
      | 'upsert'
      | 'delete'
      | 'deleteMany'
      | 'executeRaw'
      | 'queryRaw'
      | 'aggregate'
      | 'count'
      | 'runCommandRaw'
      | 'findRaw'
      | 'groupBy';

   /**
    * These options are being passed into the middleware as "params"
    */
   export type MiddlewareParams = {
      model?: ModelName;
      action: PrismaAction;
      args: any;
      dataPath: string[];
      runInTransaction: boolean;
   };

   /**
    * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
    */
   export type Middleware<T = any> = (
      params: MiddlewareParams,
      next: (params: MiddlewareParams) => $Utils.JsPromise<T>
   ) => $Utils.JsPromise<T>;

   // tested in getLogLevel.test.ts
   export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

   /**
    * `PrismaClient` proxy available in interactive transactions.
    */
   export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>;

   export type Datasource = {
      url?: string;
   };

   /**
    * Count Types
    */

   /**
    * Count Type UserCountOutputType
    */

   export type UserCountOutputType = {
      posts: number;
   };

   export type UserCountOutputTypeSelect<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
   > = {
      posts?: boolean | UserCountOutputTypeCountPostsArgs;
   };

   // Custom InputTypes
   /**
    * UserCountOutputType without action
    */
   export type UserCountOutputTypeDefaultArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
   > = {
      /**
       * Select specific fields to fetch from the UserCountOutputType
       */
      select?: UserCountOutputTypeSelect<ExtArgs> | null;
   };

   /**
    * UserCountOutputType without action
    */
   export type UserCountOutputTypeCountPostsArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
   > = {
      where?: PostWhereInput;
   };

   /**
    * Count Type CompanyCountOutputType
    */

   export type CompanyCountOutputType = {
      teams: number;
      onboardings: number;
   };

   export type CompanyCountOutputTypeSelect<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
   > = {
      teams?: boolean | CompanyCountOutputTypeCountTeamsArgs;
      onboardings?: boolean | CompanyCountOutputTypeCountOnboardingsArgs;
   };

   // Custom InputTypes
   /**
    * CompanyCountOutputType without action
    */
   export type CompanyCountOutputTypeDefaultArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
   > = {
      /**
       * Select specific fields to fetch from the CompanyCountOutputType
       */
      select?: CompanyCountOutputTypeSelect<ExtArgs> | null;
   };

   /**
    * CompanyCountOutputType without action
    */
   export type CompanyCountOutputTypeCountTeamsArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
   > = {
      where?: TeamWhereInput;
   };

   /**
    * CompanyCountOutputType without action
    */
   export type CompanyCountOutputTypeCountOnboardingsArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
   > = {
      where?: OnboardingWhereInput;
   };

   /**
    * Count Type TeamCountOutputType
    */

   export type TeamCountOutputType = {
      onboardings: number;
   };

   export type TeamCountOutputTypeSelect<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
   > = {
      onboardings?: boolean | TeamCountOutputTypeCountOnboardingsArgs;
   };

   // Custom InputTypes
   /**
    * TeamCountOutputType without action
    */
   export type TeamCountOutputTypeDefaultArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
   > = {
      /**
       * Select specific fields to fetch from the TeamCountOutputType
       */
      select?: TeamCountOutputTypeSelect<ExtArgs> | null;
   };

   /**
    * TeamCountOutputType without action
    */
   export type TeamCountOutputTypeCountOnboardingsArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
   > = {
      where?: OnboardingWhereInput;
   };

   /**
    * Models
    */

   /**
    * Model User
    */

   export type AggregateUser = {
      _count: UserCountAggregateOutputType | null;
      _avg: UserAvgAggregateOutputType | null;
      _sum: UserSumAggregateOutputType | null;
      _min: UserMinAggregateOutputType | null;
      _max: UserMaxAggregateOutputType | null;
   };

   export type UserAvgAggregateOutputType = {
      id: number | null;
   };

   export type UserSumAggregateOutputType = {
      id: number | null;
   };

   export type UserMinAggregateOutputType = {
      id: number | null;
      email: string | null;
      name: string | null;
   };

   export type UserMaxAggregateOutputType = {
      id: number | null;
      email: string | null;
      name: string | null;
   };

   export type UserCountAggregateOutputType = {
      id: number;
      email: number;
      name: number;
      _all: number;
   };

   export type UserAvgAggregateInputType = {
      id?: true;
   };

   export type UserSumAggregateInputType = {
      id?: true;
   };

   export type UserMinAggregateInputType = {
      id?: true;
      email?: true;
      name?: true;
   };

   export type UserMaxAggregateInputType = {
      id?: true;
      email?: true;
      name?: true;
   };

   export type UserCountAggregateInputType = {
      id?: true;
      email?: true;
      name?: true;
      _all?: true;
   };

   export type UserAggregateArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
   > = {
      /**
       * Filter which User to aggregate.
       */
      where?: UserWhereInput;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
       *
       * Determine the order of Users to fetch.
       */
      orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[];
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
       *
       * Sets the start position
       */
      cursor?: UserWhereUniqueInput;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
       *
       * Take `±n` Users from the position of the cursor.
       */
      take?: number;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
       *
       * Skip the first `n` Users.
       */
      skip?: number;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
       *
       * Count returned Users
       **/
      _count?: true | UserCountAggregateInputType;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
       *
       * Select which fields to average
       **/
      _avg?: UserAvgAggregateInputType;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
       *
       * Select which fields to sum
       **/
      _sum?: UserSumAggregateInputType;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
       *
       * Select which fields to find the minimum value
       **/
      _min?: UserMinAggregateInputType;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
       *
       * Select which fields to find the maximum value
       **/
      _max?: UserMaxAggregateInputType;
   };

   export type GetUserAggregateType<T extends UserAggregateArgs> = {
      [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
         ? T[P] extends true
            ? number
            : GetScalarType<T[P], AggregateUser[P]>
         : GetScalarType<T[P], AggregateUser[P]>;
   };

   export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
      {
         where?: UserWhereInput;
         orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[];
         by: UserScalarFieldEnum[] | UserScalarFieldEnum;
         having?: UserScalarWhereWithAggregatesInput;
         take?: number;
         skip?: number;
         _count?: UserCountAggregateInputType | true;
         _avg?: UserAvgAggregateInputType;
         _sum?: UserSumAggregateInputType;
         _min?: UserMinAggregateInputType;
         _max?: UserMaxAggregateInputType;
      };

   export type UserGroupByOutputType = {
      id: number;
      email: string;
      name: string | null;
      _count: UserCountAggregateOutputType | null;
      _avg: UserAvgAggregateOutputType | null;
      _sum: UserSumAggregateOutputType | null;
      _min: UserMinAggregateOutputType | null;
      _max: UserMaxAggregateOutputType | null;
   };

   type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
      Array<
         PickEnumerable<UserGroupByOutputType, T['by']> & {
            [P in keyof T & keyof UserGroupByOutputType]: P extends '_count'
               ? T[P] extends boolean
                  ? number
                  : GetScalarType<T[P], UserGroupByOutputType[P]>
               : GetScalarType<T[P], UserGroupByOutputType[P]>;
         }
      >
   >;

   export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
      $Extensions.GetSelect<
         {
            id?: boolean;
            email?: boolean;
            name?: boolean;
            posts?: boolean | User$postsArgs<ExtArgs>;
            _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>;
         },
         ExtArgs['result']['user']
      >;

   export type UserSelectCreateManyAndReturn<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
   > = $Extensions.GetSelect<
      {
         id?: boolean;
         email?: boolean;
         name?: boolean;
      },
      ExtArgs['result']['user']
   >;

   export type UserSelectUpdateManyAndReturn<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
   > = $Extensions.GetSelect<
      {
         id?: boolean;
         email?: boolean;
         name?: boolean;
      },
      ExtArgs['result']['user']
   >;

   export type UserSelectScalar = {
      id?: boolean;
      email?: boolean;
      name?: boolean;
   };

   export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
      $Extensions.GetOmit<'id' | 'email' | 'name', ExtArgs['result']['user']>;
   export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
      posts?: boolean | User$postsArgs<ExtArgs>;
      _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>;
   };
   export type UserIncludeCreateManyAndReturn<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
   > = {};
   export type UserIncludeUpdateManyAndReturn<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
   > = {};

   export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
      name: 'User';
      objects: {
         posts: Prisma.$PostPayload<ExtArgs>[];
      };
      scalars: $Extensions.GetPayloadResult<
         {
            id: number;
            email: string;
            name: string | null;
         },
         ExtArgs['result']['user']
      >;
      composites: {};
   };

   type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<
      Prisma.$UserPayload,
      S
   >;

   type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = Omit<
      UserFindManyArgs,
      'select' | 'include' | 'distinct' | 'omit'
   > & {
      select?: UserCountAggregateInputType | true;
   };

   export interface UserDelegate<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
      GlobalOmitOptions = {},
   > {
      [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User']; meta: { name: 'User' } };
      /**
       * Find zero or one User that matches the filter.
       * @param {UserFindUniqueArgs} args - Arguments to find a User
       * @example
       * // Get one User
       * const user = await prisma.user.findUnique({
       *   where: {
       *     // ... provide filter here
       *   }
       * })
       */
      findUnique<T extends UserFindUniqueArgs>(
         args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>
      ): Prisma__UserClient<
         $Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'findUnique', GlobalOmitOptions> | null,
         null,
         ExtArgs,
         GlobalOmitOptions
      >;

      /**
       * Find one User that matches the filter or throw an error with `error.code='P2025'`
       * if no matches were found.
       * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
       * @example
       * // Get one User
       * const user = await prisma.user.findUniqueOrThrow({
       *   where: {
       *     // ... provide filter here
       *   }
       * })
       */
      findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(
         args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>
      ): Prisma__UserClient<
         $Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'findUniqueOrThrow', GlobalOmitOptions>,
         never,
         ExtArgs,
         GlobalOmitOptions
      >;

      /**
       * Find the first User that matches the filter.
       * Note, that providing `undefined` is treated as the value not being there.
       * Read more here: https://pris.ly/d/null-undefined
       * @param {UserFindFirstArgs} args - Arguments to find a User
       * @example
       * // Get one User
       * const user = await prisma.user.findFirst({
       *   where: {
       *     // ... provide filter here
       *   }
       * })
       */
      findFirst<T extends UserFindFirstArgs>(
         args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>
      ): Prisma__UserClient<
         $Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'findFirst', GlobalOmitOptions> | null,
         null,
         ExtArgs,
         GlobalOmitOptions
      >;

      /**
       * Find the first User that matches the filter or
       * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
       * Note, that providing `undefined` is treated as the value not being there.
       * Read more here: https://pris.ly/d/null-undefined
       * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
       * @example
       * // Get one User
       * const user = await prisma.user.findFirstOrThrow({
       *   where: {
       *     // ... provide filter here
       *   }
       * })
       */
      findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(
         args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>
      ): Prisma__UserClient<
         $Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'findFirstOrThrow', GlobalOmitOptions>,
         never,
         ExtArgs,
         GlobalOmitOptions
      >;

      /**
       * Find zero or more Users that matches the filter.
       * Note, that providing `undefined` is treated as the value not being there.
       * Read more here: https://pris.ly/d/null-undefined
       * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
       * @example
       * // Get all Users
       * const users = await prisma.user.findMany()
       *
       * // Get first 10 Users
       * const users = await prisma.user.findMany({ take: 10 })
       *
       * // Only select the `id`
       * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
       *
       */
      findMany<T extends UserFindManyArgs>(
         args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>
      ): Prisma.PrismaPromise<
         $Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions>
      >;

      /**
       * Create a User.
       * @param {UserCreateArgs} args - Arguments to create a User.
       * @example
       * // Create one User
       * const User = await prisma.user.create({
       *   data: {
       *     // ... data to create a User
       *   }
       * })
       *
       */
      create<T extends UserCreateArgs>(
         args: SelectSubset<T, UserCreateArgs<ExtArgs>>
      ): Prisma__UserClient<
         $Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'create', GlobalOmitOptions>,
         never,
         ExtArgs,
         GlobalOmitOptions
      >;

      /**
       * Create many Users.
       * @param {UserCreateManyArgs} args - Arguments to create many Users.
       * @example
       * // Create many Users
       * const user = await prisma.user.createMany({
       *   data: [
       *     // ... provide data here
       *   ]
       * })
       *
       */
      createMany<T extends UserCreateManyArgs>(
         args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>
      ): Prisma.PrismaPromise<BatchPayload>;

      /**
       * Create many Users and returns the data saved in the database.
       * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
       * @example
       * // Create many Users
       * const user = await prisma.user.createManyAndReturn({
       *   data: [
       *     // ... provide data here
       *   ]
       * })
       *
       * // Create many Users and only return the `id`
       * const userWithIdOnly = await prisma.user.createManyAndReturn({
       *   select: { id: true },
       *   data: [
       *     // ... provide data here
       *   ]
       * })
       * Note, that providing `undefined` is treated as the value not being there.
       * Read more here: https://pris.ly/d/null-undefined
       *
       */
      createManyAndReturn<T extends UserCreateManyAndReturnArgs>(
         args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>
      ): Prisma.PrismaPromise<
         $Result.GetResult<
            Prisma.$UserPayload<ExtArgs>,
            T,
            'createManyAndReturn',
            GlobalOmitOptions
         >
      >;

      /**
       * Delete a User.
       * @param {UserDeleteArgs} args - Arguments to delete one User.
       * @example
       * // Delete one User
       * const User = await prisma.user.delete({
       *   where: {
       *     // ... filter to delete one User
       *   }
       * })
       *
       */
      delete<T extends UserDeleteArgs>(
         args: SelectSubset<T, UserDeleteArgs<ExtArgs>>
      ): Prisma__UserClient<
         $Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'delete', GlobalOmitOptions>,
         never,
         ExtArgs,
         GlobalOmitOptions
      >;

      /**
       * Update one User.
       * @param {UserUpdateArgs} args - Arguments to update one User.
       * @example
       * // Update one User
       * const user = await prisma.user.update({
       *   where: {
       *     // ... provide filter here
       *   },
       *   data: {
       *     // ... provide data here
       *   }
       * })
       *
       */
      update<T extends UserUpdateArgs>(
         args: SelectSubset<T, UserUpdateArgs<ExtArgs>>
      ): Prisma__UserClient<
         $Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'update', GlobalOmitOptions>,
         never,
         ExtArgs,
         GlobalOmitOptions
      >;

      /**
       * Delete zero or more Users.
       * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
       * @example
       * // Delete a few Users
       * const { count } = await prisma.user.deleteMany({
       *   where: {
       *     // ... provide filter here
       *   }
       * })
       *
       */
      deleteMany<T extends UserDeleteManyArgs>(
         args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>
      ): Prisma.PrismaPromise<BatchPayload>;

      /**
       * Update zero or more Users.
       * Note, that providing `undefined` is treated as the value not being there.
       * Read more here: https://pris.ly/d/null-undefined
       * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
       * @example
       * // Update many Users
       * const user = await prisma.user.updateMany({
       *   where: {
       *     // ... provide filter here
       *   },
       *   data: {
       *     // ... provide data here
       *   }
       * })
       *
       */
      updateMany<T extends UserUpdateManyArgs>(
         args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>
      ): Prisma.PrismaPromise<BatchPayload>;

      /**
       * Update zero or more Users and returns the data updated in the database.
       * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
       * @example
       * // Update many Users
       * const user = await prisma.user.updateManyAndReturn({
       *   where: {
       *     // ... provide filter here
       *   },
       *   data: [
       *     // ... provide data here
       *   ]
       * })
       *
       * // Update zero or more Users and only return the `id`
       * const userWithIdOnly = await prisma.user.updateManyAndReturn({
       *   select: { id: true },
       *   where: {
       *     // ... provide filter here
       *   },
       *   data: [
       *     // ... provide data here
       *   ]
       * })
       * Note, that providing `undefined` is treated as the value not being there.
       * Read more here: https://pris.ly/d/null-undefined
       *
       */
      updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(
         args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>
      ): Prisma.PrismaPromise<
         $Result.GetResult<
            Prisma.$UserPayload<ExtArgs>,
            T,
            'updateManyAndReturn',
            GlobalOmitOptions
         >
      >;

      /**
       * Create or update one User.
       * @param {UserUpsertArgs} args - Arguments to update or create a User.
       * @example
       * // Update or create a User
       * const user = await prisma.user.upsert({
       *   create: {
       *     // ... data to create a User
       *   },
       *   update: {
       *     // ... in case it already exists, update
       *   },
       *   where: {
       *     // ... the filter for the User we want to update
       *   }
       * })
       */
      upsert<T extends UserUpsertArgs>(
         args: SelectSubset<T, UserUpsertArgs<ExtArgs>>
      ): Prisma__UserClient<
         $Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'upsert', GlobalOmitOptions>,
         never,
         ExtArgs,
         GlobalOmitOptions
      >;

      /**
       * Count the number of Users.
       * Note, that providing `undefined` is treated as the value not being there.
       * Read more here: https://pris.ly/d/null-undefined
       * @param {UserCountArgs} args - Arguments to filter Users to count.
       * @example
       * // Count the number of Users
       * const count = await prisma.user.count({
       *   where: {
       *     // ... the filter for the Users we want to count
       *   }
       * })
       **/
      count<T extends UserCountArgs>(
         args?: Subset<T, UserCountArgs>
      ): Prisma.PrismaPromise<
         T extends $Utils.Record<'select', any>
            ? T['select'] extends true
               ? number
               : GetScalarType<T['select'], UserCountAggregateOutputType>
            : number
      >;

      /**
       * Allows you to perform aggregations operations on a User.
       * Note, that providing `undefined` is treated as the value not being there.
       * Read more here: https://pris.ly/d/null-undefined
       * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
       * @example
       * // Ordered by age ascending
       * // Where email contains prisma.io
       * // Limited to the 10 users
       * const aggregations = await prisma.user.aggregate({
       *   _avg: {
       *     age: true,
       *   },
       *   where: {
       *     email: {
       *       contains: "prisma.io",
       *     },
       *   },
       *   orderBy: {
       *     age: "asc",
       *   },
       *   take: 10,
       * })
       **/
      aggregate<T extends UserAggregateArgs>(
         args: Subset<T, UserAggregateArgs>
      ): Prisma.PrismaPromise<GetUserAggregateType<T>>;

      /**
       * Group by User.
       * Note, that providing `undefined` is treated as the value not being there.
       * Read more here: https://pris.ly/d/null-undefined
       * @param {UserGroupByArgs} args - Group by arguments.
       * @example
       * // Group by city, order by createdAt, get count
       * const result = await prisma.user.groupBy({
       *   by: ['city', 'createdAt'],
       *   orderBy: {
       *     createdAt: true
       *   },
       *   _count: {
       *     _all: true
       *   },
       * })
       *
       **/
      groupBy<
         T extends UserGroupByArgs,
         HasSelectOrTake extends Or<Extends<'skip', Keys<T>>, Extends<'take', Keys<T>>>,
         OrderByArg extends True extends HasSelectOrTake
            ? { orderBy: UserGroupByArgs['orderBy'] }
            : { orderBy?: UserGroupByArgs['orderBy'] },
         OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
         ByFields extends MaybeTupleToUnion<T['by']>,
         ByValid extends Has<ByFields, OrderFields>,
         HavingFields extends GetHavingFields<T['having']>,
         HavingValid extends Has<ByFields, HavingFields>,
         ByEmpty extends T['by'] extends never[] ? True : False,
         InputErrors extends ByEmpty extends True
            ? `Error: "by" must not be empty.`
            : HavingValid extends False
              ? {
                   [P in HavingFields]: P extends ByFields
                      ? never
                      : P extends string
                        ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                        : [Error, 'Field ', P, ` in "having" needs to be provided in "by"`];
                }[HavingFields]
              : 'take' extends Keys<T>
                ? 'orderBy' extends Keys<T>
                   ? ByValid extends True
                      ? {}
                      : {
                           [P in OrderFields]: P extends ByFields
                              ? never
                              : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                        }[OrderFields]
                   : 'Error: If you provide "take", you also need to provide "orderBy"'
                : 'skip' extends Keys<T>
                  ? 'orderBy' extends Keys<T>
                     ? ByValid extends True
                        ? {}
                        : {
                             [P in OrderFields]: P extends ByFields
                                ? never
                                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                          }[OrderFields]
                     : 'Error: If you provide "skip", you also need to provide "orderBy"'
                  : ByValid extends True
                    ? {}
                    : {
                         [P in OrderFields]: P extends ByFields
                            ? never
                            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                      }[OrderFields],
      >(
         args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors
      ): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
      /**
       * Fields of the User model
       */
      readonly fields: UserFieldRefs;
   }

   /**
    * The delegate class that acts as a "Promise-like" for User.
    * Why is this prefixed with `Prisma__`?
    * Because we want to prevent naming conflicts as mentioned in
    * https://github.com/prisma/prisma-client-js/issues/707
    */
   export interface Prisma__UserClient<
      T,
      Null = never,
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
      GlobalOmitOptions = {},
   > extends Prisma.PrismaPromise<T> {
      readonly [Symbol.toStringTag]: 'PrismaPromise';
      posts<T extends User$postsArgs<ExtArgs> = {}>(
         args?: Subset<T, User$postsArgs<ExtArgs>>
      ): Prisma.PrismaPromise<
         $Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions> | Null
      >;
      /**
       * Attaches callbacks for the resolution and/or rejection of the Promise.
       * @param onfulfilled The callback to execute when the Promise is resolved.
       * @param onrejected The callback to execute when the Promise is rejected.
       * @returns A Promise for the completion of which ever callback is executed.
       */
      then<TResult1 = T, TResult2 = never>(
         onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
         onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
      ): $Utils.JsPromise<TResult1 | TResult2>;
      /**
       * Attaches a callback for only the rejection of the Promise.
       * @param onrejected The callback to execute when the Promise is rejected.
       * @returns A Promise for the completion of the callback.
       */
      catch<TResult = never>(
         onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null
      ): $Utils.JsPromise<T | TResult>;
      /**
       * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
       * resolved value cannot be modified from the callback.
       * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
       * @returns A Promise for the completion of the callback.
       */
      finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
   }

   /**
    * Fields of the User model
    */
   interface UserFieldRefs {
      readonly id: FieldRef<'User', 'Int'>;
      readonly email: FieldRef<'User', 'String'>;
      readonly name: FieldRef<'User', 'String'>;
   }

   // Custom InputTypes
   /**
    * User findUnique
    */
   export type UserFindUniqueArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
   > = {
      /**
       * Select specific fields to fetch from the User
       */
      select?: UserSelect<ExtArgs> | null;
      /**
       * Omit specific fields from the User
       */
      omit?: UserOmit<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: UserInclude<ExtArgs> | null;
      /**
       * Filter, which User to fetch.
       */
      where: UserWhereUniqueInput;
   };

   /**
    * User findUniqueOrThrow
    */
   export type UserFindUniqueOrThrowArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
   > = {
      /**
       * Select specific fields to fetch from the User
       */
      select?: UserSelect<ExtArgs> | null;
      /**
       * Omit specific fields from the User
       */
      omit?: UserOmit<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: UserInclude<ExtArgs> | null;
      /**
       * Filter, which User to fetch.
       */
      where: UserWhereUniqueInput;
   };

   /**
    * User findFirst
    */
   export type UserFindFirstArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
   > = {
      /**
       * Select specific fields to fetch from the User
       */
      select?: UserSelect<ExtArgs> | null;
      /**
       * Omit specific fields from the User
       */
      omit?: UserOmit<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: UserInclude<ExtArgs> | null;
      /**
       * Filter, which User to fetch.
       */
      where?: UserWhereInput;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
       *
       * Determine the order of Users to fetch.
       */
      orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[];
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
       *
       * Sets the position for searching for Users.
       */
      cursor?: UserWhereUniqueInput;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
       *
       * Take `±n` Users from the position of the cursor.
       */
      take?: number;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
       *
       * Skip the first `n` Users.
       */
      skip?: number;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
       *
       * Filter by unique combinations of Users.
       */
      distinct?: UserScalarFieldEnum | UserScalarFieldEnum[];
   };

   /**
    * User findFirstOrThrow
    */
   export type UserFindFirstOrThrowArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
   > = {
      /**
       * Select specific fields to fetch from the User
       */
      select?: UserSelect<ExtArgs> | null;
      /**
       * Omit specific fields from the User
       */
      omit?: UserOmit<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: UserInclude<ExtArgs> | null;
      /**
       * Filter, which User to fetch.
       */
      where?: UserWhereInput;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
       *
       * Determine the order of Users to fetch.
       */
      orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[];
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
       *
       * Sets the position for searching for Users.
       */
      cursor?: UserWhereUniqueInput;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
       *
       * Take `±n` Users from the position of the cursor.
       */
      take?: number;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
       *
       * Skip the first `n` Users.
       */
      skip?: number;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
       *
       * Filter by unique combinations of Users.
       */
      distinct?: UserScalarFieldEnum | UserScalarFieldEnum[];
   };

   /**
    * User findMany
    */
   export type UserFindManyArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
   > = {
      /**
       * Select specific fields to fetch from the User
       */
      select?: UserSelect<ExtArgs> | null;
      /**
       * Omit specific fields from the User
       */
      omit?: UserOmit<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: UserInclude<ExtArgs> | null;
      /**
       * Filter, which Users to fetch.
       */
      where?: UserWhereInput;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
       *
       * Determine the order of Users to fetch.
       */
      orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[];
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
       *
       * Sets the position for listing Users.
       */
      cursor?: UserWhereUniqueInput;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
       *
       * Take `±n` Users from the position of the cursor.
       */
      take?: number;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
       *
       * Skip the first `n` Users.
       */
      skip?: number;
      distinct?: UserScalarFieldEnum | UserScalarFieldEnum[];
   };

   /**
    * User create
    */
   export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
      {
         /**
          * Select specific fields to fetch from the User
          */
         select?: UserSelect<ExtArgs> | null;
         /**
          * Omit specific fields from the User
          */
         omit?: UserOmit<ExtArgs> | null;
         /**
          * Choose, which related nodes to fetch as well
          */
         include?: UserInclude<ExtArgs> | null;
         /**
          * The data needed to create a User.
          */
         data: XOR<UserCreateInput, UserUncheckedCreateInput>;
      };

   /**
    * User createMany
    */
   export type UserCreateManyArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
   > = {
      /**
       * The data used to create many Users.
       */
      data: UserCreateManyInput | UserCreateManyInput[];
      skipDuplicates?: boolean;
   };

   /**
    * User createManyAndReturn
    */
   export type UserCreateManyAndReturnArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
   > = {
      /**
       * Select specific fields to fetch from the User
       */
      select?: UserSelectCreateManyAndReturn<ExtArgs> | null;
      /**
       * Omit specific fields from the User
       */
      omit?: UserOmit<ExtArgs> | null;
      /**
       * The data used to create many Users.
       */
      data: UserCreateManyInput | UserCreateManyInput[];
      skipDuplicates?: boolean;
   };

   /**
    * User update
    */
   export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
      {
         /**
          * Select specific fields to fetch from the User
          */
         select?: UserSelect<ExtArgs> | null;
         /**
          * Omit specific fields from the User
          */
         omit?: UserOmit<ExtArgs> | null;
         /**
          * Choose, which related nodes to fetch as well
          */
         include?: UserInclude<ExtArgs> | null;
         /**
          * The data needed to update a User.
          */
         data: XOR<UserUpdateInput, UserUncheckedUpdateInput>;
         /**
          * Choose, which User to update.
          */
         where: UserWhereUniqueInput;
      };

   /**
    * User updateMany
    */
   export type UserUpdateManyArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
   > = {
      /**
       * The data used to update Users.
       */
      data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>;
      /**
       * Filter which Users to update
       */
      where?: UserWhereInput;
      /**
       * Limit how many Users to update.
       */
      limit?: number;
   };

   /**
    * User updateManyAndReturn
    */
   export type UserUpdateManyAndReturnArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
   > = {
      /**
       * Select specific fields to fetch from the User
       */
      select?: UserSelectUpdateManyAndReturn<ExtArgs> | null;
      /**
       * Omit specific fields from the User
       */
      omit?: UserOmit<ExtArgs> | null;
      /**
       * The data used to update Users.
       */
      data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>;
      /**
       * Filter which Users to update
       */
      where?: UserWhereInput;
      /**
       * Limit how many Users to update.
       */
      limit?: number;
   };

   /**
    * User upsert
    */
   export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
      {
         /**
          * Select specific fields to fetch from the User
          */
         select?: UserSelect<ExtArgs> | null;
         /**
          * Omit specific fields from the User
          */
         omit?: UserOmit<ExtArgs> | null;
         /**
          * Choose, which related nodes to fetch as well
          */
         include?: UserInclude<ExtArgs> | null;
         /**
          * The filter to search for the User to update in case it exists.
          */
         where: UserWhereUniqueInput;
         /**
          * In case the User found by the `where` argument doesn't exist, create a new User with this data.
          */
         create: XOR<UserCreateInput, UserUncheckedCreateInput>;
         /**
          * In case the User was found with the provided `where` argument, update it with this data.
          */
         update: XOR<UserUpdateInput, UserUncheckedUpdateInput>;
      };

   /**
    * User delete
    */
   export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
      {
         /**
          * Select specific fields to fetch from the User
          */
         select?: UserSelect<ExtArgs> | null;
         /**
          * Omit specific fields from the User
          */
         omit?: UserOmit<ExtArgs> | null;
         /**
          * Choose, which related nodes to fetch as well
          */
         include?: UserInclude<ExtArgs> | null;
         /**
          * Filter which User to delete.
          */
         where: UserWhereUniqueInput;
      };

   /**
    * User deleteMany
    */
   export type UserDeleteManyArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
   > = {
      /**
       * Filter which Users to delete
       */
      where?: UserWhereInput;
      /**
       * Limit how many Users to delete.
       */
      limit?: number;
   };

   /**
    * User.posts
    */
   export type User$postsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
      {
         /**
          * Select specific fields to fetch from the Post
          */
         select?: PostSelect<ExtArgs> | null;
         /**
          * Omit specific fields from the Post
          */
         omit?: PostOmit<ExtArgs> | null;
         /**
          * Choose, which related nodes to fetch as well
          */
         include?: PostInclude<ExtArgs> | null;
         where?: PostWhereInput;
         orderBy?: PostOrderByWithRelationInput | PostOrderByWithRelationInput[];
         cursor?: PostWhereUniqueInput;
         take?: number;
         skip?: number;
         distinct?: PostScalarFieldEnum | PostScalarFieldEnum[];
      };

   /**
    * User without action
    */
   export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
      {
         /**
          * Select specific fields to fetch from the User
          */
         select?: UserSelect<ExtArgs> | null;
         /**
          * Omit specific fields from the User
          */
         omit?: UserOmit<ExtArgs> | null;
         /**
          * Choose, which related nodes to fetch as well
          */
         include?: UserInclude<ExtArgs> | null;
      };

   /**
    * Model Post
    */

   export type AggregatePost = {
      _count: PostCountAggregateOutputType | null;
      _avg: PostAvgAggregateOutputType | null;
      _sum: PostSumAggregateOutputType | null;
      _min: PostMinAggregateOutputType | null;
      _max: PostMaxAggregateOutputType | null;
   };

   export type PostAvgAggregateOutputType = {
      id: number | null;
      authorId: number | null;
   };

   export type PostSumAggregateOutputType = {
      id: number | null;
      authorId: number | null;
   };

   export type PostMinAggregateOutputType = {
      id: number | null;
      title: string | null;
      content: string | null;
      published: boolean | null;
      authorId: number | null;
   };

   export type PostMaxAggregateOutputType = {
      id: number | null;
      title: string | null;
      content: string | null;
      published: boolean | null;
      authorId: number | null;
   };

   export type PostCountAggregateOutputType = {
      id: number;
      title: number;
      content: number;
      published: number;
      authorId: number;
      _all: number;
   };

   export type PostAvgAggregateInputType = {
      id?: true;
      authorId?: true;
   };

   export type PostSumAggregateInputType = {
      id?: true;
      authorId?: true;
   };

   export type PostMinAggregateInputType = {
      id?: true;
      title?: true;
      content?: true;
      published?: true;
      authorId?: true;
   };

   export type PostMaxAggregateInputType = {
      id?: true;
      title?: true;
      content?: true;
      published?: true;
      authorId?: true;
   };

   export type PostCountAggregateInputType = {
      id?: true;
      title?: true;
      content?: true;
      published?: true;
      authorId?: true;
      _all?: true;
   };

   export type PostAggregateArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
   > = {
      /**
       * Filter which Post to aggregate.
       */
      where?: PostWhereInput;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
       *
       * Determine the order of Posts to fetch.
       */
      orderBy?: PostOrderByWithRelationInput | PostOrderByWithRelationInput[];
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
       *
       * Sets the start position
       */
      cursor?: PostWhereUniqueInput;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
       *
       * Take `±n` Posts from the position of the cursor.
       */
      take?: number;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
       *
       * Skip the first `n` Posts.
       */
      skip?: number;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
       *
       * Count returned Posts
       **/
      _count?: true | PostCountAggregateInputType;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
       *
       * Select which fields to average
       **/
      _avg?: PostAvgAggregateInputType;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
       *
       * Select which fields to sum
       **/
      _sum?: PostSumAggregateInputType;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
       *
       * Select which fields to find the minimum value
       **/
      _min?: PostMinAggregateInputType;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
       *
       * Select which fields to find the maximum value
       **/
      _max?: PostMaxAggregateInputType;
   };

   export type GetPostAggregateType<T extends PostAggregateArgs> = {
      [P in keyof T & keyof AggregatePost]: P extends '_count' | 'count'
         ? T[P] extends true
            ? number
            : GetScalarType<T[P], AggregatePost[P]>
         : GetScalarType<T[P], AggregatePost[P]>;
   };

   export type PostGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
      {
         where?: PostWhereInput;
         orderBy?: PostOrderByWithAggregationInput | PostOrderByWithAggregationInput[];
         by: PostScalarFieldEnum[] | PostScalarFieldEnum;
         having?: PostScalarWhereWithAggregatesInput;
         take?: number;
         skip?: number;
         _count?: PostCountAggregateInputType | true;
         _avg?: PostAvgAggregateInputType;
         _sum?: PostSumAggregateInputType;
         _min?: PostMinAggregateInputType;
         _max?: PostMaxAggregateInputType;
      };

   export type PostGroupByOutputType = {
      id: number;
      title: string;
      content: string | null;
      published: boolean;
      authorId: number;
      _count: PostCountAggregateOutputType | null;
      _avg: PostAvgAggregateOutputType | null;
      _sum: PostSumAggregateOutputType | null;
      _min: PostMinAggregateOutputType | null;
      _max: PostMaxAggregateOutputType | null;
   };

   type GetPostGroupByPayload<T extends PostGroupByArgs> = Prisma.PrismaPromise<
      Array<
         PickEnumerable<PostGroupByOutputType, T['by']> & {
            [P in keyof T & keyof PostGroupByOutputType]: P extends '_count'
               ? T[P] extends boolean
                  ? number
                  : GetScalarType<T[P], PostGroupByOutputType[P]>
               : GetScalarType<T[P], PostGroupByOutputType[P]>;
         }
      >
   >;

   export type PostSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
      $Extensions.GetSelect<
         {
            id?: boolean;
            title?: boolean;
            content?: boolean;
            published?: boolean;
            authorId?: boolean;
            author?: boolean | UserDefaultArgs<ExtArgs>;
         },
         ExtArgs['result']['post']
      >;

   export type PostSelectCreateManyAndReturn<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
   > = $Extensions.GetSelect<
      {
         id?: boolean;
         title?: boolean;
         content?: boolean;
         published?: boolean;
         authorId?: boolean;
         author?: boolean | UserDefaultArgs<ExtArgs>;
      },
      ExtArgs['result']['post']
   >;

   export type PostSelectUpdateManyAndReturn<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
   > = $Extensions.GetSelect<
      {
         id?: boolean;
         title?: boolean;
         content?: boolean;
         published?: boolean;
         authorId?: boolean;
         author?: boolean | UserDefaultArgs<ExtArgs>;
      },
      ExtArgs['result']['post']
   >;

   export type PostSelectScalar = {
      id?: boolean;
      title?: boolean;
      content?: boolean;
      published?: boolean;
      authorId?: boolean;
   };

   export type PostOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
      $Extensions.GetOmit<
         'id' | 'title' | 'content' | 'published' | 'authorId',
         ExtArgs['result']['post']
      >;
   export type PostInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
      author?: boolean | UserDefaultArgs<ExtArgs>;
   };
   export type PostIncludeCreateManyAndReturn<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
   > = {
      author?: boolean | UserDefaultArgs<ExtArgs>;
   };
   export type PostIncludeUpdateManyAndReturn<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
   > = {
      author?: boolean | UserDefaultArgs<ExtArgs>;
   };

   export type $PostPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
      name: 'Post';
      objects: {
         author: Prisma.$UserPayload<ExtArgs>;
      };
      scalars: $Extensions.GetPayloadResult<
         {
            id: number;
            title: string;
            content: string | null;
            published: boolean;
            authorId: number;
         },
         ExtArgs['result']['post']
      >;
      composites: {};
   };

   type PostGetPayload<S extends boolean | null | undefined | PostDefaultArgs> = $Result.GetResult<
      Prisma.$PostPayload,
      S
   >;

   type PostCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = Omit<
      PostFindManyArgs,
      'select' | 'include' | 'distinct' | 'omit'
   > & {
      select?: PostCountAggregateInputType | true;
   };

   export interface PostDelegate<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
      GlobalOmitOptions = {},
   > {
      [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Post']; meta: { name: 'Post' } };
      /**
       * Find zero or one Post that matches the filter.
       * @param {PostFindUniqueArgs} args - Arguments to find a Post
       * @example
       * // Get one Post
       * const post = await prisma.post.findUnique({
       *   where: {
       *     // ... provide filter here
       *   }
       * })
       */
      findUnique<T extends PostFindUniqueArgs>(
         args: SelectSubset<T, PostFindUniqueArgs<ExtArgs>>
      ): Prisma__PostClient<
         $Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, 'findUnique', GlobalOmitOptions> | null,
         null,
         ExtArgs,
         GlobalOmitOptions
      >;

      /**
       * Find one Post that matches the filter or throw an error with `error.code='P2025'`
       * if no matches were found.
       * @param {PostFindUniqueOrThrowArgs} args - Arguments to find a Post
       * @example
       * // Get one Post
       * const post = await prisma.post.findUniqueOrThrow({
       *   where: {
       *     // ... provide filter here
       *   }
       * })
       */
      findUniqueOrThrow<T extends PostFindUniqueOrThrowArgs>(
         args: SelectSubset<T, PostFindUniqueOrThrowArgs<ExtArgs>>
      ): Prisma__PostClient<
         $Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, 'findUniqueOrThrow', GlobalOmitOptions>,
         never,
         ExtArgs,
         GlobalOmitOptions
      >;

      /**
       * Find the first Post that matches the filter.
       * Note, that providing `undefined` is treated as the value not being there.
       * Read more here: https://pris.ly/d/null-undefined
       * @param {PostFindFirstArgs} args - Arguments to find a Post
       * @example
       * // Get one Post
       * const post = await prisma.post.findFirst({
       *   where: {
       *     // ... provide filter here
       *   }
       * })
       */
      findFirst<T extends PostFindFirstArgs>(
         args?: SelectSubset<T, PostFindFirstArgs<ExtArgs>>
      ): Prisma__PostClient<
         $Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, 'findFirst', GlobalOmitOptions> | null,
         null,
         ExtArgs,
         GlobalOmitOptions
      >;

      /**
       * Find the first Post that matches the filter or
       * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
       * Note, that providing `undefined` is treated as the value not being there.
       * Read more here: https://pris.ly/d/null-undefined
       * @param {PostFindFirstOrThrowArgs} args - Arguments to find a Post
       * @example
       * // Get one Post
       * const post = await prisma.post.findFirstOrThrow({
       *   where: {
       *     // ... provide filter here
       *   }
       * })
       */
      findFirstOrThrow<T extends PostFindFirstOrThrowArgs>(
         args?: SelectSubset<T, PostFindFirstOrThrowArgs<ExtArgs>>
      ): Prisma__PostClient<
         $Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, 'findFirstOrThrow', GlobalOmitOptions>,
         never,
         ExtArgs,
         GlobalOmitOptions
      >;

      /**
       * Find zero or more Posts that matches the filter.
       * Note, that providing `undefined` is treated as the value not being there.
       * Read more here: https://pris.ly/d/null-undefined
       * @param {PostFindManyArgs} args - Arguments to filter and select certain fields only.
       * @example
       * // Get all Posts
       * const posts = await prisma.post.findMany()
       *
       * // Get first 10 Posts
       * const posts = await prisma.post.findMany({ take: 10 })
       *
       * // Only select the `id`
       * const postWithIdOnly = await prisma.post.findMany({ select: { id: true } })
       *
       */
      findMany<T extends PostFindManyArgs>(
         args?: SelectSubset<T, PostFindManyArgs<ExtArgs>>
      ): Prisma.PrismaPromise<
         $Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions>
      >;

      /**
       * Create a Post.
       * @param {PostCreateArgs} args - Arguments to create a Post.
       * @example
       * // Create one Post
       * const Post = await prisma.post.create({
       *   data: {
       *     // ... data to create a Post
       *   }
       * })
       *
       */
      create<T extends PostCreateArgs>(
         args: SelectSubset<T, PostCreateArgs<ExtArgs>>
      ): Prisma__PostClient<
         $Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, 'create', GlobalOmitOptions>,
         never,
         ExtArgs,
         GlobalOmitOptions
      >;

      /**
       * Create many Posts.
       * @param {PostCreateManyArgs} args - Arguments to create many Posts.
       * @example
       * // Create many Posts
       * const post = await prisma.post.createMany({
       *   data: [
       *     // ... provide data here
       *   ]
       * })
       *
       */
      createMany<T extends PostCreateManyArgs>(
         args?: SelectSubset<T, PostCreateManyArgs<ExtArgs>>
      ): Prisma.PrismaPromise<BatchPayload>;

      /**
       * Create many Posts and returns the data saved in the database.
       * @param {PostCreateManyAndReturnArgs} args - Arguments to create many Posts.
       * @example
       * // Create many Posts
       * const post = await prisma.post.createManyAndReturn({
       *   data: [
       *     // ... provide data here
       *   ]
       * })
       *
       * // Create many Posts and only return the `id`
       * const postWithIdOnly = await prisma.post.createManyAndReturn({
       *   select: { id: true },
       *   data: [
       *     // ... provide data here
       *   ]
       * })
       * Note, that providing `undefined` is treated as the value not being there.
       * Read more here: https://pris.ly/d/null-undefined
       *
       */
      createManyAndReturn<T extends PostCreateManyAndReturnArgs>(
         args?: SelectSubset<T, PostCreateManyAndReturnArgs<ExtArgs>>
      ): Prisma.PrismaPromise<
         $Result.GetResult<
            Prisma.$PostPayload<ExtArgs>,
            T,
            'createManyAndReturn',
            GlobalOmitOptions
         >
      >;

      /**
       * Delete a Post.
       * @param {PostDeleteArgs} args - Arguments to delete one Post.
       * @example
       * // Delete one Post
       * const Post = await prisma.post.delete({
       *   where: {
       *     // ... filter to delete one Post
       *   }
       * })
       *
       */
      delete<T extends PostDeleteArgs>(
         args: SelectSubset<T, PostDeleteArgs<ExtArgs>>
      ): Prisma__PostClient<
         $Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, 'delete', GlobalOmitOptions>,
         never,
         ExtArgs,
         GlobalOmitOptions
      >;

      /**
       * Update one Post.
       * @param {PostUpdateArgs} args - Arguments to update one Post.
       * @example
       * // Update one Post
       * const post = await prisma.post.update({
       *   where: {
       *     // ... provide filter here
       *   },
       *   data: {
       *     // ... provide data here
       *   }
       * })
       *
       */
      update<T extends PostUpdateArgs>(
         args: SelectSubset<T, PostUpdateArgs<ExtArgs>>
      ): Prisma__PostClient<
         $Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, 'update', GlobalOmitOptions>,
         never,
         ExtArgs,
         GlobalOmitOptions
      >;

      /**
       * Delete zero or more Posts.
       * @param {PostDeleteManyArgs} args - Arguments to filter Posts to delete.
       * @example
       * // Delete a few Posts
       * const { count } = await prisma.post.deleteMany({
       *   where: {
       *     // ... provide filter here
       *   }
       * })
       *
       */
      deleteMany<T extends PostDeleteManyArgs>(
         args?: SelectSubset<T, PostDeleteManyArgs<ExtArgs>>
      ): Prisma.PrismaPromise<BatchPayload>;

      /**
       * Update zero or more Posts.
       * Note, that providing `undefined` is treated as the value not being there.
       * Read more here: https://pris.ly/d/null-undefined
       * @param {PostUpdateManyArgs} args - Arguments to update one or more rows.
       * @example
       * // Update many Posts
       * const post = await prisma.post.updateMany({
       *   where: {
       *     // ... provide filter here
       *   },
       *   data: {
       *     // ... provide data here
       *   }
       * })
       *
       */
      updateMany<T extends PostUpdateManyArgs>(
         args: SelectSubset<T, PostUpdateManyArgs<ExtArgs>>
      ): Prisma.PrismaPromise<BatchPayload>;

      /**
       * Update zero or more Posts and returns the data updated in the database.
       * @param {PostUpdateManyAndReturnArgs} args - Arguments to update many Posts.
       * @example
       * // Update many Posts
       * const post = await prisma.post.updateManyAndReturn({
       *   where: {
       *     // ... provide filter here
       *   },
       *   data: [
       *     // ... provide data here
       *   ]
       * })
       *
       * // Update zero or more Posts and only return the `id`
       * const postWithIdOnly = await prisma.post.updateManyAndReturn({
       *   select: { id: true },
       *   where: {
       *     // ... provide filter here
       *   },
       *   data: [
       *     // ... provide data here
       *   ]
       * })
       * Note, that providing `undefined` is treated as the value not being there.
       * Read more here: https://pris.ly/d/null-undefined
       *
       */
      updateManyAndReturn<T extends PostUpdateManyAndReturnArgs>(
         args: SelectSubset<T, PostUpdateManyAndReturnArgs<ExtArgs>>
      ): Prisma.PrismaPromise<
         $Result.GetResult<
            Prisma.$PostPayload<ExtArgs>,
            T,
            'updateManyAndReturn',
            GlobalOmitOptions
         >
      >;

      /**
       * Create or update one Post.
       * @param {PostUpsertArgs} args - Arguments to update or create a Post.
       * @example
       * // Update or create a Post
       * const post = await prisma.post.upsert({
       *   create: {
       *     // ... data to create a Post
       *   },
       *   update: {
       *     // ... in case it already exists, update
       *   },
       *   where: {
       *     // ... the filter for the Post we want to update
       *   }
       * })
       */
      upsert<T extends PostUpsertArgs>(
         args: SelectSubset<T, PostUpsertArgs<ExtArgs>>
      ): Prisma__PostClient<
         $Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, 'upsert', GlobalOmitOptions>,
         never,
         ExtArgs,
         GlobalOmitOptions
      >;

      /**
       * Count the number of Posts.
       * Note, that providing `undefined` is treated as the value not being there.
       * Read more here: https://pris.ly/d/null-undefined
       * @param {PostCountArgs} args - Arguments to filter Posts to count.
       * @example
       * // Count the number of Posts
       * const count = await prisma.post.count({
       *   where: {
       *     // ... the filter for the Posts we want to count
       *   }
       * })
       **/
      count<T extends PostCountArgs>(
         args?: Subset<T, PostCountArgs>
      ): Prisma.PrismaPromise<
         T extends $Utils.Record<'select', any>
            ? T['select'] extends true
               ? number
               : GetScalarType<T['select'], PostCountAggregateOutputType>
            : number
      >;

      /**
       * Allows you to perform aggregations operations on a Post.
       * Note, that providing `undefined` is treated as the value not being there.
       * Read more here: https://pris.ly/d/null-undefined
       * @param {PostAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
       * @example
       * // Ordered by age ascending
       * // Where email contains prisma.io
       * // Limited to the 10 users
       * const aggregations = await prisma.user.aggregate({
       *   _avg: {
       *     age: true,
       *   },
       *   where: {
       *     email: {
       *       contains: "prisma.io",
       *     },
       *   },
       *   orderBy: {
       *     age: "asc",
       *   },
       *   take: 10,
       * })
       **/
      aggregate<T extends PostAggregateArgs>(
         args: Subset<T, PostAggregateArgs>
      ): Prisma.PrismaPromise<GetPostAggregateType<T>>;

      /**
       * Group by Post.
       * Note, that providing `undefined` is treated as the value not being there.
       * Read more here: https://pris.ly/d/null-undefined
       * @param {PostGroupByArgs} args - Group by arguments.
       * @example
       * // Group by city, order by createdAt, get count
       * const result = await prisma.user.groupBy({
       *   by: ['city', 'createdAt'],
       *   orderBy: {
       *     createdAt: true
       *   },
       *   _count: {
       *     _all: true
       *   },
       * })
       *
       **/
      groupBy<
         T extends PostGroupByArgs,
         HasSelectOrTake extends Or<Extends<'skip', Keys<T>>, Extends<'take', Keys<T>>>,
         OrderByArg extends True extends HasSelectOrTake
            ? { orderBy: PostGroupByArgs['orderBy'] }
            : { orderBy?: PostGroupByArgs['orderBy'] },
         OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
         ByFields extends MaybeTupleToUnion<T['by']>,
         ByValid extends Has<ByFields, OrderFields>,
         HavingFields extends GetHavingFields<T['having']>,
         HavingValid extends Has<ByFields, HavingFields>,
         ByEmpty extends T['by'] extends never[] ? True : False,
         InputErrors extends ByEmpty extends True
            ? `Error: "by" must not be empty.`
            : HavingValid extends False
              ? {
                   [P in HavingFields]: P extends ByFields
                      ? never
                      : P extends string
                        ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                        : [Error, 'Field ', P, ` in "having" needs to be provided in "by"`];
                }[HavingFields]
              : 'take' extends Keys<T>
                ? 'orderBy' extends Keys<T>
                   ? ByValid extends True
                      ? {}
                      : {
                           [P in OrderFields]: P extends ByFields
                              ? never
                              : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                        }[OrderFields]
                   : 'Error: If you provide "take", you also need to provide "orderBy"'
                : 'skip' extends Keys<T>
                  ? 'orderBy' extends Keys<T>
                     ? ByValid extends True
                        ? {}
                        : {
                             [P in OrderFields]: P extends ByFields
                                ? never
                                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                          }[OrderFields]
                     : 'Error: If you provide "skip", you also need to provide "orderBy"'
                  : ByValid extends True
                    ? {}
                    : {
                         [P in OrderFields]: P extends ByFields
                            ? never
                            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                      }[OrderFields],
      >(
         args: SubsetIntersection<T, PostGroupByArgs, OrderByArg> & InputErrors
      ): {} extends InputErrors ? GetPostGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
      /**
       * Fields of the Post model
       */
      readonly fields: PostFieldRefs;
   }

   /**
    * The delegate class that acts as a "Promise-like" for Post.
    * Why is this prefixed with `Prisma__`?
    * Because we want to prevent naming conflicts as mentioned in
    * https://github.com/prisma/prisma-client-js/issues/707
    */
   export interface Prisma__PostClient<
      T,
      Null = never,
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
      GlobalOmitOptions = {},
   > extends Prisma.PrismaPromise<T> {
      readonly [Symbol.toStringTag]: 'PrismaPromise';
      author<T extends UserDefaultArgs<ExtArgs> = {}>(
         args?: Subset<T, UserDefaultArgs<ExtArgs>>
      ): Prisma__UserClient<
         | $Result.GetResult<
              Prisma.$UserPayload<ExtArgs>,
              T,
              'findUniqueOrThrow',
              GlobalOmitOptions
           >
         | Null,
         Null,
         ExtArgs,
         GlobalOmitOptions
      >;
      /**
       * Attaches callbacks for the resolution and/or rejection of the Promise.
       * @param onfulfilled The callback to execute when the Promise is resolved.
       * @param onrejected The callback to execute when the Promise is rejected.
       * @returns A Promise for the completion of which ever callback is executed.
       */
      then<TResult1 = T, TResult2 = never>(
         onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
         onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
      ): $Utils.JsPromise<TResult1 | TResult2>;
      /**
       * Attaches a callback for only the rejection of the Promise.
       * @param onrejected The callback to execute when the Promise is rejected.
       * @returns A Promise for the completion of the callback.
       */
      catch<TResult = never>(
         onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null
      ): $Utils.JsPromise<T | TResult>;
      /**
       * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
       * resolved value cannot be modified from the callback.
       * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
       * @returns A Promise for the completion of the callback.
       */
      finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
   }

   /**
    * Fields of the Post model
    */
   interface PostFieldRefs {
      readonly id: FieldRef<'Post', 'Int'>;
      readonly title: FieldRef<'Post', 'String'>;
      readonly content: FieldRef<'Post', 'String'>;
      readonly published: FieldRef<'Post', 'Boolean'>;
      readonly authorId: FieldRef<'Post', 'Int'>;
   }

   // Custom InputTypes
   /**
    * Post findUnique
    */
   export type PostFindUniqueArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
   > = {
      /**
       * Select specific fields to fetch from the Post
       */
      select?: PostSelect<ExtArgs> | null;
      /**
       * Omit specific fields from the Post
       */
      omit?: PostOmit<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: PostInclude<ExtArgs> | null;
      /**
       * Filter, which Post to fetch.
       */
      where: PostWhereUniqueInput;
   };

   /**
    * Post findUniqueOrThrow
    */
   export type PostFindUniqueOrThrowArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
   > = {
      /**
       * Select specific fields to fetch from the Post
       */
      select?: PostSelect<ExtArgs> | null;
      /**
       * Omit specific fields from the Post
       */
      omit?: PostOmit<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: PostInclude<ExtArgs> | null;
      /**
       * Filter, which Post to fetch.
       */
      where: PostWhereUniqueInput;
   };

   /**
    * Post findFirst
    */
   export type PostFindFirstArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
   > = {
      /**
       * Select specific fields to fetch from the Post
       */
      select?: PostSelect<ExtArgs> | null;
      /**
       * Omit specific fields from the Post
       */
      omit?: PostOmit<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: PostInclude<ExtArgs> | null;
      /**
       * Filter, which Post to fetch.
       */
      where?: PostWhereInput;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
       *
       * Determine the order of Posts to fetch.
       */
      orderBy?: PostOrderByWithRelationInput | PostOrderByWithRelationInput[];
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
       *
       * Sets the position for searching for Posts.
       */
      cursor?: PostWhereUniqueInput;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
       *
       * Take `±n` Posts from the position of the cursor.
       */
      take?: number;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
       *
       * Skip the first `n` Posts.
       */
      skip?: number;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
       *
       * Filter by unique combinations of Posts.
       */
      distinct?: PostScalarFieldEnum | PostScalarFieldEnum[];
   };

   /**
    * Post findFirstOrThrow
    */
   export type PostFindFirstOrThrowArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
   > = {
      /**
       * Select specific fields to fetch from the Post
       */
      select?: PostSelect<ExtArgs> | null;
      /**
       * Omit specific fields from the Post
       */
      omit?: PostOmit<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: PostInclude<ExtArgs> | null;
      /**
       * Filter, which Post to fetch.
       */
      where?: PostWhereInput;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
       *
       * Determine the order of Posts to fetch.
       */
      orderBy?: PostOrderByWithRelationInput | PostOrderByWithRelationInput[];
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
       *
       * Sets the position for searching for Posts.
       */
      cursor?: PostWhereUniqueInput;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
       *
       * Take `±n` Posts from the position of the cursor.
       */
      take?: number;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
       *
       * Skip the first `n` Posts.
       */
      skip?: number;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
       *
       * Filter by unique combinations of Posts.
       */
      distinct?: PostScalarFieldEnum | PostScalarFieldEnum[];
   };

   /**
    * Post findMany
    */
   export type PostFindManyArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
   > = {
      /**
       * Select specific fields to fetch from the Post
       */
      select?: PostSelect<ExtArgs> | null;
      /**
       * Omit specific fields from the Post
       */
      omit?: PostOmit<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: PostInclude<ExtArgs> | null;
      /**
       * Filter, which Posts to fetch.
       */
      where?: PostWhereInput;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
       *
       * Determine the order of Posts to fetch.
       */
      orderBy?: PostOrderByWithRelationInput | PostOrderByWithRelationInput[];
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
       *
       * Sets the position for listing Posts.
       */
      cursor?: PostWhereUniqueInput;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
       *
       * Take `±n` Posts from the position of the cursor.
       */
      take?: number;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
       *
       * Skip the first `n` Posts.
       */
      skip?: number;
      distinct?: PostScalarFieldEnum | PostScalarFieldEnum[];
   };

   /**
    * Post create
    */
   export type PostCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
      {
         /**
          * Select specific fields to fetch from the Post
          */
         select?: PostSelect<ExtArgs> | null;
         /**
          * Omit specific fields from the Post
          */
         omit?: PostOmit<ExtArgs> | null;
         /**
          * Choose, which related nodes to fetch as well
          */
         include?: PostInclude<ExtArgs> | null;
         /**
          * The data needed to create a Post.
          */
         data: XOR<PostCreateInput, PostUncheckedCreateInput>;
      };

   /**
    * Post createMany
    */
   export type PostCreateManyArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
   > = {
      /**
       * The data used to create many Posts.
       */
      data: PostCreateManyInput | PostCreateManyInput[];
      skipDuplicates?: boolean;
   };

   /**
    * Post createManyAndReturn
    */
   export type PostCreateManyAndReturnArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
   > = {
      /**
       * Select specific fields to fetch from the Post
       */
      select?: PostSelectCreateManyAndReturn<ExtArgs> | null;
      /**
       * Omit specific fields from the Post
       */
      omit?: PostOmit<ExtArgs> | null;
      /**
       * The data used to create many Posts.
       */
      data: PostCreateManyInput | PostCreateManyInput[];
      skipDuplicates?: boolean;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: PostIncludeCreateManyAndReturn<ExtArgs> | null;
   };

   /**
    * Post update
    */
   export type PostUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
      {
         /**
          * Select specific fields to fetch from the Post
          */
         select?: PostSelect<ExtArgs> | null;
         /**
          * Omit specific fields from the Post
          */
         omit?: PostOmit<ExtArgs> | null;
         /**
          * Choose, which related nodes to fetch as well
          */
         include?: PostInclude<ExtArgs> | null;
         /**
          * The data needed to update a Post.
          */
         data: XOR<PostUpdateInput, PostUncheckedUpdateInput>;
         /**
          * Choose, which Post to update.
          */
         where: PostWhereUniqueInput;
      };

   /**
    * Post updateMany
    */
   export type PostUpdateManyArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
   > = {
      /**
       * The data used to update Posts.
       */
      data: XOR<PostUpdateManyMutationInput, PostUncheckedUpdateManyInput>;
      /**
       * Filter which Posts to update
       */
      where?: PostWhereInput;
      /**
       * Limit how many Posts to update.
       */
      limit?: number;
   };

   /**
    * Post updateManyAndReturn
    */
   export type PostUpdateManyAndReturnArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
   > = {
      /**
       * Select specific fields to fetch from the Post
       */
      select?: PostSelectUpdateManyAndReturn<ExtArgs> | null;
      /**
       * Omit specific fields from the Post
       */
      omit?: PostOmit<ExtArgs> | null;
      /**
       * The data used to update Posts.
       */
      data: XOR<PostUpdateManyMutationInput, PostUncheckedUpdateManyInput>;
      /**
       * Filter which Posts to update
       */
      where?: PostWhereInput;
      /**
       * Limit how many Posts to update.
       */
      limit?: number;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: PostIncludeUpdateManyAndReturn<ExtArgs> | null;
   };

   /**
    * Post upsert
    */
   export type PostUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
      {
         /**
          * Select specific fields to fetch from the Post
          */
         select?: PostSelect<ExtArgs> | null;
         /**
          * Omit specific fields from the Post
          */
         omit?: PostOmit<ExtArgs> | null;
         /**
          * Choose, which related nodes to fetch as well
          */
         include?: PostInclude<ExtArgs> | null;
         /**
          * The filter to search for the Post to update in case it exists.
          */
         where: PostWhereUniqueInput;
         /**
          * In case the Post found by the `where` argument doesn't exist, create a new Post with this data.
          */
         create: XOR<PostCreateInput, PostUncheckedCreateInput>;
         /**
          * In case the Post was found with the provided `where` argument, update it with this data.
          */
         update: XOR<PostUpdateInput, PostUncheckedUpdateInput>;
      };

   /**
    * Post delete
    */
   export type PostDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
      {
         /**
          * Select specific fields to fetch from the Post
          */
         select?: PostSelect<ExtArgs> | null;
         /**
          * Omit specific fields from the Post
          */
         omit?: PostOmit<ExtArgs> | null;
         /**
          * Choose, which related nodes to fetch as well
          */
         include?: PostInclude<ExtArgs> | null;
         /**
          * Filter which Post to delete.
          */
         where: PostWhereUniqueInput;
      };

   /**
    * Post deleteMany
    */
   export type PostDeleteManyArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
   > = {
      /**
       * Filter which Posts to delete
       */
      where?: PostWhereInput;
      /**
       * Limit how many Posts to delete.
       */
      limit?: number;
   };

   /**
    * Post without action
    */
   export type PostDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
      {
         /**
          * Select specific fields to fetch from the Post
          */
         select?: PostSelect<ExtArgs> | null;
         /**
          * Omit specific fields from the Post
          */
         omit?: PostOmit<ExtArgs> | null;
         /**
          * Choose, which related nodes to fetch as well
          */
         include?: PostInclude<ExtArgs> | null;
      };

   /**
    * Model Company
    */

   export type AggregateCompany = {
      _count: CompanyCountAggregateOutputType | null;
      _min: CompanyMinAggregateOutputType | null;
      _max: CompanyMaxAggregateOutputType | null;
   };

   export type CompanyMinAggregateOutputType = {
      id: string | null;
      name: string | null;
      email: string | null;
      description: string | null;
      website: string | null;
      createdAt: Date | null;
      updatedAt: Date | null;
   };

   export type CompanyMaxAggregateOutputType = {
      id: string | null;
      name: string | null;
      email: string | null;
      description: string | null;
      website: string | null;
      createdAt: Date | null;
      updatedAt: Date | null;
   };

   export type CompanyCountAggregateOutputType = {
      id: number;
      name: number;
      email: number;
      description: number;
      website: number;
      createdAt: number;
      updatedAt: number;
      _all: number;
   };

   export type CompanyMinAggregateInputType = {
      id?: true;
      name?: true;
      email?: true;
      description?: true;
      website?: true;
      createdAt?: true;
      updatedAt?: true;
   };

   export type CompanyMaxAggregateInputType = {
      id?: true;
      name?: true;
      email?: true;
      description?: true;
      website?: true;
      createdAt?: true;
      updatedAt?: true;
   };

   export type CompanyCountAggregateInputType = {
      id?: true;
      name?: true;
      email?: true;
      description?: true;
      website?: true;
      createdAt?: true;
      updatedAt?: true;
      _all?: true;
   };

   export type CompanyAggregateArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
   > = {
      /**
       * Filter which Company to aggregate.
       */
      where?: CompanyWhereInput;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
       *
       * Determine the order of Companies to fetch.
       */
      orderBy?: CompanyOrderByWithRelationInput | CompanyOrderByWithRelationInput[];
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
       *
       * Sets the start position
       */
      cursor?: CompanyWhereUniqueInput;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
       *
       * Take `±n` Companies from the position of the cursor.
       */
      take?: number;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
       *
       * Skip the first `n` Companies.
       */
      skip?: number;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
       *
       * Count returned Companies
       **/
      _count?: true | CompanyCountAggregateInputType;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
       *
       * Select which fields to find the minimum value
       **/
      _min?: CompanyMinAggregateInputType;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
       *
       * Select which fields to find the maximum value
       **/
      _max?: CompanyMaxAggregateInputType;
   };

   export type GetCompanyAggregateType<T extends CompanyAggregateArgs> = {
      [P in keyof T & keyof AggregateCompany]: P extends '_count' | 'count'
         ? T[P] extends true
            ? number
            : GetScalarType<T[P], AggregateCompany[P]>
         : GetScalarType<T[P], AggregateCompany[P]>;
   };

   export type CompanyGroupByArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
   > = {
      where?: CompanyWhereInput;
      orderBy?: CompanyOrderByWithAggregationInput | CompanyOrderByWithAggregationInput[];
      by: CompanyScalarFieldEnum[] | CompanyScalarFieldEnum;
      having?: CompanyScalarWhereWithAggregatesInput;
      take?: number;
      skip?: number;
      _count?: CompanyCountAggregateInputType | true;
      _min?: CompanyMinAggregateInputType;
      _max?: CompanyMaxAggregateInputType;
   };

   export type CompanyGroupByOutputType = {
      id: string;
      name: string;
      email: string;
      description: string | null;
      website: string | null;
      createdAt: Date;
      updatedAt: Date;
      _count: CompanyCountAggregateOutputType | null;
      _min: CompanyMinAggregateOutputType | null;
      _max: CompanyMaxAggregateOutputType | null;
   };

   type GetCompanyGroupByPayload<T extends CompanyGroupByArgs> = Prisma.PrismaPromise<
      Array<
         PickEnumerable<CompanyGroupByOutputType, T['by']> & {
            [P in keyof T & keyof CompanyGroupByOutputType]: P extends '_count'
               ? T[P] extends boolean
                  ? number
                  : GetScalarType<T[P], CompanyGroupByOutputType[P]>
               : GetScalarType<T[P], CompanyGroupByOutputType[P]>;
         }
      >
   >;

   export type CompanySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
      $Extensions.GetSelect<
         {
            id?: boolean;
            name?: boolean;
            email?: boolean;
            description?: boolean;
            website?: boolean;
            createdAt?: boolean;
            updatedAt?: boolean;
            teams?: boolean | Company$teamsArgs<ExtArgs>;
            onboardings?: boolean | Company$onboardingsArgs<ExtArgs>;
            _count?: boolean | CompanyCountOutputTypeDefaultArgs<ExtArgs>;
         },
         ExtArgs['result']['company']
      >;

   export type CompanySelectCreateManyAndReturn<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
   > = $Extensions.GetSelect<
      {
         id?: boolean;
         name?: boolean;
         email?: boolean;
         description?: boolean;
         website?: boolean;
         createdAt?: boolean;
         updatedAt?: boolean;
      },
      ExtArgs['result']['company']
   >;

   export type CompanySelectUpdateManyAndReturn<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
   > = $Extensions.GetSelect<
      {
         id?: boolean;
         name?: boolean;
         email?: boolean;
         description?: boolean;
         website?: boolean;
         createdAt?: boolean;
         updatedAt?: boolean;
      },
      ExtArgs['result']['company']
   >;

   export type CompanySelectScalar = {
      id?: boolean;
      name?: boolean;
      email?: boolean;
      description?: boolean;
      website?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
   };

   export type CompanyOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
      $Extensions.GetOmit<
         'id' | 'name' | 'email' | 'description' | 'website' | 'createdAt' | 'updatedAt',
         ExtArgs['result']['company']
      >;
   export type CompanyInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
      {
         teams?: boolean | Company$teamsArgs<ExtArgs>;
         onboardings?: boolean | Company$onboardingsArgs<ExtArgs>;
         _count?: boolean | CompanyCountOutputTypeDefaultArgs<ExtArgs>;
      };
   export type CompanyIncludeCreateManyAndReturn<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
   > = {};
   export type CompanyIncludeUpdateManyAndReturn<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
   > = {};

   export type $CompanyPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
      {
         name: 'Company';
         objects: {
            teams: Prisma.$TeamPayload<ExtArgs>[];
            onboardings: Prisma.$OnboardingPayload<ExtArgs>[];
         };
         scalars: $Extensions.GetPayloadResult<
            {
               id: string;
               name: string;
               email: string;
               description: string | null;
               website: string | null;
               createdAt: Date;
               updatedAt: Date;
            },
            ExtArgs['result']['company']
         >;
         composites: {};
      };

   type CompanyGetPayload<S extends boolean | null | undefined | CompanyDefaultArgs> =
      $Result.GetResult<Prisma.$CompanyPayload, S>;

   type CompanyCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = Omit<
      CompanyFindManyArgs,
      'select' | 'include' | 'distinct' | 'omit'
   > & {
      select?: CompanyCountAggregateInputType | true;
   };

   export interface CompanyDelegate<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
      GlobalOmitOptions = {},
   > {
      [K: symbol]: {
         types: Prisma.TypeMap<ExtArgs>['model']['Company'];
         meta: { name: 'Company' };
      };
      /**
       * Find zero or one Company that matches the filter.
       * @param {CompanyFindUniqueArgs} args - Arguments to find a Company
       * @example
       * // Get one Company
       * const company = await prisma.company.findUnique({
       *   where: {
       *     // ... provide filter here
       *   }
       * })
       */
      findUnique<T extends CompanyFindUniqueArgs>(
         args: SelectSubset<T, CompanyFindUniqueArgs<ExtArgs>>
      ): Prisma__CompanyClient<
         $Result.GetResult<
            Prisma.$CompanyPayload<ExtArgs>,
            T,
            'findUnique',
            GlobalOmitOptions
         > | null,
         null,
         ExtArgs,
         GlobalOmitOptions
      >;

      /**
       * Find one Company that matches the filter or throw an error with `error.code='P2025'`
       * if no matches were found.
       * @param {CompanyFindUniqueOrThrowArgs} args - Arguments to find a Company
       * @example
       * // Get one Company
       * const company = await prisma.company.findUniqueOrThrow({
       *   where: {
       *     // ... provide filter here
       *   }
       * })
       */
      findUniqueOrThrow<T extends CompanyFindUniqueOrThrowArgs>(
         args: SelectSubset<T, CompanyFindUniqueOrThrowArgs<ExtArgs>>
      ): Prisma__CompanyClient<
         $Result.GetResult<
            Prisma.$CompanyPayload<ExtArgs>,
            T,
            'findUniqueOrThrow',
            GlobalOmitOptions
         >,
         never,
         ExtArgs,
         GlobalOmitOptions
      >;

      /**
       * Find the first Company that matches the filter.
       * Note, that providing `undefined` is treated as the value not being there.
       * Read more here: https://pris.ly/d/null-undefined
       * @param {CompanyFindFirstArgs} args - Arguments to find a Company
       * @example
       * // Get one Company
       * const company = await prisma.company.findFirst({
       *   where: {
       *     // ... provide filter here
       *   }
       * })
       */
      findFirst<T extends CompanyFindFirstArgs>(
         args?: SelectSubset<T, CompanyFindFirstArgs<ExtArgs>>
      ): Prisma__CompanyClient<
         $Result.GetResult<
            Prisma.$CompanyPayload<ExtArgs>,
            T,
            'findFirst',
            GlobalOmitOptions
         > | null,
         null,
         ExtArgs,
         GlobalOmitOptions
      >;

      /**
       * Find the first Company that matches the filter or
       * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
       * Note, that providing `undefined` is treated as the value not being there.
       * Read more here: https://pris.ly/d/null-undefined
       * @param {CompanyFindFirstOrThrowArgs} args - Arguments to find a Company
       * @example
       * // Get one Company
       * const company = await prisma.company.findFirstOrThrow({
       *   where: {
       *     // ... provide filter here
       *   }
       * })
       */
      findFirstOrThrow<T extends CompanyFindFirstOrThrowArgs>(
         args?: SelectSubset<T, CompanyFindFirstOrThrowArgs<ExtArgs>>
      ): Prisma__CompanyClient<
         $Result.GetResult<
            Prisma.$CompanyPayload<ExtArgs>,
            T,
            'findFirstOrThrow',
            GlobalOmitOptions
         >,
         never,
         ExtArgs,
         GlobalOmitOptions
      >;

      /**
       * Find zero or more Companies that matches the filter.
       * Note, that providing `undefined` is treated as the value not being there.
       * Read more here: https://pris.ly/d/null-undefined
       * @param {CompanyFindManyArgs} args - Arguments to filter and select certain fields only.
       * @example
       * // Get all Companies
       * const companies = await prisma.company.findMany()
       *
       * // Get first 10 Companies
       * const companies = await prisma.company.findMany({ take: 10 })
       *
       * // Only select the `id`
       * const companyWithIdOnly = await prisma.company.findMany({ select: { id: true } })
       *
       */
      findMany<T extends CompanyFindManyArgs>(
         args?: SelectSubset<T, CompanyFindManyArgs<ExtArgs>>
      ): Prisma.PrismaPromise<
         $Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions>
      >;

      /**
       * Create a Company.
       * @param {CompanyCreateArgs} args - Arguments to create a Company.
       * @example
       * // Create one Company
       * const Company = await prisma.company.create({
       *   data: {
       *     // ... data to create a Company
       *   }
       * })
       *
       */
      create<T extends CompanyCreateArgs>(
         args: SelectSubset<T, CompanyCreateArgs<ExtArgs>>
      ): Prisma__CompanyClient<
         $Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, 'create', GlobalOmitOptions>,
         never,
         ExtArgs,
         GlobalOmitOptions
      >;

      /**
       * Create many Companies.
       * @param {CompanyCreateManyArgs} args - Arguments to create many Companies.
       * @example
       * // Create many Companies
       * const company = await prisma.company.createMany({
       *   data: [
       *     // ... provide data here
       *   ]
       * })
       *
       */
      createMany<T extends CompanyCreateManyArgs>(
         args?: SelectSubset<T, CompanyCreateManyArgs<ExtArgs>>
      ): Prisma.PrismaPromise<BatchPayload>;

      /**
       * Create many Companies and returns the data saved in the database.
       * @param {CompanyCreateManyAndReturnArgs} args - Arguments to create many Companies.
       * @example
       * // Create many Companies
       * const company = await prisma.company.createManyAndReturn({
       *   data: [
       *     // ... provide data here
       *   ]
       * })
       *
       * // Create many Companies and only return the `id`
       * const companyWithIdOnly = await prisma.company.createManyAndReturn({
       *   select: { id: true },
       *   data: [
       *     // ... provide data here
       *   ]
       * })
       * Note, that providing `undefined` is treated as the value not being there.
       * Read more here: https://pris.ly/d/null-undefined
       *
       */
      createManyAndReturn<T extends CompanyCreateManyAndReturnArgs>(
         args?: SelectSubset<T, CompanyCreateManyAndReturnArgs<ExtArgs>>
      ): Prisma.PrismaPromise<
         $Result.GetResult<
            Prisma.$CompanyPayload<ExtArgs>,
            T,
            'createManyAndReturn',
            GlobalOmitOptions
         >
      >;

      /**
       * Delete a Company.
       * @param {CompanyDeleteArgs} args - Arguments to delete one Company.
       * @example
       * // Delete one Company
       * const Company = await prisma.company.delete({
       *   where: {
       *     // ... filter to delete one Company
       *   }
       * })
       *
       */
      delete<T extends CompanyDeleteArgs>(
         args: SelectSubset<T, CompanyDeleteArgs<ExtArgs>>
      ): Prisma__CompanyClient<
         $Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, 'delete', GlobalOmitOptions>,
         never,
         ExtArgs,
         GlobalOmitOptions
      >;

      /**
       * Update one Company.
       * @param {CompanyUpdateArgs} args - Arguments to update one Company.
       * @example
       * // Update one Company
       * const company = await prisma.company.update({
       *   where: {
       *     // ... provide filter here
       *   },
       *   data: {
       *     // ... provide data here
       *   }
       * })
       *
       */
      update<T extends CompanyUpdateArgs>(
         args: SelectSubset<T, CompanyUpdateArgs<ExtArgs>>
      ): Prisma__CompanyClient<
         $Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, 'update', GlobalOmitOptions>,
         never,
         ExtArgs,
         GlobalOmitOptions
      >;

      /**
       * Delete zero or more Companies.
       * @param {CompanyDeleteManyArgs} args - Arguments to filter Companies to delete.
       * @example
       * // Delete a few Companies
       * const { count } = await prisma.company.deleteMany({
       *   where: {
       *     // ... provide filter here
       *   }
       * })
       *
       */
      deleteMany<T extends CompanyDeleteManyArgs>(
         args?: SelectSubset<T, CompanyDeleteManyArgs<ExtArgs>>
      ): Prisma.PrismaPromise<BatchPayload>;

      /**
       * Update zero or more Companies.
       * Note, that providing `undefined` is treated as the value not being there.
       * Read more here: https://pris.ly/d/null-undefined
       * @param {CompanyUpdateManyArgs} args - Arguments to update one or more rows.
       * @example
       * // Update many Companies
       * const company = await prisma.company.updateMany({
       *   where: {
       *     // ... provide filter here
       *   },
       *   data: {
       *     // ... provide data here
       *   }
       * })
       *
       */
      updateMany<T extends CompanyUpdateManyArgs>(
         args: SelectSubset<T, CompanyUpdateManyArgs<ExtArgs>>
      ): Prisma.PrismaPromise<BatchPayload>;

      /**
       * Update zero or more Companies and returns the data updated in the database.
       * @param {CompanyUpdateManyAndReturnArgs} args - Arguments to update many Companies.
       * @example
       * // Update many Companies
       * const company = await prisma.company.updateManyAndReturn({
       *   where: {
       *     // ... provide filter here
       *   },
       *   data: [
       *     // ... provide data here
       *   ]
       * })
       *
       * // Update zero or more Companies and only return the `id`
       * const companyWithIdOnly = await prisma.company.updateManyAndReturn({
       *   select: { id: true },
       *   where: {
       *     // ... provide filter here
       *   },
       *   data: [
       *     // ... provide data here
       *   ]
       * })
       * Note, that providing `undefined` is treated as the value not being there.
       * Read more here: https://pris.ly/d/null-undefined
       *
       */
      updateManyAndReturn<T extends CompanyUpdateManyAndReturnArgs>(
         args: SelectSubset<T, CompanyUpdateManyAndReturnArgs<ExtArgs>>
      ): Prisma.PrismaPromise<
         $Result.GetResult<
            Prisma.$CompanyPayload<ExtArgs>,
            T,
            'updateManyAndReturn',
            GlobalOmitOptions
         >
      >;

      /**
       * Create or update one Company.
       * @param {CompanyUpsertArgs} args - Arguments to update or create a Company.
       * @example
       * // Update or create a Company
       * const company = await prisma.company.upsert({
       *   create: {
       *     // ... data to create a Company
       *   },
       *   update: {
       *     // ... in case it already exists, update
       *   },
       *   where: {
       *     // ... the filter for the Company we want to update
       *   }
       * })
       */
      upsert<T extends CompanyUpsertArgs>(
         args: SelectSubset<T, CompanyUpsertArgs<ExtArgs>>
      ): Prisma__CompanyClient<
         $Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, 'upsert', GlobalOmitOptions>,
         never,
         ExtArgs,
         GlobalOmitOptions
      >;

      /**
       * Count the number of Companies.
       * Note, that providing `undefined` is treated as the value not being there.
       * Read more here: https://pris.ly/d/null-undefined
       * @param {CompanyCountArgs} args - Arguments to filter Companies to count.
       * @example
       * // Count the number of Companies
       * const count = await prisma.company.count({
       *   where: {
       *     // ... the filter for the Companies we want to count
       *   }
       * })
       **/
      count<T extends CompanyCountArgs>(
         args?: Subset<T, CompanyCountArgs>
      ): Prisma.PrismaPromise<
         T extends $Utils.Record<'select', any>
            ? T['select'] extends true
               ? number
               : GetScalarType<T['select'], CompanyCountAggregateOutputType>
            : number
      >;

      /**
       * Allows you to perform aggregations operations on a Company.
       * Note, that providing `undefined` is treated as the value not being there.
       * Read more here: https://pris.ly/d/null-undefined
       * @param {CompanyAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
       * @example
       * // Ordered by age ascending
       * // Where email contains prisma.io
       * // Limited to the 10 users
       * const aggregations = await prisma.user.aggregate({
       *   _avg: {
       *     age: true,
       *   },
       *   where: {
       *     email: {
       *       contains: "prisma.io",
       *     },
       *   },
       *   orderBy: {
       *     age: "asc",
       *   },
       *   take: 10,
       * })
       **/
      aggregate<T extends CompanyAggregateArgs>(
         args: Subset<T, CompanyAggregateArgs>
      ): Prisma.PrismaPromise<GetCompanyAggregateType<T>>;

      /**
       * Group by Company.
       * Note, that providing `undefined` is treated as the value not being there.
       * Read more here: https://pris.ly/d/null-undefined
       * @param {CompanyGroupByArgs} args - Group by arguments.
       * @example
       * // Group by city, order by createdAt, get count
       * const result = await prisma.user.groupBy({
       *   by: ['city', 'createdAt'],
       *   orderBy: {
       *     createdAt: true
       *   },
       *   _count: {
       *     _all: true
       *   },
       * })
       *
       **/
      groupBy<
         T extends CompanyGroupByArgs,
         HasSelectOrTake extends Or<Extends<'skip', Keys<T>>, Extends<'take', Keys<T>>>,
         OrderByArg extends True extends HasSelectOrTake
            ? { orderBy: CompanyGroupByArgs['orderBy'] }
            : { orderBy?: CompanyGroupByArgs['orderBy'] },
         OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
         ByFields extends MaybeTupleToUnion<T['by']>,
         ByValid extends Has<ByFields, OrderFields>,
         HavingFields extends GetHavingFields<T['having']>,
         HavingValid extends Has<ByFields, HavingFields>,
         ByEmpty extends T['by'] extends never[] ? True : False,
         InputErrors extends ByEmpty extends True
            ? `Error: "by" must not be empty.`
            : HavingValid extends False
              ? {
                   [P in HavingFields]: P extends ByFields
                      ? never
                      : P extends string
                        ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                        : [Error, 'Field ', P, ` in "having" needs to be provided in "by"`];
                }[HavingFields]
              : 'take' extends Keys<T>
                ? 'orderBy' extends Keys<T>
                   ? ByValid extends True
                      ? {}
                      : {
                           [P in OrderFields]: P extends ByFields
                              ? never
                              : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                        }[OrderFields]
                   : 'Error: If you provide "take", you also need to provide "orderBy"'
                : 'skip' extends Keys<T>
                  ? 'orderBy' extends Keys<T>
                     ? ByValid extends True
                        ? {}
                        : {
                             [P in OrderFields]: P extends ByFields
                                ? never
                                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                          }[OrderFields]
                     : 'Error: If you provide "skip", you also need to provide "orderBy"'
                  : ByValid extends True
                    ? {}
                    : {
                         [P in OrderFields]: P extends ByFields
                            ? never
                            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                      }[OrderFields],
      >(
         args: SubsetIntersection<T, CompanyGroupByArgs, OrderByArg> & InputErrors
      ): {} extends InputErrors ? GetCompanyGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
      /**
       * Fields of the Company model
       */
      readonly fields: CompanyFieldRefs;
   }

   /**
    * The delegate class that acts as a "Promise-like" for Company.
    * Why is this prefixed with `Prisma__`?
    * Because we want to prevent naming conflicts as mentioned in
    * https://github.com/prisma/prisma-client-js/issues/707
    */
   export interface Prisma__CompanyClient<
      T,
      Null = never,
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
      GlobalOmitOptions = {},
   > extends Prisma.PrismaPromise<T> {
      readonly [Symbol.toStringTag]: 'PrismaPromise';
      teams<T extends Company$teamsArgs<ExtArgs> = {}>(
         args?: Subset<T, Company$teamsArgs<ExtArgs>>
      ): Prisma.PrismaPromise<
         $Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions> | Null
      >;
      onboardings<T extends Company$onboardingsArgs<ExtArgs> = {}>(
         args?: Subset<T, Company$onboardingsArgs<ExtArgs>>
      ): Prisma.PrismaPromise<
         | $Result.GetResult<Prisma.$OnboardingPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions>
         | Null
      >;
      /**
       * Attaches callbacks for the resolution and/or rejection of the Promise.
       * @param onfulfilled The callback to execute when the Promise is resolved.
       * @param onrejected The callback to execute when the Promise is rejected.
       * @returns A Promise for the completion of which ever callback is executed.
       */
      then<TResult1 = T, TResult2 = never>(
         onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
         onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
      ): $Utils.JsPromise<TResult1 | TResult2>;
      /**
       * Attaches a callback for only the rejection of the Promise.
       * @param onrejected The callback to execute when the Promise is rejected.
       * @returns A Promise for the completion of the callback.
       */
      catch<TResult = never>(
         onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null
      ): $Utils.JsPromise<T | TResult>;
      /**
       * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
       * resolved value cannot be modified from the callback.
       * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
       * @returns A Promise for the completion of the callback.
       */
      finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
   }

   /**
    * Fields of the Company model
    */
   interface CompanyFieldRefs {
      readonly id: FieldRef<'Company', 'String'>;
      readonly name: FieldRef<'Company', 'String'>;
      readonly email: FieldRef<'Company', 'String'>;
      readonly description: FieldRef<'Company', 'String'>;
      readonly website: FieldRef<'Company', 'String'>;
      readonly createdAt: FieldRef<'Company', 'DateTime'>;
      readonly updatedAt: FieldRef<'Company', 'DateTime'>;
   }

   // Custom InputTypes
   /**
    * Company findUnique
    */
   export type CompanyFindUniqueArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
   > = {
      /**
       * Select specific fields to fetch from the Company
       */
      select?: CompanySelect<ExtArgs> | null;
      /**
       * Omit specific fields from the Company
       */
      omit?: CompanyOmit<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: CompanyInclude<ExtArgs> | null;
      /**
       * Filter, which Company to fetch.
       */
      where: CompanyWhereUniqueInput;
   };

   /**
    * Company findUniqueOrThrow
    */
   export type CompanyFindUniqueOrThrowArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
   > = {
      /**
       * Select specific fields to fetch from the Company
       */
      select?: CompanySelect<ExtArgs> | null;
      /**
       * Omit specific fields from the Company
       */
      omit?: CompanyOmit<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: CompanyInclude<ExtArgs> | null;
      /**
       * Filter, which Company to fetch.
       */
      where: CompanyWhereUniqueInput;
   };

   /**
    * Company findFirst
    */
   export type CompanyFindFirstArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
   > = {
      /**
       * Select specific fields to fetch from the Company
       */
      select?: CompanySelect<ExtArgs> | null;
      /**
       * Omit specific fields from the Company
       */
      omit?: CompanyOmit<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: CompanyInclude<ExtArgs> | null;
      /**
       * Filter, which Company to fetch.
       */
      where?: CompanyWhereInput;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
       *
       * Determine the order of Companies to fetch.
       */
      orderBy?: CompanyOrderByWithRelationInput | CompanyOrderByWithRelationInput[];
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
       *
       * Sets the position for searching for Companies.
       */
      cursor?: CompanyWhereUniqueInput;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
       *
       * Take `±n` Companies from the position of the cursor.
       */
      take?: number;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
       *
       * Skip the first `n` Companies.
       */
      skip?: number;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
       *
       * Filter by unique combinations of Companies.
       */
      distinct?: CompanyScalarFieldEnum | CompanyScalarFieldEnum[];
   };

   /**
    * Company findFirstOrThrow
    */
   export type CompanyFindFirstOrThrowArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
   > = {
      /**
       * Select specific fields to fetch from the Company
       */
      select?: CompanySelect<ExtArgs> | null;
      /**
       * Omit specific fields from the Company
       */
      omit?: CompanyOmit<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: CompanyInclude<ExtArgs> | null;
      /**
       * Filter, which Company to fetch.
       */
      where?: CompanyWhereInput;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
       *
       * Determine the order of Companies to fetch.
       */
      orderBy?: CompanyOrderByWithRelationInput | CompanyOrderByWithRelationInput[];
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
       *
       * Sets the position for searching for Companies.
       */
      cursor?: CompanyWhereUniqueInput;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
       *
       * Take `±n` Companies from the position of the cursor.
       */
      take?: number;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
       *
       * Skip the first `n` Companies.
       */
      skip?: number;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
       *
       * Filter by unique combinations of Companies.
       */
      distinct?: CompanyScalarFieldEnum | CompanyScalarFieldEnum[];
   };

   /**
    * Company findMany
    */
   export type CompanyFindManyArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
   > = {
      /**
       * Select specific fields to fetch from the Company
       */
      select?: CompanySelect<ExtArgs> | null;
      /**
       * Omit specific fields from the Company
       */
      omit?: CompanyOmit<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: CompanyInclude<ExtArgs> | null;
      /**
       * Filter, which Companies to fetch.
       */
      where?: CompanyWhereInput;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
       *
       * Determine the order of Companies to fetch.
       */
      orderBy?: CompanyOrderByWithRelationInput | CompanyOrderByWithRelationInput[];
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
       *
       * Sets the position for listing Companies.
       */
      cursor?: CompanyWhereUniqueInput;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
       *
       * Take `±n` Companies from the position of the cursor.
       */
      take?: number;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
       *
       * Skip the first `n` Companies.
       */
      skip?: number;
      distinct?: CompanyScalarFieldEnum | CompanyScalarFieldEnum[];
   };

   /**
    * Company create
    */
   export type CompanyCreateArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
   > = {
      /**
       * Select specific fields to fetch from the Company
       */
      select?: CompanySelect<ExtArgs> | null;
      /**
       * Omit specific fields from the Company
       */
      omit?: CompanyOmit<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: CompanyInclude<ExtArgs> | null;
      /**
       * The data needed to create a Company.
       */
      data: XOR<CompanyCreateInput, CompanyUncheckedCreateInput>;
   };

   /**
    * Company createMany
    */
   export type CompanyCreateManyArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
   > = {
      /**
       * The data used to create many Companies.
       */
      data: CompanyCreateManyInput | CompanyCreateManyInput[];
      skipDuplicates?: boolean;
   };

   /**
    * Company createManyAndReturn
    */
   export type CompanyCreateManyAndReturnArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
   > = {
      /**
       * Select specific fields to fetch from the Company
       */
      select?: CompanySelectCreateManyAndReturn<ExtArgs> | null;
      /**
       * Omit specific fields from the Company
       */
      omit?: CompanyOmit<ExtArgs> | null;
      /**
       * The data used to create many Companies.
       */
      data: CompanyCreateManyInput | CompanyCreateManyInput[];
      skipDuplicates?: boolean;
   };

   /**
    * Company update
    */
   export type CompanyUpdateArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
   > = {
      /**
       * Select specific fields to fetch from the Company
       */
      select?: CompanySelect<ExtArgs> | null;
      /**
       * Omit specific fields from the Company
       */
      omit?: CompanyOmit<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: CompanyInclude<ExtArgs> | null;
      /**
       * The data needed to update a Company.
       */
      data: XOR<CompanyUpdateInput, CompanyUncheckedUpdateInput>;
      /**
       * Choose, which Company to update.
       */
      where: CompanyWhereUniqueInput;
   };

   /**
    * Company updateMany
    */
   export type CompanyUpdateManyArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
   > = {
      /**
       * The data used to update Companies.
       */
      data: XOR<CompanyUpdateManyMutationInput, CompanyUncheckedUpdateManyInput>;
      /**
       * Filter which Companies to update
       */
      where?: CompanyWhereInput;
      /**
       * Limit how many Companies to update.
       */
      limit?: number;
   };

   /**
    * Company updateManyAndReturn
    */
   export type CompanyUpdateManyAndReturnArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
   > = {
      /**
       * Select specific fields to fetch from the Company
       */
      select?: CompanySelectUpdateManyAndReturn<ExtArgs> | null;
      /**
       * Omit specific fields from the Company
       */
      omit?: CompanyOmit<ExtArgs> | null;
      /**
       * The data used to update Companies.
       */
      data: XOR<CompanyUpdateManyMutationInput, CompanyUncheckedUpdateManyInput>;
      /**
       * Filter which Companies to update
       */
      where?: CompanyWhereInput;
      /**
       * Limit how many Companies to update.
       */
      limit?: number;
   };

   /**
    * Company upsert
    */
   export type CompanyUpsertArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
   > = {
      /**
       * Select specific fields to fetch from the Company
       */
      select?: CompanySelect<ExtArgs> | null;
      /**
       * Omit specific fields from the Company
       */
      omit?: CompanyOmit<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: CompanyInclude<ExtArgs> | null;
      /**
       * The filter to search for the Company to update in case it exists.
       */
      where: CompanyWhereUniqueInput;
      /**
       * In case the Company found by the `where` argument doesn't exist, create a new Company with this data.
       */
      create: XOR<CompanyCreateInput, CompanyUncheckedCreateInput>;
      /**
       * In case the Company was found with the provided `where` argument, update it with this data.
       */
      update: XOR<CompanyUpdateInput, CompanyUncheckedUpdateInput>;
   };

   /**
    * Company delete
    */
   export type CompanyDeleteArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
   > = {
      /**
       * Select specific fields to fetch from the Company
       */
      select?: CompanySelect<ExtArgs> | null;
      /**
       * Omit specific fields from the Company
       */
      omit?: CompanyOmit<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: CompanyInclude<ExtArgs> | null;
      /**
       * Filter which Company to delete.
       */
      where: CompanyWhereUniqueInput;
   };

   /**
    * Company deleteMany
    */
   export type CompanyDeleteManyArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
   > = {
      /**
       * Filter which Companies to delete
       */
      where?: CompanyWhereInput;
      /**
       * Limit how many Companies to delete.
       */
      limit?: number;
   };

   /**
    * Company.teams
    */
   export type Company$teamsArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
   > = {
      /**
       * Select specific fields to fetch from the Team
       */
      select?: TeamSelect<ExtArgs> | null;
      /**
       * Omit specific fields from the Team
       */
      omit?: TeamOmit<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: TeamInclude<ExtArgs> | null;
      where?: TeamWhereInput;
      orderBy?: TeamOrderByWithRelationInput | TeamOrderByWithRelationInput[];
      cursor?: TeamWhereUniqueInput;
      take?: number;
      skip?: number;
      distinct?: TeamScalarFieldEnum | TeamScalarFieldEnum[];
   };

   /**
    * Company.onboardings
    */
   export type Company$onboardingsArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
   > = {
      /**
       * Select specific fields to fetch from the Onboarding
       */
      select?: OnboardingSelect<ExtArgs> | null;
      /**
       * Omit specific fields from the Onboarding
       */
      omit?: OnboardingOmit<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: OnboardingInclude<ExtArgs> | null;
      where?: OnboardingWhereInput;
      orderBy?: OnboardingOrderByWithRelationInput | OnboardingOrderByWithRelationInput[];
      cursor?: OnboardingWhereUniqueInput;
      take?: number;
      skip?: number;
      distinct?: OnboardingScalarFieldEnum | OnboardingScalarFieldEnum[];
   };

   /**
    * Company without action
    */
   export type CompanyDefaultArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
   > = {
      /**
       * Select specific fields to fetch from the Company
       */
      select?: CompanySelect<ExtArgs> | null;
      /**
       * Omit specific fields from the Company
       */
      omit?: CompanyOmit<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: CompanyInclude<ExtArgs> | null;
   };

   /**
    * Model Team
    */

   export type AggregateTeam = {
      _count: TeamCountAggregateOutputType | null;
      _min: TeamMinAggregateOutputType | null;
      _max: TeamMaxAggregateOutputType | null;
   };

   export type TeamMinAggregateOutputType = {
      id: string | null;
      name: string | null;
      description: string | null;
      createdAt: Date | null;
      updatedAt: Date | null;
      companyId: string | null;
   };

   export type TeamMaxAggregateOutputType = {
      id: string | null;
      name: string | null;
      description: string | null;
      createdAt: Date | null;
      updatedAt: Date | null;
      companyId: string | null;
   };

   export type TeamCountAggregateOutputType = {
      id: number;
      name: number;
      description: number;
      createdAt: number;
      updatedAt: number;
      companyId: number;
      _all: number;
   };

   export type TeamMinAggregateInputType = {
      id?: true;
      name?: true;
      description?: true;
      createdAt?: true;
      updatedAt?: true;
      companyId?: true;
   };

   export type TeamMaxAggregateInputType = {
      id?: true;
      name?: true;
      description?: true;
      createdAt?: true;
      updatedAt?: true;
      companyId?: true;
   };

   export type TeamCountAggregateInputType = {
      id?: true;
      name?: true;
      description?: true;
      createdAt?: true;
      updatedAt?: true;
      companyId?: true;
      _all?: true;
   };

   export type TeamAggregateArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
   > = {
      /**
       * Filter which Team to aggregate.
       */
      where?: TeamWhereInput;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
       *
       * Determine the order of Teams to fetch.
       */
      orderBy?: TeamOrderByWithRelationInput | TeamOrderByWithRelationInput[];
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
       *
       * Sets the start position
       */
      cursor?: TeamWhereUniqueInput;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
       *
       * Take `±n` Teams from the position of the cursor.
       */
      take?: number;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
       *
       * Skip the first `n` Teams.
       */
      skip?: number;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
       *
       * Count returned Teams
       **/
      _count?: true | TeamCountAggregateInputType;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
       *
       * Select which fields to find the minimum value
       **/
      _min?: TeamMinAggregateInputType;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
       *
       * Select which fields to find the maximum value
       **/
      _max?: TeamMaxAggregateInputType;
   };

   export type GetTeamAggregateType<T extends TeamAggregateArgs> = {
      [P in keyof T & keyof AggregateTeam]: P extends '_count' | 'count'
         ? T[P] extends true
            ? number
            : GetScalarType<T[P], AggregateTeam[P]>
         : GetScalarType<T[P], AggregateTeam[P]>;
   };

   export type TeamGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
      {
         where?: TeamWhereInput;
         orderBy?: TeamOrderByWithAggregationInput | TeamOrderByWithAggregationInput[];
         by: TeamScalarFieldEnum[] | TeamScalarFieldEnum;
         having?: TeamScalarWhereWithAggregatesInput;
         take?: number;
         skip?: number;
         _count?: TeamCountAggregateInputType | true;
         _min?: TeamMinAggregateInputType;
         _max?: TeamMaxAggregateInputType;
      };

   export type TeamGroupByOutputType = {
      id: string;
      name: string;
      description: string | null;
      createdAt: Date;
      updatedAt: Date;
      companyId: string;
      _count: TeamCountAggregateOutputType | null;
      _min: TeamMinAggregateOutputType | null;
      _max: TeamMaxAggregateOutputType | null;
   };

   type GetTeamGroupByPayload<T extends TeamGroupByArgs> = Prisma.PrismaPromise<
      Array<
         PickEnumerable<TeamGroupByOutputType, T['by']> & {
            [P in keyof T & keyof TeamGroupByOutputType]: P extends '_count'
               ? T[P] extends boolean
                  ? number
                  : GetScalarType<T[P], TeamGroupByOutputType[P]>
               : GetScalarType<T[P], TeamGroupByOutputType[P]>;
         }
      >
   >;

   export type TeamSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
      $Extensions.GetSelect<
         {
            id?: boolean;
            name?: boolean;
            description?: boolean;
            createdAt?: boolean;
            updatedAt?: boolean;
            companyId?: boolean;
            company?: boolean | CompanyDefaultArgs<ExtArgs>;
            onboardings?: boolean | Team$onboardingsArgs<ExtArgs>;
            _count?: boolean | TeamCountOutputTypeDefaultArgs<ExtArgs>;
         },
         ExtArgs['result']['team']
      >;

   export type TeamSelectCreateManyAndReturn<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
   > = $Extensions.GetSelect<
      {
         id?: boolean;
         name?: boolean;
         description?: boolean;
         createdAt?: boolean;
         updatedAt?: boolean;
         companyId?: boolean;
         company?: boolean | CompanyDefaultArgs<ExtArgs>;
      },
      ExtArgs['result']['team']
   >;

   export type TeamSelectUpdateManyAndReturn<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
   > = $Extensions.GetSelect<
      {
         id?: boolean;
         name?: boolean;
         description?: boolean;
         createdAt?: boolean;
         updatedAt?: boolean;
         companyId?: boolean;
         company?: boolean | CompanyDefaultArgs<ExtArgs>;
      },
      ExtArgs['result']['team']
   >;

   export type TeamSelectScalar = {
      id?: boolean;
      name?: boolean;
      description?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      companyId?: boolean;
   };

   export type TeamOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
      $Extensions.GetOmit<
         'id' | 'name' | 'description' | 'createdAt' | 'updatedAt' | 'companyId',
         ExtArgs['result']['team']
      >;
   export type TeamInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
      company?: boolean | CompanyDefaultArgs<ExtArgs>;
      onboardings?: boolean | Team$onboardingsArgs<ExtArgs>;
      _count?: boolean | TeamCountOutputTypeDefaultArgs<ExtArgs>;
   };
   export type TeamIncludeCreateManyAndReturn<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
   > = {
      company?: boolean | CompanyDefaultArgs<ExtArgs>;
   };
   export type TeamIncludeUpdateManyAndReturn<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
   > = {
      company?: boolean | CompanyDefaultArgs<ExtArgs>;
   };

   export type $TeamPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
      name: 'Team';
      objects: {
         company: Prisma.$CompanyPayload<ExtArgs>;
         onboardings: Prisma.$OnboardingPayload<ExtArgs>[];
      };
      scalars: $Extensions.GetPayloadResult<
         {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            companyId: string;
         },
         ExtArgs['result']['team']
      >;
      composites: {};
   };

   type TeamGetPayload<S extends boolean | null | undefined | TeamDefaultArgs> = $Result.GetResult<
      Prisma.$TeamPayload,
      S
   >;

   type TeamCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = Omit<
      TeamFindManyArgs,
      'select' | 'include' | 'distinct' | 'omit'
   > & {
      select?: TeamCountAggregateInputType | true;
   };

   export interface TeamDelegate<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
      GlobalOmitOptions = {},
   > {
      [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Team']; meta: { name: 'Team' } };
      /**
       * Find zero or one Team that matches the filter.
       * @param {TeamFindUniqueArgs} args - Arguments to find a Team
       * @example
       * // Get one Team
       * const team = await prisma.team.findUnique({
       *   where: {
       *     // ... provide filter here
       *   }
       * })
       */
      findUnique<T extends TeamFindUniqueArgs>(
         args: SelectSubset<T, TeamFindUniqueArgs<ExtArgs>>
      ): Prisma__TeamClient<
         $Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, 'findUnique', GlobalOmitOptions> | null,
         null,
         ExtArgs,
         GlobalOmitOptions
      >;

      /**
       * Find one Team that matches the filter or throw an error with `error.code='P2025'`
       * if no matches were found.
       * @param {TeamFindUniqueOrThrowArgs} args - Arguments to find a Team
       * @example
       * // Get one Team
       * const team = await prisma.team.findUniqueOrThrow({
       *   where: {
       *     // ... provide filter here
       *   }
       * })
       */
      findUniqueOrThrow<T extends TeamFindUniqueOrThrowArgs>(
         args: SelectSubset<T, TeamFindUniqueOrThrowArgs<ExtArgs>>
      ): Prisma__TeamClient<
         $Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, 'findUniqueOrThrow', GlobalOmitOptions>,
         never,
         ExtArgs,
         GlobalOmitOptions
      >;

      /**
       * Find the first Team that matches the filter.
       * Note, that providing `undefined` is treated as the value not being there.
       * Read more here: https://pris.ly/d/null-undefined
       * @param {TeamFindFirstArgs} args - Arguments to find a Team
       * @example
       * // Get one Team
       * const team = await prisma.team.findFirst({
       *   where: {
       *     // ... provide filter here
       *   }
       * })
       */
      findFirst<T extends TeamFindFirstArgs>(
         args?: SelectSubset<T, TeamFindFirstArgs<ExtArgs>>
      ): Prisma__TeamClient<
         $Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, 'findFirst', GlobalOmitOptions> | null,
         null,
         ExtArgs,
         GlobalOmitOptions
      >;

      /**
       * Find the first Team that matches the filter or
       * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
       * Note, that providing `undefined` is treated as the value not being there.
       * Read more here: https://pris.ly/d/null-undefined
       * @param {TeamFindFirstOrThrowArgs} args - Arguments to find a Team
       * @example
       * // Get one Team
       * const team = await prisma.team.findFirstOrThrow({
       *   where: {
       *     // ... provide filter here
       *   }
       * })
       */
      findFirstOrThrow<T extends TeamFindFirstOrThrowArgs>(
         args?: SelectSubset<T, TeamFindFirstOrThrowArgs<ExtArgs>>
      ): Prisma__TeamClient<
         $Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, 'findFirstOrThrow', GlobalOmitOptions>,
         never,
         ExtArgs,
         GlobalOmitOptions
      >;

      /**
       * Find zero or more Teams that matches the filter.
       * Note, that providing `undefined` is treated as the value not being there.
       * Read more here: https://pris.ly/d/null-undefined
       * @param {TeamFindManyArgs} args - Arguments to filter and select certain fields only.
       * @example
       * // Get all Teams
       * const teams = await prisma.team.findMany()
       *
       * // Get first 10 Teams
       * const teams = await prisma.team.findMany({ take: 10 })
       *
       * // Only select the `id`
       * const teamWithIdOnly = await prisma.team.findMany({ select: { id: true } })
       *
       */
      findMany<T extends TeamFindManyArgs>(
         args?: SelectSubset<T, TeamFindManyArgs<ExtArgs>>
      ): Prisma.PrismaPromise<
         $Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions>
      >;

      /**
       * Create a Team.
       * @param {TeamCreateArgs} args - Arguments to create a Team.
       * @example
       * // Create one Team
       * const Team = await prisma.team.create({
       *   data: {
       *     // ... data to create a Team
       *   }
       * })
       *
       */
      create<T extends TeamCreateArgs>(
         args: SelectSubset<T, TeamCreateArgs<ExtArgs>>
      ): Prisma__TeamClient<
         $Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, 'create', GlobalOmitOptions>,
         never,
         ExtArgs,
         GlobalOmitOptions
      >;

      /**
       * Create many Teams.
       * @param {TeamCreateManyArgs} args - Arguments to create many Teams.
       * @example
       * // Create many Teams
       * const team = await prisma.team.createMany({
       *   data: [
       *     // ... provide data here
       *   ]
       * })
       *
       */
      createMany<T extends TeamCreateManyArgs>(
         args?: SelectSubset<T, TeamCreateManyArgs<ExtArgs>>
      ): Prisma.PrismaPromise<BatchPayload>;

      /**
       * Create many Teams and returns the data saved in the database.
       * @param {TeamCreateManyAndReturnArgs} args - Arguments to create many Teams.
       * @example
       * // Create many Teams
       * const team = await prisma.team.createManyAndReturn({
       *   data: [
       *     // ... provide data here
       *   ]
       * })
       *
       * // Create many Teams and only return the `id`
       * const teamWithIdOnly = await prisma.team.createManyAndReturn({
       *   select: { id: true },
       *   data: [
       *     // ... provide data here
       *   ]
       * })
       * Note, that providing `undefined` is treated as the value not being there.
       * Read more here: https://pris.ly/d/null-undefined
       *
       */
      createManyAndReturn<T extends TeamCreateManyAndReturnArgs>(
         args?: SelectSubset<T, TeamCreateManyAndReturnArgs<ExtArgs>>
      ): Prisma.PrismaPromise<
         $Result.GetResult<
            Prisma.$TeamPayload<ExtArgs>,
            T,
            'createManyAndReturn',
            GlobalOmitOptions
         >
      >;

      /**
       * Delete a Team.
       * @param {TeamDeleteArgs} args - Arguments to delete one Team.
       * @example
       * // Delete one Team
       * const Team = await prisma.team.delete({
       *   where: {
       *     // ... filter to delete one Team
       *   }
       * })
       *
       */
      delete<T extends TeamDeleteArgs>(
         args: SelectSubset<T, TeamDeleteArgs<ExtArgs>>
      ): Prisma__TeamClient<
         $Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, 'delete', GlobalOmitOptions>,
         never,
         ExtArgs,
         GlobalOmitOptions
      >;

      /**
       * Update one Team.
       * @param {TeamUpdateArgs} args - Arguments to update one Team.
       * @example
       * // Update one Team
       * const team = await prisma.team.update({
       *   where: {
       *     // ... provide filter here
       *   },
       *   data: {
       *     // ... provide data here
       *   }
       * })
       *
       */
      update<T extends TeamUpdateArgs>(
         args: SelectSubset<T, TeamUpdateArgs<ExtArgs>>
      ): Prisma__TeamClient<
         $Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, 'update', GlobalOmitOptions>,
         never,
         ExtArgs,
         GlobalOmitOptions
      >;

      /**
       * Delete zero or more Teams.
       * @param {TeamDeleteManyArgs} args - Arguments to filter Teams to delete.
       * @example
       * // Delete a few Teams
       * const { count } = await prisma.team.deleteMany({
       *   where: {
       *     // ... provide filter here
       *   }
       * })
       *
       */
      deleteMany<T extends TeamDeleteManyArgs>(
         args?: SelectSubset<T, TeamDeleteManyArgs<ExtArgs>>
      ): Prisma.PrismaPromise<BatchPayload>;

      /**
       * Update zero or more Teams.
       * Note, that providing `undefined` is treated as the value not being there.
       * Read more here: https://pris.ly/d/null-undefined
       * @param {TeamUpdateManyArgs} args - Arguments to update one or more rows.
       * @example
       * // Update many Teams
       * const team = await prisma.team.updateMany({
       *   where: {
       *     // ... provide filter here
       *   },
       *   data: {
       *     // ... provide data here
       *   }
       * })
       *
       */
      updateMany<T extends TeamUpdateManyArgs>(
         args: SelectSubset<T, TeamUpdateManyArgs<ExtArgs>>
      ): Prisma.PrismaPromise<BatchPayload>;

      /**
       * Update zero or more Teams and returns the data updated in the database.
       * @param {TeamUpdateManyAndReturnArgs} args - Arguments to update many Teams.
       * @example
       * // Update many Teams
       * const team = await prisma.team.updateManyAndReturn({
       *   where: {
       *     // ... provide filter here
       *   },
       *   data: [
       *     // ... provide data here
       *   ]
       * })
       *
       * // Update zero or more Teams and only return the `id`
       * const teamWithIdOnly = await prisma.team.updateManyAndReturn({
       *   select: { id: true },
       *   where: {
       *     // ... provide filter here
       *   },
       *   data: [
       *     // ... provide data here
       *   ]
       * })
       * Note, that providing `undefined` is treated as the value not being there.
       * Read more here: https://pris.ly/d/null-undefined
       *
       */
      updateManyAndReturn<T extends TeamUpdateManyAndReturnArgs>(
         args: SelectSubset<T, TeamUpdateManyAndReturnArgs<ExtArgs>>
      ): Prisma.PrismaPromise<
         $Result.GetResult<
            Prisma.$TeamPayload<ExtArgs>,
            T,
            'updateManyAndReturn',
            GlobalOmitOptions
         >
      >;

      /**
       * Create or update one Team.
       * @param {TeamUpsertArgs} args - Arguments to update or create a Team.
       * @example
       * // Update or create a Team
       * const team = await prisma.team.upsert({
       *   create: {
       *     // ... data to create a Team
       *   },
       *   update: {
       *     // ... in case it already exists, update
       *   },
       *   where: {
       *     // ... the filter for the Team we want to update
       *   }
       * })
       */
      upsert<T extends TeamUpsertArgs>(
         args: SelectSubset<T, TeamUpsertArgs<ExtArgs>>
      ): Prisma__TeamClient<
         $Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, 'upsert', GlobalOmitOptions>,
         never,
         ExtArgs,
         GlobalOmitOptions
      >;

      /**
       * Count the number of Teams.
       * Note, that providing `undefined` is treated as the value not being there.
       * Read more here: https://pris.ly/d/null-undefined
       * @param {TeamCountArgs} args - Arguments to filter Teams to count.
       * @example
       * // Count the number of Teams
       * const count = await prisma.team.count({
       *   where: {
       *     // ... the filter for the Teams we want to count
       *   }
       * })
       **/
      count<T extends TeamCountArgs>(
         args?: Subset<T, TeamCountArgs>
      ): Prisma.PrismaPromise<
         T extends $Utils.Record<'select', any>
            ? T['select'] extends true
               ? number
               : GetScalarType<T['select'], TeamCountAggregateOutputType>
            : number
      >;

      /**
       * Allows you to perform aggregations operations on a Team.
       * Note, that providing `undefined` is treated as the value not being there.
       * Read more here: https://pris.ly/d/null-undefined
       * @param {TeamAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
       * @example
       * // Ordered by age ascending
       * // Where email contains prisma.io
       * // Limited to the 10 users
       * const aggregations = await prisma.user.aggregate({
       *   _avg: {
       *     age: true,
       *   },
       *   where: {
       *     email: {
       *       contains: "prisma.io",
       *     },
       *   },
       *   orderBy: {
       *     age: "asc",
       *   },
       *   take: 10,
       * })
       **/
      aggregate<T extends TeamAggregateArgs>(
         args: Subset<T, TeamAggregateArgs>
      ): Prisma.PrismaPromise<GetTeamAggregateType<T>>;

      /**
       * Group by Team.
       * Note, that providing `undefined` is treated as the value not being there.
       * Read more here: https://pris.ly/d/null-undefined
       * @param {TeamGroupByArgs} args - Group by arguments.
       * @example
       * // Group by city, order by createdAt, get count
       * const result = await prisma.user.groupBy({
       *   by: ['city', 'createdAt'],
       *   orderBy: {
       *     createdAt: true
       *   },
       *   _count: {
       *     _all: true
       *   },
       * })
       *
       **/
      groupBy<
         T extends TeamGroupByArgs,
         HasSelectOrTake extends Or<Extends<'skip', Keys<T>>, Extends<'take', Keys<T>>>,
         OrderByArg extends True extends HasSelectOrTake
            ? { orderBy: TeamGroupByArgs['orderBy'] }
            : { orderBy?: TeamGroupByArgs['orderBy'] },
         OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
         ByFields extends MaybeTupleToUnion<T['by']>,
         ByValid extends Has<ByFields, OrderFields>,
         HavingFields extends GetHavingFields<T['having']>,
         HavingValid extends Has<ByFields, HavingFields>,
         ByEmpty extends T['by'] extends never[] ? True : False,
         InputErrors extends ByEmpty extends True
            ? `Error: "by" must not be empty.`
            : HavingValid extends False
              ? {
                   [P in HavingFields]: P extends ByFields
                      ? never
                      : P extends string
                        ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                        : [Error, 'Field ', P, ` in "having" needs to be provided in "by"`];
                }[HavingFields]
              : 'take' extends Keys<T>
                ? 'orderBy' extends Keys<T>
                   ? ByValid extends True
                      ? {}
                      : {
                           [P in OrderFields]: P extends ByFields
                              ? never
                              : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                        }[OrderFields]
                   : 'Error: If you provide "take", you also need to provide "orderBy"'
                : 'skip' extends Keys<T>
                  ? 'orderBy' extends Keys<T>
                     ? ByValid extends True
                        ? {}
                        : {
                             [P in OrderFields]: P extends ByFields
                                ? never
                                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                          }[OrderFields]
                     : 'Error: If you provide "skip", you also need to provide "orderBy"'
                  : ByValid extends True
                    ? {}
                    : {
                         [P in OrderFields]: P extends ByFields
                            ? never
                            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                      }[OrderFields],
      >(
         args: SubsetIntersection<T, TeamGroupByArgs, OrderByArg> & InputErrors
      ): {} extends InputErrors ? GetTeamGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
      /**
       * Fields of the Team model
       */
      readonly fields: TeamFieldRefs;
   }

   /**
    * The delegate class that acts as a "Promise-like" for Team.
    * Why is this prefixed with `Prisma__`?
    * Because we want to prevent naming conflicts as mentioned in
    * https://github.com/prisma/prisma-client-js/issues/707
    */
   export interface Prisma__TeamClient<
      T,
      Null = never,
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
      GlobalOmitOptions = {},
   > extends Prisma.PrismaPromise<T> {
      readonly [Symbol.toStringTag]: 'PrismaPromise';
      company<T extends CompanyDefaultArgs<ExtArgs> = {}>(
         args?: Subset<T, CompanyDefaultArgs<ExtArgs>>
      ): Prisma__CompanyClient<
         | $Result.GetResult<
              Prisma.$CompanyPayload<ExtArgs>,
              T,
              'findUniqueOrThrow',
              GlobalOmitOptions
           >
         | Null,
         Null,
         ExtArgs,
         GlobalOmitOptions
      >;
      onboardings<T extends Team$onboardingsArgs<ExtArgs> = {}>(
         args?: Subset<T, Team$onboardingsArgs<ExtArgs>>
      ): Prisma.PrismaPromise<
         | $Result.GetResult<Prisma.$OnboardingPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions>
         | Null
      >;
      /**
       * Attaches callbacks for the resolution and/or rejection of the Promise.
       * @param onfulfilled The callback to execute when the Promise is resolved.
       * @param onrejected The callback to execute when the Promise is rejected.
       * @returns A Promise for the completion of which ever callback is executed.
       */
      then<TResult1 = T, TResult2 = never>(
         onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
         onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
      ): $Utils.JsPromise<TResult1 | TResult2>;
      /**
       * Attaches a callback for only the rejection of the Promise.
       * @param onrejected The callback to execute when the Promise is rejected.
       * @returns A Promise for the completion of the callback.
       */
      catch<TResult = never>(
         onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null
      ): $Utils.JsPromise<T | TResult>;
      /**
       * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
       * resolved value cannot be modified from the callback.
       * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
       * @returns A Promise for the completion of the callback.
       */
      finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
   }

   /**
    * Fields of the Team model
    */
   interface TeamFieldRefs {
      readonly id: FieldRef<'Team', 'String'>;
      readonly name: FieldRef<'Team', 'String'>;
      readonly description: FieldRef<'Team', 'String'>;
      readonly createdAt: FieldRef<'Team', 'DateTime'>;
      readonly updatedAt: FieldRef<'Team', 'DateTime'>;
      readonly companyId: FieldRef<'Team', 'String'>;
   }

   // Custom InputTypes
   /**
    * Team findUnique
    */
   export type TeamFindUniqueArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
   > = {
      /**
       * Select specific fields to fetch from the Team
       */
      select?: TeamSelect<ExtArgs> | null;
      /**
       * Omit specific fields from the Team
       */
      omit?: TeamOmit<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: TeamInclude<ExtArgs> | null;
      /**
       * Filter, which Team to fetch.
       */
      where: TeamWhereUniqueInput;
   };

   /**
    * Team findUniqueOrThrow
    */
   export type TeamFindUniqueOrThrowArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
   > = {
      /**
       * Select specific fields to fetch from the Team
       */
      select?: TeamSelect<ExtArgs> | null;
      /**
       * Omit specific fields from the Team
       */
      omit?: TeamOmit<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: TeamInclude<ExtArgs> | null;
      /**
       * Filter, which Team to fetch.
       */
      where: TeamWhereUniqueInput;
   };

   /**
    * Team findFirst
    */
   export type TeamFindFirstArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
   > = {
      /**
       * Select specific fields to fetch from the Team
       */
      select?: TeamSelect<ExtArgs> | null;
      /**
       * Omit specific fields from the Team
       */
      omit?: TeamOmit<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: TeamInclude<ExtArgs> | null;
      /**
       * Filter, which Team to fetch.
       */
      where?: TeamWhereInput;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
       *
       * Determine the order of Teams to fetch.
       */
      orderBy?: TeamOrderByWithRelationInput | TeamOrderByWithRelationInput[];
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
       *
       * Sets the position for searching for Teams.
       */
      cursor?: TeamWhereUniqueInput;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
       *
       * Take `±n` Teams from the position of the cursor.
       */
      take?: number;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
       *
       * Skip the first `n` Teams.
       */
      skip?: number;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
       *
       * Filter by unique combinations of Teams.
       */
      distinct?: TeamScalarFieldEnum | TeamScalarFieldEnum[];
   };

   /**
    * Team findFirstOrThrow
    */
   export type TeamFindFirstOrThrowArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
   > = {
      /**
       * Select specific fields to fetch from the Team
       */
      select?: TeamSelect<ExtArgs> | null;
      /**
       * Omit specific fields from the Team
       */
      omit?: TeamOmit<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: TeamInclude<ExtArgs> | null;
      /**
       * Filter, which Team to fetch.
       */
      where?: TeamWhereInput;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
       *
       * Determine the order of Teams to fetch.
       */
      orderBy?: TeamOrderByWithRelationInput | TeamOrderByWithRelationInput[];
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
       *
       * Sets the position for searching for Teams.
       */
      cursor?: TeamWhereUniqueInput;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
       *
       * Take `±n` Teams from the position of the cursor.
       */
      take?: number;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
       *
       * Skip the first `n` Teams.
       */
      skip?: number;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
       *
       * Filter by unique combinations of Teams.
       */
      distinct?: TeamScalarFieldEnum | TeamScalarFieldEnum[];
   };

   /**
    * Team findMany
    */
   export type TeamFindManyArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
   > = {
      /**
       * Select specific fields to fetch from the Team
       */
      select?: TeamSelect<ExtArgs> | null;
      /**
       * Omit specific fields from the Team
       */
      omit?: TeamOmit<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: TeamInclude<ExtArgs> | null;
      /**
       * Filter, which Teams to fetch.
       */
      where?: TeamWhereInput;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
       *
       * Determine the order of Teams to fetch.
       */
      orderBy?: TeamOrderByWithRelationInput | TeamOrderByWithRelationInput[];
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
       *
       * Sets the position for listing Teams.
       */
      cursor?: TeamWhereUniqueInput;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
       *
       * Take `±n` Teams from the position of the cursor.
       */
      take?: number;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
       *
       * Skip the first `n` Teams.
       */
      skip?: number;
      distinct?: TeamScalarFieldEnum | TeamScalarFieldEnum[];
   };

   /**
    * Team create
    */
   export type TeamCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
      {
         /**
          * Select specific fields to fetch from the Team
          */
         select?: TeamSelect<ExtArgs> | null;
         /**
          * Omit specific fields from the Team
          */
         omit?: TeamOmit<ExtArgs> | null;
         /**
          * Choose, which related nodes to fetch as well
          */
         include?: TeamInclude<ExtArgs> | null;
         /**
          * The data needed to create a Team.
          */
         data: XOR<TeamCreateInput, TeamUncheckedCreateInput>;
      };

   /**
    * Team createMany
    */
   export type TeamCreateManyArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
   > = {
      /**
       * The data used to create many Teams.
       */
      data: TeamCreateManyInput | TeamCreateManyInput[];
      skipDuplicates?: boolean;
   };

   /**
    * Team createManyAndReturn
    */
   export type TeamCreateManyAndReturnArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
   > = {
      /**
       * Select specific fields to fetch from the Team
       */
      select?: TeamSelectCreateManyAndReturn<ExtArgs> | null;
      /**
       * Omit specific fields from the Team
       */
      omit?: TeamOmit<ExtArgs> | null;
      /**
       * The data used to create many Teams.
       */
      data: TeamCreateManyInput | TeamCreateManyInput[];
      skipDuplicates?: boolean;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: TeamIncludeCreateManyAndReturn<ExtArgs> | null;
   };

   /**
    * Team update
    */
   export type TeamUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
      {
         /**
          * Select specific fields to fetch from the Team
          */
         select?: TeamSelect<ExtArgs> | null;
         /**
          * Omit specific fields from the Team
          */
         omit?: TeamOmit<ExtArgs> | null;
         /**
          * Choose, which related nodes to fetch as well
          */
         include?: TeamInclude<ExtArgs> | null;
         /**
          * The data needed to update a Team.
          */
         data: XOR<TeamUpdateInput, TeamUncheckedUpdateInput>;
         /**
          * Choose, which Team to update.
          */
         where: TeamWhereUniqueInput;
      };

   /**
    * Team updateMany
    */
   export type TeamUpdateManyArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
   > = {
      /**
       * The data used to update Teams.
       */
      data: XOR<TeamUpdateManyMutationInput, TeamUncheckedUpdateManyInput>;
      /**
       * Filter which Teams to update
       */
      where?: TeamWhereInput;
      /**
       * Limit how many Teams to update.
       */
      limit?: number;
   };

   /**
    * Team updateManyAndReturn
    */
   export type TeamUpdateManyAndReturnArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
   > = {
      /**
       * Select specific fields to fetch from the Team
       */
      select?: TeamSelectUpdateManyAndReturn<ExtArgs> | null;
      /**
       * Omit specific fields from the Team
       */
      omit?: TeamOmit<ExtArgs> | null;
      /**
       * The data used to update Teams.
       */
      data: XOR<TeamUpdateManyMutationInput, TeamUncheckedUpdateManyInput>;
      /**
       * Filter which Teams to update
       */
      where?: TeamWhereInput;
      /**
       * Limit how many Teams to update.
       */
      limit?: number;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: TeamIncludeUpdateManyAndReturn<ExtArgs> | null;
   };

   /**
    * Team upsert
    */
   export type TeamUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
      {
         /**
          * Select specific fields to fetch from the Team
          */
         select?: TeamSelect<ExtArgs> | null;
         /**
          * Omit specific fields from the Team
          */
         omit?: TeamOmit<ExtArgs> | null;
         /**
          * Choose, which related nodes to fetch as well
          */
         include?: TeamInclude<ExtArgs> | null;
         /**
          * The filter to search for the Team to update in case it exists.
          */
         where: TeamWhereUniqueInput;
         /**
          * In case the Team found by the `where` argument doesn't exist, create a new Team with this data.
          */
         create: XOR<TeamCreateInput, TeamUncheckedCreateInput>;
         /**
          * In case the Team was found with the provided `where` argument, update it with this data.
          */
         update: XOR<TeamUpdateInput, TeamUncheckedUpdateInput>;
      };

   /**
    * Team delete
    */
   export type TeamDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
      {
         /**
          * Select specific fields to fetch from the Team
          */
         select?: TeamSelect<ExtArgs> | null;
         /**
          * Omit specific fields from the Team
          */
         omit?: TeamOmit<ExtArgs> | null;
         /**
          * Choose, which related nodes to fetch as well
          */
         include?: TeamInclude<ExtArgs> | null;
         /**
          * Filter which Team to delete.
          */
         where: TeamWhereUniqueInput;
      };

   /**
    * Team deleteMany
    */
   export type TeamDeleteManyArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
   > = {
      /**
       * Filter which Teams to delete
       */
      where?: TeamWhereInput;
      /**
       * Limit how many Teams to delete.
       */
      limit?: number;
   };

   /**
    * Team.onboardings
    */
   export type Team$onboardingsArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
   > = {
      /**
       * Select specific fields to fetch from the Onboarding
       */
      select?: OnboardingSelect<ExtArgs> | null;
      /**
       * Omit specific fields from the Onboarding
       */
      omit?: OnboardingOmit<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: OnboardingInclude<ExtArgs> | null;
      where?: OnboardingWhereInput;
      orderBy?: OnboardingOrderByWithRelationInput | OnboardingOrderByWithRelationInput[];
      cursor?: OnboardingWhereUniqueInput;
      take?: number;
      skip?: number;
      distinct?: OnboardingScalarFieldEnum | OnboardingScalarFieldEnum[];
   };

   /**
    * Team without action
    */
   export type TeamDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
      {
         /**
          * Select specific fields to fetch from the Team
          */
         select?: TeamSelect<ExtArgs> | null;
         /**
          * Omit specific fields from the Team
          */
         omit?: TeamOmit<ExtArgs> | null;
         /**
          * Choose, which related nodes to fetch as well
          */
         include?: TeamInclude<ExtArgs> | null;
      };

   /**
    * Model Onboarding
    */

   export type AggregateOnboarding = {
      _count: OnboardingCountAggregateOutputType | null;
      _min: OnboardingMinAggregateOutputType | null;
      _max: OnboardingMaxAggregateOutputType | null;
   };

   export type OnboardingMinAggregateOutputType = {
      id: string | null;
      employeeName: string | null;
      employeeEmail: string | null;
      position: string | null;
      startDate: Date | null;
      status: $Enums.OnboardingStatus | null;
      notes: string | null;
      createdAt: Date | null;
      updatedAt: Date | null;
      companyId: string | null;
      teamId: string | null;
   };

   export type OnboardingMaxAggregateOutputType = {
      id: string | null;
      employeeName: string | null;
      employeeEmail: string | null;
      position: string | null;
      startDate: Date | null;
      status: $Enums.OnboardingStatus | null;
      notes: string | null;
      createdAt: Date | null;
      updatedAt: Date | null;
      companyId: string | null;
      teamId: string | null;
   };

   export type OnboardingCountAggregateOutputType = {
      id: number;
      employeeName: number;
      employeeEmail: number;
      position: number;
      startDate: number;
      status: number;
      notes: number;
      createdAt: number;
      updatedAt: number;
      companyId: number;
      teamId: number;
      _all: number;
   };

   export type OnboardingMinAggregateInputType = {
      id?: true;
      employeeName?: true;
      employeeEmail?: true;
      position?: true;
      startDate?: true;
      status?: true;
      notes?: true;
      createdAt?: true;
      updatedAt?: true;
      companyId?: true;
      teamId?: true;
   };

   export type OnboardingMaxAggregateInputType = {
      id?: true;
      employeeName?: true;
      employeeEmail?: true;
      position?: true;
      startDate?: true;
      status?: true;
      notes?: true;
      createdAt?: true;
      updatedAt?: true;
      companyId?: true;
      teamId?: true;
   };

   export type OnboardingCountAggregateInputType = {
      id?: true;
      employeeName?: true;
      employeeEmail?: true;
      position?: true;
      startDate?: true;
      status?: true;
      notes?: true;
      createdAt?: true;
      updatedAt?: true;
      companyId?: true;
      teamId?: true;
      _all?: true;
   };

   export type OnboardingAggregateArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
   > = {
      /**
       * Filter which Onboarding to aggregate.
       */
      where?: OnboardingWhereInput;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
       *
       * Determine the order of Onboardings to fetch.
       */
      orderBy?: OnboardingOrderByWithRelationInput | OnboardingOrderByWithRelationInput[];
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
       *
       * Sets the start position
       */
      cursor?: OnboardingWhereUniqueInput;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
       *
       * Take `±n` Onboardings from the position of the cursor.
       */
      take?: number;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
       *
       * Skip the first `n` Onboardings.
       */
      skip?: number;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
       *
       * Count returned Onboardings
       **/
      _count?: true | OnboardingCountAggregateInputType;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
       *
       * Select which fields to find the minimum value
       **/
      _min?: OnboardingMinAggregateInputType;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
       *
       * Select which fields to find the maximum value
       **/
      _max?: OnboardingMaxAggregateInputType;
   };

   export type GetOnboardingAggregateType<T extends OnboardingAggregateArgs> = {
      [P in keyof T & keyof AggregateOnboarding]: P extends '_count' | 'count'
         ? T[P] extends true
            ? number
            : GetScalarType<T[P], AggregateOnboarding[P]>
         : GetScalarType<T[P], AggregateOnboarding[P]>;
   };

   export type OnboardingGroupByArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
   > = {
      where?: OnboardingWhereInput;
      orderBy?: OnboardingOrderByWithAggregationInput | OnboardingOrderByWithAggregationInput[];
      by: OnboardingScalarFieldEnum[] | OnboardingScalarFieldEnum;
      having?: OnboardingScalarWhereWithAggregatesInput;
      take?: number;
      skip?: number;
      _count?: OnboardingCountAggregateInputType | true;
      _min?: OnboardingMinAggregateInputType;
      _max?: OnboardingMaxAggregateInputType;
   };

   export type OnboardingGroupByOutputType = {
      id: string;
      employeeName: string;
      employeeEmail: string;
      position: string;
      startDate: Date;
      status: $Enums.OnboardingStatus;
      notes: string | null;
      createdAt: Date;
      updatedAt: Date;
      companyId: string;
      teamId: string | null;
      _count: OnboardingCountAggregateOutputType | null;
      _min: OnboardingMinAggregateOutputType | null;
      _max: OnboardingMaxAggregateOutputType | null;
   };

   type GetOnboardingGroupByPayload<T extends OnboardingGroupByArgs> = Prisma.PrismaPromise<
      Array<
         PickEnumerable<OnboardingGroupByOutputType, T['by']> & {
            [P in keyof T & keyof OnboardingGroupByOutputType]: P extends '_count'
               ? T[P] extends boolean
                  ? number
                  : GetScalarType<T[P], OnboardingGroupByOutputType[P]>
               : GetScalarType<T[P], OnboardingGroupByOutputType[P]>;
         }
      >
   >;

   export type OnboardingSelect<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
   > = $Extensions.GetSelect<
      {
         id?: boolean;
         employeeName?: boolean;
         employeeEmail?: boolean;
         position?: boolean;
         startDate?: boolean;
         status?: boolean;
         notes?: boolean;
         createdAt?: boolean;
         updatedAt?: boolean;
         companyId?: boolean;
         teamId?: boolean;
         company?: boolean | CompanyDefaultArgs<ExtArgs>;
         team?: boolean | Onboarding$teamArgs<ExtArgs>;
      },
      ExtArgs['result']['onboarding']
   >;

   export type OnboardingSelectCreateManyAndReturn<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
   > = $Extensions.GetSelect<
      {
         id?: boolean;
         employeeName?: boolean;
         employeeEmail?: boolean;
         position?: boolean;
         startDate?: boolean;
         status?: boolean;
         notes?: boolean;
         createdAt?: boolean;
         updatedAt?: boolean;
         companyId?: boolean;
         teamId?: boolean;
         company?: boolean | CompanyDefaultArgs<ExtArgs>;
         team?: boolean | Onboarding$teamArgs<ExtArgs>;
      },
      ExtArgs['result']['onboarding']
   >;

   export type OnboardingSelectUpdateManyAndReturn<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
   > = $Extensions.GetSelect<
      {
         id?: boolean;
         employeeName?: boolean;
         employeeEmail?: boolean;
         position?: boolean;
         startDate?: boolean;
         status?: boolean;
         notes?: boolean;
         createdAt?: boolean;
         updatedAt?: boolean;
         companyId?: boolean;
         teamId?: boolean;
         company?: boolean | CompanyDefaultArgs<ExtArgs>;
         team?: boolean | Onboarding$teamArgs<ExtArgs>;
      },
      ExtArgs['result']['onboarding']
   >;

   export type OnboardingSelectScalar = {
      id?: boolean;
      employeeName?: boolean;
      employeeEmail?: boolean;
      position?: boolean;
      startDate?: boolean;
      status?: boolean;
      notes?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      companyId?: boolean;
      teamId?: boolean;
   };

   export type OnboardingOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
      $Extensions.GetOmit<
         | 'id'
         | 'employeeName'
         | 'employeeEmail'
         | 'position'
         | 'startDate'
         | 'status'
         | 'notes'
         | 'createdAt'
         | 'updatedAt'
         | 'companyId'
         | 'teamId',
         ExtArgs['result']['onboarding']
      >;
   export type OnboardingInclude<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
   > = {
      company?: boolean | CompanyDefaultArgs<ExtArgs>;
      team?: boolean | Onboarding$teamArgs<ExtArgs>;
   };
   export type OnboardingIncludeCreateManyAndReturn<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
   > = {
      company?: boolean | CompanyDefaultArgs<ExtArgs>;
      team?: boolean | Onboarding$teamArgs<ExtArgs>;
   };
   export type OnboardingIncludeUpdateManyAndReturn<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
   > = {
      company?: boolean | CompanyDefaultArgs<ExtArgs>;
      team?: boolean | Onboarding$teamArgs<ExtArgs>;
   };

   export type $OnboardingPayload<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
   > = {
      name: 'Onboarding';
      objects: {
         company: Prisma.$CompanyPayload<ExtArgs>;
         team: Prisma.$TeamPayload<ExtArgs> | null;
      };
      scalars: $Extensions.GetPayloadResult<
         {
            id: string;
            employeeName: string;
            employeeEmail: string;
            position: string;
            startDate: Date;
            status: $Enums.OnboardingStatus;
            notes: string | null;
            createdAt: Date;
            updatedAt: Date;
            companyId: string;
            teamId: string | null;
         },
         ExtArgs['result']['onboarding']
      >;
      composites: {};
   };

   type OnboardingGetPayload<S extends boolean | null | undefined | OnboardingDefaultArgs> =
      $Result.GetResult<Prisma.$OnboardingPayload, S>;

   type OnboardingCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
      Omit<OnboardingFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
         select?: OnboardingCountAggregateInputType | true;
      };

   export interface OnboardingDelegate<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
      GlobalOmitOptions = {},
   > {
      [K: symbol]: {
         types: Prisma.TypeMap<ExtArgs>['model']['Onboarding'];
         meta: { name: 'Onboarding' };
      };
      /**
       * Find zero or one Onboarding that matches the filter.
       * @param {OnboardingFindUniqueArgs} args - Arguments to find a Onboarding
       * @example
       * // Get one Onboarding
       * const onboarding = await prisma.onboarding.findUnique({
       *   where: {
       *     // ... provide filter here
       *   }
       * })
       */
      findUnique<T extends OnboardingFindUniqueArgs>(
         args: SelectSubset<T, OnboardingFindUniqueArgs<ExtArgs>>
      ): Prisma__OnboardingClient<
         $Result.GetResult<
            Prisma.$OnboardingPayload<ExtArgs>,
            T,
            'findUnique',
            GlobalOmitOptions
         > | null,
         null,
         ExtArgs,
         GlobalOmitOptions
      >;

      /**
       * Find one Onboarding that matches the filter or throw an error with `error.code='P2025'`
       * if no matches were found.
       * @param {OnboardingFindUniqueOrThrowArgs} args - Arguments to find a Onboarding
       * @example
       * // Get one Onboarding
       * const onboarding = await prisma.onboarding.findUniqueOrThrow({
       *   where: {
       *     // ... provide filter here
       *   }
       * })
       */
      findUniqueOrThrow<T extends OnboardingFindUniqueOrThrowArgs>(
         args: SelectSubset<T, OnboardingFindUniqueOrThrowArgs<ExtArgs>>
      ): Prisma__OnboardingClient<
         $Result.GetResult<
            Prisma.$OnboardingPayload<ExtArgs>,
            T,
            'findUniqueOrThrow',
            GlobalOmitOptions
         >,
         never,
         ExtArgs,
         GlobalOmitOptions
      >;

      /**
       * Find the first Onboarding that matches the filter.
       * Note, that providing `undefined` is treated as the value not being there.
       * Read more here: https://pris.ly/d/null-undefined
       * @param {OnboardingFindFirstArgs} args - Arguments to find a Onboarding
       * @example
       * // Get one Onboarding
       * const onboarding = await prisma.onboarding.findFirst({
       *   where: {
       *     // ... provide filter here
       *   }
       * })
       */
      findFirst<T extends OnboardingFindFirstArgs>(
         args?: SelectSubset<T, OnboardingFindFirstArgs<ExtArgs>>
      ): Prisma__OnboardingClient<
         $Result.GetResult<
            Prisma.$OnboardingPayload<ExtArgs>,
            T,
            'findFirst',
            GlobalOmitOptions
         > | null,
         null,
         ExtArgs,
         GlobalOmitOptions
      >;

      /**
       * Find the first Onboarding that matches the filter or
       * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
       * Note, that providing `undefined` is treated as the value not being there.
       * Read more here: https://pris.ly/d/null-undefined
       * @param {OnboardingFindFirstOrThrowArgs} args - Arguments to find a Onboarding
       * @example
       * // Get one Onboarding
       * const onboarding = await prisma.onboarding.findFirstOrThrow({
       *   where: {
       *     // ... provide filter here
       *   }
       * })
       */
      findFirstOrThrow<T extends OnboardingFindFirstOrThrowArgs>(
         args?: SelectSubset<T, OnboardingFindFirstOrThrowArgs<ExtArgs>>
      ): Prisma__OnboardingClient<
         $Result.GetResult<
            Prisma.$OnboardingPayload<ExtArgs>,
            T,
            'findFirstOrThrow',
            GlobalOmitOptions
         >,
         never,
         ExtArgs,
         GlobalOmitOptions
      >;

      /**
       * Find zero or more Onboardings that matches the filter.
       * Note, that providing `undefined` is treated as the value not being there.
       * Read more here: https://pris.ly/d/null-undefined
       * @param {OnboardingFindManyArgs} args - Arguments to filter and select certain fields only.
       * @example
       * // Get all Onboardings
       * const onboardings = await prisma.onboarding.findMany()
       *
       * // Get first 10 Onboardings
       * const onboardings = await prisma.onboarding.findMany({ take: 10 })
       *
       * // Only select the `id`
       * const onboardingWithIdOnly = await prisma.onboarding.findMany({ select: { id: true } })
       *
       */
      findMany<T extends OnboardingFindManyArgs>(
         args?: SelectSubset<T, OnboardingFindManyArgs<ExtArgs>>
      ): Prisma.PrismaPromise<
         $Result.GetResult<Prisma.$OnboardingPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions>
      >;

      /**
       * Create a Onboarding.
       * @param {OnboardingCreateArgs} args - Arguments to create a Onboarding.
       * @example
       * // Create one Onboarding
       * const Onboarding = await prisma.onboarding.create({
       *   data: {
       *     // ... data to create a Onboarding
       *   }
       * })
       *
       */
      create<T extends OnboardingCreateArgs>(
         args: SelectSubset<T, OnboardingCreateArgs<ExtArgs>>
      ): Prisma__OnboardingClient<
         $Result.GetResult<Prisma.$OnboardingPayload<ExtArgs>, T, 'create', GlobalOmitOptions>,
         never,
         ExtArgs,
         GlobalOmitOptions
      >;

      /**
       * Create many Onboardings.
       * @param {OnboardingCreateManyArgs} args - Arguments to create many Onboardings.
       * @example
       * // Create many Onboardings
       * const onboarding = await prisma.onboarding.createMany({
       *   data: [
       *     // ... provide data here
       *   ]
       * })
       *
       */
      createMany<T extends OnboardingCreateManyArgs>(
         args?: SelectSubset<T, OnboardingCreateManyArgs<ExtArgs>>
      ): Prisma.PrismaPromise<BatchPayload>;

      /**
       * Create many Onboardings and returns the data saved in the database.
       * @param {OnboardingCreateManyAndReturnArgs} args - Arguments to create many Onboardings.
       * @example
       * // Create many Onboardings
       * const onboarding = await prisma.onboarding.createManyAndReturn({
       *   data: [
       *     // ... provide data here
       *   ]
       * })
       *
       * // Create many Onboardings and only return the `id`
       * const onboardingWithIdOnly = await prisma.onboarding.createManyAndReturn({
       *   select: { id: true },
       *   data: [
       *     // ... provide data here
       *   ]
       * })
       * Note, that providing `undefined` is treated as the value not being there.
       * Read more here: https://pris.ly/d/null-undefined
       *
       */
      createManyAndReturn<T extends OnboardingCreateManyAndReturnArgs>(
         args?: SelectSubset<T, OnboardingCreateManyAndReturnArgs<ExtArgs>>
      ): Prisma.PrismaPromise<
         $Result.GetResult<
            Prisma.$OnboardingPayload<ExtArgs>,
            T,
            'createManyAndReturn',
            GlobalOmitOptions
         >
      >;

      /**
       * Delete a Onboarding.
       * @param {OnboardingDeleteArgs} args - Arguments to delete one Onboarding.
       * @example
       * // Delete one Onboarding
       * const Onboarding = await prisma.onboarding.delete({
       *   where: {
       *     // ... filter to delete one Onboarding
       *   }
       * })
       *
       */
      delete<T extends OnboardingDeleteArgs>(
         args: SelectSubset<T, OnboardingDeleteArgs<ExtArgs>>
      ): Prisma__OnboardingClient<
         $Result.GetResult<Prisma.$OnboardingPayload<ExtArgs>, T, 'delete', GlobalOmitOptions>,
         never,
         ExtArgs,
         GlobalOmitOptions
      >;

      /**
       * Update one Onboarding.
       * @param {OnboardingUpdateArgs} args - Arguments to update one Onboarding.
       * @example
       * // Update one Onboarding
       * const onboarding = await prisma.onboarding.update({
       *   where: {
       *     // ... provide filter here
       *   },
       *   data: {
       *     // ... provide data here
       *   }
       * })
       *
       */
      update<T extends OnboardingUpdateArgs>(
         args: SelectSubset<T, OnboardingUpdateArgs<ExtArgs>>
      ): Prisma__OnboardingClient<
         $Result.GetResult<Prisma.$OnboardingPayload<ExtArgs>, T, 'update', GlobalOmitOptions>,
         never,
         ExtArgs,
         GlobalOmitOptions
      >;

      /**
       * Delete zero or more Onboardings.
       * @param {OnboardingDeleteManyArgs} args - Arguments to filter Onboardings to delete.
       * @example
       * // Delete a few Onboardings
       * const { count } = await prisma.onboarding.deleteMany({
       *   where: {
       *     // ... provide filter here
       *   }
       * })
       *
       */
      deleteMany<T extends OnboardingDeleteManyArgs>(
         args?: SelectSubset<T, OnboardingDeleteManyArgs<ExtArgs>>
      ): Prisma.PrismaPromise<BatchPayload>;

      /**
       * Update zero or more Onboardings.
       * Note, that providing `undefined` is treated as the value not being there.
       * Read more here: https://pris.ly/d/null-undefined
       * @param {OnboardingUpdateManyArgs} args - Arguments to update one or more rows.
       * @example
       * // Update many Onboardings
       * const onboarding = await prisma.onboarding.updateMany({
       *   where: {
       *     // ... provide filter here
       *   },
       *   data: {
       *     // ... provide data here
       *   }
       * })
       *
       */
      updateMany<T extends OnboardingUpdateManyArgs>(
         args: SelectSubset<T, OnboardingUpdateManyArgs<ExtArgs>>
      ): Prisma.PrismaPromise<BatchPayload>;

      /**
       * Update zero or more Onboardings and returns the data updated in the database.
       * @param {OnboardingUpdateManyAndReturnArgs} args - Arguments to update many Onboardings.
       * @example
       * // Update many Onboardings
       * const onboarding = await prisma.onboarding.updateManyAndReturn({
       *   where: {
       *     // ... provide filter here
       *   },
       *   data: [
       *     // ... provide data here
       *   ]
       * })
       *
       * // Update zero or more Onboardings and only return the `id`
       * const onboardingWithIdOnly = await prisma.onboarding.updateManyAndReturn({
       *   select: { id: true },
       *   where: {
       *     // ... provide filter here
       *   },
       *   data: [
       *     // ... provide data here
       *   ]
       * })
       * Note, that providing `undefined` is treated as the value not being there.
       * Read more here: https://pris.ly/d/null-undefined
       *
       */
      updateManyAndReturn<T extends OnboardingUpdateManyAndReturnArgs>(
         args: SelectSubset<T, OnboardingUpdateManyAndReturnArgs<ExtArgs>>
      ): Prisma.PrismaPromise<
         $Result.GetResult<
            Prisma.$OnboardingPayload<ExtArgs>,
            T,
            'updateManyAndReturn',
            GlobalOmitOptions
         >
      >;

      /**
       * Create or update one Onboarding.
       * @param {OnboardingUpsertArgs} args - Arguments to update or create a Onboarding.
       * @example
       * // Update or create a Onboarding
       * const onboarding = await prisma.onboarding.upsert({
       *   create: {
       *     // ... data to create a Onboarding
       *   },
       *   update: {
       *     // ... in case it already exists, update
       *   },
       *   where: {
       *     // ... the filter for the Onboarding we want to update
       *   }
       * })
       */
      upsert<T extends OnboardingUpsertArgs>(
         args: SelectSubset<T, OnboardingUpsertArgs<ExtArgs>>
      ): Prisma__OnboardingClient<
         $Result.GetResult<Prisma.$OnboardingPayload<ExtArgs>, T, 'upsert', GlobalOmitOptions>,
         never,
         ExtArgs,
         GlobalOmitOptions
      >;

      /**
       * Count the number of Onboardings.
       * Note, that providing `undefined` is treated as the value not being there.
       * Read more here: https://pris.ly/d/null-undefined
       * @param {OnboardingCountArgs} args - Arguments to filter Onboardings to count.
       * @example
       * // Count the number of Onboardings
       * const count = await prisma.onboarding.count({
       *   where: {
       *     // ... the filter for the Onboardings we want to count
       *   }
       * })
       **/
      count<T extends OnboardingCountArgs>(
         args?: Subset<T, OnboardingCountArgs>
      ): Prisma.PrismaPromise<
         T extends $Utils.Record<'select', any>
            ? T['select'] extends true
               ? number
               : GetScalarType<T['select'], OnboardingCountAggregateOutputType>
            : number
      >;

      /**
       * Allows you to perform aggregations operations on a Onboarding.
       * Note, that providing `undefined` is treated as the value not being there.
       * Read more here: https://pris.ly/d/null-undefined
       * @param {OnboardingAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
       * @example
       * // Ordered by age ascending
       * // Where email contains prisma.io
       * // Limited to the 10 users
       * const aggregations = await prisma.user.aggregate({
       *   _avg: {
       *     age: true,
       *   },
       *   where: {
       *     email: {
       *       contains: "prisma.io",
       *     },
       *   },
       *   orderBy: {
       *     age: "asc",
       *   },
       *   take: 10,
       * })
       **/
      aggregate<T extends OnboardingAggregateArgs>(
         args: Subset<T, OnboardingAggregateArgs>
      ): Prisma.PrismaPromise<GetOnboardingAggregateType<T>>;

      /**
       * Group by Onboarding.
       * Note, that providing `undefined` is treated as the value not being there.
       * Read more here: https://pris.ly/d/null-undefined
       * @param {OnboardingGroupByArgs} args - Group by arguments.
       * @example
       * // Group by city, order by createdAt, get count
       * const result = await prisma.user.groupBy({
       *   by: ['city', 'createdAt'],
       *   orderBy: {
       *     createdAt: true
       *   },
       *   _count: {
       *     _all: true
       *   },
       * })
       *
       **/
      groupBy<
         T extends OnboardingGroupByArgs,
         HasSelectOrTake extends Or<Extends<'skip', Keys<T>>, Extends<'take', Keys<T>>>,
         OrderByArg extends True extends HasSelectOrTake
            ? { orderBy: OnboardingGroupByArgs['orderBy'] }
            : { orderBy?: OnboardingGroupByArgs['orderBy'] },
         OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
         ByFields extends MaybeTupleToUnion<T['by']>,
         ByValid extends Has<ByFields, OrderFields>,
         HavingFields extends GetHavingFields<T['having']>,
         HavingValid extends Has<ByFields, HavingFields>,
         ByEmpty extends T['by'] extends never[] ? True : False,
         InputErrors extends ByEmpty extends True
            ? `Error: "by" must not be empty.`
            : HavingValid extends False
              ? {
                   [P in HavingFields]: P extends ByFields
                      ? never
                      : P extends string
                        ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                        : [Error, 'Field ', P, ` in "having" needs to be provided in "by"`];
                }[HavingFields]
              : 'take' extends Keys<T>
                ? 'orderBy' extends Keys<T>
                   ? ByValid extends True
                      ? {}
                      : {
                           [P in OrderFields]: P extends ByFields
                              ? never
                              : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                        }[OrderFields]
                   : 'Error: If you provide "take", you also need to provide "orderBy"'
                : 'skip' extends Keys<T>
                  ? 'orderBy' extends Keys<T>
                     ? ByValid extends True
                        ? {}
                        : {
                             [P in OrderFields]: P extends ByFields
                                ? never
                                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                          }[OrderFields]
                     : 'Error: If you provide "skip", you also need to provide "orderBy"'
                  : ByValid extends True
                    ? {}
                    : {
                         [P in OrderFields]: P extends ByFields
                            ? never
                            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                      }[OrderFields],
      >(
         args: SubsetIntersection<T, OnboardingGroupByArgs, OrderByArg> & InputErrors
      ): {} extends InputErrors
         ? GetOnboardingGroupByPayload<T>
         : Prisma.PrismaPromise<InputErrors>;
      /**
       * Fields of the Onboarding model
       */
      readonly fields: OnboardingFieldRefs;
   }

   /**
    * The delegate class that acts as a "Promise-like" for Onboarding.
    * Why is this prefixed with `Prisma__`?
    * Because we want to prevent naming conflicts as mentioned in
    * https://github.com/prisma/prisma-client-js/issues/707
    */
   export interface Prisma__OnboardingClient<
      T,
      Null = never,
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
      GlobalOmitOptions = {},
   > extends Prisma.PrismaPromise<T> {
      readonly [Symbol.toStringTag]: 'PrismaPromise';
      company<T extends CompanyDefaultArgs<ExtArgs> = {}>(
         args?: Subset<T, CompanyDefaultArgs<ExtArgs>>
      ): Prisma__CompanyClient<
         | $Result.GetResult<
              Prisma.$CompanyPayload<ExtArgs>,
              T,
              'findUniqueOrThrow',
              GlobalOmitOptions
           >
         | Null,
         Null,
         ExtArgs,
         GlobalOmitOptions
      >;
      team<T extends Onboarding$teamArgs<ExtArgs> = {}>(
         args?: Subset<T, Onboarding$teamArgs<ExtArgs>>
      ): Prisma__TeamClient<
         $Result.GetResult<
            Prisma.$TeamPayload<ExtArgs>,
            T,
            'findUniqueOrThrow',
            GlobalOmitOptions
         > | null,
         null,
         ExtArgs,
         GlobalOmitOptions
      >;
      /**
       * Attaches callbacks for the resolution and/or rejection of the Promise.
       * @param onfulfilled The callback to execute when the Promise is resolved.
       * @param onrejected The callback to execute when the Promise is rejected.
       * @returns A Promise for the completion of which ever callback is executed.
       */
      then<TResult1 = T, TResult2 = never>(
         onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
         onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
      ): $Utils.JsPromise<TResult1 | TResult2>;
      /**
       * Attaches a callback for only the rejection of the Promise.
       * @param onrejected The callback to execute when the Promise is rejected.
       * @returns A Promise for the completion of the callback.
       */
      catch<TResult = never>(
         onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null
      ): $Utils.JsPromise<T | TResult>;
      /**
       * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
       * resolved value cannot be modified from the callback.
       * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
       * @returns A Promise for the completion of the callback.
       */
      finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
   }

   /**
    * Fields of the Onboarding model
    */
   interface OnboardingFieldRefs {
      readonly id: FieldRef<'Onboarding', 'String'>;
      readonly employeeName: FieldRef<'Onboarding', 'String'>;
      readonly employeeEmail: FieldRef<'Onboarding', 'String'>;
      readonly position: FieldRef<'Onboarding', 'String'>;
      readonly startDate: FieldRef<'Onboarding', 'DateTime'>;
      readonly status: FieldRef<'Onboarding', 'OnboardingStatus'>;
      readonly notes: FieldRef<'Onboarding', 'String'>;
      readonly createdAt: FieldRef<'Onboarding', 'DateTime'>;
      readonly updatedAt: FieldRef<'Onboarding', 'DateTime'>;
      readonly companyId: FieldRef<'Onboarding', 'String'>;
      readonly teamId: FieldRef<'Onboarding', 'String'>;
   }

   // Custom InputTypes
   /**
    * Onboarding findUnique
    */
   export type OnboardingFindUniqueArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
   > = {
      /**
       * Select specific fields to fetch from the Onboarding
       */
      select?: OnboardingSelect<ExtArgs> | null;
      /**
       * Omit specific fields from the Onboarding
       */
      omit?: OnboardingOmit<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: OnboardingInclude<ExtArgs> | null;
      /**
       * Filter, which Onboarding to fetch.
       */
      where: OnboardingWhereUniqueInput;
   };

   /**
    * Onboarding findUniqueOrThrow
    */
   export type OnboardingFindUniqueOrThrowArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
   > = {
      /**
       * Select specific fields to fetch from the Onboarding
       */
      select?: OnboardingSelect<ExtArgs> | null;
      /**
       * Omit specific fields from the Onboarding
       */
      omit?: OnboardingOmit<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: OnboardingInclude<ExtArgs> | null;
      /**
       * Filter, which Onboarding to fetch.
       */
      where: OnboardingWhereUniqueInput;
   };

   /**
    * Onboarding findFirst
    */
   export type OnboardingFindFirstArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
   > = {
      /**
       * Select specific fields to fetch from the Onboarding
       */
      select?: OnboardingSelect<ExtArgs> | null;
      /**
       * Omit specific fields from the Onboarding
       */
      omit?: OnboardingOmit<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: OnboardingInclude<ExtArgs> | null;
      /**
       * Filter, which Onboarding to fetch.
       */
      where?: OnboardingWhereInput;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
       *
       * Determine the order of Onboardings to fetch.
       */
      orderBy?: OnboardingOrderByWithRelationInput | OnboardingOrderByWithRelationInput[];
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
       *
       * Sets the position for searching for Onboardings.
       */
      cursor?: OnboardingWhereUniqueInput;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
       *
       * Take `±n` Onboardings from the position of the cursor.
       */
      take?: number;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
       *
       * Skip the first `n` Onboardings.
       */
      skip?: number;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
       *
       * Filter by unique combinations of Onboardings.
       */
      distinct?: OnboardingScalarFieldEnum | OnboardingScalarFieldEnum[];
   };

   /**
    * Onboarding findFirstOrThrow
    */
   export type OnboardingFindFirstOrThrowArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
   > = {
      /**
       * Select specific fields to fetch from the Onboarding
       */
      select?: OnboardingSelect<ExtArgs> | null;
      /**
       * Omit specific fields from the Onboarding
       */
      omit?: OnboardingOmit<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: OnboardingInclude<ExtArgs> | null;
      /**
       * Filter, which Onboarding to fetch.
       */
      where?: OnboardingWhereInput;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
       *
       * Determine the order of Onboardings to fetch.
       */
      orderBy?: OnboardingOrderByWithRelationInput | OnboardingOrderByWithRelationInput[];
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
       *
       * Sets the position for searching for Onboardings.
       */
      cursor?: OnboardingWhereUniqueInput;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
       *
       * Take `±n` Onboardings from the position of the cursor.
       */
      take?: number;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
       *
       * Skip the first `n` Onboardings.
       */
      skip?: number;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
       *
       * Filter by unique combinations of Onboardings.
       */
      distinct?: OnboardingScalarFieldEnum | OnboardingScalarFieldEnum[];
   };

   /**
    * Onboarding findMany
    */
   export type OnboardingFindManyArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
   > = {
      /**
       * Select specific fields to fetch from the Onboarding
       */
      select?: OnboardingSelect<ExtArgs> | null;
      /**
       * Omit specific fields from the Onboarding
       */
      omit?: OnboardingOmit<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: OnboardingInclude<ExtArgs> | null;
      /**
       * Filter, which Onboardings to fetch.
       */
      where?: OnboardingWhereInput;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
       *
       * Determine the order of Onboardings to fetch.
       */
      orderBy?: OnboardingOrderByWithRelationInput | OnboardingOrderByWithRelationInput[];
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
       *
       * Sets the position for listing Onboardings.
       */
      cursor?: OnboardingWhereUniqueInput;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
       *
       * Take `±n` Onboardings from the position of the cursor.
       */
      take?: number;
      /**
       * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
       *
       * Skip the first `n` Onboardings.
       */
      skip?: number;
      distinct?: OnboardingScalarFieldEnum | OnboardingScalarFieldEnum[];
   };

   /**
    * Onboarding create
    */
   export type OnboardingCreateArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
   > = {
      /**
       * Select specific fields to fetch from the Onboarding
       */
      select?: OnboardingSelect<ExtArgs> | null;
      /**
       * Omit specific fields from the Onboarding
       */
      omit?: OnboardingOmit<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: OnboardingInclude<ExtArgs> | null;
      /**
       * The data needed to create a Onboarding.
       */
      data: XOR<OnboardingCreateInput, OnboardingUncheckedCreateInput>;
   };

   /**
    * Onboarding createMany
    */
   export type OnboardingCreateManyArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
   > = {
      /**
       * The data used to create many Onboardings.
       */
      data: OnboardingCreateManyInput | OnboardingCreateManyInput[];
      skipDuplicates?: boolean;
   };

   /**
    * Onboarding createManyAndReturn
    */
   export type OnboardingCreateManyAndReturnArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
   > = {
      /**
       * Select specific fields to fetch from the Onboarding
       */
      select?: OnboardingSelectCreateManyAndReturn<ExtArgs> | null;
      /**
       * Omit specific fields from the Onboarding
       */
      omit?: OnboardingOmit<ExtArgs> | null;
      /**
       * The data used to create many Onboardings.
       */
      data: OnboardingCreateManyInput | OnboardingCreateManyInput[];
      skipDuplicates?: boolean;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: OnboardingIncludeCreateManyAndReturn<ExtArgs> | null;
   };

   /**
    * Onboarding update
    */
   export type OnboardingUpdateArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
   > = {
      /**
       * Select specific fields to fetch from the Onboarding
       */
      select?: OnboardingSelect<ExtArgs> | null;
      /**
       * Omit specific fields from the Onboarding
       */
      omit?: OnboardingOmit<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: OnboardingInclude<ExtArgs> | null;
      /**
       * The data needed to update a Onboarding.
       */
      data: XOR<OnboardingUpdateInput, OnboardingUncheckedUpdateInput>;
      /**
       * Choose, which Onboarding to update.
       */
      where: OnboardingWhereUniqueInput;
   };

   /**
    * Onboarding updateMany
    */
   export type OnboardingUpdateManyArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
   > = {
      /**
       * The data used to update Onboardings.
       */
      data: XOR<OnboardingUpdateManyMutationInput, OnboardingUncheckedUpdateManyInput>;
      /**
       * Filter which Onboardings to update
       */
      where?: OnboardingWhereInput;
      /**
       * Limit how many Onboardings to update.
       */
      limit?: number;
   };

   /**
    * Onboarding updateManyAndReturn
    */
   export type OnboardingUpdateManyAndReturnArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
   > = {
      /**
       * Select specific fields to fetch from the Onboarding
       */
      select?: OnboardingSelectUpdateManyAndReturn<ExtArgs> | null;
      /**
       * Omit specific fields from the Onboarding
       */
      omit?: OnboardingOmit<ExtArgs> | null;
      /**
       * The data used to update Onboardings.
       */
      data: XOR<OnboardingUpdateManyMutationInput, OnboardingUncheckedUpdateManyInput>;
      /**
       * Filter which Onboardings to update
       */
      where?: OnboardingWhereInput;
      /**
       * Limit how many Onboardings to update.
       */
      limit?: number;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: OnboardingIncludeUpdateManyAndReturn<ExtArgs> | null;
   };

   /**
    * Onboarding upsert
    */
   export type OnboardingUpsertArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
   > = {
      /**
       * Select specific fields to fetch from the Onboarding
       */
      select?: OnboardingSelect<ExtArgs> | null;
      /**
       * Omit specific fields from the Onboarding
       */
      omit?: OnboardingOmit<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: OnboardingInclude<ExtArgs> | null;
      /**
       * The filter to search for the Onboarding to update in case it exists.
       */
      where: OnboardingWhereUniqueInput;
      /**
       * In case the Onboarding found by the `where` argument doesn't exist, create a new Onboarding with this data.
       */
      create: XOR<OnboardingCreateInput, OnboardingUncheckedCreateInput>;
      /**
       * In case the Onboarding was found with the provided `where` argument, update it with this data.
       */
      update: XOR<OnboardingUpdateInput, OnboardingUncheckedUpdateInput>;
   };

   /**
    * Onboarding delete
    */
   export type OnboardingDeleteArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
   > = {
      /**
       * Select specific fields to fetch from the Onboarding
       */
      select?: OnboardingSelect<ExtArgs> | null;
      /**
       * Omit specific fields from the Onboarding
       */
      omit?: OnboardingOmit<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: OnboardingInclude<ExtArgs> | null;
      /**
       * Filter which Onboarding to delete.
       */
      where: OnboardingWhereUniqueInput;
   };

   /**
    * Onboarding deleteMany
    */
   export type OnboardingDeleteManyArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
   > = {
      /**
       * Filter which Onboardings to delete
       */
      where?: OnboardingWhereInput;
      /**
       * Limit how many Onboardings to delete.
       */
      limit?: number;
   };

   /**
    * Onboarding.team
    */
   export type Onboarding$teamArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
   > = {
      /**
       * Select specific fields to fetch from the Team
       */
      select?: TeamSelect<ExtArgs> | null;
      /**
       * Omit specific fields from the Team
       */
      omit?: TeamOmit<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: TeamInclude<ExtArgs> | null;
      where?: TeamWhereInput;
   };

   /**
    * Onboarding without action
    */
   export type OnboardingDefaultArgs<
      ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
   > = {
      /**
       * Select specific fields to fetch from the Onboarding
       */
      select?: OnboardingSelect<ExtArgs> | null;
      /**
       * Omit specific fields from the Onboarding
       */
      omit?: OnboardingOmit<ExtArgs> | null;
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: OnboardingInclude<ExtArgs> | null;
   };

   /**
    * Enums
    */

   export const TransactionIsolationLevel: {
      ReadUncommitted: 'ReadUncommitted';
      ReadCommitted: 'ReadCommitted';
      RepeatableRead: 'RepeatableRead';
      Serializable: 'Serializable';
   };

   export type TransactionIsolationLevel =
      (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];

   export const UserScalarFieldEnum: {
      id: 'id';
      email: 'email';
      name: 'name';
   };

   export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum];

   export const PostScalarFieldEnum: {
      id: 'id';
      title: 'title';
      content: 'content';
      published: 'published';
      authorId: 'authorId';
   };

   export type PostScalarFieldEnum = (typeof PostScalarFieldEnum)[keyof typeof PostScalarFieldEnum];

   export const CompanyScalarFieldEnum: {
      id: 'id';
      name: 'name';
      email: 'email';
      description: 'description';
      website: 'website';
      createdAt: 'createdAt';
      updatedAt: 'updatedAt';
   };

   export type CompanyScalarFieldEnum =
      (typeof CompanyScalarFieldEnum)[keyof typeof CompanyScalarFieldEnum];

   export const TeamScalarFieldEnum: {
      id: 'id';
      name: 'name';
      description: 'description';
      createdAt: 'createdAt';
      updatedAt: 'updatedAt';
      companyId: 'companyId';
   };

   export type TeamScalarFieldEnum = (typeof TeamScalarFieldEnum)[keyof typeof TeamScalarFieldEnum];

   export const OnboardingScalarFieldEnum: {
      id: 'id';
      employeeName: 'employeeName';
      employeeEmail: 'employeeEmail';
      position: 'position';
      startDate: 'startDate';
      status: 'status';
      notes: 'notes';
      createdAt: 'createdAt';
      updatedAt: 'updatedAt';
      companyId: 'companyId';
      teamId: 'teamId';
   };

   export type OnboardingScalarFieldEnum =
      (typeof OnboardingScalarFieldEnum)[keyof typeof OnboardingScalarFieldEnum];

   export const SortOrder: {
      asc: 'asc';
      desc: 'desc';
   };

   export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];

   export const QueryMode: {
      default: 'default';
      insensitive: 'insensitive';
   };

   export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode];

   export const NullsOrder: {
      first: 'first';
      last: 'last';
   };

   export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder];

   /**
    * Field references
    */

   /**
    * Reference to a field of type 'Int'
    */
   export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>;

   /**
    * Reference to a field of type 'Int[]'
    */
   export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>;

   /**
    * Reference to a field of type 'String'
    */
   export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>;

   /**
    * Reference to a field of type 'String[]'
    */
   export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>;

   /**
    * Reference to a field of type 'Boolean'
    */
   export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>;

   /**
    * Reference to a field of type 'DateTime'
    */
   export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>;

   /**
    * Reference to a field of type 'DateTime[]'
    */
   export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<
      $PrismaModel,
      'DateTime[]'
   >;

   /**
    * Reference to a field of type 'OnboardingStatus'
    */
   export type EnumOnboardingStatusFieldRefInput<$PrismaModel> = FieldRefInputType<
      $PrismaModel,
      'OnboardingStatus'
   >;

   /**
    * Reference to a field of type 'OnboardingStatus[]'
    */
   export type ListEnumOnboardingStatusFieldRefInput<$PrismaModel> = FieldRefInputType<
      $PrismaModel,
      'OnboardingStatus[]'
   >;

   /**
    * Reference to a field of type 'Float'
    */
   export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>;

   /**
    * Reference to a field of type 'Float[]'
    */
   export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>;

   /**
    * Deep Input Types
    */

   export type UserWhereInput = {
      AND?: UserWhereInput | UserWhereInput[];
      OR?: UserWhereInput[];
      NOT?: UserWhereInput | UserWhereInput[];
      id?: IntFilter<'User'> | number;
      email?: StringFilter<'User'> | string;
      name?: StringNullableFilter<'User'> | string | null;
      posts?: PostListRelationFilter;
   };

   export type UserOrderByWithRelationInput = {
      id?: SortOrder;
      email?: SortOrder;
      name?: SortOrderInput | SortOrder;
      posts?: PostOrderByRelationAggregateInput;
   };

   export type UserWhereUniqueInput = Prisma.AtLeast<
      {
         id?: number;
         email?: string;
         AND?: UserWhereInput | UserWhereInput[];
         OR?: UserWhereInput[];
         NOT?: UserWhereInput | UserWhereInput[];
         name?: StringNullableFilter<'User'> | string | null;
         posts?: PostListRelationFilter;
      },
      'id' | 'email'
   >;

   export type UserOrderByWithAggregationInput = {
      id?: SortOrder;
      email?: SortOrder;
      name?: SortOrderInput | SortOrder;
      _count?: UserCountOrderByAggregateInput;
      _avg?: UserAvgOrderByAggregateInput;
      _max?: UserMaxOrderByAggregateInput;
      _min?: UserMinOrderByAggregateInput;
      _sum?: UserSumOrderByAggregateInput;
   };

   export type UserScalarWhereWithAggregatesInput = {
      AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[];
      OR?: UserScalarWhereWithAggregatesInput[];
      NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[];
      id?: IntWithAggregatesFilter<'User'> | number;
      email?: StringWithAggregatesFilter<'User'> | string;
      name?: StringNullableWithAggregatesFilter<'User'> | string | null;
   };

   export type PostWhereInput = {
      AND?: PostWhereInput | PostWhereInput[];
      OR?: PostWhereInput[];
      NOT?: PostWhereInput | PostWhereInput[];
      id?: IntFilter<'Post'> | number;
      title?: StringFilter<'Post'> | string;
      content?: StringNullableFilter<'Post'> | string | null;
      published?: BoolFilter<'Post'> | boolean;
      authorId?: IntFilter<'Post'> | number;
      author?: XOR<UserScalarRelationFilter, UserWhereInput>;
   };

   export type PostOrderByWithRelationInput = {
      id?: SortOrder;
      title?: SortOrder;
      content?: SortOrderInput | SortOrder;
      published?: SortOrder;
      authorId?: SortOrder;
      author?: UserOrderByWithRelationInput;
   };

   export type PostWhereUniqueInput = Prisma.AtLeast<
      {
         id?: number;
         AND?: PostWhereInput | PostWhereInput[];
         OR?: PostWhereInput[];
         NOT?: PostWhereInput | PostWhereInput[];
         title?: StringFilter<'Post'> | string;
         content?: StringNullableFilter<'Post'> | string | null;
         published?: BoolFilter<'Post'> | boolean;
         authorId?: IntFilter<'Post'> | number;
         author?: XOR<UserScalarRelationFilter, UserWhereInput>;
      },
      'id'
   >;

   export type PostOrderByWithAggregationInput = {
      id?: SortOrder;
      title?: SortOrder;
      content?: SortOrderInput | SortOrder;
      published?: SortOrder;
      authorId?: SortOrder;
      _count?: PostCountOrderByAggregateInput;
      _avg?: PostAvgOrderByAggregateInput;
      _max?: PostMaxOrderByAggregateInput;
      _min?: PostMinOrderByAggregateInput;
      _sum?: PostSumOrderByAggregateInput;
   };

   export type PostScalarWhereWithAggregatesInput = {
      AND?: PostScalarWhereWithAggregatesInput | PostScalarWhereWithAggregatesInput[];
      OR?: PostScalarWhereWithAggregatesInput[];
      NOT?: PostScalarWhereWithAggregatesInput | PostScalarWhereWithAggregatesInput[];
      id?: IntWithAggregatesFilter<'Post'> | number;
      title?: StringWithAggregatesFilter<'Post'> | string;
      content?: StringNullableWithAggregatesFilter<'Post'> | string | null;
      published?: BoolWithAggregatesFilter<'Post'> | boolean;
      authorId?: IntWithAggregatesFilter<'Post'> | number;
   };

   export type CompanyWhereInput = {
      AND?: CompanyWhereInput | CompanyWhereInput[];
      OR?: CompanyWhereInput[];
      NOT?: CompanyWhereInput | CompanyWhereInput[];
      id?: StringFilter<'Company'> | string;
      name?: StringFilter<'Company'> | string;
      email?: StringFilter<'Company'> | string;
      description?: StringNullableFilter<'Company'> | string | null;
      website?: StringNullableFilter<'Company'> | string | null;
      createdAt?: DateTimeFilter<'Company'> | Date | string;
      updatedAt?: DateTimeFilter<'Company'> | Date | string;
      teams?: TeamListRelationFilter;
      onboardings?: OnboardingListRelationFilter;
   };

   export type CompanyOrderByWithRelationInput = {
      id?: SortOrder;
      name?: SortOrder;
      email?: SortOrder;
      description?: SortOrderInput | SortOrder;
      website?: SortOrderInput | SortOrder;
      createdAt?: SortOrder;
      updatedAt?: SortOrder;
      teams?: TeamOrderByRelationAggregateInput;
      onboardings?: OnboardingOrderByRelationAggregateInput;
   };

   export type CompanyWhereUniqueInput = Prisma.AtLeast<
      {
         id?: string;
         email?: string;
         AND?: CompanyWhereInput | CompanyWhereInput[];
         OR?: CompanyWhereInput[];
         NOT?: CompanyWhereInput | CompanyWhereInput[];
         name?: StringFilter<'Company'> | string;
         description?: StringNullableFilter<'Company'> | string | null;
         website?: StringNullableFilter<'Company'> | string | null;
         createdAt?: DateTimeFilter<'Company'> | Date | string;
         updatedAt?: DateTimeFilter<'Company'> | Date | string;
         teams?: TeamListRelationFilter;
         onboardings?: OnboardingListRelationFilter;
      },
      'id' | 'email'
   >;

   export type CompanyOrderByWithAggregationInput = {
      id?: SortOrder;
      name?: SortOrder;
      email?: SortOrder;
      description?: SortOrderInput | SortOrder;
      website?: SortOrderInput | SortOrder;
      createdAt?: SortOrder;
      updatedAt?: SortOrder;
      _count?: CompanyCountOrderByAggregateInput;
      _max?: CompanyMaxOrderByAggregateInput;
      _min?: CompanyMinOrderByAggregateInput;
   };

   export type CompanyScalarWhereWithAggregatesInput = {
      AND?: CompanyScalarWhereWithAggregatesInput | CompanyScalarWhereWithAggregatesInput[];
      OR?: CompanyScalarWhereWithAggregatesInput[];
      NOT?: CompanyScalarWhereWithAggregatesInput | CompanyScalarWhereWithAggregatesInput[];
      id?: StringWithAggregatesFilter<'Company'> | string;
      name?: StringWithAggregatesFilter<'Company'> | string;
      email?: StringWithAggregatesFilter<'Company'> | string;
      description?: StringNullableWithAggregatesFilter<'Company'> | string | null;
      website?: StringNullableWithAggregatesFilter<'Company'> | string | null;
      createdAt?: DateTimeWithAggregatesFilter<'Company'> | Date | string;
      updatedAt?: DateTimeWithAggregatesFilter<'Company'> | Date | string;
   };

   export type TeamWhereInput = {
      AND?: TeamWhereInput | TeamWhereInput[];
      OR?: TeamWhereInput[];
      NOT?: TeamWhereInput | TeamWhereInput[];
      id?: StringFilter<'Team'> | string;
      name?: StringFilter<'Team'> | string;
      description?: StringNullableFilter<'Team'> | string | null;
      createdAt?: DateTimeFilter<'Team'> | Date | string;
      updatedAt?: DateTimeFilter<'Team'> | Date | string;
      companyId?: StringFilter<'Team'> | string;
      company?: XOR<CompanyScalarRelationFilter, CompanyWhereInput>;
      onboardings?: OnboardingListRelationFilter;
   };

   export type TeamOrderByWithRelationInput = {
      id?: SortOrder;
      name?: SortOrder;
      description?: SortOrderInput | SortOrder;
      createdAt?: SortOrder;
      updatedAt?: SortOrder;
      companyId?: SortOrder;
      company?: CompanyOrderByWithRelationInput;
      onboardings?: OnboardingOrderByRelationAggregateInput;
   };

   export type TeamWhereUniqueInput = Prisma.AtLeast<
      {
         id?: string;
         AND?: TeamWhereInput | TeamWhereInput[];
         OR?: TeamWhereInput[];
         NOT?: TeamWhereInput | TeamWhereInput[];
         name?: StringFilter<'Team'> | string;
         description?: StringNullableFilter<'Team'> | string | null;
         createdAt?: DateTimeFilter<'Team'> | Date | string;
         updatedAt?: DateTimeFilter<'Team'> | Date | string;
         companyId?: StringFilter<'Team'> | string;
         company?: XOR<CompanyScalarRelationFilter, CompanyWhereInput>;
         onboardings?: OnboardingListRelationFilter;
      },
      'id'
   >;

   export type TeamOrderByWithAggregationInput = {
      id?: SortOrder;
      name?: SortOrder;
      description?: SortOrderInput | SortOrder;
      createdAt?: SortOrder;
      updatedAt?: SortOrder;
      companyId?: SortOrder;
      _count?: TeamCountOrderByAggregateInput;
      _max?: TeamMaxOrderByAggregateInput;
      _min?: TeamMinOrderByAggregateInput;
   };

   export type TeamScalarWhereWithAggregatesInput = {
      AND?: TeamScalarWhereWithAggregatesInput | TeamScalarWhereWithAggregatesInput[];
      OR?: TeamScalarWhereWithAggregatesInput[];
      NOT?: TeamScalarWhereWithAggregatesInput | TeamScalarWhereWithAggregatesInput[];
      id?: StringWithAggregatesFilter<'Team'> | string;
      name?: StringWithAggregatesFilter<'Team'> | string;
      description?: StringNullableWithAggregatesFilter<'Team'> | string | null;
      createdAt?: DateTimeWithAggregatesFilter<'Team'> | Date | string;
      updatedAt?: DateTimeWithAggregatesFilter<'Team'> | Date | string;
      companyId?: StringWithAggregatesFilter<'Team'> | string;
   };

   export type OnboardingWhereInput = {
      AND?: OnboardingWhereInput | OnboardingWhereInput[];
      OR?: OnboardingWhereInput[];
      NOT?: OnboardingWhereInput | OnboardingWhereInput[];
      id?: StringFilter<'Onboarding'> | string;
      employeeName?: StringFilter<'Onboarding'> | string;
      employeeEmail?: StringFilter<'Onboarding'> | string;
      position?: StringFilter<'Onboarding'> | string;
      startDate?: DateTimeFilter<'Onboarding'> | Date | string;
      status?: EnumOnboardingStatusFilter<'Onboarding'> | $Enums.OnboardingStatus;
      notes?: StringNullableFilter<'Onboarding'> | string | null;
      createdAt?: DateTimeFilter<'Onboarding'> | Date | string;
      updatedAt?: DateTimeFilter<'Onboarding'> | Date | string;
      companyId?: StringFilter<'Onboarding'> | string;
      teamId?: StringNullableFilter<'Onboarding'> | string | null;
      company?: XOR<CompanyScalarRelationFilter, CompanyWhereInput>;
      team?: XOR<TeamNullableScalarRelationFilter, TeamWhereInput> | null;
   };

   export type OnboardingOrderByWithRelationInput = {
      id?: SortOrder;
      employeeName?: SortOrder;
      employeeEmail?: SortOrder;
      position?: SortOrder;
      startDate?: SortOrder;
      status?: SortOrder;
      notes?: SortOrderInput | SortOrder;
      createdAt?: SortOrder;
      updatedAt?: SortOrder;
      companyId?: SortOrder;
      teamId?: SortOrderInput | SortOrder;
      company?: CompanyOrderByWithRelationInput;
      team?: TeamOrderByWithRelationInput;
   };

   export type OnboardingWhereUniqueInput = Prisma.AtLeast<
      {
         id?: string;
         AND?: OnboardingWhereInput | OnboardingWhereInput[];
         OR?: OnboardingWhereInput[];
         NOT?: OnboardingWhereInput | OnboardingWhereInput[];
         employeeName?: StringFilter<'Onboarding'> | string;
         employeeEmail?: StringFilter<'Onboarding'> | string;
         position?: StringFilter<'Onboarding'> | string;
         startDate?: DateTimeFilter<'Onboarding'> | Date | string;
         status?: EnumOnboardingStatusFilter<'Onboarding'> | $Enums.OnboardingStatus;
         notes?: StringNullableFilter<'Onboarding'> | string | null;
         createdAt?: DateTimeFilter<'Onboarding'> | Date | string;
         updatedAt?: DateTimeFilter<'Onboarding'> | Date | string;
         companyId?: StringFilter<'Onboarding'> | string;
         teamId?: StringNullableFilter<'Onboarding'> | string | null;
         company?: XOR<CompanyScalarRelationFilter, CompanyWhereInput>;
         team?: XOR<TeamNullableScalarRelationFilter, TeamWhereInput> | null;
      },
      'id'
   >;

   export type OnboardingOrderByWithAggregationInput = {
      id?: SortOrder;
      employeeName?: SortOrder;
      employeeEmail?: SortOrder;
      position?: SortOrder;
      startDate?: SortOrder;
      status?: SortOrder;
      notes?: SortOrderInput | SortOrder;
      createdAt?: SortOrder;
      updatedAt?: SortOrder;
      companyId?: SortOrder;
      teamId?: SortOrderInput | SortOrder;
      _count?: OnboardingCountOrderByAggregateInput;
      _max?: OnboardingMaxOrderByAggregateInput;
      _min?: OnboardingMinOrderByAggregateInput;
   };

   export type OnboardingScalarWhereWithAggregatesInput = {
      AND?: OnboardingScalarWhereWithAggregatesInput | OnboardingScalarWhereWithAggregatesInput[];
      OR?: OnboardingScalarWhereWithAggregatesInput[];
      NOT?: OnboardingScalarWhereWithAggregatesInput | OnboardingScalarWhereWithAggregatesInput[];
      id?: StringWithAggregatesFilter<'Onboarding'> | string;
      employeeName?: StringWithAggregatesFilter<'Onboarding'> | string;
      employeeEmail?: StringWithAggregatesFilter<'Onboarding'> | string;
      position?: StringWithAggregatesFilter<'Onboarding'> | string;
      startDate?: DateTimeWithAggregatesFilter<'Onboarding'> | Date | string;
      status?: EnumOnboardingStatusWithAggregatesFilter<'Onboarding'> | $Enums.OnboardingStatus;
      notes?: StringNullableWithAggregatesFilter<'Onboarding'> | string | null;
      createdAt?: DateTimeWithAggregatesFilter<'Onboarding'> | Date | string;
      updatedAt?: DateTimeWithAggregatesFilter<'Onboarding'> | Date | string;
      companyId?: StringWithAggregatesFilter<'Onboarding'> | string;
      teamId?: StringNullableWithAggregatesFilter<'Onboarding'> | string | null;
   };

   export type UserCreateInput = {
      email: string;
      name?: string | null;
      posts?: PostCreateNestedManyWithoutAuthorInput;
   };

   export type UserUncheckedCreateInput = {
      id?: number;
      email: string;
      name?: string | null;
      posts?: PostUncheckedCreateNestedManyWithoutAuthorInput;
   };

   export type UserUpdateInput = {
      email?: StringFieldUpdateOperationsInput | string;
      name?: NullableStringFieldUpdateOperationsInput | string | null;
      posts?: PostUpdateManyWithoutAuthorNestedInput;
   };

   export type UserUncheckedUpdateInput = {
      id?: IntFieldUpdateOperationsInput | number;
      email?: StringFieldUpdateOperationsInput | string;
      name?: NullableStringFieldUpdateOperationsInput | string | null;
      posts?: PostUncheckedUpdateManyWithoutAuthorNestedInput;
   };

   export type UserCreateManyInput = {
      id?: number;
      email: string;
      name?: string | null;
   };

   export type UserUpdateManyMutationInput = {
      email?: StringFieldUpdateOperationsInput | string;
      name?: NullableStringFieldUpdateOperationsInput | string | null;
   };

   export type UserUncheckedUpdateManyInput = {
      id?: IntFieldUpdateOperationsInput | number;
      email?: StringFieldUpdateOperationsInput | string;
      name?: NullableStringFieldUpdateOperationsInput | string | null;
   };

   export type PostCreateInput = {
      title: string;
      content?: string | null;
      published?: boolean;
      author: UserCreateNestedOneWithoutPostsInput;
   };

   export type PostUncheckedCreateInput = {
      id?: number;
      title: string;
      content?: string | null;
      published?: boolean;
      authorId: number;
   };

   export type PostUpdateInput = {
      title?: StringFieldUpdateOperationsInput | string;
      content?: NullableStringFieldUpdateOperationsInput | string | null;
      published?: BoolFieldUpdateOperationsInput | boolean;
      author?: UserUpdateOneRequiredWithoutPostsNestedInput;
   };

   export type PostUncheckedUpdateInput = {
      id?: IntFieldUpdateOperationsInput | number;
      title?: StringFieldUpdateOperationsInput | string;
      content?: NullableStringFieldUpdateOperationsInput | string | null;
      published?: BoolFieldUpdateOperationsInput | boolean;
      authorId?: IntFieldUpdateOperationsInput | number;
   };

   export type PostCreateManyInput = {
      id?: number;
      title: string;
      content?: string | null;
      published?: boolean;
      authorId: number;
   };

   export type PostUpdateManyMutationInput = {
      title?: StringFieldUpdateOperationsInput | string;
      content?: NullableStringFieldUpdateOperationsInput | string | null;
      published?: BoolFieldUpdateOperationsInput | boolean;
   };

   export type PostUncheckedUpdateManyInput = {
      id?: IntFieldUpdateOperationsInput | number;
      title?: StringFieldUpdateOperationsInput | string;
      content?: NullableStringFieldUpdateOperationsInput | string | null;
      published?: BoolFieldUpdateOperationsInput | boolean;
      authorId?: IntFieldUpdateOperationsInput | number;
   };

   export type CompanyCreateInput = {
      id?: string;
      name: string;
      email: string;
      description?: string | null;
      website?: string | null;
      createdAt?: Date | string;
      updatedAt?: Date | string;
      teams?: TeamCreateNestedManyWithoutCompanyInput;
      onboardings?: OnboardingCreateNestedManyWithoutCompanyInput;
   };

   export type CompanyUncheckedCreateInput = {
      id?: string;
      name: string;
      email: string;
      description?: string | null;
      website?: string | null;
      createdAt?: Date | string;
      updatedAt?: Date | string;
      teams?: TeamUncheckedCreateNestedManyWithoutCompanyInput;
      onboardings?: OnboardingUncheckedCreateNestedManyWithoutCompanyInput;
   };

   export type CompanyUpdateInput = {
      id?: StringFieldUpdateOperationsInput | string;
      name?: StringFieldUpdateOperationsInput | string;
      email?: StringFieldUpdateOperationsInput | string;
      description?: NullableStringFieldUpdateOperationsInput | string | null;
      website?: NullableStringFieldUpdateOperationsInput | string | null;
      createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
      updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
      teams?: TeamUpdateManyWithoutCompanyNestedInput;
      onboardings?: OnboardingUpdateManyWithoutCompanyNestedInput;
   };

   export type CompanyUncheckedUpdateInput = {
      id?: StringFieldUpdateOperationsInput | string;
      name?: StringFieldUpdateOperationsInput | string;
      email?: StringFieldUpdateOperationsInput | string;
      description?: NullableStringFieldUpdateOperationsInput | string | null;
      website?: NullableStringFieldUpdateOperationsInput | string | null;
      createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
      updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
      teams?: TeamUncheckedUpdateManyWithoutCompanyNestedInput;
      onboardings?: OnboardingUncheckedUpdateManyWithoutCompanyNestedInput;
   };

   export type CompanyCreateManyInput = {
      id?: string;
      name: string;
      email: string;
      description?: string | null;
      website?: string | null;
      createdAt?: Date | string;
      updatedAt?: Date | string;
   };

   export type CompanyUpdateManyMutationInput = {
      id?: StringFieldUpdateOperationsInput | string;
      name?: StringFieldUpdateOperationsInput | string;
      email?: StringFieldUpdateOperationsInput | string;
      description?: NullableStringFieldUpdateOperationsInput | string | null;
      website?: NullableStringFieldUpdateOperationsInput | string | null;
      createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
      updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
   };

   export type CompanyUncheckedUpdateManyInput = {
      id?: StringFieldUpdateOperationsInput | string;
      name?: StringFieldUpdateOperationsInput | string;
      email?: StringFieldUpdateOperationsInput | string;
      description?: NullableStringFieldUpdateOperationsInput | string | null;
      website?: NullableStringFieldUpdateOperationsInput | string | null;
      createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
      updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
   };

   export type TeamCreateInput = {
      id?: string;
      name: string;
      description?: string | null;
      createdAt?: Date | string;
      updatedAt?: Date | string;
      company: CompanyCreateNestedOneWithoutTeamsInput;
      onboardings?: OnboardingCreateNestedManyWithoutTeamInput;
   };

   export type TeamUncheckedCreateInput = {
      id?: string;
      name: string;
      description?: string | null;
      createdAt?: Date | string;
      updatedAt?: Date | string;
      companyId: string;
      onboardings?: OnboardingUncheckedCreateNestedManyWithoutTeamInput;
   };

   export type TeamUpdateInput = {
      id?: StringFieldUpdateOperationsInput | string;
      name?: StringFieldUpdateOperationsInput | string;
      description?: NullableStringFieldUpdateOperationsInput | string | null;
      createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
      updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
      company?: CompanyUpdateOneRequiredWithoutTeamsNestedInput;
      onboardings?: OnboardingUpdateManyWithoutTeamNestedInput;
   };

   export type TeamUncheckedUpdateInput = {
      id?: StringFieldUpdateOperationsInput | string;
      name?: StringFieldUpdateOperationsInput | string;
      description?: NullableStringFieldUpdateOperationsInput | string | null;
      createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
      updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
      companyId?: StringFieldUpdateOperationsInput | string;
      onboardings?: OnboardingUncheckedUpdateManyWithoutTeamNestedInput;
   };

   export type TeamCreateManyInput = {
      id?: string;
      name: string;
      description?: string | null;
      createdAt?: Date | string;
      updatedAt?: Date | string;
      companyId: string;
   };

   export type TeamUpdateManyMutationInput = {
      id?: StringFieldUpdateOperationsInput | string;
      name?: StringFieldUpdateOperationsInput | string;
      description?: NullableStringFieldUpdateOperationsInput | string | null;
      createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
      updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
   };

   export type TeamUncheckedUpdateManyInput = {
      id?: StringFieldUpdateOperationsInput | string;
      name?: StringFieldUpdateOperationsInput | string;
      description?: NullableStringFieldUpdateOperationsInput | string | null;
      createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
      updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
      companyId?: StringFieldUpdateOperationsInput | string;
   };

   export type OnboardingCreateInput = {
      id?: string;
      employeeName: string;
      employeeEmail: string;
      position: string;
      startDate: Date | string;
      status?: $Enums.OnboardingStatus;
      notes?: string | null;
      createdAt?: Date | string;
      updatedAt?: Date | string;
      company: CompanyCreateNestedOneWithoutOnboardingsInput;
      team?: TeamCreateNestedOneWithoutOnboardingsInput;
   };

   export type OnboardingUncheckedCreateInput = {
      id?: string;
      employeeName: string;
      employeeEmail: string;
      position: string;
      startDate: Date | string;
      status?: $Enums.OnboardingStatus;
      notes?: string | null;
      createdAt?: Date | string;
      updatedAt?: Date | string;
      companyId: string;
      teamId?: string | null;
   };

   export type OnboardingUpdateInput = {
      id?: StringFieldUpdateOperationsInput | string;
      employeeName?: StringFieldUpdateOperationsInput | string;
      employeeEmail?: StringFieldUpdateOperationsInput | string;
      position?: StringFieldUpdateOperationsInput | string;
      startDate?: DateTimeFieldUpdateOperationsInput | Date | string;
      status?: EnumOnboardingStatusFieldUpdateOperationsInput | $Enums.OnboardingStatus;
      notes?: NullableStringFieldUpdateOperationsInput | string | null;
      createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
      updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
      company?: CompanyUpdateOneRequiredWithoutOnboardingsNestedInput;
      team?: TeamUpdateOneWithoutOnboardingsNestedInput;
   };

   export type OnboardingUncheckedUpdateInput = {
      id?: StringFieldUpdateOperationsInput | string;
      employeeName?: StringFieldUpdateOperationsInput | string;
      employeeEmail?: StringFieldUpdateOperationsInput | string;
      position?: StringFieldUpdateOperationsInput | string;
      startDate?: DateTimeFieldUpdateOperationsInput | Date | string;
      status?: EnumOnboardingStatusFieldUpdateOperationsInput | $Enums.OnboardingStatus;
      notes?: NullableStringFieldUpdateOperationsInput | string | null;
      createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
      updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
      companyId?: StringFieldUpdateOperationsInput | string;
      teamId?: NullableStringFieldUpdateOperationsInput | string | null;
   };

   export type OnboardingCreateManyInput = {
      id?: string;
      employeeName: string;
      employeeEmail: string;
      position: string;
      startDate: Date | string;
      status?: $Enums.OnboardingStatus;
      notes?: string | null;
      createdAt?: Date | string;
      updatedAt?: Date | string;
      companyId: string;
      teamId?: string | null;
   };

   export type OnboardingUpdateManyMutationInput = {
      id?: StringFieldUpdateOperationsInput | string;
      employeeName?: StringFieldUpdateOperationsInput | string;
      employeeEmail?: StringFieldUpdateOperationsInput | string;
      position?: StringFieldUpdateOperationsInput | string;
      startDate?: DateTimeFieldUpdateOperationsInput | Date | string;
      status?: EnumOnboardingStatusFieldUpdateOperationsInput | $Enums.OnboardingStatus;
      notes?: NullableStringFieldUpdateOperationsInput | string | null;
      createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
      updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
   };

   export type OnboardingUncheckedUpdateManyInput = {
      id?: StringFieldUpdateOperationsInput | string;
      employeeName?: StringFieldUpdateOperationsInput | string;
      employeeEmail?: StringFieldUpdateOperationsInput | string;
      position?: StringFieldUpdateOperationsInput | string;
      startDate?: DateTimeFieldUpdateOperationsInput | Date | string;
      status?: EnumOnboardingStatusFieldUpdateOperationsInput | $Enums.OnboardingStatus;
      notes?: NullableStringFieldUpdateOperationsInput | string | null;
      createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
      updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
      companyId?: StringFieldUpdateOperationsInput | string;
      teamId?: NullableStringFieldUpdateOperationsInput | string | null;
   };

   export type IntFilter<$PrismaModel = never> = {
      equals?: number | IntFieldRefInput<$PrismaModel>;
      in?: number[] | ListIntFieldRefInput<$PrismaModel>;
      notIn?: number[] | ListIntFieldRefInput<$PrismaModel>;
      lt?: number | IntFieldRefInput<$PrismaModel>;
      lte?: number | IntFieldRefInput<$PrismaModel>;
      gt?: number | IntFieldRefInput<$PrismaModel>;
      gte?: number | IntFieldRefInput<$PrismaModel>;
      not?: NestedIntFilter<$PrismaModel> | number;
   };

   export type StringFilter<$PrismaModel = never> = {
      equals?: string | StringFieldRefInput<$PrismaModel>;
      in?: string[] | ListStringFieldRefInput<$PrismaModel>;
      notIn?: string[] | ListStringFieldRefInput<$PrismaModel>;
      lt?: string | StringFieldRefInput<$PrismaModel>;
      lte?: string | StringFieldRefInput<$PrismaModel>;
      gt?: string | StringFieldRefInput<$PrismaModel>;
      gte?: string | StringFieldRefInput<$PrismaModel>;
      contains?: string | StringFieldRefInput<$PrismaModel>;
      startsWith?: string | StringFieldRefInput<$PrismaModel>;
      endsWith?: string | StringFieldRefInput<$PrismaModel>;
      mode?: QueryMode;
      not?: NestedStringFilter<$PrismaModel> | string;
   };

   export type StringNullableFilter<$PrismaModel = never> = {
      equals?: string | StringFieldRefInput<$PrismaModel> | null;
      in?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
      notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
      lt?: string | StringFieldRefInput<$PrismaModel>;
      lte?: string | StringFieldRefInput<$PrismaModel>;
      gt?: string | StringFieldRefInput<$PrismaModel>;
      gte?: string | StringFieldRefInput<$PrismaModel>;
      contains?: string | StringFieldRefInput<$PrismaModel>;
      startsWith?: string | StringFieldRefInput<$PrismaModel>;
      endsWith?: string | StringFieldRefInput<$PrismaModel>;
      mode?: QueryMode;
      not?: NestedStringNullableFilter<$PrismaModel> | string | null;
   };

   export type PostListRelationFilter = {
      every?: PostWhereInput;
      some?: PostWhereInput;
      none?: PostWhereInput;
   };

   export type SortOrderInput = {
      sort: SortOrder;
      nulls?: NullsOrder;
   };

   export type PostOrderByRelationAggregateInput = {
      _count?: SortOrder;
   };

   export type UserCountOrderByAggregateInput = {
      id?: SortOrder;
      email?: SortOrder;
      name?: SortOrder;
   };

   export type UserAvgOrderByAggregateInput = {
      id?: SortOrder;
   };

   export type UserMaxOrderByAggregateInput = {
      id?: SortOrder;
      email?: SortOrder;
      name?: SortOrder;
   };

   export type UserMinOrderByAggregateInput = {
      id?: SortOrder;
      email?: SortOrder;
      name?: SortOrder;
   };

   export type UserSumOrderByAggregateInput = {
      id?: SortOrder;
   };

   export type IntWithAggregatesFilter<$PrismaModel = never> = {
      equals?: number | IntFieldRefInput<$PrismaModel>;
      in?: number[] | ListIntFieldRefInput<$PrismaModel>;
      notIn?: number[] | ListIntFieldRefInput<$PrismaModel>;
      lt?: number | IntFieldRefInput<$PrismaModel>;
      lte?: number | IntFieldRefInput<$PrismaModel>;
      gt?: number | IntFieldRefInput<$PrismaModel>;
      gte?: number | IntFieldRefInput<$PrismaModel>;
      not?: NestedIntWithAggregatesFilter<$PrismaModel> | number;
      _count?: NestedIntFilter<$PrismaModel>;
      _avg?: NestedFloatFilter<$PrismaModel>;
      _sum?: NestedIntFilter<$PrismaModel>;
      _min?: NestedIntFilter<$PrismaModel>;
      _max?: NestedIntFilter<$PrismaModel>;
   };

   export type StringWithAggregatesFilter<$PrismaModel = never> = {
      equals?: string | StringFieldRefInput<$PrismaModel>;
      in?: string[] | ListStringFieldRefInput<$PrismaModel>;
      notIn?: string[] | ListStringFieldRefInput<$PrismaModel>;
      lt?: string | StringFieldRefInput<$PrismaModel>;
      lte?: string | StringFieldRefInput<$PrismaModel>;
      gt?: string | StringFieldRefInput<$PrismaModel>;
      gte?: string | StringFieldRefInput<$PrismaModel>;
      contains?: string | StringFieldRefInput<$PrismaModel>;
      startsWith?: string | StringFieldRefInput<$PrismaModel>;
      endsWith?: string | StringFieldRefInput<$PrismaModel>;
      mode?: QueryMode;
      not?: NestedStringWithAggregatesFilter<$PrismaModel> | string;
      _count?: NestedIntFilter<$PrismaModel>;
      _min?: NestedStringFilter<$PrismaModel>;
      _max?: NestedStringFilter<$PrismaModel>;
   };

   export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
      equals?: string | StringFieldRefInput<$PrismaModel> | null;
      in?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
      notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
      lt?: string | StringFieldRefInput<$PrismaModel>;
      lte?: string | StringFieldRefInput<$PrismaModel>;
      gt?: string | StringFieldRefInput<$PrismaModel>;
      gte?: string | StringFieldRefInput<$PrismaModel>;
      contains?: string | StringFieldRefInput<$PrismaModel>;
      startsWith?: string | StringFieldRefInput<$PrismaModel>;
      endsWith?: string | StringFieldRefInput<$PrismaModel>;
      mode?: QueryMode;
      not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null;
      _count?: NestedIntNullableFilter<$PrismaModel>;
      _min?: NestedStringNullableFilter<$PrismaModel>;
      _max?: NestedStringNullableFilter<$PrismaModel>;
   };

   export type BoolFilter<$PrismaModel = never> = {
      equals?: boolean | BooleanFieldRefInput<$PrismaModel>;
      not?: NestedBoolFilter<$PrismaModel> | boolean;
   };

   export type UserScalarRelationFilter = {
      is?: UserWhereInput;
      isNot?: UserWhereInput;
   };

   export type PostCountOrderByAggregateInput = {
      id?: SortOrder;
      title?: SortOrder;
      content?: SortOrder;
      published?: SortOrder;
      authorId?: SortOrder;
   };

   export type PostAvgOrderByAggregateInput = {
      id?: SortOrder;
      authorId?: SortOrder;
   };

   export type PostMaxOrderByAggregateInput = {
      id?: SortOrder;
      title?: SortOrder;
      content?: SortOrder;
      published?: SortOrder;
      authorId?: SortOrder;
   };

   export type PostMinOrderByAggregateInput = {
      id?: SortOrder;
      title?: SortOrder;
      content?: SortOrder;
      published?: SortOrder;
      authorId?: SortOrder;
   };

   export type PostSumOrderByAggregateInput = {
      id?: SortOrder;
      authorId?: SortOrder;
   };

   export type BoolWithAggregatesFilter<$PrismaModel = never> = {
      equals?: boolean | BooleanFieldRefInput<$PrismaModel>;
      not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean;
      _count?: NestedIntFilter<$PrismaModel>;
      _min?: NestedBoolFilter<$PrismaModel>;
      _max?: NestedBoolFilter<$PrismaModel>;
   };

   export type DateTimeFilter<$PrismaModel = never> = {
      equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
      in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
      notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
      lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
      lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
      gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
      gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
      not?: NestedDateTimeFilter<$PrismaModel> | Date | string;
   };

   export type TeamListRelationFilter = {
      every?: TeamWhereInput;
      some?: TeamWhereInput;
      none?: TeamWhereInput;
   };

   export type OnboardingListRelationFilter = {
      every?: OnboardingWhereInput;
      some?: OnboardingWhereInput;
      none?: OnboardingWhereInput;
   };

   export type TeamOrderByRelationAggregateInput = {
      _count?: SortOrder;
   };

   export type OnboardingOrderByRelationAggregateInput = {
      _count?: SortOrder;
   };

   export type CompanyCountOrderByAggregateInput = {
      id?: SortOrder;
      name?: SortOrder;
      email?: SortOrder;
      description?: SortOrder;
      website?: SortOrder;
      createdAt?: SortOrder;
      updatedAt?: SortOrder;
   };

   export type CompanyMaxOrderByAggregateInput = {
      id?: SortOrder;
      name?: SortOrder;
      email?: SortOrder;
      description?: SortOrder;
      website?: SortOrder;
      createdAt?: SortOrder;
      updatedAt?: SortOrder;
   };

   export type CompanyMinOrderByAggregateInput = {
      id?: SortOrder;
      name?: SortOrder;
      email?: SortOrder;
      description?: SortOrder;
      website?: SortOrder;
      createdAt?: SortOrder;
      updatedAt?: SortOrder;
   };

   export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
      equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
      in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
      notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
      lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
      lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
      gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
      gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
      not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string;
      _count?: NestedIntFilter<$PrismaModel>;
      _min?: NestedDateTimeFilter<$PrismaModel>;
      _max?: NestedDateTimeFilter<$PrismaModel>;
   };

   export type CompanyScalarRelationFilter = {
      is?: CompanyWhereInput;
      isNot?: CompanyWhereInput;
   };

   export type TeamCountOrderByAggregateInput = {
      id?: SortOrder;
      name?: SortOrder;
      description?: SortOrder;
      createdAt?: SortOrder;
      updatedAt?: SortOrder;
      companyId?: SortOrder;
   };

   export type TeamMaxOrderByAggregateInput = {
      id?: SortOrder;
      name?: SortOrder;
      description?: SortOrder;
      createdAt?: SortOrder;
      updatedAt?: SortOrder;
      companyId?: SortOrder;
   };

   export type TeamMinOrderByAggregateInput = {
      id?: SortOrder;
      name?: SortOrder;
      description?: SortOrder;
      createdAt?: SortOrder;
      updatedAt?: SortOrder;
      companyId?: SortOrder;
   };

   export type EnumOnboardingStatusFilter<$PrismaModel = never> = {
      equals?: $Enums.OnboardingStatus | EnumOnboardingStatusFieldRefInput<$PrismaModel>;
      in?: $Enums.OnboardingStatus[] | ListEnumOnboardingStatusFieldRefInput<$PrismaModel>;
      notIn?: $Enums.OnboardingStatus[] | ListEnumOnboardingStatusFieldRefInput<$PrismaModel>;
      not?: NestedEnumOnboardingStatusFilter<$PrismaModel> | $Enums.OnboardingStatus;
   };

   export type TeamNullableScalarRelationFilter = {
      is?: TeamWhereInput | null;
      isNot?: TeamWhereInput | null;
   };

   export type OnboardingCountOrderByAggregateInput = {
      id?: SortOrder;
      employeeName?: SortOrder;
      employeeEmail?: SortOrder;
      position?: SortOrder;
      startDate?: SortOrder;
      status?: SortOrder;
      notes?: SortOrder;
      createdAt?: SortOrder;
      updatedAt?: SortOrder;
      companyId?: SortOrder;
      teamId?: SortOrder;
   };

   export type OnboardingMaxOrderByAggregateInput = {
      id?: SortOrder;
      employeeName?: SortOrder;
      employeeEmail?: SortOrder;
      position?: SortOrder;
      startDate?: SortOrder;
      status?: SortOrder;
      notes?: SortOrder;
      createdAt?: SortOrder;
      updatedAt?: SortOrder;
      companyId?: SortOrder;
      teamId?: SortOrder;
   };

   export type OnboardingMinOrderByAggregateInput = {
      id?: SortOrder;
      employeeName?: SortOrder;
      employeeEmail?: SortOrder;
      position?: SortOrder;
      startDate?: SortOrder;
      status?: SortOrder;
      notes?: SortOrder;
      createdAt?: SortOrder;
      updatedAt?: SortOrder;
      companyId?: SortOrder;
      teamId?: SortOrder;
   };

   export type EnumOnboardingStatusWithAggregatesFilter<$PrismaModel = never> = {
      equals?: $Enums.OnboardingStatus | EnumOnboardingStatusFieldRefInput<$PrismaModel>;
      in?: $Enums.OnboardingStatus[] | ListEnumOnboardingStatusFieldRefInput<$PrismaModel>;
      notIn?: $Enums.OnboardingStatus[] | ListEnumOnboardingStatusFieldRefInput<$PrismaModel>;
      not?: NestedEnumOnboardingStatusWithAggregatesFilter<$PrismaModel> | $Enums.OnboardingStatus;
      _count?: NestedIntFilter<$PrismaModel>;
      _min?: NestedEnumOnboardingStatusFilter<$PrismaModel>;
      _max?: NestedEnumOnboardingStatusFilter<$PrismaModel>;
   };

   export type PostCreateNestedManyWithoutAuthorInput = {
      create?:
         | XOR<PostCreateWithoutAuthorInput, PostUncheckedCreateWithoutAuthorInput>
         | PostCreateWithoutAuthorInput[]
         | PostUncheckedCreateWithoutAuthorInput[];
      connectOrCreate?:
         | PostCreateOrConnectWithoutAuthorInput
         | PostCreateOrConnectWithoutAuthorInput[];
      createMany?: PostCreateManyAuthorInputEnvelope;
      connect?: PostWhereUniqueInput | PostWhereUniqueInput[];
   };

   export type PostUncheckedCreateNestedManyWithoutAuthorInput = {
      create?:
         | XOR<PostCreateWithoutAuthorInput, PostUncheckedCreateWithoutAuthorInput>
         | PostCreateWithoutAuthorInput[]
         | PostUncheckedCreateWithoutAuthorInput[];
      connectOrCreate?:
         | PostCreateOrConnectWithoutAuthorInput
         | PostCreateOrConnectWithoutAuthorInput[];
      createMany?: PostCreateManyAuthorInputEnvelope;
      connect?: PostWhereUniqueInput | PostWhereUniqueInput[];
   };

   export type StringFieldUpdateOperationsInput = {
      set?: string;
   };

   export type NullableStringFieldUpdateOperationsInput = {
      set?: string | null;
   };

   export type PostUpdateManyWithoutAuthorNestedInput = {
      create?:
         | XOR<PostCreateWithoutAuthorInput, PostUncheckedCreateWithoutAuthorInput>
         | PostCreateWithoutAuthorInput[]
         | PostUncheckedCreateWithoutAuthorInput[];
      connectOrCreate?:
         | PostCreateOrConnectWithoutAuthorInput
         | PostCreateOrConnectWithoutAuthorInput[];
      upsert?:
         | PostUpsertWithWhereUniqueWithoutAuthorInput
         | PostUpsertWithWhereUniqueWithoutAuthorInput[];
      createMany?: PostCreateManyAuthorInputEnvelope;
      set?: PostWhereUniqueInput | PostWhereUniqueInput[];
      disconnect?: PostWhereUniqueInput | PostWhereUniqueInput[];
      delete?: PostWhereUniqueInput | PostWhereUniqueInput[];
      connect?: PostWhereUniqueInput | PostWhereUniqueInput[];
      update?:
         | PostUpdateWithWhereUniqueWithoutAuthorInput
         | PostUpdateWithWhereUniqueWithoutAuthorInput[];
      updateMany?:
         | PostUpdateManyWithWhereWithoutAuthorInput
         | PostUpdateManyWithWhereWithoutAuthorInput[];
      deleteMany?: PostScalarWhereInput | PostScalarWhereInput[];
   };

   export type IntFieldUpdateOperationsInput = {
      set?: number;
      increment?: number;
      decrement?: number;
      multiply?: number;
      divide?: number;
   };

   export type PostUncheckedUpdateManyWithoutAuthorNestedInput = {
      create?:
         | XOR<PostCreateWithoutAuthorInput, PostUncheckedCreateWithoutAuthorInput>
         | PostCreateWithoutAuthorInput[]
         | PostUncheckedCreateWithoutAuthorInput[];
      connectOrCreate?:
         | PostCreateOrConnectWithoutAuthorInput
         | PostCreateOrConnectWithoutAuthorInput[];
      upsert?:
         | PostUpsertWithWhereUniqueWithoutAuthorInput
         | PostUpsertWithWhereUniqueWithoutAuthorInput[];
      createMany?: PostCreateManyAuthorInputEnvelope;
      set?: PostWhereUniqueInput | PostWhereUniqueInput[];
      disconnect?: PostWhereUniqueInput | PostWhereUniqueInput[];
      delete?: PostWhereUniqueInput | PostWhereUniqueInput[];
      connect?: PostWhereUniqueInput | PostWhereUniqueInput[];
      update?:
         | PostUpdateWithWhereUniqueWithoutAuthorInput
         | PostUpdateWithWhereUniqueWithoutAuthorInput[];
      updateMany?:
         | PostUpdateManyWithWhereWithoutAuthorInput
         | PostUpdateManyWithWhereWithoutAuthorInput[];
      deleteMany?: PostScalarWhereInput | PostScalarWhereInput[];
   };

   export type UserCreateNestedOneWithoutPostsInput = {
      create?: XOR<UserCreateWithoutPostsInput, UserUncheckedCreateWithoutPostsInput>;
      connectOrCreate?: UserCreateOrConnectWithoutPostsInput;
      connect?: UserWhereUniqueInput;
   };

   export type BoolFieldUpdateOperationsInput = {
      set?: boolean;
   };

   export type UserUpdateOneRequiredWithoutPostsNestedInput = {
      create?: XOR<UserCreateWithoutPostsInput, UserUncheckedCreateWithoutPostsInput>;
      connectOrCreate?: UserCreateOrConnectWithoutPostsInput;
      upsert?: UserUpsertWithoutPostsInput;
      connect?: UserWhereUniqueInput;
      update?: XOR<
         XOR<UserUpdateToOneWithWhereWithoutPostsInput, UserUpdateWithoutPostsInput>,
         UserUncheckedUpdateWithoutPostsInput
      >;
   };

   export type TeamCreateNestedManyWithoutCompanyInput = {
      create?:
         | XOR<TeamCreateWithoutCompanyInput, TeamUncheckedCreateWithoutCompanyInput>
         | TeamCreateWithoutCompanyInput[]
         | TeamUncheckedCreateWithoutCompanyInput[];
      connectOrCreate?:
         | TeamCreateOrConnectWithoutCompanyInput
         | TeamCreateOrConnectWithoutCompanyInput[];
      createMany?: TeamCreateManyCompanyInputEnvelope;
      connect?: TeamWhereUniqueInput | TeamWhereUniqueInput[];
   };

   export type OnboardingCreateNestedManyWithoutCompanyInput = {
      create?:
         | XOR<OnboardingCreateWithoutCompanyInput, OnboardingUncheckedCreateWithoutCompanyInput>
         | OnboardingCreateWithoutCompanyInput[]
         | OnboardingUncheckedCreateWithoutCompanyInput[];
      connectOrCreate?:
         | OnboardingCreateOrConnectWithoutCompanyInput
         | OnboardingCreateOrConnectWithoutCompanyInput[];
      createMany?: OnboardingCreateManyCompanyInputEnvelope;
      connect?: OnboardingWhereUniqueInput | OnboardingWhereUniqueInput[];
   };

   export type TeamUncheckedCreateNestedManyWithoutCompanyInput = {
      create?:
         | XOR<TeamCreateWithoutCompanyInput, TeamUncheckedCreateWithoutCompanyInput>
         | TeamCreateWithoutCompanyInput[]
         | TeamUncheckedCreateWithoutCompanyInput[];
      connectOrCreate?:
         | TeamCreateOrConnectWithoutCompanyInput
         | TeamCreateOrConnectWithoutCompanyInput[];
      createMany?: TeamCreateManyCompanyInputEnvelope;
      connect?: TeamWhereUniqueInput | TeamWhereUniqueInput[];
   };

   export type OnboardingUncheckedCreateNestedManyWithoutCompanyInput = {
      create?:
         | XOR<OnboardingCreateWithoutCompanyInput, OnboardingUncheckedCreateWithoutCompanyInput>
         | OnboardingCreateWithoutCompanyInput[]
         | OnboardingUncheckedCreateWithoutCompanyInput[];
      connectOrCreate?:
         | OnboardingCreateOrConnectWithoutCompanyInput
         | OnboardingCreateOrConnectWithoutCompanyInput[];
      createMany?: OnboardingCreateManyCompanyInputEnvelope;
      connect?: OnboardingWhereUniqueInput | OnboardingWhereUniqueInput[];
   };

   export type DateTimeFieldUpdateOperationsInput = {
      set?: Date | string;
   };

   export type TeamUpdateManyWithoutCompanyNestedInput = {
      create?:
         | XOR<TeamCreateWithoutCompanyInput, TeamUncheckedCreateWithoutCompanyInput>
         | TeamCreateWithoutCompanyInput[]
         | TeamUncheckedCreateWithoutCompanyInput[];
      connectOrCreate?:
         | TeamCreateOrConnectWithoutCompanyInput
         | TeamCreateOrConnectWithoutCompanyInput[];
      upsert?:
         | TeamUpsertWithWhereUniqueWithoutCompanyInput
         | TeamUpsertWithWhereUniqueWithoutCompanyInput[];
      createMany?: TeamCreateManyCompanyInputEnvelope;
      set?: TeamWhereUniqueInput | TeamWhereUniqueInput[];
      disconnect?: TeamWhereUniqueInput | TeamWhereUniqueInput[];
      delete?: TeamWhereUniqueInput | TeamWhereUniqueInput[];
      connect?: TeamWhereUniqueInput | TeamWhereUniqueInput[];
      update?:
         | TeamUpdateWithWhereUniqueWithoutCompanyInput
         | TeamUpdateWithWhereUniqueWithoutCompanyInput[];
      updateMany?:
         | TeamUpdateManyWithWhereWithoutCompanyInput
         | TeamUpdateManyWithWhereWithoutCompanyInput[];
      deleteMany?: TeamScalarWhereInput | TeamScalarWhereInput[];
   };

   export type OnboardingUpdateManyWithoutCompanyNestedInput = {
      create?:
         | XOR<OnboardingCreateWithoutCompanyInput, OnboardingUncheckedCreateWithoutCompanyInput>
         | OnboardingCreateWithoutCompanyInput[]
         | OnboardingUncheckedCreateWithoutCompanyInput[];
      connectOrCreate?:
         | OnboardingCreateOrConnectWithoutCompanyInput
         | OnboardingCreateOrConnectWithoutCompanyInput[];
      upsert?:
         | OnboardingUpsertWithWhereUniqueWithoutCompanyInput
         | OnboardingUpsertWithWhereUniqueWithoutCompanyInput[];
      createMany?: OnboardingCreateManyCompanyInputEnvelope;
      set?: OnboardingWhereUniqueInput | OnboardingWhereUniqueInput[];
      disconnect?: OnboardingWhereUniqueInput | OnboardingWhereUniqueInput[];
      delete?: OnboardingWhereUniqueInput | OnboardingWhereUniqueInput[];
      connect?: OnboardingWhereUniqueInput | OnboardingWhereUniqueInput[];
      update?:
         | OnboardingUpdateWithWhereUniqueWithoutCompanyInput
         | OnboardingUpdateWithWhereUniqueWithoutCompanyInput[];
      updateMany?:
         | OnboardingUpdateManyWithWhereWithoutCompanyInput
         | OnboardingUpdateManyWithWhereWithoutCompanyInput[];
      deleteMany?: OnboardingScalarWhereInput | OnboardingScalarWhereInput[];
   };

   export type TeamUncheckedUpdateManyWithoutCompanyNestedInput = {
      create?:
         | XOR<TeamCreateWithoutCompanyInput, TeamUncheckedCreateWithoutCompanyInput>
         | TeamCreateWithoutCompanyInput[]
         | TeamUncheckedCreateWithoutCompanyInput[];
      connectOrCreate?:
         | TeamCreateOrConnectWithoutCompanyInput
         | TeamCreateOrConnectWithoutCompanyInput[];
      upsert?:
         | TeamUpsertWithWhereUniqueWithoutCompanyInput
         | TeamUpsertWithWhereUniqueWithoutCompanyInput[];
      createMany?: TeamCreateManyCompanyInputEnvelope;
      set?: TeamWhereUniqueInput | TeamWhereUniqueInput[];
      disconnect?: TeamWhereUniqueInput | TeamWhereUniqueInput[];
      delete?: TeamWhereUniqueInput | TeamWhereUniqueInput[];
      connect?: TeamWhereUniqueInput | TeamWhereUniqueInput[];
      update?:
         | TeamUpdateWithWhereUniqueWithoutCompanyInput
         | TeamUpdateWithWhereUniqueWithoutCompanyInput[];
      updateMany?:
         | TeamUpdateManyWithWhereWithoutCompanyInput
         | TeamUpdateManyWithWhereWithoutCompanyInput[];
      deleteMany?: TeamScalarWhereInput | TeamScalarWhereInput[];
   };

   export type OnboardingUncheckedUpdateManyWithoutCompanyNestedInput = {
      create?:
         | XOR<OnboardingCreateWithoutCompanyInput, OnboardingUncheckedCreateWithoutCompanyInput>
         | OnboardingCreateWithoutCompanyInput[]
         | OnboardingUncheckedCreateWithoutCompanyInput[];
      connectOrCreate?:
         | OnboardingCreateOrConnectWithoutCompanyInput
         | OnboardingCreateOrConnectWithoutCompanyInput[];
      upsert?:
         | OnboardingUpsertWithWhereUniqueWithoutCompanyInput
         | OnboardingUpsertWithWhereUniqueWithoutCompanyInput[];
      createMany?: OnboardingCreateManyCompanyInputEnvelope;
      set?: OnboardingWhereUniqueInput | OnboardingWhereUniqueInput[];
      disconnect?: OnboardingWhereUniqueInput | OnboardingWhereUniqueInput[];
      delete?: OnboardingWhereUniqueInput | OnboardingWhereUniqueInput[];
      connect?: OnboardingWhereUniqueInput | OnboardingWhereUniqueInput[];
      update?:
         | OnboardingUpdateWithWhereUniqueWithoutCompanyInput
         | OnboardingUpdateWithWhereUniqueWithoutCompanyInput[];
      updateMany?:
         | OnboardingUpdateManyWithWhereWithoutCompanyInput
         | OnboardingUpdateManyWithWhereWithoutCompanyInput[];
      deleteMany?: OnboardingScalarWhereInput | OnboardingScalarWhereInput[];
   };

   export type CompanyCreateNestedOneWithoutTeamsInput = {
      create?: XOR<CompanyCreateWithoutTeamsInput, CompanyUncheckedCreateWithoutTeamsInput>;
      connectOrCreate?: CompanyCreateOrConnectWithoutTeamsInput;
      connect?: CompanyWhereUniqueInput;
   };

   export type OnboardingCreateNestedManyWithoutTeamInput = {
      create?:
         | XOR<OnboardingCreateWithoutTeamInput, OnboardingUncheckedCreateWithoutTeamInput>
         | OnboardingCreateWithoutTeamInput[]
         | OnboardingUncheckedCreateWithoutTeamInput[];
      connectOrCreate?:
         | OnboardingCreateOrConnectWithoutTeamInput
         | OnboardingCreateOrConnectWithoutTeamInput[];
      createMany?: OnboardingCreateManyTeamInputEnvelope;
      connect?: OnboardingWhereUniqueInput | OnboardingWhereUniqueInput[];
   };

   export type OnboardingUncheckedCreateNestedManyWithoutTeamInput = {
      create?:
         | XOR<OnboardingCreateWithoutTeamInput, OnboardingUncheckedCreateWithoutTeamInput>
         | OnboardingCreateWithoutTeamInput[]
         | OnboardingUncheckedCreateWithoutTeamInput[];
      connectOrCreate?:
         | OnboardingCreateOrConnectWithoutTeamInput
         | OnboardingCreateOrConnectWithoutTeamInput[];
      createMany?: OnboardingCreateManyTeamInputEnvelope;
      connect?: OnboardingWhereUniqueInput | OnboardingWhereUniqueInput[];
   };

   export type CompanyUpdateOneRequiredWithoutTeamsNestedInput = {
      create?: XOR<CompanyCreateWithoutTeamsInput, CompanyUncheckedCreateWithoutTeamsInput>;
      connectOrCreate?: CompanyCreateOrConnectWithoutTeamsInput;
      upsert?: CompanyUpsertWithoutTeamsInput;
      connect?: CompanyWhereUniqueInput;
      update?: XOR<
         XOR<CompanyUpdateToOneWithWhereWithoutTeamsInput, CompanyUpdateWithoutTeamsInput>,
         CompanyUncheckedUpdateWithoutTeamsInput
      >;
   };

   export type OnboardingUpdateManyWithoutTeamNestedInput = {
      create?:
         | XOR<OnboardingCreateWithoutTeamInput, OnboardingUncheckedCreateWithoutTeamInput>
         | OnboardingCreateWithoutTeamInput[]
         | OnboardingUncheckedCreateWithoutTeamInput[];
      connectOrCreate?:
         | OnboardingCreateOrConnectWithoutTeamInput
         | OnboardingCreateOrConnectWithoutTeamInput[];
      upsert?:
         | OnboardingUpsertWithWhereUniqueWithoutTeamInput
         | OnboardingUpsertWithWhereUniqueWithoutTeamInput[];
      createMany?: OnboardingCreateManyTeamInputEnvelope;
      set?: OnboardingWhereUniqueInput | OnboardingWhereUniqueInput[];
      disconnect?: OnboardingWhereUniqueInput | OnboardingWhereUniqueInput[];
      delete?: OnboardingWhereUniqueInput | OnboardingWhereUniqueInput[];
      connect?: OnboardingWhereUniqueInput | OnboardingWhereUniqueInput[];
      update?:
         | OnboardingUpdateWithWhereUniqueWithoutTeamInput
         | OnboardingUpdateWithWhereUniqueWithoutTeamInput[];
      updateMany?:
         | OnboardingUpdateManyWithWhereWithoutTeamInput
         | OnboardingUpdateManyWithWhereWithoutTeamInput[];
      deleteMany?: OnboardingScalarWhereInput | OnboardingScalarWhereInput[];
   };

   export type OnboardingUncheckedUpdateManyWithoutTeamNestedInput = {
      create?:
         | XOR<OnboardingCreateWithoutTeamInput, OnboardingUncheckedCreateWithoutTeamInput>
         | OnboardingCreateWithoutTeamInput[]
         | OnboardingUncheckedCreateWithoutTeamInput[];
      connectOrCreate?:
         | OnboardingCreateOrConnectWithoutTeamInput
         | OnboardingCreateOrConnectWithoutTeamInput[];
      upsert?:
         | OnboardingUpsertWithWhereUniqueWithoutTeamInput
         | OnboardingUpsertWithWhereUniqueWithoutTeamInput[];
      createMany?: OnboardingCreateManyTeamInputEnvelope;
      set?: OnboardingWhereUniqueInput | OnboardingWhereUniqueInput[];
      disconnect?: OnboardingWhereUniqueInput | OnboardingWhereUniqueInput[];
      delete?: OnboardingWhereUniqueInput | OnboardingWhereUniqueInput[];
      connect?: OnboardingWhereUniqueInput | OnboardingWhereUniqueInput[];
      update?:
         | OnboardingUpdateWithWhereUniqueWithoutTeamInput
         | OnboardingUpdateWithWhereUniqueWithoutTeamInput[];
      updateMany?:
         | OnboardingUpdateManyWithWhereWithoutTeamInput
         | OnboardingUpdateManyWithWhereWithoutTeamInput[];
      deleteMany?: OnboardingScalarWhereInput | OnboardingScalarWhereInput[];
   };

   export type CompanyCreateNestedOneWithoutOnboardingsInput = {
      create?: XOR<
         CompanyCreateWithoutOnboardingsInput,
         CompanyUncheckedCreateWithoutOnboardingsInput
      >;
      connectOrCreate?: CompanyCreateOrConnectWithoutOnboardingsInput;
      connect?: CompanyWhereUniqueInput;
   };

   export type TeamCreateNestedOneWithoutOnboardingsInput = {
      create?: XOR<TeamCreateWithoutOnboardingsInput, TeamUncheckedCreateWithoutOnboardingsInput>;
      connectOrCreate?: TeamCreateOrConnectWithoutOnboardingsInput;
      connect?: TeamWhereUniqueInput;
   };

   export type EnumOnboardingStatusFieldUpdateOperationsInput = {
      set?: $Enums.OnboardingStatus;
   };

   export type CompanyUpdateOneRequiredWithoutOnboardingsNestedInput = {
      create?: XOR<
         CompanyCreateWithoutOnboardingsInput,
         CompanyUncheckedCreateWithoutOnboardingsInput
      >;
      connectOrCreate?: CompanyCreateOrConnectWithoutOnboardingsInput;
      upsert?: CompanyUpsertWithoutOnboardingsInput;
      connect?: CompanyWhereUniqueInput;
      update?: XOR<
         XOR<
            CompanyUpdateToOneWithWhereWithoutOnboardingsInput,
            CompanyUpdateWithoutOnboardingsInput
         >,
         CompanyUncheckedUpdateWithoutOnboardingsInput
      >;
   };

   export type TeamUpdateOneWithoutOnboardingsNestedInput = {
      create?: XOR<TeamCreateWithoutOnboardingsInput, TeamUncheckedCreateWithoutOnboardingsInput>;
      connectOrCreate?: TeamCreateOrConnectWithoutOnboardingsInput;
      upsert?: TeamUpsertWithoutOnboardingsInput;
      disconnect?: TeamWhereInput | boolean;
      delete?: TeamWhereInput | boolean;
      connect?: TeamWhereUniqueInput;
      update?: XOR<
         XOR<TeamUpdateToOneWithWhereWithoutOnboardingsInput, TeamUpdateWithoutOnboardingsInput>,
         TeamUncheckedUpdateWithoutOnboardingsInput
      >;
   };

   export type NestedIntFilter<$PrismaModel = never> = {
      equals?: number | IntFieldRefInput<$PrismaModel>;
      in?: number[] | ListIntFieldRefInput<$PrismaModel>;
      notIn?: number[] | ListIntFieldRefInput<$PrismaModel>;
      lt?: number | IntFieldRefInput<$PrismaModel>;
      lte?: number | IntFieldRefInput<$PrismaModel>;
      gt?: number | IntFieldRefInput<$PrismaModel>;
      gte?: number | IntFieldRefInput<$PrismaModel>;
      not?: NestedIntFilter<$PrismaModel> | number;
   };

   export type NestedStringFilter<$PrismaModel = never> = {
      equals?: string | StringFieldRefInput<$PrismaModel>;
      in?: string[] | ListStringFieldRefInput<$PrismaModel>;
      notIn?: string[] | ListStringFieldRefInput<$PrismaModel>;
      lt?: string | StringFieldRefInput<$PrismaModel>;
      lte?: string | StringFieldRefInput<$PrismaModel>;
      gt?: string | StringFieldRefInput<$PrismaModel>;
      gte?: string | StringFieldRefInput<$PrismaModel>;
      contains?: string | StringFieldRefInput<$PrismaModel>;
      startsWith?: string | StringFieldRefInput<$PrismaModel>;
      endsWith?: string | StringFieldRefInput<$PrismaModel>;
      not?: NestedStringFilter<$PrismaModel> | string;
   };

   export type NestedStringNullableFilter<$PrismaModel = never> = {
      equals?: string | StringFieldRefInput<$PrismaModel> | null;
      in?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
      notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
      lt?: string | StringFieldRefInput<$PrismaModel>;
      lte?: string | StringFieldRefInput<$PrismaModel>;
      gt?: string | StringFieldRefInput<$PrismaModel>;
      gte?: string | StringFieldRefInput<$PrismaModel>;
      contains?: string | StringFieldRefInput<$PrismaModel>;
      startsWith?: string | StringFieldRefInput<$PrismaModel>;
      endsWith?: string | StringFieldRefInput<$PrismaModel>;
      not?: NestedStringNullableFilter<$PrismaModel> | string | null;
   };

   export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
      equals?: number | IntFieldRefInput<$PrismaModel>;
      in?: number[] | ListIntFieldRefInput<$PrismaModel>;
      notIn?: number[] | ListIntFieldRefInput<$PrismaModel>;
      lt?: number | IntFieldRefInput<$PrismaModel>;
      lte?: number | IntFieldRefInput<$PrismaModel>;
      gt?: number | IntFieldRefInput<$PrismaModel>;
      gte?: number | IntFieldRefInput<$PrismaModel>;
      not?: NestedIntWithAggregatesFilter<$PrismaModel> | number;
      _count?: NestedIntFilter<$PrismaModel>;
      _avg?: NestedFloatFilter<$PrismaModel>;
      _sum?: NestedIntFilter<$PrismaModel>;
      _min?: NestedIntFilter<$PrismaModel>;
      _max?: NestedIntFilter<$PrismaModel>;
   };

   export type NestedFloatFilter<$PrismaModel = never> = {
      equals?: number | FloatFieldRefInput<$PrismaModel>;
      in?: number[] | ListFloatFieldRefInput<$PrismaModel>;
      notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>;
      lt?: number | FloatFieldRefInput<$PrismaModel>;
      lte?: number | FloatFieldRefInput<$PrismaModel>;
      gt?: number | FloatFieldRefInput<$PrismaModel>;
      gte?: number | FloatFieldRefInput<$PrismaModel>;
      not?: NestedFloatFilter<$PrismaModel> | number;
   };

   export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
      equals?: string | StringFieldRefInput<$PrismaModel>;
      in?: string[] | ListStringFieldRefInput<$PrismaModel>;
      notIn?: string[] | ListStringFieldRefInput<$PrismaModel>;
      lt?: string | StringFieldRefInput<$PrismaModel>;
      lte?: string | StringFieldRefInput<$PrismaModel>;
      gt?: string | StringFieldRefInput<$PrismaModel>;
      gte?: string | StringFieldRefInput<$PrismaModel>;
      contains?: string | StringFieldRefInput<$PrismaModel>;
      startsWith?: string | StringFieldRefInput<$PrismaModel>;
      endsWith?: string | StringFieldRefInput<$PrismaModel>;
      not?: NestedStringWithAggregatesFilter<$PrismaModel> | string;
      _count?: NestedIntFilter<$PrismaModel>;
      _min?: NestedStringFilter<$PrismaModel>;
      _max?: NestedStringFilter<$PrismaModel>;
   };

   export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
      equals?: string | StringFieldRefInput<$PrismaModel> | null;
      in?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
      notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
      lt?: string | StringFieldRefInput<$PrismaModel>;
      lte?: string | StringFieldRefInput<$PrismaModel>;
      gt?: string | StringFieldRefInput<$PrismaModel>;
      gte?: string | StringFieldRefInput<$PrismaModel>;
      contains?: string | StringFieldRefInput<$PrismaModel>;
      startsWith?: string | StringFieldRefInput<$PrismaModel>;
      endsWith?: string | StringFieldRefInput<$PrismaModel>;
      not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null;
      _count?: NestedIntNullableFilter<$PrismaModel>;
      _min?: NestedStringNullableFilter<$PrismaModel>;
      _max?: NestedStringNullableFilter<$PrismaModel>;
   };

   export type NestedIntNullableFilter<$PrismaModel = never> = {
      equals?: number | IntFieldRefInput<$PrismaModel> | null;
      in?: number[] | ListIntFieldRefInput<$PrismaModel> | null;
      notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null;
      lt?: number | IntFieldRefInput<$PrismaModel>;
      lte?: number | IntFieldRefInput<$PrismaModel>;
      gt?: number | IntFieldRefInput<$PrismaModel>;
      gte?: number | IntFieldRefInput<$PrismaModel>;
      not?: NestedIntNullableFilter<$PrismaModel> | number | null;
   };

   export type NestedBoolFilter<$PrismaModel = never> = {
      equals?: boolean | BooleanFieldRefInput<$PrismaModel>;
      not?: NestedBoolFilter<$PrismaModel> | boolean;
   };

   export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
      equals?: boolean | BooleanFieldRefInput<$PrismaModel>;
      not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean;
      _count?: NestedIntFilter<$PrismaModel>;
      _min?: NestedBoolFilter<$PrismaModel>;
      _max?: NestedBoolFilter<$PrismaModel>;
   };

   export type NestedDateTimeFilter<$PrismaModel = never> = {
      equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
      in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
      notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
      lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
      lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
      gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
      gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
      not?: NestedDateTimeFilter<$PrismaModel> | Date | string;
   };

   export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
      equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
      in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
      notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
      lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
      lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
      gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
      gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
      not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string;
      _count?: NestedIntFilter<$PrismaModel>;
      _min?: NestedDateTimeFilter<$PrismaModel>;
      _max?: NestedDateTimeFilter<$PrismaModel>;
   };

   export type NestedEnumOnboardingStatusFilter<$PrismaModel = never> = {
      equals?: $Enums.OnboardingStatus | EnumOnboardingStatusFieldRefInput<$PrismaModel>;
      in?: $Enums.OnboardingStatus[] | ListEnumOnboardingStatusFieldRefInput<$PrismaModel>;
      notIn?: $Enums.OnboardingStatus[] | ListEnumOnboardingStatusFieldRefInput<$PrismaModel>;
      not?: NestedEnumOnboardingStatusFilter<$PrismaModel> | $Enums.OnboardingStatus;
   };

   export type NestedEnumOnboardingStatusWithAggregatesFilter<$PrismaModel = never> = {
      equals?: $Enums.OnboardingStatus | EnumOnboardingStatusFieldRefInput<$PrismaModel>;
      in?: $Enums.OnboardingStatus[] | ListEnumOnboardingStatusFieldRefInput<$PrismaModel>;
      notIn?: $Enums.OnboardingStatus[] | ListEnumOnboardingStatusFieldRefInput<$PrismaModel>;
      not?: NestedEnumOnboardingStatusWithAggregatesFilter<$PrismaModel> | $Enums.OnboardingStatus;
      _count?: NestedIntFilter<$PrismaModel>;
      _min?: NestedEnumOnboardingStatusFilter<$PrismaModel>;
      _max?: NestedEnumOnboardingStatusFilter<$PrismaModel>;
   };

   export type PostCreateWithoutAuthorInput = {
      title: string;
      content?: string | null;
      published?: boolean;
   };

   export type PostUncheckedCreateWithoutAuthorInput = {
      id?: number;
      title: string;
      content?: string | null;
      published?: boolean;
   };

   export type PostCreateOrConnectWithoutAuthorInput = {
      where: PostWhereUniqueInput;
      create: XOR<PostCreateWithoutAuthorInput, PostUncheckedCreateWithoutAuthorInput>;
   };

   export type PostCreateManyAuthorInputEnvelope = {
      data: PostCreateManyAuthorInput | PostCreateManyAuthorInput[];
      skipDuplicates?: boolean;
   };

   export type PostUpsertWithWhereUniqueWithoutAuthorInput = {
      where: PostWhereUniqueInput;
      update: XOR<PostUpdateWithoutAuthorInput, PostUncheckedUpdateWithoutAuthorInput>;
      create: XOR<PostCreateWithoutAuthorInput, PostUncheckedCreateWithoutAuthorInput>;
   };

   export type PostUpdateWithWhereUniqueWithoutAuthorInput = {
      where: PostWhereUniqueInput;
      data: XOR<PostUpdateWithoutAuthorInput, PostUncheckedUpdateWithoutAuthorInput>;
   };

   export type PostUpdateManyWithWhereWithoutAuthorInput = {
      where: PostScalarWhereInput;
      data: XOR<PostUpdateManyMutationInput, PostUncheckedUpdateManyWithoutAuthorInput>;
   };

   export type PostScalarWhereInput = {
      AND?: PostScalarWhereInput | PostScalarWhereInput[];
      OR?: PostScalarWhereInput[];
      NOT?: PostScalarWhereInput | PostScalarWhereInput[];
      id?: IntFilter<'Post'> | number;
      title?: StringFilter<'Post'> | string;
      content?: StringNullableFilter<'Post'> | string | null;
      published?: BoolFilter<'Post'> | boolean;
      authorId?: IntFilter<'Post'> | number;
   };

   export type UserCreateWithoutPostsInput = {
      email: string;
      name?: string | null;
   };

   export type UserUncheckedCreateWithoutPostsInput = {
      id?: number;
      email: string;
      name?: string | null;
   };

   export type UserCreateOrConnectWithoutPostsInput = {
      where: UserWhereUniqueInput;
      create: XOR<UserCreateWithoutPostsInput, UserUncheckedCreateWithoutPostsInput>;
   };

   export type UserUpsertWithoutPostsInput = {
      update: XOR<UserUpdateWithoutPostsInput, UserUncheckedUpdateWithoutPostsInput>;
      create: XOR<UserCreateWithoutPostsInput, UserUncheckedCreateWithoutPostsInput>;
      where?: UserWhereInput;
   };

   export type UserUpdateToOneWithWhereWithoutPostsInput = {
      where?: UserWhereInput;
      data: XOR<UserUpdateWithoutPostsInput, UserUncheckedUpdateWithoutPostsInput>;
   };

   export type UserUpdateWithoutPostsInput = {
      email?: StringFieldUpdateOperationsInput | string;
      name?: NullableStringFieldUpdateOperationsInput | string | null;
   };

   export type UserUncheckedUpdateWithoutPostsInput = {
      id?: IntFieldUpdateOperationsInput | number;
      email?: StringFieldUpdateOperationsInput | string;
      name?: NullableStringFieldUpdateOperationsInput | string | null;
   };

   export type TeamCreateWithoutCompanyInput = {
      id?: string;
      name: string;
      description?: string | null;
      createdAt?: Date | string;
      updatedAt?: Date | string;
      onboardings?: OnboardingCreateNestedManyWithoutTeamInput;
   };

   export type TeamUncheckedCreateWithoutCompanyInput = {
      id?: string;
      name: string;
      description?: string | null;
      createdAt?: Date | string;
      updatedAt?: Date | string;
      onboardings?: OnboardingUncheckedCreateNestedManyWithoutTeamInput;
   };

   export type TeamCreateOrConnectWithoutCompanyInput = {
      where: TeamWhereUniqueInput;
      create: XOR<TeamCreateWithoutCompanyInput, TeamUncheckedCreateWithoutCompanyInput>;
   };

   export type TeamCreateManyCompanyInputEnvelope = {
      data: TeamCreateManyCompanyInput | TeamCreateManyCompanyInput[];
      skipDuplicates?: boolean;
   };

   export type OnboardingCreateWithoutCompanyInput = {
      id?: string;
      employeeName: string;
      employeeEmail: string;
      position: string;
      startDate: Date | string;
      status?: $Enums.OnboardingStatus;
      notes?: string | null;
      createdAt?: Date | string;
      updatedAt?: Date | string;
      team?: TeamCreateNestedOneWithoutOnboardingsInput;
   };

   export type OnboardingUncheckedCreateWithoutCompanyInput = {
      id?: string;
      employeeName: string;
      employeeEmail: string;
      position: string;
      startDate: Date | string;
      status?: $Enums.OnboardingStatus;
      notes?: string | null;
      createdAt?: Date | string;
      updatedAt?: Date | string;
      teamId?: string | null;
   };

   export type OnboardingCreateOrConnectWithoutCompanyInput = {
      where: OnboardingWhereUniqueInput;
      create: XOR<
         OnboardingCreateWithoutCompanyInput,
         OnboardingUncheckedCreateWithoutCompanyInput
      >;
   };

   export type OnboardingCreateManyCompanyInputEnvelope = {
      data: OnboardingCreateManyCompanyInput | OnboardingCreateManyCompanyInput[];
      skipDuplicates?: boolean;
   };

   export type TeamUpsertWithWhereUniqueWithoutCompanyInput = {
      where: TeamWhereUniqueInput;
      update: XOR<TeamUpdateWithoutCompanyInput, TeamUncheckedUpdateWithoutCompanyInput>;
      create: XOR<TeamCreateWithoutCompanyInput, TeamUncheckedCreateWithoutCompanyInput>;
   };

   export type TeamUpdateWithWhereUniqueWithoutCompanyInput = {
      where: TeamWhereUniqueInput;
      data: XOR<TeamUpdateWithoutCompanyInput, TeamUncheckedUpdateWithoutCompanyInput>;
   };

   export type TeamUpdateManyWithWhereWithoutCompanyInput = {
      where: TeamScalarWhereInput;
      data: XOR<TeamUpdateManyMutationInput, TeamUncheckedUpdateManyWithoutCompanyInput>;
   };

   export type TeamScalarWhereInput = {
      AND?: TeamScalarWhereInput | TeamScalarWhereInput[];
      OR?: TeamScalarWhereInput[];
      NOT?: TeamScalarWhereInput | TeamScalarWhereInput[];
      id?: StringFilter<'Team'> | string;
      name?: StringFilter<'Team'> | string;
      description?: StringNullableFilter<'Team'> | string | null;
      createdAt?: DateTimeFilter<'Team'> | Date | string;
      updatedAt?: DateTimeFilter<'Team'> | Date | string;
      companyId?: StringFilter<'Team'> | string;
   };

   export type OnboardingUpsertWithWhereUniqueWithoutCompanyInput = {
      where: OnboardingWhereUniqueInput;
      update: XOR<
         OnboardingUpdateWithoutCompanyInput,
         OnboardingUncheckedUpdateWithoutCompanyInput
      >;
      create: XOR<
         OnboardingCreateWithoutCompanyInput,
         OnboardingUncheckedCreateWithoutCompanyInput
      >;
   };

   export type OnboardingUpdateWithWhereUniqueWithoutCompanyInput = {
      where: OnboardingWhereUniqueInput;
      data: XOR<OnboardingUpdateWithoutCompanyInput, OnboardingUncheckedUpdateWithoutCompanyInput>;
   };

   export type OnboardingUpdateManyWithWhereWithoutCompanyInput = {
      where: OnboardingScalarWhereInput;
      data: XOR<
         OnboardingUpdateManyMutationInput,
         OnboardingUncheckedUpdateManyWithoutCompanyInput
      >;
   };

   export type OnboardingScalarWhereInput = {
      AND?: OnboardingScalarWhereInput | OnboardingScalarWhereInput[];
      OR?: OnboardingScalarWhereInput[];
      NOT?: OnboardingScalarWhereInput | OnboardingScalarWhereInput[];
      id?: StringFilter<'Onboarding'> | string;
      employeeName?: StringFilter<'Onboarding'> | string;
      employeeEmail?: StringFilter<'Onboarding'> | string;
      position?: StringFilter<'Onboarding'> | string;
      startDate?: DateTimeFilter<'Onboarding'> | Date | string;
      status?: EnumOnboardingStatusFilter<'Onboarding'> | $Enums.OnboardingStatus;
      notes?: StringNullableFilter<'Onboarding'> | string | null;
      createdAt?: DateTimeFilter<'Onboarding'> | Date | string;
      updatedAt?: DateTimeFilter<'Onboarding'> | Date | string;
      companyId?: StringFilter<'Onboarding'> | string;
      teamId?: StringNullableFilter<'Onboarding'> | string | null;
   };

   export type CompanyCreateWithoutTeamsInput = {
      id?: string;
      name: string;
      email: string;
      description?: string | null;
      website?: string | null;
      createdAt?: Date | string;
      updatedAt?: Date | string;
      onboardings?: OnboardingCreateNestedManyWithoutCompanyInput;
   };

   export type CompanyUncheckedCreateWithoutTeamsInput = {
      id?: string;
      name: string;
      email: string;
      description?: string | null;
      website?: string | null;
      createdAt?: Date | string;
      updatedAt?: Date | string;
      onboardings?: OnboardingUncheckedCreateNestedManyWithoutCompanyInput;
   };

   export type CompanyCreateOrConnectWithoutTeamsInput = {
      where: CompanyWhereUniqueInput;
      create: XOR<CompanyCreateWithoutTeamsInput, CompanyUncheckedCreateWithoutTeamsInput>;
   };

   export type OnboardingCreateWithoutTeamInput = {
      id?: string;
      employeeName: string;
      employeeEmail: string;
      position: string;
      startDate: Date | string;
      status?: $Enums.OnboardingStatus;
      notes?: string | null;
      createdAt?: Date | string;
      updatedAt?: Date | string;
      company: CompanyCreateNestedOneWithoutOnboardingsInput;
   };

   export type OnboardingUncheckedCreateWithoutTeamInput = {
      id?: string;
      employeeName: string;
      employeeEmail: string;
      position: string;
      startDate: Date | string;
      status?: $Enums.OnboardingStatus;
      notes?: string | null;
      createdAt?: Date | string;
      updatedAt?: Date | string;
      companyId: string;
   };

   export type OnboardingCreateOrConnectWithoutTeamInput = {
      where: OnboardingWhereUniqueInput;
      create: XOR<OnboardingCreateWithoutTeamInput, OnboardingUncheckedCreateWithoutTeamInput>;
   };

   export type OnboardingCreateManyTeamInputEnvelope = {
      data: OnboardingCreateManyTeamInput | OnboardingCreateManyTeamInput[];
      skipDuplicates?: boolean;
   };

   export type CompanyUpsertWithoutTeamsInput = {
      update: XOR<CompanyUpdateWithoutTeamsInput, CompanyUncheckedUpdateWithoutTeamsInput>;
      create: XOR<CompanyCreateWithoutTeamsInput, CompanyUncheckedCreateWithoutTeamsInput>;
      where?: CompanyWhereInput;
   };

   export type CompanyUpdateToOneWithWhereWithoutTeamsInput = {
      where?: CompanyWhereInput;
      data: XOR<CompanyUpdateWithoutTeamsInput, CompanyUncheckedUpdateWithoutTeamsInput>;
   };

   export type CompanyUpdateWithoutTeamsInput = {
      id?: StringFieldUpdateOperationsInput | string;
      name?: StringFieldUpdateOperationsInput | string;
      email?: StringFieldUpdateOperationsInput | string;
      description?: NullableStringFieldUpdateOperationsInput | string | null;
      website?: NullableStringFieldUpdateOperationsInput | string | null;
      createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
      updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
      onboardings?: OnboardingUpdateManyWithoutCompanyNestedInput;
   };

   export type CompanyUncheckedUpdateWithoutTeamsInput = {
      id?: StringFieldUpdateOperationsInput | string;
      name?: StringFieldUpdateOperationsInput | string;
      email?: StringFieldUpdateOperationsInput | string;
      description?: NullableStringFieldUpdateOperationsInput | string | null;
      website?: NullableStringFieldUpdateOperationsInput | string | null;
      createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
      updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
      onboardings?: OnboardingUncheckedUpdateManyWithoutCompanyNestedInput;
   };

   export type OnboardingUpsertWithWhereUniqueWithoutTeamInput = {
      where: OnboardingWhereUniqueInput;
      update: XOR<OnboardingUpdateWithoutTeamInput, OnboardingUncheckedUpdateWithoutTeamInput>;
      create: XOR<OnboardingCreateWithoutTeamInput, OnboardingUncheckedCreateWithoutTeamInput>;
   };

   export type OnboardingUpdateWithWhereUniqueWithoutTeamInput = {
      where: OnboardingWhereUniqueInput;
      data: XOR<OnboardingUpdateWithoutTeamInput, OnboardingUncheckedUpdateWithoutTeamInput>;
   };

   export type OnboardingUpdateManyWithWhereWithoutTeamInput = {
      where: OnboardingScalarWhereInput;
      data: XOR<OnboardingUpdateManyMutationInput, OnboardingUncheckedUpdateManyWithoutTeamInput>;
   };

   export type CompanyCreateWithoutOnboardingsInput = {
      id?: string;
      name: string;
      email: string;
      description?: string | null;
      website?: string | null;
      createdAt?: Date | string;
      updatedAt?: Date | string;
      teams?: TeamCreateNestedManyWithoutCompanyInput;
   };

   export type CompanyUncheckedCreateWithoutOnboardingsInput = {
      id?: string;
      name: string;
      email: string;
      description?: string | null;
      website?: string | null;
      createdAt?: Date | string;
      updatedAt?: Date | string;
      teams?: TeamUncheckedCreateNestedManyWithoutCompanyInput;
   };

   export type CompanyCreateOrConnectWithoutOnboardingsInput = {
      where: CompanyWhereUniqueInput;
      create: XOR<
         CompanyCreateWithoutOnboardingsInput,
         CompanyUncheckedCreateWithoutOnboardingsInput
      >;
   };

   export type TeamCreateWithoutOnboardingsInput = {
      id?: string;
      name: string;
      description?: string | null;
      createdAt?: Date | string;
      updatedAt?: Date | string;
      company: CompanyCreateNestedOneWithoutTeamsInput;
   };

   export type TeamUncheckedCreateWithoutOnboardingsInput = {
      id?: string;
      name: string;
      description?: string | null;
      createdAt?: Date | string;
      updatedAt?: Date | string;
      companyId: string;
   };

   export type TeamCreateOrConnectWithoutOnboardingsInput = {
      where: TeamWhereUniqueInput;
      create: XOR<TeamCreateWithoutOnboardingsInput, TeamUncheckedCreateWithoutOnboardingsInput>;
   };

   export type CompanyUpsertWithoutOnboardingsInput = {
      update: XOR<
         CompanyUpdateWithoutOnboardingsInput,
         CompanyUncheckedUpdateWithoutOnboardingsInput
      >;
      create: XOR<
         CompanyCreateWithoutOnboardingsInput,
         CompanyUncheckedCreateWithoutOnboardingsInput
      >;
      where?: CompanyWhereInput;
   };

   export type CompanyUpdateToOneWithWhereWithoutOnboardingsInput = {
      where?: CompanyWhereInput;
      data: XOR<
         CompanyUpdateWithoutOnboardingsInput,
         CompanyUncheckedUpdateWithoutOnboardingsInput
      >;
   };

   export type CompanyUpdateWithoutOnboardingsInput = {
      id?: StringFieldUpdateOperationsInput | string;
      name?: StringFieldUpdateOperationsInput | string;
      email?: StringFieldUpdateOperationsInput | string;
      description?: NullableStringFieldUpdateOperationsInput | string | null;
      website?: NullableStringFieldUpdateOperationsInput | string | null;
      createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
      updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
      teams?: TeamUpdateManyWithoutCompanyNestedInput;
   };

   export type CompanyUncheckedUpdateWithoutOnboardingsInput = {
      id?: StringFieldUpdateOperationsInput | string;
      name?: StringFieldUpdateOperationsInput | string;
      email?: StringFieldUpdateOperationsInput | string;
      description?: NullableStringFieldUpdateOperationsInput | string | null;
      website?: NullableStringFieldUpdateOperationsInput | string | null;
      createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
      updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
      teams?: TeamUncheckedUpdateManyWithoutCompanyNestedInput;
   };

   export type TeamUpsertWithoutOnboardingsInput = {
      update: XOR<TeamUpdateWithoutOnboardingsInput, TeamUncheckedUpdateWithoutOnboardingsInput>;
      create: XOR<TeamCreateWithoutOnboardingsInput, TeamUncheckedCreateWithoutOnboardingsInput>;
      where?: TeamWhereInput;
   };

   export type TeamUpdateToOneWithWhereWithoutOnboardingsInput = {
      where?: TeamWhereInput;
      data: XOR<TeamUpdateWithoutOnboardingsInput, TeamUncheckedUpdateWithoutOnboardingsInput>;
   };

   export type TeamUpdateWithoutOnboardingsInput = {
      id?: StringFieldUpdateOperationsInput | string;
      name?: StringFieldUpdateOperationsInput | string;
      description?: NullableStringFieldUpdateOperationsInput | string | null;
      createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
      updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
      company?: CompanyUpdateOneRequiredWithoutTeamsNestedInput;
   };

   export type TeamUncheckedUpdateWithoutOnboardingsInput = {
      id?: StringFieldUpdateOperationsInput | string;
      name?: StringFieldUpdateOperationsInput | string;
      description?: NullableStringFieldUpdateOperationsInput | string | null;
      createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
      updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
      companyId?: StringFieldUpdateOperationsInput | string;
   };

   export type PostCreateManyAuthorInput = {
      id?: number;
      title: string;
      content?: string | null;
      published?: boolean;
   };

   export type PostUpdateWithoutAuthorInput = {
      title?: StringFieldUpdateOperationsInput | string;
      content?: NullableStringFieldUpdateOperationsInput | string | null;
      published?: BoolFieldUpdateOperationsInput | boolean;
   };

   export type PostUncheckedUpdateWithoutAuthorInput = {
      id?: IntFieldUpdateOperationsInput | number;
      title?: StringFieldUpdateOperationsInput | string;
      content?: NullableStringFieldUpdateOperationsInput | string | null;
      published?: BoolFieldUpdateOperationsInput | boolean;
   };

   export type PostUncheckedUpdateManyWithoutAuthorInput = {
      id?: IntFieldUpdateOperationsInput | number;
      title?: StringFieldUpdateOperationsInput | string;
      content?: NullableStringFieldUpdateOperationsInput | string | null;
      published?: BoolFieldUpdateOperationsInput | boolean;
   };

   export type TeamCreateManyCompanyInput = {
      id?: string;
      name: string;
      description?: string | null;
      createdAt?: Date | string;
      updatedAt?: Date | string;
   };

   export type OnboardingCreateManyCompanyInput = {
      id?: string;
      employeeName: string;
      employeeEmail: string;
      position: string;
      startDate: Date | string;
      status?: $Enums.OnboardingStatus;
      notes?: string | null;
      createdAt?: Date | string;
      updatedAt?: Date | string;
      teamId?: string | null;
   };

   export type TeamUpdateWithoutCompanyInput = {
      id?: StringFieldUpdateOperationsInput | string;
      name?: StringFieldUpdateOperationsInput | string;
      description?: NullableStringFieldUpdateOperationsInput | string | null;
      createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
      updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
      onboardings?: OnboardingUpdateManyWithoutTeamNestedInput;
   };

   export type TeamUncheckedUpdateWithoutCompanyInput = {
      id?: StringFieldUpdateOperationsInput | string;
      name?: StringFieldUpdateOperationsInput | string;
      description?: NullableStringFieldUpdateOperationsInput | string | null;
      createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
      updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
      onboardings?: OnboardingUncheckedUpdateManyWithoutTeamNestedInput;
   };

   export type TeamUncheckedUpdateManyWithoutCompanyInput = {
      id?: StringFieldUpdateOperationsInput | string;
      name?: StringFieldUpdateOperationsInput | string;
      description?: NullableStringFieldUpdateOperationsInput | string | null;
      createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
      updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
   };

   export type OnboardingUpdateWithoutCompanyInput = {
      id?: StringFieldUpdateOperationsInput | string;
      employeeName?: StringFieldUpdateOperationsInput | string;
      employeeEmail?: StringFieldUpdateOperationsInput | string;
      position?: StringFieldUpdateOperationsInput | string;
      startDate?: DateTimeFieldUpdateOperationsInput | Date | string;
      status?: EnumOnboardingStatusFieldUpdateOperationsInput | $Enums.OnboardingStatus;
      notes?: NullableStringFieldUpdateOperationsInput | string | null;
      createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
      updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
      team?: TeamUpdateOneWithoutOnboardingsNestedInput;
   };

   export type OnboardingUncheckedUpdateWithoutCompanyInput = {
      id?: StringFieldUpdateOperationsInput | string;
      employeeName?: StringFieldUpdateOperationsInput | string;
      employeeEmail?: StringFieldUpdateOperationsInput | string;
      position?: StringFieldUpdateOperationsInput | string;
      startDate?: DateTimeFieldUpdateOperationsInput | Date | string;
      status?: EnumOnboardingStatusFieldUpdateOperationsInput | $Enums.OnboardingStatus;
      notes?: NullableStringFieldUpdateOperationsInput | string | null;
      createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
      updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
      teamId?: NullableStringFieldUpdateOperationsInput | string | null;
   };

   export type OnboardingUncheckedUpdateManyWithoutCompanyInput = {
      id?: StringFieldUpdateOperationsInput | string;
      employeeName?: StringFieldUpdateOperationsInput | string;
      employeeEmail?: StringFieldUpdateOperationsInput | string;
      position?: StringFieldUpdateOperationsInput | string;
      startDate?: DateTimeFieldUpdateOperationsInput | Date | string;
      status?: EnumOnboardingStatusFieldUpdateOperationsInput | $Enums.OnboardingStatus;
      notes?: NullableStringFieldUpdateOperationsInput | string | null;
      createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
      updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
      teamId?: NullableStringFieldUpdateOperationsInput | string | null;
   };

   export type OnboardingCreateManyTeamInput = {
      id?: string;
      employeeName: string;
      employeeEmail: string;
      position: string;
      startDate: Date | string;
      status?: $Enums.OnboardingStatus;
      notes?: string | null;
      createdAt?: Date | string;
      updatedAt?: Date | string;
      companyId: string;
   };

   export type OnboardingUpdateWithoutTeamInput = {
      id?: StringFieldUpdateOperationsInput | string;
      employeeName?: StringFieldUpdateOperationsInput | string;
      employeeEmail?: StringFieldUpdateOperationsInput | string;
      position?: StringFieldUpdateOperationsInput | string;
      startDate?: DateTimeFieldUpdateOperationsInput | Date | string;
      status?: EnumOnboardingStatusFieldUpdateOperationsInput | $Enums.OnboardingStatus;
      notes?: NullableStringFieldUpdateOperationsInput | string | null;
      createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
      updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
      company?: CompanyUpdateOneRequiredWithoutOnboardingsNestedInput;
   };

   export type OnboardingUncheckedUpdateWithoutTeamInput = {
      id?: StringFieldUpdateOperationsInput | string;
      employeeName?: StringFieldUpdateOperationsInput | string;
      employeeEmail?: StringFieldUpdateOperationsInput | string;
      position?: StringFieldUpdateOperationsInput | string;
      startDate?: DateTimeFieldUpdateOperationsInput | Date | string;
      status?: EnumOnboardingStatusFieldUpdateOperationsInput | $Enums.OnboardingStatus;
      notes?: NullableStringFieldUpdateOperationsInput | string | null;
      createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
      updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
      companyId?: StringFieldUpdateOperationsInput | string;
   };

   export type OnboardingUncheckedUpdateManyWithoutTeamInput = {
      id?: StringFieldUpdateOperationsInput | string;
      employeeName?: StringFieldUpdateOperationsInput | string;
      employeeEmail?: StringFieldUpdateOperationsInput | string;
      position?: StringFieldUpdateOperationsInput | string;
      startDate?: DateTimeFieldUpdateOperationsInput | Date | string;
      status?: EnumOnboardingStatusFieldUpdateOperationsInput | $Enums.OnboardingStatus;
      notes?: NullableStringFieldUpdateOperationsInput | string | null;
      createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
      updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
      companyId?: StringFieldUpdateOperationsInput | string;
   };

   /**
    * Batch Payload for updateMany & deleteMany & createMany
    */

   export type BatchPayload = {
      count: number;
   };

   /**
    * DMMF
    */
   export const dmmf: runtime.BaseDMMF;
}
