/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Schema, Utils, UID } from "@strapi/types";

export type ID = `${number}` | number;
export type IDProperty = { id: ID, documentId: string };
export type BooleanValue =
  | boolean
  | "true"
  | "false"
  | "t"
  | "f"
  | "1"
  | "0"
  | 1
  | 0;
export type NumberValue = string | number;
export type DateValue = Schema.Attribute.DateValue | number;
export type TimeValue = Schema.Attribute.TimeValue | number;
export type DateTimeValue = Schema.Attribute.DateTimeValue | number;
export type TimeStampValue = Schema.Attribute.TimestampValue;

type OriginalGetValue<
  TAttribute extends Schema.Attribute.Attribute,
  TGuard = unknown,
> = Utils.Guard.Never<
  | Schema.Attribute.GetBigIntegerValue<TAttribute>
  | Schema.Attribute.GetBooleanValue<TAttribute>
  | Schema.Attribute.GetBlocksValue<TAttribute>
  | Schema.Attribute.GetComponentValue<TAttribute>
  | Schema.Attribute.GetDecimalValue<TAttribute>
  | Schema.Attribute.GetDynamicZoneValue<TAttribute>
  | Schema.Attribute.GetEnumerationValue<TAttribute>
  | Schema.Attribute.GetEmailValue<TAttribute>
  | Schema.Attribute.GetFloatValue<TAttribute>
  | Schema.Attribute.GetIntegerValue<TAttribute>
  | Schema.Attribute.GetJsonValue<TAttribute>
  | Schema.Attribute.GetMediaValue<TAttribute>
  | Schema.Attribute.GetPasswordValue<TAttribute>
  | Schema.Attribute.GetRelationValue<TAttribute>
  | Schema.Attribute.GetRichTextValue<TAttribute>
  | Schema.Attribute.GetStringValue<TAttribute>
  | Schema.Attribute.GetTextValue<TAttribute>
  | Schema.Attribute.GetUIDValue<TAttribute>
  | Schema.Attribute.GetDateValue<TAttribute>
  | Schema.Attribute.GetDateTimeValue<TAttribute>
  | Schema.Attribute.GetTimeValue<TAttribute>
  | Schema.Attribute.GetTimestampValue<TAttribute>,
  TGuard
>;

type OriginalGetAll<TSchemaUID extends UID.Schema> = Utils.Get<
  Schema.Schemas[TSchemaUID],
  "attributes"
>;
type OriginalGet<
  TSchemaUID extends UID.Schema,
  TKey extends OriginalGetKeys<TSchemaUID>,
> = Utils.Get<OriginalGetAll<TSchemaUID>, TKey>;

type OriginalGetRequiredKeys<TSchemaUID extends UID.Schema> =
  Utils.Object.KeysBy<
    OriginalGetAll<TSchemaUID>,
    Schema.Attribute.Required,
    string
  >;
type OriginalGetOptionalKeys<TSchemaUID extends UID.Schema> =
  Utils.Object.KeysExcept<
    OriginalGetAll<TSchemaUID>,
    Schema.Attribute.Required,
    string
  >;

type OriginalGetKeys<TSchemaUID extends UID.Schema> =
  keyof OriginalGetAll<TSchemaUID> & string;

export type GetValues<TSchemaUID extends UID.Schema> = {
  [TKey in OriginalGetOptionalKeys<TSchemaUID>]?: GetValue<
    OriginalGet<TSchemaUID, TKey>
  >;
} & {
  [TKey in OriginalGetRequiredKeys<TSchemaUID>]-?: GetValue<
    OriginalGet<TSchemaUID, TKey>
  >;
};

/**
 * Attribute.GetValue override with extended values
 *
 * Fallback to unknown if never is found
 */

export type GetValue<TAttribute> = TAttribute extends Schema.Attribute.Attribute
  ? Utils.If<
      Utils.IsNotNever<TAttribute>,
      Utils.MatchFirst<
        [
          [
            Utils.Extends<TAttribute, Schema.Attribute.OfType<"relation">>,
            TAttribute extends Schema.Attribute.RelationWithTarget<infer _TRelationKind, infer TTargetUID>
              ? TTargetUID extends UID.ContentType
                ? TAttribute["target"] extends TTargetUID
                  ? Array<GetValues<TTargetUID>>
                  : never
                : never
              : any
          ],
          [
            Utils.Extends<TAttribute, Schema.Attribute.OfType<"dynamiczone">>,
            TAttribute extends Schema.Attribute.DynamicZone<
              infer TComponentsUIDs
            >
              ? Array<
                  Utils.Array.Values<TComponentsUIDs> extends infer TComponentUID
                    ? TComponentUID extends UID.Component
                      ? GetValues<TComponentUID> & {
                          __component: TComponentUID;
                        }
                      : never
                    : never
                >
              : never,
          ],
          [
            Utils.Extends<TAttribute, Schema.Attribute.OfType<"component">>,
            TAttribute extends Schema.Attribute.Component<
              infer TComponentUID,
              infer TRepeatable
            >
              ? TComponentUID extends UID.Component
                ? GetValues<TComponentUID> extends infer TValues
                  ? Utils.If<TRepeatable, TValues[], TValues>
                  : never
                : never
              : never,
          ],
          [Utils.Constants.True, OriginalGetValue<TAttribute, unknown>],
        ],
        unknown
      >,
      unknown
    >
  : never;

export type APIResponseData<TContentTypeUID extends UID.ContentType> = IDProperty & GetValues<TContentTypeUID>;

export interface APIResponseCollectionMetadata {
  pagination: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
}

export interface SingleTypeResponse<
    TContentTypeUID extends UID.ContentType,
> {
    data: APIResponseData<TContentTypeUID>
}
export interface CollectionTypeResponse<
  TContentTypeUID extends UID.ContentType,
> {
  data: APIResponseData<TContentTypeUID>[];
  meta: APIResponseCollectionMetadata;
}
