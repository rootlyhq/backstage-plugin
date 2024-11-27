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
    if (!objects?.length) return;
    const fetchComponentUrl = async (entityRef) => {
      try {
        const component = await catalogApi.getEntityByRef(entityRef);
        if (component) {
          setComponentUrls((prev) => ({
            ...prev,
            [entityRef]: `/catalog/${component.metadata.namespace}/component/${component.metadata.name}`
          }));
        }
      } catch {
      }
    };
    objects.forEach((obj) => {
      const entityRef = obj.attributes.backstage_id;
      if (entityRef) {
        fetchComponentUrl(entityRef);
      }
    });
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
