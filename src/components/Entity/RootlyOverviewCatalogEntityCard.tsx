import {
  HeaderIconLinkRow,
  IconLinkVerticalProps,
  Progress,
} from '@backstage/core-components';
import { useEntity } from '@backstage/plugin-catalog-react';
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@material-ui/core';
import Link from '@material-ui/core/Link';
import CachedIcon from '@material-ui/icons/Cached';
import WhatshotIcon from '@material-ui/icons/Whatshot';
import { Alert } from '@material-ui/lab';
import React, { useState } from 'react';
import { useAsync } from 'react-use';

import {
  ROOTLY_ANNOTATION_ORG_ID,
  ROOTLY_ANNOTATION_CATALOG_ENTITY_ID,
  ROOTLY_ANNOTATION_CATALOG_ENTITY_SLUG,
} from '@rootly/backstage-plugin-common';
import { useRootlyClient } from '../../api';

export const RootlyOverviewCatalogEntityCard = () => {
  const { entity } = useEntity();
  const rootlyClient = useRootlyClient({
    organizationId:
      entity.metadata.annotations?.[ROOTLY_ANNOTATION_ORG_ID],
  });

  const [reload, setReload] = useState(false);

  const catalogEntityIdAnnotation =
    entity.metadata.annotations?.[ROOTLY_ANNOTATION_CATALOG_ENTITY_ID] ||
    entity.metadata.annotations?.[ROOTLY_ANNOTATION_CATALOG_ENTITY_SLUG];

  const createIncidentLink: IconLinkVerticalProps = {
    label: 'Create Incident',
    disabled: false,
    icon: <WhatshotIcon />,
    href: rootlyClient.getCreateIncidentURL(),
  };

  const {
    value: catalogEntityResponse,
    loading,
    error,
  } = useAsync(
    async () =>
      catalogEntityIdAnnotation
        ? await rootlyClient.getCatalogEntity(catalogEntityIdAnnotation)
        : undefined,
    [reload, catalogEntityIdAnnotation],
  );

  const catalogEntity = catalogEntityResponse?.data;

  const viewInRootlyLink: IconLinkVerticalProps | undefined = catalogEntity
    ? {
        label: 'View in Rootly',
        disabled: false,
        icon: <WhatshotIcon />,
        href: rootlyClient.getCatalogEntityDetailsURL(catalogEntity, undefined),
      }
    : undefined;

  return (
    <Card>
      <CardHeader
        title="Rootly"
        action={
          <>
            {catalogEntity && (
              <IconButton
                component={Link}
                aria-label="Refresh"
                disabled={false}
                title="Refresh"
                onClick={() => setReload(!reload)}
              >
                <CachedIcon />
              </IconButton>
            )}
          </>
        }
        subheader={
          <HeaderIconLinkRow
            links={[
              createIncidentLink,
              ...(viewInRootlyLink ? [viewInRootlyLink] : []),
            ]}
          />
        }
      />
      {catalogEntity && (
        <>
          <Divider />
          <CardContent>
            <Typography variant="subtitle1">
              <strong>{catalogEntity.attributes.name}</strong>
            </Typography>
            {catalogEntity.attributes.description && (
              <Typography variant="body2" color="textSecondary">
                {catalogEntity.attributes.description}
              </Typography>
            )}
          </CardContent>
          {catalogEntity.attributes.properties &&
            catalogEntity.attributes.properties.length > 0 && (
              <>
                <Divider />
                <CardContent>
                  <Typography variant="subtitle1">Properties</Typography>
                  <List dense>
                    {catalogEntity.attributes.properties.map((prop: any) => (
                      <ListItem
                        key={prop.catalog_property_id}
                        style={{ paddingLeft: 0 }}
                      >
                        <ListItemText
                          primary={String(prop.value)}
                          secondary={prop.catalog_property_id}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </>
            )}
        </>
      )}
      <CardContent>
        {loading && <Progress />}
        {error && <Alert severity="error">{error.message}</Alert>}
        {!loading && !error && !catalogEntity && (
          <Typography variant="subtitle1">
            Catalog entity not found in Rootly
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};
