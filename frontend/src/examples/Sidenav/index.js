import { useEffect, useState } from "react"; // Añadimos useState
import { useLocation, NavLink, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

// @mui material components
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import Icon from "@mui/material/Icon";
import Dialog from "@mui/material/Dialog"; // Nuevo: Para la alerta
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Material Dashboard 2 React example components
import SidenavCollapse from "examples/Sidenav/SidenavCollapse";
import SidenavRoot from "examples/Sidenav/SidenavRoot";
import sidenavLogoLabel from "examples/Sidenav/styles/sidenav";

import {
  useMaterialUIController,
  setMiniSidenav,
  setTransparentSidenav,
  setWhiteSidenav,
  setAuthUser,
} from "context";

function Sidenav({ color, brand, brandName, routes, ...rest }) {
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentSidenav, whiteSidenav, darkMode, sidenavColor, user } =
    controller;

  const location = useLocation();
  const navigate = useNavigate();
  const collapseName = location.pathname.replace("/", "");

  // --- ESTADO PARA EL DIÁLOGO DE CONFIRMACIÓN ---
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);

  let textColor = "white";
  if (transparentSidenav || (whiteSidenav && !darkMode)) {
    textColor = "dark";
  } else if (whiteSidenav && darkMode) {
    textColor = "inherit";
  }

  const closeSidenav = () => setMiniSidenav(dispatch, true);

  // Funciones para el diálogo
  const handleOpenDialog = () => setOpenLogoutDialog(true);
  const handleCloseDialog = () => setOpenLogoutDialog(false);

  const handleLogout = () => {
    localStorage.removeItem("user_active");
    setAuthUser(dispatch, null);
    handleCloseDialog();
    navigate("/authentication/sign-in");
  };

  useEffect(() => {
    function handleMiniSidenav() {
      setMiniSidenav(dispatch, window.innerWidth < 1200);
      setTransparentSidenav(dispatch, window.innerWidth < 1200 ? false : transparentSidenav);
      setWhiteSidenav(dispatch, window.innerWidth < 1200 ? false : whiteSidenav);
    }
    window.addEventListener("resize", handleMiniSidenav);
    handleMiniSidenav();
    return () => window.removeEventListener("resize", handleMiniSidenav);
  }, [dispatch, location]);

  const filteredRoutes = routes.filter((route) => route.key !== "sign-in");

  const renderRoutes = filteredRoutes.map(
    ({ type, name, icon, title, noCollapse, key, href, route }) => {
      let returnValue;
      if (type === "collapse") {
        returnValue = href ? (
          <Link
            href={href}
            key={key}
            target="_blank"
            rel="noreferrer"
            sx={{ textDecoration: "none" }}
          >
            <SidenavCollapse
              name={name}
              icon={icon}
              active={key === collapseName}
              noCollapse={noCollapse}
            />
          </Link>
        ) : (
          <NavLink key={key} to={route}>
            <SidenavCollapse name={name} icon={icon} active={key === collapseName} />
          </NavLink>
        );
      } else if (type === "title") {
        returnValue = (
          <MDTypography
            key={key}
            color={textColor}
            display="block"
            variant="caption"
            fontWeight="bold"
            textTransform="uppercase"
            pl={3}
            mt={2}
            mb={1}
            ml={1}
          >
            {title}
          </MDTypography>
        );
      } else if (type === "divider") {
        returnValue = (
          <Divider
            key={key}
            light={
              (!darkMode && !whiteSidenav && !transparentSidenav) ||
              (darkMode && !transparentSidenav && whiteSidenav)
            }
          />
        );
      }
      return returnValue;
    }
  );

  return (
    <SidenavRoot
      {...rest}
      variant="permanent"
      ownerState={{ transparentSidenav, whiteSidenav, miniSidenav, darkMode }}
    >
      <MDBox pt={3} pb={1} px={4} textAlign="center">
        <MDBox
          display={{ xs: "block", xl: "none" }}
          position="absolute"
          top={0}
          right={0}
          p={1.625}
          onClick={closeSidenav}
          sx={{ cursor: "pointer" }}
        >
          <MDTypography variant="h6" color="secondary">
            <Icon sx={{ fontWeight: "bold" }}>close</Icon>
          </MDTypography>
        </MDBox>

        <MDBox component={NavLink} to="/" display="flex" alignItems="center">
          {brand && <MDBox component="img" src={brand} alt="Brand" width="2rem" />}
          <MDBox
            width={!brandName && "100%"}
            sx={(theme) => sidenavLogoLabel(theme, { miniSidenav })}
          >
            <MDTypography component="h6" variant="button" fontWeight="medium" color={textColor}>
              {user ? user.nombre : brandName}
            </MDTypography>
            {user && !miniSidenav && (
              <MDTypography
                display="block"
                variant="caption"
                color={textColor}
                fontWeight="regular"
                opacity={0.7}
              >
                {user.rol.toUpperCase()}
              </MDTypography>
            )}
          </MDBox>
        </MDBox>
      </MDBox>

      <Divider
        light={
          (!darkMode && !whiteSidenav && !transparentSidenav) ||
          (darkMode && !transparentSidenav && whiteSidenav)
        }
      />

      <List>{renderRoutes}</List>

      {/* --- SECCIÓN INFERIOR: LOGOUT + BOTÓN EXTERNO --- */}
      <MDBox p={2} mt="auto">
        <MDBox mb={1}>
          <MDButton
            variant="text"
            color={textColor === "white" ? "white" : "dark"}
            fullWidth
            onClick={handleOpenDialog} // Abrir el diálogo en lugar de cerrar directo
            sx={{
              justifyContent: miniSidenav ? "center" : "flex-start",
              px: miniSidenav ? 0 : 2,
            }}
          >
            <Icon fontSize="small">logout</Icon>
            {!miniSidenav && (
              <MDTypography variant="button" fontWeight="medium" color={textColor} sx={{ ml: 1.5 }}>
                Cerrar Sesión
              </MDTypography>
            )}
          </MDButton>
        </MDBox>

        <MDButton
          component="a"
          href="https://mikrowisp.oneredrd.com/cliente/login"
          target="_blank"
          rel="noreferrer"
          variant="gradient"
          color={sidenavColor}
          fullWidth
        >
          {miniSidenav ? <Icon>person</Icon> : "ONERED CLIENTE"}
        </MDButton>
      </MDBox>

      {/* --- DIÁLOGO DE CONFIRMACIÓN DE CIERRE DE SESIÓN --- */}
      <Dialog
        open={openLogoutDialog}
        onClose={handleCloseDialog}
        aria-labelledby="logout-dialog-title"
        aria-describedby="logout-dialog-description"
      >
        <DialogTitle id="logout-dialog-title" sx={{ textAlign: "center" }}>
          <Icon color="warning" sx={{ fontSize: "48px !important", mb: 2 }}>
            warning
          </Icon>
          <br />
          ¿Confirmar salida?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="logout-dialog-description" textAlign="center">
            Estás a punto de cerrar tu sesión en <strong>DocONERED</strong>.
            <br />
            ¿Estás seguro de que deseas salir?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
          <MDButton onClick={handleCloseDialog} color="secondary">
            Cancelar
          </MDButton>
          <MDButton onClick={handleLogout} color="info" variant="gradient">
            Sí, cerrar sesión
          </MDButton>
        </DialogActions>
      </Dialog>
    </SidenavRoot>
  );
}

Sidenav.defaultProps = { color: "info", brand: "" };
Sidenav.propTypes = {
  color: PropTypes.oneOf(["primary", "secondary", "info", "success", "warning", "error", "dark"]),
  brand: PropTypes.string,
  brandName: PropTypes.string.isRequired,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Sidenav;
