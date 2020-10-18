import React, {useState, useEffect, useCallback, useRef} from 'react';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
}));




const NumberForm = props => {
    const classes = useStyles();
  
    const handleChange = e => {
      props.setSpeed(e.target.value
      )
    }
  
    const changeSpeed = e => {
      e.preventDefault();
      props.setSpeed(props.speed)
      props.runSimulation();
    }
  
    return (
      <form onSumbit={changeSpeed} className={classes.root} noValidate autoComplete="off">
        <div>
          
          <TextField
            id="standard-number"
            label="Number"
            type="number"
            step='100'
            value={props.speed}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
         
        </div>
        <button>Change Speed(ms)</button>
      </form>
    );
  }

  export default NumberForm;