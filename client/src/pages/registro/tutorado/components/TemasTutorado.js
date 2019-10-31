/* eslint-disable no-script-url */

import React, {memo} from 'react';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Title from '../../../seguimiento/components/Title';
import TemasTutorado from '../../../seguimiento/components/TemasTutorado';

const useStyles = makeStyles({
  depositContext: {
    flex: 1,
  },
});

return (
    <React.Fragment>
      <Title>Temas del Tutorado</Title>
      <div>
        <div className="row">
            <textarea/>
        </div>
      </div>
    </React.Fragment>
);

export default TemasTutorado;