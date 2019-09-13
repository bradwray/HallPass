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
import Typography from "@material-ui/core/Typography";
import MenuItem from "@material-ui/core/MenuItem";

import Select from "@material-ui/core/Select";

const readableExpiration = date => {
   var hours = date.getHours();
   var minutes = date.getMinutes();
   var day = date.toUTCString().substring(0, 16);
   var ampm = hours >= 12 ? "pm" : "am";
   hours = hours % 12;
   hours = hours ? hours : 12; // the hour '0' should be '12'
   minutes = minutes < 10 ? "0" + minutes : minutes;
   var strTime = hours + ":" + minutes + " " + ampm;
   return strTime + " on " + day;
};

let styles = theme => ({
   container: {
      backgroundColor: "#eee",
      width: "100%",
      height: "100%"
   },
   textField: {
      width: "90%",
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
      color: "#00695C",
      bottom: "20px"
   },
   colorPrimary: {
      backgroundColor: "#B2DFDB"
   },
   barColorPrimary: {
      backgroundColor: "#00695C"
   },
   expired: {
      backgroundColor: "#f00",
      width: "100%",
      height: "600px"
   }
});

class Pass extends React.Component {
   state = {
      expired: false,
      name: localStorage.getItem("name")
   };

   componentWillMount = () => {
      var endTime;
      var passMins = 8;
      //if a QR was just scanned (i.e. ...sandbox.io/Wray and there is no time param yet
      //and the pass has been expired as long as it was in the first place
      if (
         this.props.match.params.expires === undefined &&
         localStorage.getItem("expiresAt") <
         new Date().getTime() - 1000 * 60 * passMins
      ) {
         //create an expiration time
         endTime = new Date().getTime() + 1000 * 60 * passMins;
         //put it in local storage
         localStorage.setItem("expiresAt", endTime);
         //push it to the path
         this.props.history.push(
            "/" + this.props.match.params.teacher + "/" + endTime
         );
         this.setState({ expired: false });
      }

      var x = setInterval(() => {
         endTime = localStorage.getItem("expiresAt");
         var firstDistance = 1000 * 60 * passMins;
         // Get todays date and time
         var now = new Date().getTime();
         // Find the distance between now and the count down date
         var distance = endTime - now;
         console.log(endTime);
         //console.log(firstDistance);
         // Time calculations for days, hours, minutes and seconds
         var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
         var seconds = Math.floor((distance % (1000 * 60)) / 1000);

         this.setState({
            percent: (1 - distance / firstDistance) * 100,
            timeLeft: minutes + " min " + seconds + " sec",
            expired: distance < 0,
            expiredAt: endTime
         });

         if (minutes < 0 - passMins) {
            window.close();
         }
      }, 1000);

      this.setState({
         fromTeacher: this.props.match.params.teacher
      });
   };

   handleChange = event => {
      localStorage.setItem("name", event.target.value);
      this.setState({
         name: event.target.value
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
      console.log(this.state);
      return (
         <div>
            {!this.state.expired ? (
               <div>
                  {this.state.fromTeacher ? (
                     <div>
                        <div className={classes.root}>
                           <Typography variant="h5">
                              Hall pass from: {this.state.fromTeacher}'s room for...
                  </Typography>
                           {!this.state.passMade ? (
                              <form
                                 className={classes.container}
                                 noValidate
                                 autoComplete="off"
                              >
                                 <TextField
                                    id="outlined-dense"
                                    label="Full Name?"
                                    className={classNames(classes.textField, classes.dense)}
                                    margin="dense"
                                    variant="outlined"
                                    onChange={this.handleChange}
                                 />
                                 <br />
                                 <br />
                                 <FormControl
                                    variant="outlined"
                                    className={classes.textField}
                                 >
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
                                       <MenuItem value={"Bathroom"}>Bathroom</MenuItem>
                                       <MenuItem value={"Office"}>Office</MenuItem>
                                       <MenuItem value={"Guidance"}>Guidance</MenuItem>
                                       <MenuItem value={"Media"}>Media</MenuItem>
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
                              </form>
                           ) : (
                                 <div>
                                    <Typography variant="h3">{this.state.name}</Typography>
                                    going to
                      <Typography variant="h3">
                                       {this.state.destination}
                                    </Typography>
                                    <br />
                                 </div>
                              )}
                           <div className={classes.timeBar}>
                              <Typography variant="h3">{this.state.timeLeft}</Typography>
                              <Typography variant="h5">
                                 till this pass expires.
                    </Typography>
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
                        </div>
                     </div>
                  ) : (
                        <div />
                     )}
               </div>
            ) : (
                  <div className={classes.expired}>
                     <Typography variant="h2">
                        PASS EXPIRED AT:{" "}
                        {readableExpiration(
                           new Date(parseInt(localStorage.getItem("expiresAt"), 10))
                        )}
                     </Typography>
                  </div>
               )}
         </div>
      );
   }
}

Pass.propTypes = {
   classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Pass);
