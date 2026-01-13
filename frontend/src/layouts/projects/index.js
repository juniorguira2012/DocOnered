import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  Icon,
  Tooltip,
  Modal,
  Divider,
  Box,
  Avatar,
  AvatarGroup,
  Autocomplete,
  TextField,
} from "@mui/material";

// IMPORTACIONES PARA DIÁLOGOS Y NOTIFICACIONES
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDProgress from "components/MDProgress";
import MDInput from "components/MDInput";
import MDSnackbar from "components/MDSnackbar";

// Material Dashboard 2 React example components
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Footer from "examples/Footer";

// --- IMPORTACIÓN DEL CONTEXTO ---
import { useMaterialUIController } from "context";

// Componente del Tablero
//import Board from "./Board";

import { useNavigate } from "react-router-dom";

function Projects() {
  const navigate = useNavigate();
  const [controller] = useMaterialUIController();
  const { user } = controller;
  const isAdmin = user?.rol === "admin";

//   const [proyectos, setProyectos] = useState([]);
//   useEffect(() => {
//   // Función para traer datos del backend
//   const fetchProjects = async () => {
//     try {
//       const response = await fetch('http://localhost:4000/api/projects');
//       const data = await response.json();
//       setProyectos(data);
//     } catch (error) {
//       console.error("Error cargando proyectos:", error);
//     }
//   };

//   fetchProjects();
// }, []);

  // Estado para todos los usuarios (sincronizado con usuarios_registrados)
  const [allUsers, setAllUsers] = useState([]);

  const [projects, setProjects] = useState(() => {
    const savedProjects = localStorage.getItem("mis_proyectos_dashboard");
    return savedProjects ? JSON.parse(savedProjects) : [];
  });

  // viewProject ya no será necesario para renderizar aquí, pero lo mantenemos para no romper handleUpdate si lo usas
  //const [viewProject, setViewProject] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState(null);
  const [newName, setNewName] = useState("");

  const [openConfirm, setOpenConfirm] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: "", color: "success" });

  // CARGA DE USUARIOS DESDE LA DB CORRECTA
  useEffect(() => {
    const registrados = JSON.parse(localStorage.getItem("usuarios_registrados")) || [];
    const adminMaster = {
      nombre: "Admin Onered",
      email: "admin@oneredrd.info",
      rol: "admin",
      isMaster: true,
    };
    const existeAdmin = registrados.find((u) => u.email === adminMaster.email);
    const listaCompleta = existeAdmin ? registrados : [adminMaster, ...registrados];
    setAllUsers(listaCompleta);
  }, []);

  useEffect(() => {
    localStorage.setItem("mis_proyectos_dashboard", JSON.stringify(projects));
  }, [projects]);

  const registrarActividad = (mensaje, tipo = "info") => {
    const currentActivity = JSON.parse(localStorage.getItem("onered_activity")) || [];
    const nuevaLog = { id: Date.now(), mensaje, tipo, fecha: new Date().toISOString() };
    localStorage.setItem(
      "onered_activity",
      JSON.stringify([nuevaLog, ...currentActivity].slice(0, 50))
    );
  };

  const showNotify = (message, color = "success") => {
    setNotification({ open: true, message, color });
  };

  const calculateProgress = (project) => {
    if (!project || !project.tareas || project.tareas.length === 0 || !project.columnas) return 0;
    const totalColumnas = project.columnas.length;
    const factorProgreso = 100 / (totalColumnas - 1 || 1);
    const sumaTotal = project.tareas.reduce((acc, tarea) => {
      const colIndex = project.columnas.findIndex((col) => col.id === tarea.status);
      return colIndex !== -1 ? acc + colIndex * factorProgreso : acc;
    }, 0);
    return Math.round(sumaTotal / project.tareas.length);
  };

  // const handleUpdateProject = (updatedProject) => {
  //   setProjects((prev) => prev.map((p) => (p.id === updatedProject.id ? updatedProject : p)));
  //   setViewProject(updatedProject);
  //   registrarActividad(`Tarea actualizada en Proyecto: ${updatedProject.nombre}`, "editó");
  // };

  const saveProjectChanges = () => {
    if (!newName.trim()) return;
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectToEdit.id
          ? { ...p, nombre: newName, members: projectToEdit.members || [] }
          : p
      )
    );
    registrarActividad(`Proyecto actualizado: ${newName}`, "editó");
    setEditModalOpen(false);
    showNotify("Proyecto actualizado correctamente");
  };

  const handleConfirmDelete = () => {
    registrarActividad(`Proyecto eliminado: ${projectToEdit.nombre}`, "eliminó");
    setProjects((prev) => prev.filter((p) => p.id !== projectToEdit.id));
    setOpenConfirm(false);
    setEditModalOpen(false);
    showNotify("Proyecto eliminado", "error");
  };

  const visibleProjects = isAdmin
    ? projects
    : projects.filter((p) => p.members?.includes(user?.email));

  // --- CAMBIO CLAVE: NAVEGACIÓN ---
  const handleOpenProject = (id) => {
    navigate(`/projects/${id}`);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <MDBox display="flex" flexDirection="column" minHeight="85vh">
        <MDBox py={3} sx={{ flex: 1 }}>
          <MDBox mb={4} display="flex" justifyContent="space-between" alignItems="center">
            <MDTypography variant="h4">Mis Proyectos</MDTypography>
            {isAdmin && (
              <MDButton
                variant="gradient"
                color="info"
                onClick={() => {
                  const nuevo = {
                    id: Date.now(),
                    nombre: "Nuevo Proyecto",
                    creado: new Date().toLocaleDateString(),
                    tareas: [],
                    members: [user.email],
                    columnas: [
                      { id: "col-1", title: "IDEAS💡" },
                      { id: "col-2", title: "POR HACER🧾" },
                      { id: "col-3", title: "EN PROCESO🔧" },
                      { id: "col-4", title: "QA☑️" },
                      { id: "col-5", title: "LISTO✅" },
                    ],
                  };
                  setProjects([...projects, nuevo]);
                  showNotify("Proyecto creado");
                }}
              >
                + Nuevo Proyecto
              </MDButton>
            )}
          </MDBox>

          <Grid container spacing={3}>
            {visibleProjects.map((proj) => (
              <Grid item xs={12} md={6} lg={4} key={proj.id}>
                <Card sx={{ cursor: "pointer", position: "relative" }}>
                  <MDBox position="absolute" top={15} right={15} zIndex={2} display="flex" gap={1}>
                    {isAdmin && (
                      <Tooltip title="Configuración">
                        <Icon
                          sx={{ color: "text.secondary", "&:hover": { color: "info.main" } }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setProjectToEdit(proj);
                            setNewName(proj.nombre);
                            setEditModalOpen(true);
                          }}
                        >
                          settings
                        </Icon>
                      </Tooltip>
                    )}
                    <Tooltip title="Ver">
                      <Icon
                        sx={{ color: "#1a73e8" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenProject(proj.id);
                        }}
                      >
                        visibility
                      </Icon>
                    </Tooltip>
                  </MDBox>
                  <MDBox p={3} onClick={() => handleOpenProject(proj.id)}>
                    <MDTypography variant="h5" fontWeight="medium" mb={1}>
                      {proj.nombre}
                    </MDTypography>

                    <MDBox display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                      <AvatarGroup
                        max={4}
                        sx={{ "& .MuiAvatar-root": { width: 24, height: 24, fontSize: 12 } }}
                      >
                        {allUsers
                          .filter((u) => proj.members?.includes(u.email))
                          .map((u) => (
                            <Tooltip key={u.email} title={u.nombre}>
                              <Avatar src={u.avatar} alt={u.nombre} />
                            </Tooltip>
                          ))}
                      </AvatarGroup>
                      <MDTypography variant="caption">Creado: {proj.creado}</MDTypography>
                    </MDBox>

                    <MDBox mt={2}>
                      <MDProgress
                        variant="gradient"
                        color={calculateProgress(proj) === 100 ? "success" : "info"}
                        value={calculateProgress(proj)}
                      />
                      <MDTypography variant="button" color="text">
                        {calculateProgress(proj)}% completado
                      </MDTypography>
                    </MDBox>
                  </MDBox>
                </Card>
              </Grid>
            ))}
          </Grid>
        </MDBox>
        <Footer />
      </MDBox>

      {/* MODAL DE CONFIGURACIÓN Y DIÁLOGOS (Sin cambios) */}
      <Modal open={editModalOpen} onClose={() => setEditModalOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", md: 500 },
            bgcolor: "background.paper",
            borderRadius: 2,
            p: 4,
            boxShadow: 24,
            outline: "none",
          }}
        >
          <MDTypography variant="h6" mb={2}>
            Configuración del Proyecto
          </MDTypography>

          <MDBox mb={3}>
            <MDTypography
              variant="caption"
              fontWeight="bold"
              color="text"
              textTransform="uppercase"
            >
              Nombre del Proyecto
            </MDTypography>
            <MDInput
              fullWidth
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              sx={{ mt: 1 }}
            />
          </MDBox>

          <MDBox mb={3}>
            <MDTypography
              variant="caption"
              fontWeight="bold"
              color="text"
              textTransform="uppercase"
            >
              Miembros del Equipo
            </MDTypography>
            <Autocomplete
              multiple
              options={allUsers}
              getOptionLabel={(option) => `${option.nombre} (${option.email})`}
              isOptionEqualToValue={(option, value) => option.email === value.email}
              value={allUsers.filter((u) => projectToEdit?.members?.includes(u.email))}
              onChange={(event, newValue) => {
                setProjectToEdit({ ...projectToEdit, members: newValue.map((v) => v.email) });
              }}
              renderInput={(params) => (
                <TextField {...params} variant="standard" placeholder="Añadir colaboradores..." />
              )}
              sx={{ mt: 1 }}
            />
          </MDBox>
          <Divider sx={{ my: 2 }} />
          <MDBox display="flex" justifyContent="space-between">
            {isAdmin && (
              <MDButton color="error" variant="text" onClick={() => setOpenConfirm(true)}>
                Eliminar Proyecto
              </MDButton>
            )}
            <MDBox display="flex" gap={1}>
              <MDButton color="secondary" onClick={() => setEditModalOpen(false)}>
                Cancelar
              </MDButton>
              <MDButton color="info" variant="gradient" onClick={saveProjectChanges}>
                Guardar
              </MDButton>
            </MDBox>
          </MDBox>
        </Box>
      </Modal>

      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>¿Eliminar proyecto?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Esta acción es irreversible y borrará todo el progreso.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <MDButton onClick={() => setOpenConfirm(false)}>Regresar</MDButton>
          <MDButton onClick={handleConfirmDelete} color="error" variant="gradient">
            Confirmar
          </MDButton>
        </DialogActions>
      </Dialog>

      <MDSnackbar
        color={notification.color}
        icon="notifications"
        title="Sistema OneRed"
        content={notification.message}
        open={notification.open}
        onClose={() => setNotification({ ...notification, open: false })}
      />
    </DashboardLayout>
  );
}

export default Projects;
