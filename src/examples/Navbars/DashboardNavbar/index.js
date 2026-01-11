// React components
import { useState, useEffect } from "react";
// react-router components
import { useLocation, Link, useNavigate } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import Icon from "@mui/material/Icon";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Badge from "@mui/material/Badge";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

import NotificationItem from "examples/Items/NotificationItem";

// Custom styles for DashboardNavbar
import {
  navbar,
  navbarContainer,
  navbarRow,
  navbarIconButton,
  navbarMobileMenu,
} from "examples/Navbars/DashboardNavbar/styles";

// Material Dashboard 2 React context
import {
  useMaterialUIController,
  setTransparentNavbar,
  setMiniSidenav,
  setOpenConfigurator,
  setAuthUser,
} from "context";

function DashboardNavbar({ absolute, light, isMini }) {
  const [navbarType, setNavbarType] = useState();
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentNavbar, fixedNavbar, openConfigurator, darkMode, user } =
    controller;

  const [openMenu, setOpenMenu] = useState(false);
  const [profileMenu, setProfileMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Calculamos cuántas no han sido leídas para el Badge
  const unreadCount = notifications.filter((n) => !n.read).length;

  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const navigate = useNavigate();

  const route = useLocation().pathname.split("/").slice(1);

  // --- LOGICA NOTIFICACIONES ---
  useEffect(() => {
    const docData = JSON.parse(localStorage.getItem("doc_activity")) || [];
    const userData = JSON.parse(localStorage.getItem("user_activity")) || [];

    const unified = [...docData, ...userData].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA;
    });

    setNotifications(unified);
  }, [openMenu]);

  useEffect(() => {
    if (fixedNavbar) {
      setNavbarType("sticky");
    } else {
      setNavbarType("static");
    }
    function handleTransparentNavbar() {
      setTransparentNavbar(dispatch, (fixedNavbar && window.scrollY === 0) || !fixedNavbar);
    }
    window.addEventListener("scroll", handleTransparentNavbar);
    handleTransparentNavbar();
    return () => window.removeEventListener("scroll", handleTransparentNavbar);
  }, [dispatch, fixedNavbar]);

  // --- FUNCIONES DE CONTROL DE MENÚS (Restauradas) ---
  const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);
  const handleOpenProfileMenu = (event) => setProfileMenu(event.currentTarget);
  const handleCloseProfileMenu = () => setProfileMenu(false);
  const handleOpenMenu = (event) => setOpenMenu(event.currentTarget);
  const handleCloseMenu = () => setOpenMenu(false);

  const handleMarkAsRead = (id, type) => {
    const storageKey = type === "security" || type === "profile" ? "user_activity" : "doc_activity";
    const currentData = JSON.parse(localStorage.getItem(storageKey)) || [];

    const updatedData = currentData.map((notif) =>
      notif.id === id ? { ...notif, read: true } : notif
    );

    localStorage.setItem(storageKey, JSON.stringify(updatedData));
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const handleOpenLogoutDialog = () => {
    setProfileMenu(false);
    setOpenLogoutDialog(true);
  };
  const handleCloseLogoutDialog = () => setOpenLogoutDialog(false);

  const handleLogout = () => {
    localStorage.removeItem("user_active");
    setAuthUser(dispatch, null);
    handleCloseLogoutDialog();
    navigate("/authentication/sign-in");
  };

  const handleConfiguratorClick = () => {
    setOpenConfigurator(dispatch, !openConfigurator);
    handleCloseProfileMenu();
  };

  const handleClearNotifications = () => {
    localStorage.removeItem("doc_activity");
    localStorage.removeItem("user_activity");
    setNotifications([]);
    handleCloseMenu();
  };

  const iconsStyle = ({ palette: { dark, white, text }, functions: { rgba } }) => ({
    color: () => {
      let colorValue = light || darkMode ? white.main : dark.main;
      if (transparentNavbar && !light) {
        colorValue = darkMode ? rgba(text.main, 0.6) : text.main;
      }
      return colorValue;
    },
  });

  const renderProfileMenu = () => (
    <Menu
      anchorEl={profileMenu}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      open={Boolean(profileMenu)}
      onClose={handleCloseProfileMenu}
      sx={{ mt: 1 }}
    >
      <MDBox px={2} py={1}>
        <MDTypography variant="h6">{user?.nombre || "Usuario"}</MDTypography>
        <MDTypography variant="caption" color="text">
          {user?.rol?.toUpperCase()}
        </MDTypography>
      </MDBox>
      <Divider sx={{ my: 0.5 }} />
      <Link to="/profile" style={{ textDecoration: "none" }}>
        <MenuItem onClick={handleCloseProfileMenu} sx={{ py: 1, px: 2 }}>
          <Icon sx={{ mr: 2 }}>person</Icon>
          <MDTypography variant="button" color="text">
            Mi Perfil
          </MDTypography>
        </MenuItem>
      </Link>
      <MenuItem onClick={handleConfiguratorClick} sx={{ py: 1, px: 2 }}>
        <Icon sx={{ mr: 2 }}>settings</Icon>
        <MDTypography variant="button" color="text">
          Configuración
        </MDTypography>
      </MenuItem>
      <Divider sx={{ my: 0.5 }} />
      <MenuItem onClick={handleOpenLogoutDialog} sx={{ py: 1, px: 2 }}>
        <Icon sx={{ mr: 2, color: "error" }}>logout</Icon>
        <MDTypography variant="button" fontWeight="medium" color="error">
          Cerrar Sesión
        </MDTypography>
      </MenuItem>
    </Menu>
  );

  const renderNotificationsMenu = () => (
    <Menu
      anchorEl={openMenu}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      open={Boolean(openMenu)}
      onClose={handleCloseMenu}
      sx={{ mt: 2 }}
    >
      {notifications.length > 0 ? (
        <>
          {notifications.slice(0, 5).map((notif) => {
            const isUserAction = notif.type === "security" || notif.type === "profile";
            let iconName = "description";
            let iconColor = "info";
            if (notif.type === "security") iconName = "lock";
            else if (notif.type === "profile") iconName = "person";
            else if (notif.action === "eliminó") iconName = "delete";

            return (
              <MDBox
                key={notif.id}
                onClick={() => handleMarkAsRead(notif.id, notif.type)}
                sx={{
                  cursor: "pointer",
                  backgroundColor: notif.read ? "transparent" : "rgba(33, 150, 243, 0.05)",
                  "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.05)" },
                }}
              >
                <NotificationItem
                  icon={<Icon color={iconColor}>{iconName}</Icon>}
                  title={notif.docTitle || notif.title}
                  description={
                    isUserAction
                      ? notif.description
                      : `${notif.action} el ${new Date(notif.date).toLocaleDateString()}`
                  }
                />
              </MDBox>
            );
          })}
          <Divider sx={{ my: 1 }} />
          <MenuItem onClick={handleClearNotifications} sx={{ justifyContent: "center" }}>
            <MDTypography variant="button" color="secondary" fontWeight="medium">
              Limpiar Historial
            </MDTypography>
          </MenuItem>
        </>
      ) : (
        <MDBox p={2}>
          <MDTypography variant="button">Sin actividad reciente</MDTypography>
        </MDBox>
      )}
    </Menu>
  );

  return (
    <AppBar
      position={absolute ? "absolute" : navbarType}
      color="inherit"
      sx={(theme) => navbar(theme, { transparentNavbar, absolute, light, darkMode })}
    >
      <Toolbar sx={(theme) => navbarContainer(theme)}>
        <MDBox
          color="inherit"
          mb={{ xs: 1, md: 0 }}
          sx={(theme) => navbarRow(theme, { isMini })}
        ></MDBox>
        {!isMini && (
          <MDBox display="flex" alignItems="center">
            <MDBox color={light ? "white" : "inherit"} display="flex" alignItems="center">
              <IconButton sx={navbarIconButton} size="medium" onClick={handleOpenProfileMenu}>
                <Icon sx={{ ...iconsStyle, fontSize: "60px !important" }}>account_circle</Icon>
              </IconButton>
              {renderProfileMenu()}
              <IconButton size="small" sx={navbarMobileMenu} onClick={handleMiniSidenav}>
                <Icon sx={iconsStyle} fontSize="medium">
                  {miniSidenav ? "menu_open" : "menu"}
                </Icon>
              </IconButton>
              <IconButton size="small" sx={navbarIconButton} onClick={handleOpenMenu}>
                <Badge badgeContent={unreadCount} color="error" overlap="circular">
                  <Icon sx={iconsStyle}>notifications</Icon>
                </Badge>
              </IconButton>
              {renderNotificationsMenu()}
            </MDBox>
          </MDBox>
        )}
      </Toolbar>

      {/* DIÁLOGO LOGOUT */}
      <Dialog
        open={openLogoutDialog}
        onClose={handleCloseLogoutDialog}
        PaperProps={{ sx: { borderRadius: "15px", padding: "10px" } }}
      >
        <DialogTitle sx={{ textAlign: "center", pb: 0 }}>
          <MDBox
            display="flex"
            justifyContent="center"
            alignItems="center"
            bgColor="warning"
            color="white"
            variant="gradient"
            borderRadius="50%"
            width="3.5rem"
            height="3.5rem"
            mx="auto"
            mb={2}
            shadow="md"
          >
            <Icon sx={{ fontSize: "2rem !important" }}>warning</Icon>
          </MDBox>
          <MDTypography variant="h5" fontWeight="medium">
            ¿Confirmar salida?
          </MDTypography>
        </DialogTitle>
        <DialogContent sx={{ textAlign: "center", py: 2 }}>
          <MDTypography variant="body2" color="text">
            ¿Estás seguro de que deseas salir de <strong>DocONERED</strong>?
          </MDTypography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", gap: 2, pb: 2 }}>
          <MDButton onClick={handleCloseLogoutDialog} variant="outlined" color="dark" size="small">
            Cancelar
          </MDButton>
          <MDButton onClick={handleLogout} variant="gradient" color="error" size="small">
            Cerrar Sesión
          </MDButton>
        </DialogActions>
      </Dialog>
    </AppBar>
  );
}

DashboardNavbar.defaultProps = { absolute: false, light: false, isMini: false };
DashboardNavbar.propTypes = {
  absolute: PropTypes.bool,
  light: PropTypes.bool,
  isMini: PropTypes.bool,
};

export default DashboardNavbar;
