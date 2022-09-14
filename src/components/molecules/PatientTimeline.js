import * as React from "react";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import Button from "@mui/material/Button";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import Typography from "@mui/material/Typography";
import ManIcon from "@mui/icons-material/Man";
import WomanIcon from "@mui/icons-material/Woman";
import { Paper } from "@mui/material";
import { format } from "date-fns";

export const PatientTimeline = ({ visits, viewAppointment }) => {
  return (
    <Paper
      sx={{
        p: 5,
        width: "40%",
        height: "60%",
        position: "absolute",
        top: 150,
      }}
    >
      <Typography align="center" color="#00b0ff" fontWeight={200}>
        Your visits for the day:
      </Typography>

      <Timeline sx={{ color: "#3f3d56" }}>
        {visits.slice(0, 5).map((visit) => (
          <TimelineItem key={visit.id}>
            <TimelineOppositeContent>
              <Typography fontSize="0.9rem">
                {format(new Date(visit.start), "HH:mm")}
              </Typography>
              <Typography variant="body2">{visit.time}</Typography>
            </TimelineOppositeContent>
            <TimelineSeparator sx={{ color: "#00b0ff" }}>
              <TimelineDot sx={{ bgcolor: "#00b0ff" }}>
                {visit.carerId.carerProfileId.gender === "male" ? (
                  <ManIcon />
                ) : (
                  <WomanIcon />
                )}
              </TimelineDot>
              <TimelineConnector sx={{ bgcolor: "#00b0ff" }} />
            </TimelineSeparator>
            <TimelineContent>
              <Typography fontSize="0.64rem">Carer</Typography>
              <Button
                size="small"
                variant="Contained"
                onClick={viewAppointment}
                id={visits.id}
              >
                {visit.carerId.carerProfileId.username}
                {visit.carerId.carerProfileId.gender}
              </Button>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </Paper>
  );
};
