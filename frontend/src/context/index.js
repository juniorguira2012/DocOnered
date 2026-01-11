import { createContext, useContext, useReducer, useMemo } from "react";
import PropTypes from "prop-types";

const MaterialUI = createContext();
MaterialUI.displayName = "MaterialUIContext";

// --- FUNCIÓN PARA GUARDAR CONFIGURACIÓN ---
const saveSettings = (state) => {
  // Guardamos solo la configuración visual, no necesariamente el usuario aquí
  // para mantener separada la sesión de la personalización.
  const { user, ...settings } = state;
  localStorage.setItem("dashboard_settings", JSON.stringify(settings));
};

function reducer(state, action) {
  let newState;
  switch (action.type) {
    case "MINI_SIDENAV":
      newState = { ...state, miniSidenav: action.value };
      break;
    case "TRANSPARENT_SIDENAV":
      newState = { ...state, transparentSidenav: action.value };
      break;
    case "WHITE_SIDENAV":
      newState = { ...state, whiteSidenav: action.value };
      break;
    case "SIDENAV_COLOR":
      newState = { ...state, sidenavColor: action.value };
      break;
    case "TRANSPARENT_NAVBAR":
      newState = { ...state, transparentNavbar: action.value };
      break;
    case "FIXED_NAVBAR":
      newState = { ...state, fixedNavbar: action.value };
      break;
    case "OPEN_CONFIGURATOR":
      newState = { ...state, openConfigurator: action.value };
      break;
    case "DIRECTION":
      newState = { ...state, direction: action.value };
      break;
    case "LAYOUT":
      newState = { ...state, layout: action.value };
      break;
    case "DARKMODE":
      newState = { ...state, darkMode: action.value };
      break;

    // --- NUEVOS CASOS DE USUARIO ---
    case "AUTH_USER":
      newState = { ...state, user: action.value };
      break;
    case "LOGOUT":
      newState = { ...state, user: null };
      break;

    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }

  if (action.type !== "OPEN_CONFIGURATOR") {
    saveSettings(newState);
  }
  return newState;
}

function MaterialUIControllerProvider({ children }) {
  const savedSettings = JSON.parse(localStorage.getItem("dashboard_settings")) || {};

  // --- CARGAR USUARIO DE LA SESIÓN ---
  const savedUser = JSON.parse(localStorage.getItem("user_active")) || null;

  const initialState = {
    miniSidenav: savedSettings.miniSidenav || false,
    transparentSidenav:
      savedSettings.transparentSidenav !== undefined ? savedSettings.transparentSidenav : false,
    whiteSidenav: savedSettings.whiteSidenav || false,
    sidenavColor: savedSettings.sidenavColor || "info",
    transparentNavbar:
      savedSettings.transparentNavbar !== undefined ? savedSettings.transparentNavbar : true,
    fixedNavbar: savedSettings.fixedNavbar !== undefined ? savedSettings.fixedNavbar : true,
    openConfigurator: false,
    direction: savedSettings.direction || "ltr",
    layout: savedSettings.layout || "dashboard",
    darkMode: savedSettings.darkMode || false,

    // --- ESTADO INICIAL DEL USUARIO ---
    user: savedUser,
  };

  const [controller, dispatch] = useReducer(reducer, initialState);
  const value = useMemo(() => [controller, dispatch], [controller, dispatch]);

  return <MaterialUI.Provider value={value}>{children}</MaterialUI.Provider>;
}

function useMaterialUIController() {
  const context = useContext(MaterialUI);
  if (!context) {
    throw new Error(
      "useMaterialUIController should be used inside the MaterialUIControllerProvider."
    );
  }
  return context;
}

MaterialUIControllerProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Context module functions
const setMiniSidenav = (dispatch, value) => dispatch({ type: "MINI_SIDENAV", value });
const setTransparentSidenav = (dispatch, value) => dispatch({ type: "TRANSPARENT_SIDENAV", value });
const setWhiteSidenav = (dispatch, value) => dispatch({ type: "WHITE_SIDENAV", value });
const setSidenavColor = (dispatch, value) => dispatch({ type: "SIDENAV_COLOR", value });
const setTransparentNavbar = (dispatch, value) => dispatch({ type: "TRANSPARENT_NAVBAR", value });
const setFixedNavbar = (dispatch, value) => dispatch({ type: "FIXED_NAVBAR", value });
const setOpenConfigurator = (dispatch, value) => dispatch({ type: "OPEN_CONFIGURATOR", value });
const setDirection = (dispatch, value) => dispatch({ type: "DIRECTION", value });
const setLayout = (dispatch, value) => dispatch({ type: "LAYOUT", value });
const setDarkMode = (dispatch, value) => dispatch({ type: "DARKMODE", value });

// --- NUEVAS FUNCIONES DE USUARIO ---
const setAuthUser = (dispatch, value) => dispatch({ type: "AUTH_USER", value });
const setLogout = (dispatch) => {
  localStorage.removeItem("user_active"); // Limpiar storage al salir
  dispatch({ type: "LOGOUT" });
};

export {
  MaterialUIControllerProvider,
  useMaterialUIController,
  setMiniSidenav,
  setTransparentSidenav,
  setWhiteSidenav,
  setSidenavColor,
  setTransparentNavbar,
  setFixedNavbar,
  setOpenConfigurator,
  setDirection,
  setLayout,
  setDarkMode,
  // Exportar nuevas funciones
  setAuthUser,
  setLogout,
};
