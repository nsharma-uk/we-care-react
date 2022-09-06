import Button from "@mui/material/Button";

export const ButtonDark = ({ label, type, href }) => {
  return (
    <Button
      className="button"
      variant="contained"
      type={type}
      href={href}
      sx={{
        fontWeight: 100,
        backgroundColor: "#3f3d56",
        color: "#eef5dbff",
        "&:hover": { backgroundColor: "#f7b801" },
        borderRadius: "18px",
      }}
    >
      {label}
    </Button>
  );
};
