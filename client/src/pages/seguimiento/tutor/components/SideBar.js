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
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle'
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';

const SideBar = memo(props => {
	const open = props.open;
	const classes = props.classes;

	const [terminosDialog, setTerminosDialog] = React.useState(false);
	const [loginDialog, setLoginDialog] = React.useState(false);

	const [state, setState] = React.useState({
		terminos: false,
	});

	const handleCheckTerminos = name => event => {
		setState({ ...state, [name]: event.target.checked });
		console.log(state.terminos)
	};

	const handleAbrirTerminos = () => {
		if (state.terminos) {
			setLoginDialog(true);
		} else {
			setTerminosDialog(true);
		}
	};

	const handleLogin = () => {
		setLoginDialog(false);
	}

	const handleSiguienteTerminos = () => {
		setTerminosDialog(false);
		setLoginDialog(true);
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
					<ListItem button onClick={handleAbrirTerminos}>
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
			<Dialog open={terminosDialog}
				scroll={'paper'}
				aria-labelledby="scroll-dialog-title"
				aria-describedby="scroll-dialog-description">

				<DialogTitle id="scroll-dialog-title">Términos y Condiciones</DialogTitle>
				<DialogContent>
					<DialogContentText>
						{[...new Array(50)]
							.map(
								() => `Cras mattis consectetur purus sit amet fermentum.
									Cras justo odio, dapibus ac facilisis in, egestas eget quam.
									Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
									Praesent commodo cursus magna, vel scelerisque nisl consectetur et.`,
							)
							.join('\n')}
					</DialogContentText>
					<FormControlLabel
						control={
							<Checkbox
								checked={state.terminos}
								onChange={handleCheckTerminos('terminos')}
								value="terminos"
								color="primary"
							/>
						}
						label="Acepto los términos y condiciones"
					/>
				</DialogContent>
				<DialogActions>
					<Button color="primary" disabled={!state.terminos} onClick={handleSiguienteTerminos}>
						Siguiente
					</Button>
				</DialogActions>
			</Dialog>
			<Dialog open={loginDialog}
				scroll={'paper'}
				aria-labelledby="scroll-dialog-title"
				aria-describedby="scroll-dialog-description">

				<DialogTitle id="form-dialog-title">Iniciar Sesión</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Es necesario que revalide sus credenciales para continuar
					</DialogContentText>
					<TextField
						autoFocus
						margin="dense"
						id="matricula"
						label="Matrícula"
						type="email"
						fullWidth
					/>
					<TextField
						autoFocus
						margin="dense"
						id="password"
						label="Contraseña"
						type="password"
						fullWidth
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleLogin} color="primary">
						Enviar
          			</Button>
				</DialogActions>
			</Dialog>
		</Drawer >
	);
});

export default SideBar;