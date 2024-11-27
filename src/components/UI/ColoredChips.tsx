import React, { useEffect, useState } from 'react';
import { Chip } from '@material-ui/core';
import { useApi } from '@backstage/core-plugin-api';
import LinkIcon from '@material-ui/icons/Link';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { useNavigate } from 'react-router-dom';
import {
  RootlyService,
  RootlyFunctionality,
  RootlyEnvironment,
  RootlyIncidentType,
  RootlyTeam,
} from '@rootly/backstage-plugin-common';
import { ColoredChip } from './ColoredChip';

export const ColoredChips = ({
  objects,
}: {
  objects:
    | RootlyService[]
    | RootlyFunctionality[]
    | RootlyEnvironment[]
    | RootlyIncidentType[]
    | RootlyTeam[];
}) => {
  const navigate = useNavigate();
  const catalogApi = useApi(catalogApiRef);

  const [componentUrls, setComponentUrls] = useState<Record<string, string>>({});

  // Fetch component URLs incrementally
  useEffect(() => {
    if (!objects?.length) return;

    const fetchComponentUrl = async (entityRef: string) => {
      try {
        const component = await catalogApi.getEntityByRef(entityRef);
        if (component) {
          setComponentUrls(prev => ({
            ...prev,
            [entityRef]: `/catalog/${component.metadata.namespace}/component/${component.metadata.name}`,
          }));
        }
      } catch {
        // No op
      }
    };

    // Fetch each entityRef independently
    objects.forEach(obj => {
      const entityRef = (obj.attributes as any).backstage_id;
      if (entityRef) {
        fetchComponentUrl(entityRef);
      }
    });
  }, [objects, catalogApi]);

  if (objects?.length > 0) {
    return (
      <>
        {objects.map(r => {
          const entityRef = (r.attributes as any).backstage_id;
          const url = componentUrls[entityRef];
          return (
            <ColoredChip
              key={r.id}
              label={r.attributes.name}
              tooltip={r.attributes.description}
              color={r.attributes.color}
              onClick={url ? () => navigate(url) : () => {}}
              icon={url ? <LinkIcon /> : undefined}
            />
          );
        })}
      </>
    );
  }

  return <Chip label="N/A" size="small" />;
};
