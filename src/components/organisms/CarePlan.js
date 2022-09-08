import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useMutation, useLazyQuery } from "@apollo/client";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import LoadingButton from "@mui/lab/LoadingButton";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import FormHelperText from "@mui/material/FormHelperText";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Button from "@mui/material/Button";
import SearchIcon from "@mui/icons-material/Search";
import MenuItem from "@mui/material/MenuItem";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Select from "@mui/material/Select";

import { CARER_SIGNUP } from "../../graphql/mutations";
import { ADDRESS_LOOKUP } from "../../graphql/queries";
import { ButtonDark } from "../atoms/ButtonDark";

export const CarePlan = ({ isMobile }) => {
  const [Login], { data, loading, error }] = useMutation(CARER_SIGNUP);

  //state for gender dropdown menu
  const [gender, setGender] = useState("");

  //state for days of the week checkbox
  const [day, setDay] = useState([]);

  //state variables for address lookup
  const [
    addressLookup,
    {
      data: addressLookupData,
      loading: addressLookupLoading,
      error: addressLookupError,
    },
  ] = useLazyQuery(ADDRESS_LOOKUP, {
    fetchPolicy: "network-only",
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
    setError,
    clearErrors,
    getValues,
  } = useForm({
    mode: "onBlur",
  });
  const [successStatus, setSuccessStatus] = useState(false);
  const [formKey, setFormKey] = useState(new Date());
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmedPassword, setShowConfirmedPassword] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState();
  const [selectedAddress, setSelectedAddress] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    if (data?.carerSignup?.success) {
      setSuccessStatus(!successStatus);
    }
  }, [data, navigate]);

  useEffect(() => {
    if (addressLookupData?.addressLookup) {
      handleOpenModal();
    }
  }, [addressLookupData]);

  const onSubmit = (formData) => {
    if (formData.password !== formData.confirmPassword) {
      setError("confirmPassword", {
        type: "manual",
        message: "Passwords do not match.",
      });
    } else if (!selectedAddressId) {
      setError("postcode", {
        type: "manual",
        message: "Please select an address",
      });
    } else {
      const signupInput = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        password: formData.password,
        postcode: formData.postcode,
        address: selectedAddressId,
      };

      const carerInput = {
        gender: gender,
        days: day,
      };

      carerSignup({
        variables: {
          signupInput,
          carerInput,
        },
      });
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmedPassword = () => {
    setShowConfirmedPassword(!showConfirmedPassword);
  };

  const handleAddressLookup = () => {
    console.log("searching...");
    console.log(getValues("postcode"));
    addressLookup({
      variables: {
        postcode: getValues("postcode"),
      },
    });
  };

  const handleOpenModal = () => {
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  const handleAddressSelection = (event) => {
    setSelectedAddressId(event.currentTarget.id);
    const { fullAddress } = addressLookupData?.addressLookup?.addresses.find(
      (each) => each._id === event.currentTarget.id
    );
    setSelectedAddress(fullAddress);
    clearErrors("postcode");
    handleCloseModal();
  };

  const handleChangeGender = (event) => {
    setGender(event.target.value);
  };

  const handleDayValue = (e) => {
    let data = day.indexOf(e.target.value);
    if (data === -1) {
      setDay([...day, e.target.value]);
    } else {
      setDay(day.filter((data) => data !== e.target.value));
    }
  };

  const resetForm = () => {
    setFormKey(new Date());
    setSuccessStatus(!successStatus);
    //TODO: it brings back the form but it's already populated with the previous data - need to find a way to empty the fields
  };

  const redirectToDashboard = () => {
    navigate("/supervisor-dashboard", { replace: true });
  };

  return (
    <Paper sx={{ p: 3, minWidth: isMobile ? "90%" : "400px" }} elevation={6}>
      {/* //address lookup modal */}
      <Dialog open={open} onClose={handleCloseModal}>
        <DialogTitle>Select Address</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please select one address from the following list:
          </DialogContentText>
          <List>
            {addressLookupData?.addressLookup?.addresses?.map((address) => {
              return (
                <ListItem disablePadding key={address._id}>
                  <ListItemButton
                    onClick={handleAddressSelection}
                    id={address._id}
                  >
                    <ListItemText primary={address.fullAddress} />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* form */}
      <Typography component="h1" variant="h4" align="center">
        Add a carer
      </Typography>
      <Divider />
      {!successStatus && (
        <Stack
          component="form"
          key={formKey}
          sx={{ p: 3 }}
          spacing={4}
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* user account details - needed for signupInput*/}
          <Stack spacing={2}>
            <Typography component="h2" variant="button" align="left">
              User account Details
            </Typography>

            <TextField
              required
              error={!!errors.firstName}
              label="First name"
              variant="outlined"
              helperText={
                !!errors.firstName ? "Please enter your first name." : ""
              }
              {...register("firstName", {
                required: true,
              })}
            />
            <TextField
              required
              error={!!errors.lastName}
              label="Last name"
              variant="outlined"
              helperText={
                !!errors.lastName ? "Please enter your last name." : ""
              }
              {...register("lastName", {
                required: true,
              })}
            />
            <TextField
              required
              error={!!errors.email}
              label="Email"
              variant="outlined"
              helperText={!!errors.email ? "Please enter a valid email." : ""}
              {...register("email", {
                required: true,
              })}
            />
            <FormControl sx={{ m: 1 }} variant="outlined">
              <InputLabel error={!!errors.password} htmlFor="password">
                Password
              </InputLabel>
              <OutlinedInput
                error={!!errors.password}
                id="password"
                type={showPassword ? "text" : "password"}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={toggleShowPassword}
                      onMouseDown={toggleShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
                {...register("password", {
                  required: true,
                })}
              />
              {!!errors.password && (
                <FormHelperText error={!!errors.password}>
                  Please enter a valid password.
                </FormHelperText>
              )}
            </FormControl>
            <FormControl sx={{ m: 1 }} variant="outlined">
              <InputLabel
                error={!!errors.confirmPassword}
                htmlFor="confirm-password"
              >
                Confirm Password
              </InputLabel>
              <OutlinedInput
                error={!!errors.confirmPassword}
                id="confirm-password"
                type={showConfirmedPassword ? "text" : "password"}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle confirm password visibility"
                      onClick={toggleShowConfirmedPassword}
                      onMouseDown={toggleShowConfirmedPassword}
                      edge="end"
                    >
                      {showConfirmedPassword ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </IconButton>
                  </InputAdornment>
                }
                label="Confirm Password"
                {...register("confirmPassword", {
                  required: true,
                  validate: (value) => getValues("password") === value,
                })}
              />
              {errors.confirmPassword && (
                <FormHelperText error={!!errors.confirmPassword}>
                  {errors.confirmPassword?.message || "Passwords do not match."}
                </FormHelperText>
              )}
            </FormControl>
            <TextField
              required
              error={!!errors.phoneNumber}
              label="Phone Number"
              variant="outlined"
              helperText={
                !!errors.phoneNumber ? "Please enter your phone number." : ""
              }
              {...register("phoneNumber", {
                required: true,
              })}
            />
            <FormControl sx={{ m: 1 }} variant="outlined">
              <InputLabel htmlFor="postcode">Postcode</InputLabel>
              <OutlinedInput
                id="postcode"
                type="text"
                // value={postcode}
                // onChange={handleOnChangeAddress}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleAddressLookup}
                      onMouseDown={handleAddressLookup}
                      edge="end"
                    >
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                }
                label="Postcode"
                {...register("postcode", {
                  required: true,
                })}
              />
              {!!errors.postcode && (
                <FormHelperText error={!!errors.postcode}>
                  {errors.postcode?.message}
                </FormHelperText>
              )}
            </FormControl>
            {selectedAddress && (
              <Typography component="div" variant="caption" align="left">
                {selectedAddress}
              </Typography>
            )}
            {/* carer account details - needed for carerInput*/}
            <Typography component="h2" variant="button" align="left">
              Profile Details
            </Typography>
            {/* drop down menu */}
            <FormControl>
              <InputLabel id="gender">Gender</InputLabel>
              <Select
                labelId="gender"
                id="gender"
                value={gender}
                label="Gender"
                onChange={handleChangeGender}
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
              </Select>
            </FormControl>
            <Typography component="h2" variant="button" align="left">
              Typical week
            </Typography>
            <Typography variant="caption" align="left">
              Working days pattern*
            </Typography>

            {/* check boxes */}
            <FormGroup
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space - between",
              }}
            >
              <FormControlLabel
                value="monday"
                control={<Checkbox />}
                label="Mon"
                onChange={(e) => handleDayValue(e)}
              />
              <FormControlLabel
                value="tuesday"
                control={<Checkbox />}
                label="Tue"
                onChange={(e) => handleDayValue(e)}
              />
              <FormControlLabel
                value="wednesday"
                control={<Checkbox />}
                label="Wed"
                onChange={(e) => handleDayValue(e)}
              />
              <FormControlLabel
                value="thursday"
                control={<Checkbox />}
                label="Thu"
                onChange={(e) => handleDayValue(e)}
              />
              <FormControlLabel
                value="friday"
                control={<Checkbox />}
                label="Fri"
                onChange={(e) => handleDayValue(e)}
              />
              <FormControlLabel
                value="saturday"
                control={<Checkbox />}
                label="Sat"
                onChange={(e) => handleDayValue(e)}
              />
              <FormControlLabel
                value="sunday"
                control={<Checkbox />}
                label="Sun"
                onChange={(e) => handleDayValue(e)}
              />
            </FormGroup>
          </Stack>

          <Stack spacing={2}>
            <LoadingButton variant="contained" type="submit" loading={loading}>
              Create Carer Account
            </LoadingButton>
            {error && (
              <Typography
                variant="caption"
                component="div"
                sx={{ color: "red" }}
                align="center"
              >
                Failed to sign up new carer. Please try again.
              </Typography>
            )}
          </Stack>
        </Stack>
      )}

      {successStatus && (
        <Stack sx={{ p: 3 }} spacing={4}>
          <Typography component="h2" variant="button" align="left">
            The new carer has been created successfully!
          </Typography>
          <ButtonDark
            label="Add another carer"
            type="button"
            onClick={resetForm}
          />
          <ButtonDark
            label="Go back to my dashboard"
            type="button"
            onClick={redirectToDashboard}
          />
        </Stack>
      )}
    </Paper>
  );
};
