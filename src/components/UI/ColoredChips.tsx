import React, { useEffect, useState } from 'react';
import { Chip } from '@material-ui/core';
import { useApi } from '@backstage/core-plugin-api';
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
  const catalogApi = useApi(catalogApiRef); // Use the catalog API

  const [componentUrls, setComponentUrls] = useState<Record<string, string>>({});

  // Fetch the component URLs dynamically
  useEffect(() => {
    const fetchComponentUrls = async () => {
      const newComponentUrls: Record<string, string> = {};
      for (const obj of objects) {
        const entityRef = obj.attributes.backstage_id;
        try {
          // Search for the component entity in the catalog
          const component = await catalogApi.getEntityByRef(entityRef);
          if (component) {
            newComponentUrls[entityRef] = `/catalog/${component.metadata.namespace}/component/${component.metadata.name}`;
            console.log(newComponentUrls);
          }
        } catch (error) {
          console.error(`Failed to fetch component ${entityRef}`, error);
        }
      }
      setComponentUrls(newComponentUrls);
    };

    if (objects?.length) {
      fetchComponentUrls();
    }
  }, [objects, catalogApi]);

  if (objects?.length > 0) {
    return (
      <>
        {objects.map(r => {
          const entityRef = r.attributes.backstage_id;
          const url = componentUrls[entityRef];
          return (
            <ColoredChip
              key={r.id}
              label={r.attributes.name}
              tooltip={r.attributes.description}
              color={r.attributes.color}
              onClick={url !== null ? () => navigate(url) : () => {}}
            />
          );
        })}
      </>
    );
  }

  return <Chip label="N/A" size="small" />;
};
