import React, { useState } from "react";
import { Grid, Card, Divider, Icon } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import MDSnackbar from "components/MDSnackbar";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { useMaterialUIController, setAuthUser } from "context"; // Importamos setAuthUser

function Profile() {
  const [controller, dispatch] = useMaterialUIController();
  const { user } = controller;

  const [formData, setFormData] = useState({
    nombre: user?.nombre || "",
    avatar: user?.avatar || "",
    password: "",
    confirmPassword: "", // Nuevo campo
  });

  const [notification, setNotification] = useState({
    open: false,
    color: "success",
    title: "",
    content: "",
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tamaño (opcional, ej: max 2MB)
      if (file.size > 2000000) {
        setNotification({
          open: true,
          color: "error",
          title: "Error de imagen",
          content: "La imagen es muy pesada (máx 2MB).",
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = () => {
    // 1. Validar longitud mínima si el usuario intenta cambiar la contraseña
    if (formData.password !== "" && formData.password.length < 8) {
      setNotification({
        open: true,
        color: "error",
        title: "Contraseña débil",
        content: "La nueva contraseña debe tener al menos 8 caracteres.",
      });
      return;
    }

    // 2. Validar que ambas contraseñas coincidan
    if (formData.password !== "" && formData.password !== formData.confirmPassword) {
      setNotification({
        open: true,
        color: "error",
        title: "Error de seguridad",
        content: "Las contraseñas no coinciden.",
      });
      return;
    }

    const users = JSON.parse(localStorage.getItem("users_db")) || [];

    // 3. Actualizar en la "Base de Datos" local
    const updatedUsers = users.map((u) => {
      if (u.email === user.email) {
        return {
          ...u,
          nombre: formData.nombre,
          avatar: formData.avatar,
          password: formData.password !== "" ? formData.password : u.password,
        };
      }
      return u;
    });

    localStorage.setItem("users_db", JSON.stringify(updatedUsers));

    // --- REGISTRO DE ACTIVIDAD PARA NOTIFICACIONES ---
    const userActivity = JSON.parse(localStorage.getItem("user_activity")) || [];
    const isPasswordChange = formData.password !== "";

    const newLog = {
      id: Date.now(),
      date: new Date().toISOString(),
      type: isPasswordChange ? "security" : "profile",
      title: isPasswordChange ? "Cambio de Seguridad" : "Actualización de Perfil",
      description: isPasswordChange
        ? `El usuario ${user.nombre} actualizó su contraseña de acceso.`
        : `El usuario ${user.nombre} actualizó su información de perfil.`,
      action: "editó",
      read: false, // Importante para que el Badge se active
    };

    localStorage.setItem("user_activity", JSON.stringify([newLog, ...userActivity].slice(0, 50)));

    // 4. ACTUALIZAR EL CONTEXTO GLOBAL Y SESIÓN ACTIVA
    const updatedUserSession = {
      ...user,
      nombre: formData.nombre,
      avatar: formData.avatar,
    };

    setAuthUser(dispatch, updatedUserSession);
    localStorage.setItem("user_active", JSON.stringify(updatedUserSession));

    setNotification({
      open: true,
      color: "success",
      title: "Perfil Actualizado",
      content: "Los cambios se han guardado y registrado con éxito.",
    });

    // Limpiar campos de password
    setFormData({ ...formData, password: "", confirmPassword: "" });
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox display="flex" flexDirection="column" minHeight="80vh">
        <MDBox mb={10} />
        <MDBox mt={5} mb={3} display="flex" justifyContent="center" flex={1}>
          <Grid container spacing={1} justifyContent="center">
            <Grid item xs={12} md={8} lg={6}>
              <Card sx={{ position: "relative", mt: -8, mx: 3, py: 2, px: 2, mb: 4 }}>
                <Grid container spacing={3} alignItems="center">
                  <Grid item>
                    <MDBox position="relative">
                      <MDAvatar
                        src={formData.avatar || ""}
                        alt="profile-image"
                        size="xl"
                        shadow="sm"
                        fallback={<Icon fontSize="large">person</Icon>}
                      />
                      <label htmlFor="upload-photo">
                        <input
                          style={{ display: "none" }}
                          id="upload-photo"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                        <MDButton
                          component="span"
                          variant="gradient"
                          color="info"
                          iconOnly
                          circular
                          sx={{ position: "absolute", bottom: 0, right: 0, width: 25, height: 25 }}
                        >
                          <Icon>edit</Icon>
                        </MDButton>
                      </label>
                    </MDBox>
                  </Grid>
                  <Grid item>
                    <MDBox height="100%" mt={0.5} lineHeight={1}>
                      <MDTypography variant="h5" fontWeight="medium">
                        {formData.nombre}
                      </MDTypography>
                      <MDTypography variant="button" color="text" fontWeight="regular">
                        {user?.rol?.toUpperCase()} - {user?.email}
                      </MDTypography>
                    </MDBox>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                <MDBox pb={2} px={2}>
                  <MDTypography variant="h6" fontWeight="bold" mb={2}>
                    Información Personal
                  </MDTypography>
                  <MDInput
                    label="Nombre Completo"
                    fullWidth
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    sx={{ mb: 3 }}
                  />

                  <Divider sx={{ my: 2 }} />
                  <MDTypography variant="h6" fontWeight="bold" mb={2}>
                    Seguridad
                  </MDTypography>

                  <MDInput
                    label="Nueva Contraseña"
                    type="password"
                    fullWidth
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    sx={{ mb: 2 }}
                  />
                  <MDInput
                    label="Confirmar Nueva Contraseña"
                    type="password"
                    fullWidth
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    sx={{ mb: 3 }}
                    error={
                      formData.password !== "" && formData.password !== formData.confirmPassword
                    }
                  />

                  <MDBox
                    display="flex"
                    alignItems="center"
                    bgcolor="#f8f9fa"
                    p={2}
                    borderRadius="lg"
                    mb={3}
                  >
                    <Icon color="secondary" sx={{ mr: 2 }}>
                      lock
                    </Icon>
                    <MDTypography variant="caption" color="text" fontWeight="bold">
                      ROL: {user?.rol?.toUpperCase()} (No editable)
                    </MDTypography>
                  </MDBox>

                  <MDButton variant="gradient" color="info" fullWidth onClick={handleSaveChanges}>
                    Guardar Cambios
                  </MDButton>
                </MDBox>
              </Card>
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>

      <MDSnackbar
        color={notification.color}
        icon={notification.color === "success" ? "check" : "warning"}
        title={notification.title}
        content={notification.content}
        open={notification.open}
        onClose={() => setNotification({ ...notification, open: false })}
      />

      <MDBox mt="auto" py={3}>
        <Footer />
      </MDBox>
    </DashboardLayout>
  );
}

export default Profile;
