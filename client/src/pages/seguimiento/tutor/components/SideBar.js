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
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle'
import Button from '@material-ui/core/Button';

const SideBar = memo(props => {
	const open = props.open;
	const classes = props.classes;

	const [openDialog, setOpen] = React.useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

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
					<ListItem button onClick={handleClickOpen}>
						<ListItemIcon>
							<CachedIcon />
						</ListItemIcon>
						<ListItemText primary="Actualizar Datos" />
					</ListItem>
					<ListItem button component="a" href="/logout">
						<ListItemIcon>
							<ExitToAppIcon />
						</ListItemIcon>
						<ListItemText primary="Cerrar Sesión" />
					</ListItem>
				</div>
			</List>
			<Dialog open={openDialog} aria-labelledby="form-dialog-title">
				<DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
				<DialogContent>
					<DialogContentText>
						To subscribe to this website, please enter your email address here. We will send updates
						occasionally.
						</DialogContentText>
					<TextField
						autoFocus
						margin="dense"
						id="name"
						label="Email Address"
						type="email"
						fullWidth
					/>
				</DialogContent>
				<DialogActions>
					<Button color="primary" onClick={handleClose}>
						Cancel
						</Button>
					<Button color="primary">
						Subscribe
						</Button>
				</DialogActions>
			</Dialog>
		</Drawer>
	);
});

export default SideBar;