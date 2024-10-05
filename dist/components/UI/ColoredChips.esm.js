import React, { useState, useEffect } from 'react';
import { Chip } from '@material-ui/core';
import { useApi } from '@backstage/core-plugin-api';
import LinkIcon from '@material-ui/icons/Link';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { useNavigate } from 'react-router-dom';
import { ColoredChip } from './ColoredChip.esm.js';

const ColoredChips = ({
  objects
}) => {
  const navigate = useNavigate();
  const catalogApi = useApi(catalogApiRef);
  const [componentUrls, setComponentUrls] = useState({});
  useEffect(() => {
    const fetchComponentUrls = async () => {
      const newComponentUrls = {};
      for (const obj of objects) {
        const entityRef = obj.attributes.backstage_id;
        try {
          if (entityRef) {
            const component = await catalogApi.getEntityByRef(entityRef);
            if (component) {
              newComponentUrls[entityRef] = `/catalog/${component.metadata.namespace}/component/${component.metadata.name}`;
            }
          }
        } catch (error) {
        }
      }
      setComponentUrls(newComponentUrls);
    };
    if (objects?.length) {
      fetchComponentUrls();
    }
  }, [objects, catalogApi]);
  if (objects?.length > 0) {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, objects.map((r) => {
      const entityRef = r.attributes.backstage_id;
      const url = componentUrls[entityRef];
      return /* @__PURE__ */ React.createElement(
        ColoredChip,
        {
          key: r.id,
          label: r.attributes.name,
          tooltip: r.attributes.description,
          color: r.attributes.color,
          onClick: url ? () => navigate(url) : () => {
          },
          icon: url ? /* @__PURE__ */ React.createElement(LinkIcon, null) : void 0
        }
      );
    }));
  }
  return /* @__PURE__ */ React.createElement(Chip, { label: "N/A", size: "small" });
};

export { ColoredChips };
//# sourceMappingURL=ColoredChips.esm.js.map
