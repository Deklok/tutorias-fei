import React, { memo } from 'react';
import clsx from 'clsx';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';


const NavBar = memo(props=>{
  const classes = props.classes;
  const nombre = props.nombre;
  const contacto = props.contacto;
  const open = props.open;

  return(
    <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={props.handleDrawerOpen}
            className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
          >
            <MenuIcon />
          </IconButton>
          {nombre ? <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
            Tutor {`${nombre}, ${contacto}`}
          </Typography> :
          <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
              Porfavor actualice su contacto y sus datos personales y recargue la página
            </Typography>}
        </Toolbar>
      </AppBar>
  );
});

export default NavBar;