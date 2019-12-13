import React, { memo } from 'react';
import { Redirect } from 'react-router-dom';
import notifier from 'simple-react-notifications';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import Typography from '@material-ui/core/Typography';
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
import CachedIcon from '@material-ui/icons/Cached';
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
	const contacto = props.contacto;
	const [email, setEmail] = React.useState(contacto);
	const [terminosDialog, setTerminosDialog] = React.useState(false);
	const [loginDialog, setLoginDialog] = React.useState(false);
	const [cancelarTutoriaDialog, setCancelarTutoriaDialog] = React.useState(false);
	const [feedbackRoute, setFeedbackRoute] = React.useState(false);
	const [mainRoute, setMainRoute] = React.useState(false);
	const [adjustRoute, setAdjustRoute] = React.useState(false);
	const [username, setUsername] = React.useState(utilities.splitCookie(cookies.get('token')).id);
	const [password, setPassword] = React.useState("");
	const [errors, setErrors] = React.useState(false);
	const [contactoDialog, setContactoDialog] = React.useState(false);
	const [contactoPermitirCambio, setContactoCambio] = React.useState(contacto == null);
	const [authError, setAuthError] = React.useState(false);
	const [buttonAccept, setButtonAccept] = React.useState(false);
	const [buttonCancel, setButtonCancel] = React.useState(false);
	var token = utilities.splitCookie(cookies.get('token')).token;
  	var role = utilities.splitCookie(cookies.get('token')).session;
	const [state, setState] = React.useState({
		terminos: false,
	});
	var initTerminos = false;

	React.useEffect(()=>{
    	checkIsAgree().then(function (result){
    		var terminosValue = {terminos: result.data};
    		setState(terminosValue);
    		initTerminos = result.data;
    	});
  	}, []);

	const handleCheckTerminos = name => event => {
		setState({ ...state, [name]: event.target.checked });
	};

	const handleAbrirTerminos = () => {
		if (state.terminos) {
			setLoginDialog(true);
		} else {
			setTerminosDialog(true);
		}
	};

	const handleLogin = () => {
		setErrors(false);
		setAuthError(false);
		setButtonAccept(true);
		setButtonCancel(true);
		if (username.length < 2 || password.length < 2) {
			setErrors(true);
			setButtonAccept(false);
			setButtonCancel(false);
		} else {
			axios.post(route + 'api/dataimport/tutor', {
				user: username,
				pass: password
			},{
				headers: { Authorization: token + ";" + role }
			}).then(function(response){
				if (response.data.auth_error) {
					setAuthError(true);
				} else {
					if (response.data.scraper_error || response.data.persistence_error) {
						notifier.error("Error en el proceso de importación - Error de servidor", {
							position: "top-right",
							autoClose: 3000
						});
					} else {
						notifier.success("La importación de datos se ha realizado correctamente", {
							position: "top-right",
							autoClose: 3000
						});
					}
					setLoginDialog(false);
				}
				setButtonAccept(false);
				setButtonCancel(false);
			}).catch(function(err){
				console.log(err.response);
				notifier.error("Error en el proceso de importación - Error inesperado", {
					position: "top-right",
					autoClose: 3000
				});
			});
		}
	}
	const handleCerrarLogin = () => {
		setLoginDialog(false);
	}

	const handleConfirmarCancelarTutoria = () => {
		setCancelarTutoriaDialog(false);
		notifyAllCanceledDay();
		cancelarTutoria()
		.then(()=>{
			notifier.success("Tutoría cancelada. Sus tutorados han sido notificados", {
				position: "top-right",
				autoClose: 10000
			});
			window.location.reload();
		}).catch(()=>{
			notifier.error("Error al cancelar la tutoría", {
				position: "top-right",
				autoClose: 5000
			});
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
		if (!initTerminos) {
			setAgreement();
		}	
	};
	const handleCerrarTerminosDialog = () => {
		setTerminosDialog(false);
		notifier.error("Para importar los datos es necesario aceptar los términos", {
			position: "top-right",
			autoClose: 3000
		});
	}
	const handleAbrirActualizarContacto = () => {
		console.log(contacto);
		console.log(contactoPermitirCambio);
		setContactoDialog(true);
	}
	const handleCerrarActualizarContacto = () => {
		setContactoDialog(false);
	}
	const handleResetContacto = () => {
		notifyResetEmail().then(function (response) {
			if (response.status == 200) {
				notifier.success("Correo olvidado en el sistema", {
					position: "top-right",
					autoClose: 3000
				});
				setContactoCambio(true);
			} else {
				setEmail(null);
				menssageError();
			}
		});
	}
	const handleActualizarCorreo = () => {
		var regExpEmail = new RegExp(/^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i);
		if (regExpEmail.test(email)) {
			notifySetupEmail().then(function (response){
				if (response.status == 201) {
					setContactoCambio(false);
					notifier.success("Correo registrado en el sistema", {
						position: "top-right",
						autoClose: 3000
					});
				} else {
					setEmail(null);
					menssageError();
				}
				setContactoDialog(false);
			});		
		} else {
			notifier.error("Esto no parece un correo válido", {
				position: "top-right",
				autoClose: 3000
			});
		}
	}

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
		return axios.post(process.env.REACT_APP_API_SERVER + 'api/db/getNextTutorship', {
			idTutor: tutor
		  },{
			headers: { Authorization: token + ";" + role }
		}).then((response)=>{
			if (response.data[0].length) {
				axios.post(route + 'api/db/updateTutorshipStatus', {
					idTutorship: response.data[0][0].idTutorship,
					idTutor: tutor,
					new_status: 3
				  },{
					headers: { Authorization: token + ";" + role }
				  });
			}
		});
	
	}
	async function notifySetupEmail(){
		return axios.post(route + 'api/notify/email/signup', {
	      user: tutor,
	      email: email
	    },{
	      headers: { Authorization: token + ";" + role }
	    });
	}
	async function notifyResetEmail(){
		return axios.post(route + 'api/notify/email/reset', {
	      user: tutor,
	    },{
	      headers: { Authorization: token + ";" + role }
	    });
	}
	async function checkIsAgree(){
		return axios.post(route + 'api/db/isagree', {
	      user: username
	    },{
	      headers: { Authorization: token + ";" + role }
	    });
	}
	async function setAgreement(){
		axios.post(route + 'api/db/setAgreement', {
	      user: username
	    },{
	      headers: { Authorization: token + ";" + role }
	    });
	}
	async function notifyAllCanceledDay(emailInput){
		axios.post(route + '/api/notify/email/signup', {
	      user: username,
	      email: emailInput
	    },{
	      headers: { Authorization: token + ";" + role }
	    });
	}
	function menssageError(){
		notifier.error("Algo salió en el registro :(", {
			position: "top-right",
			autoClose: 3000
		});
	}

	function logout() {
		console.log("Loggin out");
		cookies.remove('token');
		window.location.reload();
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
					<ListItem button onClick={handleAbrirActualizarContacto}>
						<ListItemIcon>
							<CachedIcon />
						</ListItemIcon>
						<ListItemText primary="Actualizar Contacto" />
					</ListItem>
					<ListItem button component="a" onClick={logout}>
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
						La Universidad Veracruzana, es el responsable del tratamiento de los Datos Personales que nos proporcione.
Sus datos personales serán utilizados para proporcionar los correspondientes registros de sus tutorados. Estos datos son de carácter informativo y de uso exclusivo para la gestion del sistema, por lo que, se comunica que no se efectuarán tratamientos adicionales.
Se informa que no realizarán transferencias que requieren de su consentimiento, salvo aquellas que sean necesarias para atender requerimientos de información de una autoridad competente, debidamente fundados y motivados.
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
					<Button onClick={handleCerrarTerminosDialog} color="secondary">
						Cancelar
          			</Button>
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
					{ authError && <Typography color="error" variant="caption"> Cuenta no existente o contraseña incorrecta. Porfavor compruebe sus datos </Typography> }
					<TextField
						autoFocus
						margin="dense"
						id="matricula"
						label="Matrícula"
						type="email"
						fullWidth
						error={errors}
						onChange={e=>setUsername(e.target.value)}
					/>
					<TextField
						autoFocus
						margin="dense"
						id="password"
						label="Contraseña"
						type="password"
						fullWidth
						error={errors}
						onChange={e=>setPassword(e.target.value)}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCerrarLogin} color="secondary" disabled={buttonCancel}>
						Cancelar
          			</Button>
					<Button onClick={handleLogin} color="primary" disabled={buttonAccept}>
						Enviar
          			</Button>
				</DialogActions>
			</Dialog>
				<Dialog open={contactoDialog}
				scroll={'paper'}
				aria-labelledby="scroll-dialog-title"
				aria-describedby="scroll-dialog-description">
				<DialogTitle id="form-dialog-title">Actualizar correo electrónico</DialogTitle>
				<DialogContent>
					<TextField
						autoFocus
						margin="dense"
						id="contacto"
						placeholder = {contacto}
						label="Correo electrónico"
						type="email"
						fullWidth
						onChange={e=>setEmail(e.target.value)}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleResetContacto} disabled={contactoPermitirCambio} color="secondary">
						Olvidar correo
          			</Button>
					<Button onClick={handleActualizarCorreo} disabled={!contactoPermitirCambio} color="primary">
						Actualizar
          			</Button>
				</DialogActions>
				<Button onClick={handleCerrarActualizarContacto} color="secondary">
						Cancelar
          			</Button>
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