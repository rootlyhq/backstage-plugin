import { Entity } from '@backstage/catalog-model';
export declare const ROOTLY_ANNOTATION_SERVICE_ID = "rootly.com/service-id";
export declare const ROOTLY_ANNOTATION_SERVICE_SLUG = "rootly.com/service-slug";
export declare const ROOTLY_ANNOTATION_SERVICE_AUTO_IMPORT = "rootly.com/service-auto-import";
export declare const isRootlyAvailable: (entity: Entity) => boolean;
export declare const autoImportService: (entity: Entity) => boolean;
