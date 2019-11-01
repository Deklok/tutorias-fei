import React, { Component } from 'react';
import './MensajePrincipal.css';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';

function MensajePrincipal(){
    return(
        <div className="MensajePrincipal">
            <Dialog disableBackdropClick disableEscapeKeyDown open="true">
                <h1>Rango de horas de atención</h1>
                    <p>
                    El rango establecido se ha guardado exitosamente.
                    Se ha enviado un correo electrónico a sus tutorados como 
                    notificación para que puedan registrarse en los bloques 
                    generados del rango de horas de atención. Si desea modificar 
                    los bloques generados o darles un nombre para identificarlos mejor, 
                    de clic en la opción para administrar los bloques.
                    </p>
                    <Button id="btnAceptar" variant="contained">Aceptar</Button>
            </Dialog> 
        </div>
    );
}

export default MensajePrincipal;