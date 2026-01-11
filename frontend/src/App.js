import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

// Material Dashboard 2 React example components
import Sidenav from "examples/Sidenav";
import Configurator from "examples/Configurator"; // Lo mantenemos para que el drawer pueda abrirse

// Material Dashboard 2 React themes
import theme from "assets/theme";
import themeDark from "assets/theme-dark";

// Material Dashboard 2 React routes
import routes from "routes";

// Material Dashboard 2 React contexts
import { useMaterialUIController, setMiniSidenav, setAuthUser } from "context";

// Estilos de Editor
import "react-quill/dist/quill.snow.css";

// Images
import brandWhite from "assets/images/logos/logo-onered.png";
import brandDark from "assets/images/logos/logo-onered.png";

export default function App() {
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, layout, sidenavColor, transparentSidenav, whiteSidenav, darkMode, user } =
    controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const { pathname } = useLocation();

  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem("user_active");
    if (savedUser && !user) {
      setAuthUser(dispatch, JSON.parse(savedUser));
    }
  }, []);

  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }
      if (route.route) {
        return <Route exact path={route.route} element={route.component} key={route.key} />;
      }
      return null;
    });

  // 1. Aquí filtramos las rutas según el rol
  const filteredRoutes = routes.filter((route) => {
    // Si la ruta es 'users' y el usuario NO es admin, queda fuera
    if (route.key === "users" && user?.rol !== "admin") {
      return false;
    }
    return true;
  });

  return (
    <ThemeProvider theme={darkMode ? themeDark : theme}>
      <CssBaseline />
      {layout === "dashboard" && (
        <>
          <Sidenav
            color={sidenavColor}
            brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
            brandName="DocONERED"
            // 2. USAMOS filteredRoutes para el menú lateral
            routes={filteredRoutes}
            onMouseEnter={handleOnMouseEnter}
            onMouseLeave={handleOnMouseLeave}
          />
          <Configurator />
        </>
      )}
      <Routes>
        {/* 3. TAMBIÉN filtramos las rutas reales para que no puedan entrar por URL */}
        {getRoutes(filteredRoutes)}

        {/* 4. Protección: Si no hay usuario y trata de ir al dashboard, mandarlo al login */}
        {!user && pathname !== "/authentication/sign-up" && (
          <Route path="*" element={<Navigate to="/authentication/sign-in" />} />
        )}

        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </ThemeProvider>
  );
}
