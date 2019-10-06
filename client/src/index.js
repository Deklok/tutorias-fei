import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#577ECF',
        },
        secondary: {
            main: '#28AD56',
        },
        danger: {
            main: '#F4534E',
        }
    },
    status: {
        danger: '#F4534E',
    },
});

render((
    <BrowserRouter>
        <MuiThemeProvider theme={theme}>
            <App />
        </MuiThemeProvider>
    </BrowserRouter>
), document.getElementById('root'));
