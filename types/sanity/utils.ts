import type {SECTIONS_QUERYResult} from './sanity.generated';

// Get all possible section types
type SectionTypes = NonNullable<
  NonNullable<SECTIONS_QUERYResult>['sections']
>[number]['_type'];

export type SectionDataType = NonNullable<
  NonNullable<SECTIONS_QUERYResult>['sections']
>[0];

export type SectionOfType<T extends SectionTypes> =
  NonNullable<SECTIONS_QUERYResult>['sections'] extends Array<infer S> | null
    ? S extends {_type: T}
      ? S
      : never
    : never;
