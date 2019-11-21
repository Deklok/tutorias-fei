import React, { memo } from 'react';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import clsx from 'clsx';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import LowPriority from '@material-ui/icons/LowPriority';
import UpdateIcon from '@material-ui/icons/Update';
import CancelPresentation from '@material-ui/icons/CancelPresentation';
import BarChartIcon from '@material-ui/icons/BarChart';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import DasboardIcon from '@material-ui/icons/Dashboard';
import CachedIcon from '@material-ui/icons/Cached'

const SideBar = memo(props => {
	const open = props.open;
	const classes = props.classes;

	return (
		<Drawer
			variant="permanent"
			classes={{
				paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
			}}
			open={open}
		>
			<div className={classes.toolbarIcon}>
				<IconButton onClick={props.handleDrawerClose}>
					<ChevronLeftIcon />
				</IconButton>
			</div>
			<Divider />
			<List>
				<div>
					<ListSubheader inset>Tutoría</ListSubheader>
					<ListItem button component="a" href="/tutor">
						<ListItemIcon>
							<DasboardIcon />
						</ListItemIcon>
						<ListItemText primary="Menu" />
					</ListItem>
					<ListItem button>
						<ListItemIcon>
							<LowPriority />
						</ListItemIcon>
						<ListItemText primary="Reasignar Tutorías" />
					</ListItem>
					<ListItem button component="a" href="/tutor/registro-bloques">
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
					<ListItem button component="a" href="/tutor/feedback">
						<ListItemIcon>
							<BarChartIcon />
						</ListItemIcon>
						<ListItemText primary="Retroalimentación" />
					</ListItem>
				</div>
			</List>
			<Divider />
			<List>
				<div>
					<ListSubheader inset>Cuenta</ListSubheader>
					<ListItem button>
						<ListItemIcon>
							<CachedIcon />
						</ListItemIcon>
						<ListItemText primary="Recargar Datos" />
					</ListItem>
					<ListItem button component="a" href="/logout">
						<ListItemIcon>
							<ExitToAppIcon />
						</ListItemIcon>
						<ListItemText primary="Cerrar Sesión" />
					</ListItem>
				</div>
			</List>
		</Drawer>
	);
});

export default SideBar;