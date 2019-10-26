import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import LowPriority from '@material-ui/icons/LowPriority';
import UpdateIcon from '@material-ui/icons/Update';
import CancelPresentation from '@material-ui/icons/CancelPresentation';
import BarChartIcon from '@material-ui/icons/BarChart';
import PowerSettingsNew from '@material-ui/icons/PowerSettingsNew';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

export const mainListItems = (
  <div>
    <ListItem button component="a" href="/">
      <ListItemIcon>
        <BarChartIcon />
      </ListItemIcon>
      <ListItemText primary="Menu" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <LowPriority />
      </ListItemIcon>
      <ListItemText primary="Reasignar Tutorías" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <UpdateIcon />
      </ListItemIcon>
      <ListItemText primary="Ajustar Horarios" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <CancelPresentation />
      </ListItemIcon>
      <ListItemText primary="Cancelar Tutoría" />
    </ListItem>
    <ListItem button component="a" href="/feedback">
      <ListItemIcon>
        <BarChartIcon />
      </ListItemIcon>
      <ListItemText primary="Retroalimentación" />
    </ListItem>
  </div>
);

export const secondaryListItems = (
  <div>
    <ListSubheader inset>Cuenta</ListSubheader>
    <ListItem button>
      <ListItemIcon>
        <PowerSettingsNew />
      </ListItemIcon>
      <ListItemText primary="Cerrar Sesión" />
    </ListItem>
  </div>
);
