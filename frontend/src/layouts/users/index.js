import React, { useState, useEffect } from "react";
import { Grid, Card, Modal, Divider, Icon } from "@mui/material";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDBadge from "components/MDBadge";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDSnackbar from "components/MDSnackbar"; 

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

function Users() {
  const [usuarios, setUsuarios] = useState([]);
  const adminMasterEmail = "admin@oneredrd.info";

  // --- ESTADOS PARA NOTIFICACIONES ---
  const [notification, setNotification] = useState({ open: false, message: "", color: "success" });
  const showSuccess = (msg) => setNotification({ open: true, message: msg, color: "success" });
  const showError = (msg) => setNotification({ open: true, message: msg, color: "error" });
  const closeNotify = () => setNotification((prev) => ({ ...prev, open: false }));

  // Estados para Modales
  const [open, setOpen] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false); // NUEVO: Modal de confirmación
  
  const [userToEdit, setUserToEdit] = useState(null);
  const [tempNombre, setTempNombre] = useState("");
  const [tempPass, setTempPass] = useState("");
  const [tempRol, setTempRol] = useState("");

  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevoEmail, setNuevoEmail] = useState("");
  const [nuevoPass, setNuevoPass] = useState("");
  const [nuevoRol, setNuevoRol] = useState("lector");

  useEffect(() => { cargarUsuarios(); }, []);

  const cargarUsuarios = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/users");
      const data = await response.json();
      setUsuarios(data.map((u) => ({ ...u, isMaster: u.email === adminMasterEmail })));
    } catch (error) {
      showError("Error de conexión con la base de datos");
    }
  };

  const handleCreate = async () => {
    if (!nuevoNombre || !nuevoEmail || !nuevoPass) {
      showError("Por favor rellena todos los campos");
      return;
    }
    try {
      const response = await fetch("http://localhost:4000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: nuevoNombre, email: nuevoEmail, password: nuevoPass }),
      });
      const data = await response.json();
      if (data.success) {
        await fetch(`http://localhost:4000/api/users/${nuevoEmail}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombre: nuevoNombre, pass: nuevoPass, rol: nuevoRol }),
        });
        showSuccess("¡Usuario creado exitosamente!");
        setOpenCreate(false);
        setNuevoNombre(""); setNuevoEmail(""); setNuevoPass(""); setNuevoRol("lector");
        cargarUsuarios();
      } else { showError(data.message || "Error al crear"); }
    } catch (error) { showError("Error de red"); }
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/users/${userToEdit.email}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: tempNombre, pass: tempPass, rol: tempRol }),
      });
      if (response.ok) {
        showSuccess("Cambios guardados con éxito");
        cargarUsuarios();
        setOpen(false);
      }
    } catch (error) { showError("Error al guardar"); }
  };

  // Función final de eliminación (llamada desde el modal elegante)
  const executeDelete = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/users/${userToEdit.email}`, {
        method: "DELETE",
      });
      if (response.ok) {
        showSuccess("Usuario eliminado correctamente");
        cargarUsuarios();
        setOpenConfirm(false);
        setOpen(false);
      }
    } catch (error) { showError("Error al eliminar"); }
  };

  const columns = [
    { Header: "Usuario", accessor: "usuario", width: "45%", align: "left" },
    { Header: "Rol", accessor: "rol", align: "center" },
    { Header: "Acción", accessor: "action", align: "center" },
  ];

  const rows = usuarios.map((user) => ({
    usuario: (
      <MDBox display="flex" flexDirection="column">
        <MDTypography variant="button" fontWeight="medium">{user.nombre}</MDTypography>
        <MDTypography variant="caption" color="secondary">{user.email}</MDTypography>
      </MDBox>
    ),
    rol: (
      <MDBadge badgeContent={user.rol.toUpperCase()} color={user.rol === "admin" ? "info" : "dark"} variant="gradient" size="sm" />
    ),
    action: (
      <MDButton color="info" variant="text" disabled={user.isMaster} onClick={() => {
        setUserToEdit(user); setTempNombre(user.nombre); setTempPass(user.pass || ""); setTempRol(user.rol); setOpen(true);
      }}>
        <Icon sx={{ mr: 1 }}>edit</Icon> {user.isMaster ? "Maestro" : "Gestionar"}
      </MDButton>
    ),
  }));

  const modalStyle = {
    position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
    width: 400, bgcolor: "background.paper", borderRadius: 3, p: 4, boxShadow: 24, outline: "none",
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox mx={2} mt={-3} py={3} px={2} variant="gradient" bgColor="info" borderRadius="lg" coloredShadow="info" display="flex" justifyContent="space-between" alignItems="center">
                <MDTypography variant="h6" color="white">Gestión de Usuarios</MDTypography>
                <MDButton color="white" onClick={() => setOpenCreate(true)}><Icon>add</Icon>&nbsp;Nuevo Usuario</MDButton>
              </MDBox>
              <MDBox pt={3}>
                <DataTable table={{ columns, rows }} isSorted={false} entriesPerPage={false} showTotalEntries={false} noEndBorder />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>

      {/* MODAL CREACIÓN */}
      <Modal open={openCreate} onClose={() => setOpenCreate(false)}>
        <MDBox sx={modalStyle}>
          <MDTypography variant="h6">Nuevo Usuario</MDTypography>
          <Divider sx={{ my: 2 }} />
          <MDBox mb={2}><MDInput label="Nombre" fullWidth value={nuevoNombre} onChange={(e) => setNuevoNombre(e.target.value)} /></MDBox>
          <MDBox mb={2}><MDInput label="Email" fullWidth value={nuevoEmail} onChange={(e) => setNuevoEmail(e.target.value)} /></MDBox>
          <MDBox mb={2}><MDInput label="Pass" type="text" fullWidth value={nuevoPass} onChange={(e) => setNuevoPass(e.target.value)} /></MDBox>
          <MDBox mb={3}>
            <select style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #d2d6da" }} value={nuevoRol} onChange={(e) => setNuevoRol(e.target.value)}>
              <option value="lector">Lector</option>
              <option value="admin">Administrador</option>
            </select>
          </MDBox>
          <MDBox display="flex" justifyContent="flex-end" gap={1}>
            <MDButton color="secondary" onClick={() => setOpenCreate(false)}>Cancelar</MDButton>
            <MDButton color="info" onClick={handleCreate}>Crear</MDButton>
          </MDBox>
        </MDBox>
      </Modal>

      {/* MODAL EDICIÓN */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <MDBox sx={modalStyle}>
          <MDTypography variant="h6">Editar Usuario</MDTypography>
          <Divider sx={{ my: 2 }} />
          <MDBox mb={2}><MDInput label="Nombre" fullWidth value={tempNombre} onChange={(e) => setTempNombre(e.target.value)} /></MDBox>
          <MDBox mb={2}><MDInput label="Contraseña" fullWidth value={tempPass} onChange={(e) => setTempPass(e.target.value)} /></MDBox>
          <MDBox mb={3}>
            <select style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #d2d6da" }} value={tempRol} onChange={(e) => setTempRol(e.target.value)}>
              <option value="lector">Lector</option>
              <option value="admin">Administrador</option>
            </select>
          </MDBox>
          <MDBox display="flex" justifyContent="space-between">
            <MDButton color="error" variant="text" onClick={() => setOpenConfirm(true)}>Eliminar</MDButton>
            <MDButton color="info" onClick={handleSave}>Guardar</MDButton>
          </MDBox>
        </MDBox>
      </Modal>

      {/* MODAL DE CONFIRMACIÓN ELEGANTE (Sustituye al window.confirm) */}
      <Modal open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <MDBox sx={modalStyle}>
          <MDBox textAlign="center">
            <Icon sx={{ fontSize: "64px !important", color: "error.main", mb: 2 }}>warning</Icon>
            <MDTypography variant="h6">¿Estás seguro?</MDTypography>
            <MDTypography variant="button" color="text">
              Estás a punto de eliminar a <b>{userToEdit?.nombre}</b>. Esta acción borrará al usuario permanentemente de PostgreSQL.
            </MDTypography>
          </MDBox>
          <MDBox display="flex" justifyContent="center" gap={2} mt={4}>
            <MDButton color="secondary" variant="gradient" onClick={() => setOpenConfirm(false)}>No, cancelar</MDButton>
            <MDButton color="error" variant="gradient" onClick={executeDelete}>Sí, eliminar</MDButton>
          </MDBox>
        </MDBox>
      </Modal>

      <MDSnackbar
        color={notification.color}
        icon={notification.color === "success" ? "check" : "warning"}
        title="Sistema OneRed"
        content={notification.message}
        dateTime="ahora"
        open={notification.open}
        onClose={closeNotify}
        close={closeNotify}
        bgWhite
      />
      <Footer />
    </DashboardLayout>
  );
}

export default Users;