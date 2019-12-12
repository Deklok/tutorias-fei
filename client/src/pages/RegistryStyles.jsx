import { makeStyles } from '@material-ui/core/styles';


export const registryBlockStyles = makeStyles(theme => ({ 
    title: {
        margin: theme.spacing(2),
        marginTop: 10,
    },
    appBarSpacer: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
    },
    container: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
    },
    paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
    },
    fixedHeight: {
        height: 240,
    },
    registryBox: {
        marginTop: 80,
        marginRight: 'auto',
        marginLeft: 'auto',
        width: '60%',
    },
    blockList: {
        marginTop: 30,
        marginRight: 'auto',
        marginLeft: 'auto',
        width: '60%',
        ['@media (max-width:760px)']:{
            marginLeft: 15,
            width: '40%',
        }
    },
    blockCell: {
        ['@media (max-width: 760px)']:{
            width: '20%',
            margin: 0,
            padding: 5,
        }
    },
    root: {
        padding: theme.spacing(3, 2),
    },
    button: {
        margin: theme.spacing(1),
        width: "95%",
    },
    saveButton: {
        marginTop: 30,
        float: 'right',
        marginRight: 120,
    },
    careerField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: '95%',
    },
    timeField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: '45%',
        ['@media (max-width:760px)']: {
            width: '95%',
        },
    },

}));