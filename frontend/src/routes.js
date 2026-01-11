import Dashboard from "layouts/dashboard";
import DocumentList from "layouts/documentList";
import Notifications from "layouts/notifications";
import DocForm from "layouts/docs/DocForm";
import SignIn from "layouts/authentication/sign-in";
import Icon from "@mui/material/Icon";
import DocViews from "layouts/docs/DocViews";
import Projects from "layouts/projects";
import SignUp from "layouts/authentication/sign-up";
import Users from "layouts/users";
import Profile from "layouts/profile";
import React from "react";
import BoardView from "layouts/projects/BoardView";

const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
  },
  {
    type: "collapse",
    name: "Documentaciones",
    key: "document-list",
    icon: <Icon fontSize="small">📄</Icon>,
    route: "/docs",
    component: <DocumentList />,
  },
  {
    type: "collapse",
    name: "Proyectos",
    key: "projects",
    icon: <Icon fontSize="small">assessment</Icon>, // Use un icono de gráfico/reporte
    route: "/projects",
    component: <Projects />,
  },
  {
    type: "view", // O el tipo que uses para rutas que no van en el menú lateral
    name: "Detalle de Proyecto",
    key: "project-details",
    route: "/projects/:id",
    component: <BoardView />,
  },
  {
    type: "collapse",
    name: "Actividad",
    key: "notifications",
    icon: <Icon fontSize="small">notifications</Icon>,
    route: "/notifications",
    component: <Notifications />,
  },
  {
    type: "collapse",
    name: "Perfil",
    key: "profile",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/profile",
    component: <Profile />,
  },
  {
    type: "divider",
    key: "divider-1",
  },
  // Gestión de Usuarios
  {
    type: "collapse",
    name: "Usuarios",
    key: "users",
    icon: <Icon fontSize="small">people</Icon>, // El icono debe ir entre < >
    route: "/users",
    component: <Users />, // Aquí debe ir el componente invocado
  },
  {
    type: "route", // Usamos "route" para que no aparezca en el menú lateral
    name: "Registrarse",
    key: "sign-up",
    route: "/authentication/sign-up",
    component: <SignUp />,
  },
  // Ruta de Login (la dejamos pero puedes comentarla si no la usas aún)
  {
    type: "collapse",
    name: "Cerrar Sesión",
    key: "sign-in",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/authentication/sign-in",
    component: <SignIn />,
  },
  // Rutas ocultas del sidebar (type: "route")
  {
    type: "route",
    name: "Nueva Doc",
    key: "new-doc",
    route: "/new",
    component: <DocForm />,
  },
  {
    type: "route",
    name: "Editar Doc",
    key: "edit-doc",
    route: "/edit/:id",
    component: <DocForm />,
  },
  {
    name: "Ver Manual",
    key: "doc-view",
    route: "/doc/:id", // El :id permite capturar el ID dinámico del manual
    component: <DocViews />,
  },
];

export default routes;
