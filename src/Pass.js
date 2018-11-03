import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import LinearProgress from "@material-ui/core/LinearProgress";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Button from "@material-ui/core/Button";

import MenuItem from "@material-ui/core/MenuItem";

import Select from "@material-ui/core/Select";

let styles = theme => ({
  container: {
    backgroundColor: "#eee",
    width: "100%",
    height: "100%"
  },
  textField: {
    width: "100%",
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    backgroundColor: "#fff"
  },
  dense: {
    marginTop: 16
  },
  menu: {
    width: 200
  },
  root: {
    flexGrow: 1
  },
  timeBar: {
    color: "#00695C"
  },
  colorPrimary: {
    backgroundColor: "#B2DFDB"
  },
  barColorPrimary: {
    backgroundColor: "#00695C"
  }
});

class Pass extends React.Component {
  state = {
    expired: false
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  componentWillMount = () => {
    var endTime = new Date().getTime();

    endTime += 1000 * 60 * 10;
    var firstDistance = endTime - new Date().getTime();
    var x = setInterval(() => {
      // Get todays date and time
      var now = new Date().getTime();
      // Find the distance between now and the count down date
      var distance = endTime - now;

      // Time calculations for days, hours, minutes and seconds
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);

      this.setState({
        percent: (1 - distance / firstDistance) * 100,
        timeLeft: minutes + " min " + seconds + " seconds till pass expires."
      });

      // If the count down is over, write some text
      if (distance < 0) {
        clearInterval(x);
        this.setState({
          expired: true
        });
      }
    }, 1000);

    this.setState({
      fromTeacher: this.props.match.params.key
    });
  };

  handleSelect = event => {
    this.setState({ destination: event.target.value });
  };

  handleMakePass = () => {
    this.setState({ passMade: true });
  };

  render() {
    const { classes } = this.props;
    console.log(this.state.percent);
    return (
      <div className={classes.root}>
        From: {this.state.fromTeacher}
        <form className={classes.container} noValidate autoComplete="off">
          <TextField
            id="outlined-dense"
            label="Full Name?"
            className={classNames(classes.textField, classes.dense)}
            margin="dense"
            variant="outlined"
          />
          <br />
          <br />
          <FormControl variant="outlined" className={classes.textField}>
            <InputLabel
              ref={ref => {
                this.InputLabelRef = ref;
              }}
              htmlFor="outlined-age-simple"
            >
              Destination?
            </InputLabel>
            <Select
              value={this.state.destination}
              onChange={this.handleSelect}
              input={
                <OutlinedInput
                  labelWidth={this.state.labelWidth}
                  name="Destination"
                  id="outlined-age-simple"
                />
              }
            >
              <MenuItem value="">
                <em>Bathroom</em>
              </MenuItem>
              <MenuItem value={10}>Office</MenuItem>
              <MenuItem value={20}>Guidance</MenuItem>
              <MenuItem value={30}>Media</MenuItem>
            </Select>
          </FormControl>
          <br />
          <br />
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={this.handleMakePass}
          >
            Make Pass
          </Button>
          <br />
          <br />
          <div className={classes.timeBar}>
            {this.state.timeLeft}
            {this.state.percent < 75 ? (
              <LinearProgress
                classes={{
                  colorPrimary: classes.colorPrimary,
                  barColorPrimary: classes.barColorPrimary
                }}
                variant="determinate"
                value={this.state.percent}
              />
            ) : (
              <LinearProgress
                color="secondary"
                variant="determinate"
                value={87}
              />
            )}
          </div>
        </form>
      </div>
    );
  }
}

Pass.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Pass);
