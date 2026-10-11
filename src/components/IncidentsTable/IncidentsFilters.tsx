import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Switch,
  TextField,
  Typography,
  makeStyles,
} from '@material-ui/core';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import { Autocomplete } from '@material-ui/lab';
import { RootlyApi } from '@rootly/backstage-plugin-common';
import React, { useState } from 'react';
import { useAsync, useDebounce } from 'react-use';
import { loadIncidentFilterOptions } from './filterOptions';
import {
  EMPTY_INCIDENT_FILTERS,
  IncidentFilterKey,
  IncidentFilterOption,
  IncidentFilters,
} from './incidentsQuery';

const FILTER_LABELS: Record<IncidentFilterKey, string> = {
  status: 'Status',
  severity: 'Severity',
  teams: 'Teams',
  services: 'Services',
  environments: 'Environments',
};

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
  select: {
    minWidth: 200,
    maxWidth: 320,
    flex: '1 1 200px',
  },
  hint: {
    marginBottom: theme.spacing(2),
  },
}));

const IncidentFilterSelect = ({
  client,
  filterKey,
  value,
  onChange,
}: {
  client: RootlyApi;
  filterKey: IncidentFilterKey;
  value: IncidentFilterOption[];
  onChange: (value: IncidentFilterOption[]) => void;
}) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');
  useDebounce(() => setSearch(input), 300, [input]);

  const { value: options = [], loading } = useAsync(async () => {
    if (!open) {
      return [];
    }
    try {
      return await loadIncidentFilterOptions(client, filterKey, search);
    } catch {
      return [];
    }
  }, [client, filterKey, search, open]);

  const label = FILTER_LABELS[filterKey];

  return (
    <Autocomplete<IncidentFilterOption, true>
      className={classes.select}
      multiple
      disableCloseOnSelect
      size="small"
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      options={options}
      loading={loading}
      value={value}
      filterOptions={opts => opts}
      getOptionLabel={option => option.label}
      getOptionSelected={(option, selected) => option.id === selected.id}
      onChange={(_, selected) => onChange(selected)}
      inputValue={input}
      onInputChange={(_, text, reason) => {
        if (reason !== 'reset') {
          setInput(text);
        }
      }}
      renderOption={(option, { selected }) => (
        <>
          <Checkbox
            icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
            checkedIcon={<CheckBoxIcon fontSize="small" />}
            checked={selected}
            size="small"
          />
          {option.label}
        </>
      )}
      renderInput={params => (
        <TextField
          {...params}
          variant="outlined"
          label={label}
          inputProps={{ ...params.inputProps, 'aria-label': label }}
        />
      )}
    />
  );
};

export const IncidentsFilters = ({
  client,
  available,
  filters,
  onFiltersChange,
  showTestIncidents,
  onShowTestIncidentsChange,
}: {
  client: RootlyApi;
  available: IncidentFilterKey[];
  filters: IncidentFilters;
  onFiltersChange: (filters: IncidentFilters) => void;
  showTestIncidents: boolean;
  onShowTestIncidentsChange: (show: boolean) => void;
}) => {
  const classes = useStyles();
  const hasSelection = available.some(key => filters[key].length > 0);
  const relationshipSelections = (
    ['teams', 'services', 'environments'] as IncidentFilterKey[]
  ).filter(key => filters[key].length > 0).length;

  return (
    <>
      <Box className={classes.root}>
        {available.map(key => (
          <IncidentFilterSelect
            key={key}
            client={client}
            filterKey={key}
            value={filters[key]}
            onChange={value => onFiltersChange({ ...filters, [key]: value })}
          />
        ))}
        <FormControlLabel
          control={
            <Switch
              checked={showTestIncidents}
              onChange={event => onShowTestIncidentsChange(event.target.checked)}
              color="primary"
              size="small"
            />
          }
          label="Show test incidents"
        />
        {hasSelection && (
          <Button size="small" onClick={() => onFiltersChange(EMPTY_INCIDENT_FILTERS)}>
            Clear filters
          </Button>
        )}
      </Box>
      {relationshipSelections > 1 && (
        <Typography
          className={classes.hint}
          variant="caption"
          color="textSecondary"
          component="p"
        >
          Team, service and environment filters match incidents linked to any
          of the selected items.
        </Typography>
      )}
    </>
  );
};
