import React from 'react';
import { RootlyResourceType } from '../../types';
import { RootlyOverviewServiceCard } from './RootlyOverviewServiceCard';
import { RootlyOverviewFunctionalityCard } from './RootlyOverviewFunctionalityCard';
import { RootlyOverviewTeamCard } from './RootlyOverviewTeamCard';

export const RootlyOverviewCard = (resourceType: RootlyResourceType) => {
  const resource = () => {
    switch (resourceType) {
      case RootlyResourceType.Service:
        // eslint-disable-next-line new-cap
        return RootlyOverviewServiceCard();
      case RootlyResourceType.Functionality:
        // eslint-disable-next-line new-cap
        return RootlyOverviewFunctionalityCard();
      case RootlyResourceType.Team:
        // eslint-disable-next-line new-cap
        return RootlyOverviewTeamCard();
      default:
        // eslint-disable-next-line new-cap
        return RootlyOverviewServiceCard();
    }
  };

  return (<div>{resource()}</div>);
};
