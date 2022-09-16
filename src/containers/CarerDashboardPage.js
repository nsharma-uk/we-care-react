import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import { useMediaQuery } from "@mui/material";
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { useState, useRef, useCallback, useEffect } from "react";
import { NextVisitForCarer } from "../components/organisms/NextVisit";
import { CarerTimeline } from "../components/molecules/CarerTimeline";
import { useMutation, useQuery, useLazyQuery } from "@apollo/client";
import { NEXT_WORKING_DAY_APPOINTMENTS } from "../graphql/queries";

export const CarerDashboardPage = () => {
  // MediaQuery for mobile viewport
  const isMobile = useMediaQuery("(max-width:900px)");

  //mutations
  const { data, loading } = useQuery(NEXT_WORKING_DAY_APPOINTMENTS);
  const [
    getUpdatedData,
    { data: dayData, loading: dayLoading, error: dayError },
  ] = useLazyQuery(NEXT_WORKING_DAY_APPOINTMENTS, {
    fetchPolicy: "network-only",
  });

  //state variables
  const [timelineDate, setTimelineDate] = useState(new Date());
  const [timelineData, setTimelineData] = useState([]);
  const [statusChanged, setStatusChanged] = useState();
  const [appointmentDetail, setAppointmentDetail] = useState();

  //useEffect for update of the page
  useEffect(() => {
    if (data) {
      setTimelineData(data.appointmentsForNextWorkingDay);
      setTimelineDate(data.appointmentsForNextWorkingDay[0].start);
    }
  }, [data]);

  useEffect(() => {
    getUpdatedData();
  }, [statusChanged]);

  useEffect(() => {
    if (dayData) {
      setTimelineData(dayData.appointmentsForNextWorkingDay);
    }
  }, [dayData]);

  //getting status change from nextVisit component
  const handleStatusChange = (e) => {
    setStatusChanged(e);
  };

  //function to display selected appointment into right hand side panel
  const viewAppointment = (event) => {
    const appointment = timelineData.filter((i) => i.id === event.target.id)[0];
    setAppointmentDetail(appointment);
  };

  //google map and directions
  const center = { lat: 52.489471, lng: -1.898575 };

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API,
    libraries: ["places"],
  });

  const [map, setMap] = useState(/** @type google.maps.Map */ (null));
  const [directionResponse, setDirectionResponse] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");

  const originRef = useRef(null);
  const destinationRef = useRef(null);
  console.log(timelineData);

  const onClick = useCallback(() => {
    if (
      originRef.current &&
      originRef.current.value !== "" &&
      destinationRef.current &&
      destinationRef.current.value !== ""
    ) {
      setOrigin(originRef.current.value);

      setDestination(destinationRef.current.value);
    }
  }, []);

  const calculateRoute = async () => {
    // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService();
    const results = await directionsService.route({
      origin,
      destination,
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.DRIVING,
    });
    setDirectionResponse(results);
    setDistance(results.routes[0].legs[0].distance.text);
    setDuration(results.routes[0].legs[0].duration.text);
  };

  const handleOriginClick = (event) => {
    setOrigin(event.target.value);
  };

  const handleDestinationClick = (event) => {
    setDestination(event.target.value);
  };

  if (!isLoaded) {
    return <h1>map is not loading</h1>;
  }

  return (
    <>
      <Box>
        {/* next appointment detail */}
        {appointmentDetail && (
          <NextVisitForCarer
            appointmentDetail={appointmentDetail}
            handleStatusChange={handleStatusChange}
          />
        )}

        {/* carer timeline box container */}
        {timelineData && (
          <Box
            zIndex="modal"
            sx={{
              minWidth: isMobile ? "100%" : "400px",
              maxWidth: isMobile ? "100%" : "400px",
              padding: isMobile ? 4 : 0,
              p: isMobile ? 3 : 0,
              background: "#DDF4FE",
              opacity: 0.95,
              borderRadius: "20px",
              p: 1,
            }}
          >
            <CarerTimeline
              date={timelineDate}
              appointments={timelineData}
              viewAppointment={viewAppointment}
            />
          </Box>
        )}

        {/* Appointments' directions box container */}
        <Box
          zIndex="modal"
          sx={{
            backgroundColor: "#DDF4FE",
            minWidth: isMobile ? "100%" : "400px",
            maxWidth: isMobile ? "100%" : "400px",
            padding: isMobile ? 4 : 0,
            p: isMobile ? 3 : 0,
            background: "#DDF4FE",
            opacity: 0.95,
            borderRadius: "20px",
            height: 320,
            p: 2,
          }}
        >
          <FormControl variant="filled" sx={{ m: 1, width: 230 }}>
            <InputLabel id="demo-simple-select-filled-label">
              Choose Your Origin
            </InputLabel>
            <Select
              labelId="demo-simple-select-filled-label"
              id="demo-simple-select-filled"
              value={origin}
              onChange={handleOriginClick}
            >
              {timelineData.map((appointment, index) => (
                <MenuItem
                  value={appointment.patientId.address.fullAddress}
                  key={index}
                >
                  {appointment.patientId.address.fullAddress}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl variant="filled" sx={{ m: 1, width: 230 }}>
            <InputLabel id="demo-simple-select-filled-label">
              Choose Your Destination
            </InputLabel>
            <Select
              labelId="demo-simple-select-filled-label"
              id="demo-simple-select-filled"
              value={destination}
              onChange={handleDestinationClick}
            >
              {timelineData.map((appointment, index) => (
                <MenuItem
                  value={appointment.patientId.address.fullAddress}
                  key={index}
                >
                  {appointment.patientId.address.fullAddress}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <div className="map-settings">
            <hr className="mt-0 mb-3" />
            <div>
              <h4>distance: {distance}</h4>
              <h4>duration: {duration}</h4>
            </div>

            <Button
              variant="Contained"
              onClick={calculateRoute}
              sx={{
                fontWeight: 100,
                backgroundColor: "#3f3d56",
                color: "#eef5dbff",
                "&:hover": { backgroundColor: "#f7b801" },
                borderRadius: "18px",
              }}
            >
              Check Directions
            </Button>
          </div>
        </Box>

        {/* map goes here  */}
        <Box>
          {" "}
          <GoogleMap
            center={center}
            zoom={16}
            mapContainerStyle={{
              width: "100%",
              minHeight: isMobile ? "100%" : "930px",
              position: "absolute",
              top: "0px",
              left: "0px",
              zIndex: "-1",
            }}
            onLoad={(map) => setMap(map)}
          >
            {/* displaying markers -render appointments later */}
            <Marker position={center} />
            {directionResponse && (
              <DirectionsRenderer directions={directionResponse} />
            )}
          </GoogleMap>
        </Box>
      </Box>
    </>
  );
};
