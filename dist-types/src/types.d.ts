import { Entity as BackstageEntity } from '@backstage/catalog-model';
import { RootlyService, RootlyFunctionality, RootlyTeam } from '@rootly/backstage-plugin-common';
export interface RootlyEntity extends BackstageEntity {
    linkedService: RootlyService | undefined;
    linkedFunctionality: RootlyFunctionality | undefined;
    linkedTeam: RootlyTeam | undefined;
}
