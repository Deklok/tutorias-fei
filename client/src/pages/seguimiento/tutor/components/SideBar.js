import React, { memo } from 'react';
import { Redirect } from 'react-router-dom';
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
import axios from 'axios';
import Cookies from 'universal-cookie';
import utilities from '../../../../utilities';

const cookies = new Cookies();
const route = process.env.REACT_APP_API_SERVER;

const SideBar = memo(props => {
	const open = props.open;
	const classes = props.classes;
	const tutor = props.idTutor;
	const idTutorship = props.idTutorship;
	const [terminosDialog, setTerminosDialog] = React.useState(false);
	const [loginDialog, setLoginDialog] = React.useState(false);
	const [cancelarTutoriaDialog, setCancelarTutoriaDialog] = React.useState(false);
	const [feedbackRoute, setFeedbackRoute] = React.useState(false);
	const [mainRoute, setMainRoute] = React.useState(false);
	const [adjustRoute, setAdjustRoute] = React.useState(false);
	var token = utilities.splitCookie(cookies.get('token')).token;
  	var role = utilities.splitCookie(cookies.get('token')).session;

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

	const handleConfirmarCancelarTutoria = () => {
		setCancelarTutoriaDialog(false);
		notifyAllCanceledDay();
		cancelarTutoria()
		.then(()=>{
			window.location.reload();
		});
	}

	const handleCerrarCancelarTutoria = () => {
		setCancelarTutoriaDialog(false);
	}

	const handleCancelarTutoria = () => {
		setCancelarTutoriaDialog(true);
	}

	const handleSiguienteTerminos = () => {
		setTerminosDialog(false);
		setLoginDialog(true);
	};

	const redirectToFeedback = () => {
		setMainRoute(false);
		setAdjustRoute(false);
		setFeedbackRoute(true);
	}

	const redirectToMain = () => {
		setFeedbackRoute(false);
		setAdjustRoute(false);
		setMainRoute(true);
	}

	const redirectToAdjust = () => {
		setMainRoute(false);
		setFeedbackRoute(false);
		setAdjustRoute(true);
	}

	async function cancelarTutoria(){
		axios.post(route+'api/db/updateTutorshipStatus', {
	      idTutorship: idTutorship,
	      idTutor: tutor,
	      new_status: 3
	    },{
	      headers: { Authorization: token + ";" + role }
	    });
	}
	async function notifyAllCanceledDay(){
		axios.post(route+'api/notify/student/canceledday', {
	      user: tutor
	    },{
	      headers: { Authorization: token + ";" + role }
	    });
	}

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
					<ListItem button component="a" onClick={redirectToMain}>
						{ mainRoute && <Redirect to='/tutor'/> }
						<ListItemIcon>
							<DasboardIcon />
						</ListItemIcon>
						<ListItemText primary="Menu" />
					</ListItem>
					<ListItem button component="a" onClick={redirectToAdjust}>
						{ adjustRoute && <Redirect to='/tutor/registro-bloques'/> }
						<ListItemIcon>
							<UpdateIcon />
						</ListItemIcon>
						<ListItemText primary="Ajustar Horarios" />
					</ListItem>
					<ListItem button>
						<ListItemIcon>
							<CancelPresentation />
						</ListItemIcon>
						<ListItemText primary="Cancelar Tutoría" onClick={handleCancelarTutoria}/>
					</ListItem>
					<ListItem button component="a" onClick={redirectToFeedback}>
						{ feedbackRoute && <Redirect to='/tutor/feedback'/> }
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

				<DialogTitle id="scroll-dialog-title">Aviso de Privacidad</DialogTitle>
				<DialogContent>
					<DialogContentText>
						La Universidad Veracruzana, es el responsable del tratamiento de los Datos Personales que nos proporcionen.\n
Sus datos personales serán utilizados para le proporcionar los correspondientes registros de sus tutorados.Estos datos son de carácter informativo y de uso exclusivo para la gestion del sistema, por lo que, se comunica que no se efectuarán tratamientos adicionales.\n
Se informa que no realizarán transferencias que requieren su consentimiento, salvo aquellas que sean necesarias para atender requerimientos de información de una autoridad competente, debidamente fundados y motivados.
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
						label="Acepto"
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
			<Dialog open={cancelarTutoriaDialog}
				scroll={'paper'}
				aria-labelledby="scroll-dialog-title"
				aria-describedby="scroll-dialog-description">

				<DialogTitle id="form-dialog-title">Cancelar Tutoría</DialogTitle>
				<DialogContent>
					<DialogContentText>
						¿Desea cancelar la tutoría actual?
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCerrarCancelarTutoria} color="primary">
						Cancelar
          			</Button>
					  <Button onClick={handleConfirmarCancelarTutoria} color="primary">
						Aceptar
          			</Button>
				</DialogActions>
			</Dialog>
		</Drawer >
	);
});

export default SideBar;