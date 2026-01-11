import React, { useState, useEffect } from "react";
import { Grid, Card, Modal, Divider, Icon } from "@mui/material";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDBadge from "components/MDBadge";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

// ... (mismas importaciones)

function Users() {
  const [usuarios, setUsuarios] = useState([]);
  const adminMasterEmail = "admin@oneredrd.info";

  // Estados para el Modal de Edición
  const [open, setOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [tempNombre, setTempNombre] = useState("");
  const [tempPass, setTempPass] = useState("");
  const [tempRol, setTempRol] = useState("");

  // --- CORRECCIÓN AQUÍ ---
  useEffect(() => {
    cargarUsuarios(); // Ahora sí carga los datos al iniciar
  }, []);

  const cargarUsuarios = () => {
    const registrados = JSON.parse(localStorage.getItem("usuarios_registrados")) || [];
    const adminMaster = {
      nombre: "Admin Onered",
      email: adminMasterEmail,
      rol: "admin",
      isMaster: true,
      avatar: "", // Añadido para consistencia con el Board
    };
    setUsuarios([adminMaster, ...registrados]);
  };

  // ... (handleOpenEdit, handleSave, handleDelete se mantienen igual)

  const handleOpenEdit = (user) => {
    setUserToEdit(user);
    setTempNombre(user.nombre);
    setTempPass(user.pass || "");
    setTempRol(user.rol);
    setOpen(true);
  };

  const handleSave = () => {
    if (userToEdit.isMaster) return;
    const registrados = JSON.parse(localStorage.getItem("usuarios_registrados")) || [];
    const nuevosRegistrados = registrados.map((u) => {
      if (u.email === userToEdit.email) {
        return { ...u, nombre: tempNombre, pass: tempPass, rol: tempRol };
      }
      return u;
    });
    localStorage.setItem("usuarios_registrados", JSON.stringify(nuevosRegistrados));
    cargarUsuarios();
    setOpen(false);
    // Cambiado alert por algo más limpio si lo deseas, pero mantengo tu lógica
    alert("Usuario actualizado correctamente.");
  };

  const handleDelete = () => {
    const confirmar = window.confirm(
      `¿Estás seguro de que deseas eliminar a ${userToEdit.nombre}? Esta acción no se puede deshacer.`
    );

    if (confirmar) {
      const registrados = JSON.parse(localStorage.getItem("usuarios_registrados")) || [];
      const nuevosRegistrados = registrados.filter((u) => u.email !== userToEdit.email);

      localStorage.setItem("usuarios_registrados", JSON.stringify(nuevosRegistrados));
      cargarUsuarios();
      setOpen(false);
      alert("Usuario eliminado del sistema.");
    }
  };

  // --- TABLA Y RENDERIZADO (Sin cambios para no romper nada) ---
  const columns = [
    { Header: "Usuario", accessor: "usuario", width: "45%", align: "left" },
    { Header: "Rol", accessor: "rol", align: "center" },
    { Header: "Estado", accessor: "status", align: "center" },
    { Header: "Acción", accessor: "action", align: "center" },
  ];

  const rows = usuarios.map((user) => ({
    usuario: (
      <MDBox display="flex" flexDirection="column">
        <MDTypography variant="button" fontWeight="medium">
          {user.nombre}
        </MDTypography>
        <MDTypography variant="caption" color="secondary">
          {user.email}
        </MDTypography>
      </MDBox>
    ),
    rol: (
      <MDBadge
        badgeContent={user.rol.toUpperCase()}
        color={user.rol === "admin" ? "info" : "dark"}
        variant="gradient"
        size="sm"
      />
    ),
    status: (
      <MDBox ml={-1}>
        <MDBadge badgeContent="activo" color="success" variant="gradient" size="sm" />
      </MDBox>
    ),
    action: (
      <MDButton
        color="info"
        variant="text"
        disabled={user.isMaster}
        onClick={() => handleOpenEdit(user)}
      >
        <Icon sx={{ mr: 1 }}>edit</Icon> {user.isMaster ? "Protegido" : "Gestionar"}
      </MDButton>
    ),
  }));

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Gestión de Alcance y Usuarios
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns, rows }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>

      {/* MODAL DE EDICIÓN (Se mantiene igual) */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <MDBox
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: 2,
            p: 4,
            boxShadow: 24,
            outline: "none",
          }}
        >
          <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <MDTypography variant="h6">Gestionar Usuario</MDTypography>
            <Icon sx={{ cursor: "pointer" }} onClick={() => setOpen(false)}>
              close
            </Icon>
          </MDBox>

          <MDTypography variant="caption" color="text">
            ID Acceso: {userToEdit?.email}
          </MDTypography>
          <Divider sx={{ my: 2 }} />

          <MDBox mb={2}>
            <MDInput
              label="Nombre completo"
              fullWidth
              value={tempNombre}
              onChange={(e) => setTempNombre(e.target.value)}
            />
          </MDBox>

          <MDBox mb={2}>
            <MDInput
              type="text"
              label="Contraseña (Ver/Editar)"
              fullWidth
              value={tempPass}
              onChange={(e) => setTempPass(e.target.value)}
            />
          </MDBox>

          <MDBox mb={3}>
            <MDTypography variant="caption" fontWeight="bold">
              Asignar Rol:
            </MDTypography>
            <select
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                marginTop: "5px",
                fontSize: "14px",
              }}
              value={tempRol}
              onChange={(e) => setTempRol(e.target.value)}
            >
              <option value="lector">Lector (Solo visualización)</option>
              <option value="admin">Administrador (Acceso total)</option>
            </select>
          </MDBox>

          <MDBox display="flex" justifyContent="space-between" alignItems="center">
            <MDButton
              color="error"
              variant="text"
              onClick={handleDelete}
              disabled={userToEdit?.isMaster}
            >
              <Icon>delete</Icon>&nbsp;Eliminar
            </MDButton>

            <MDBox display="flex" gap={1}>
              <MDButton color="info" onClick={handleSave}>
                Guardar
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Modal>

      <Footer />
    </DashboardLayout>
  );
}

export default Users;
