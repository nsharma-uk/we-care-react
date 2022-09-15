import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

import { useState } from "react";

const CheckInAndOut = () => {
  const [alignment, setAlignment] = useState("");

  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  return (
    <ToggleButtonGroup
      color="primary"
      value={alignment}
      exclusive
      onChange={handleChange}
      aria-label="Platform"
      sx={{ p: 2 }}
    >
      <ToggleButton value="web">Check In</ToggleButton>
      <ToggleButton value="android">Check Out</ToggleButton>
    </ToggleButtonGroup>
  );
};

const BtnUpdateNotes = () => {
  const updateCareNotes = () => {
    console.log("updateCareNotes");
  };
  return (
    <Button variant="Contained" onClick={updateCareNotes}>
      Update care notes
    </Button>
  );
};

const BtnPastNotes = () => {
  const viewPastVisitNotes = () => {
    console.log("viewPastVisitNotes");
  };
  return (
    <Button variant="contained" onClick={viewPastVisitNotes}>
      View past visit notes
    </Button>
  );
};

const BtnPatientProfile = () => {
  const ViewPatientProfile = () => {
    console.log("ViewPatientProfile");
  };
  return (
    <Button variant="Contained" onClick={ViewPatientProfile}>
      View Patient Profile
    </Button>
  );
};

export const NextVisitForCarer = () => {
  return (
    <Paper
      sx={{ p: 3, width: "30%", height: 800, position: "absolute", right: 1 }}
      elevation={6}
    >
      <div>
        <h2>Next Appointment Patient Detail</h2>
        <h4>Name of the Patient | Address of the Patient</h4>
      </div>
      <CheckInAndOut />
      <TextField
        sx={{ width: "500px" }}
        id="outlined-textarea"
        label="Your Special Care Requirement"
        multiline
        row={4}
        variant="filled"
      />
      <Stack
        direction="row"
        divider={<Divider orientation="vertical" flexItem />}
        spacing={2}
        sx={{ p: 3 }}
      >
        <BtnUpdateNotes />
        <BtnPastNotes />
        <BtnPatientProfile />
      </Stack>
    </Paper>
  );
};