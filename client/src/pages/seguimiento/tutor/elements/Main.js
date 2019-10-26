import React, { memo } from 'react';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import CurrentTutorado from '../elements/CurrentTutorado';
import NextTutorado from '../elements/NextTutorado';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Agenda from '../elements/Agenda';
import Paper from '@material-ui/core/Paper';
import Tutorados from '../elements/Tutorados';
import TemasTutorado from '../elements/TemasTutorado';

const Main = memo(props => {
	const classes = props.classes;
	const test = props.test;
	return (
		<main className={classes.content}>
		    <div className={classes.appBarSpacer} />
		    <Container maxWidth="lg" className={classes.container}>
		      <Grid container spacing={3} justify="flex-end">
		        {/* Tutoria Controles */}
		        <Grid item xs={12} md={8} lg={8}>
		          <CurrentTutorado />
		        </Grid>
		        <Grid item xs={12} md={4} lg={4}>
		          <NextTutorado />
		        </Grid>
		      </Grid>
		      <Grid container spacing={3}>
		        {/* Agenda */}
		        <Grid item xs={12} md={4} lg={5}>
		          <Typography variant="h6" gutterBottom>
		            Agenda
		            </Typography>
		          <Divider />
		          <Agenda className={classes.markdown}>
		            {test}
		          </Agenda>
		        </Grid>
		        {/* Temas Tutorado */}
		        <Grid item xs={12} md={4} lg={3}>
		          <Paper elevation={0} className={classes.sidebarAboutBox}>
		            <TemasTutorado />
		          </Paper>
		        </Grid>
		        {/* Recent Tutorados */}
		        <Grid item xs={12} md={4} lg={4}>
		          <Paper className={classes.paper}>
		            <Tutorados />
		          </Paper>
		        </Grid>
		      </Grid>
		    </Container>
	  	</main>
	);
});

export default Main;