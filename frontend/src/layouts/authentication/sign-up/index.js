import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import MDSnackbar from "components/MDSnackbar"; // Importamos las alertas

// Authentication layout components
import CoverLayout from "layouts/authentication/components/CoverLayout";

// --- IMPORTACIÓN DEL LOGO ---
import brandLogo from "assets/images/logos/logo-onered.png";

function Cover() {
  const navigate = useNavigate();

  // --- ESTADOS PARA DATOS ---
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // --- ESTADOS PARA ALERTAS ---
  const [successSB, setSuccessSB] = useState(false);
  const closeSuccessSB = () => setSuccessSB(false);

  const handleSignUp = (event) => {
    event.preventDefault();

    const usuariosExistentes = JSON.parse(localStorage.getItem("usuarios_registrados")) || [];

    const nuevoUsuario = {
      nombre: nombre,
      email: email,
      pass: password,
      rol: "lector",
    };

    usuariosExistentes.push(nuevoUsuario);
    localStorage.setItem("usuarios_registrados", JSON.stringify(usuariosExistentes));

    // MOSTRAR ALERTA DE ÉXITO
    setSuccessSB(true);

    // ESPERAR UN MOMENTO PARA QUE VEAN EL MENSAJE Y LUEGO NAVEGAR
    setTimeout(() => {
      navigate("/authentication/sign-in");
    }, 2000);
  };

  return (
    <CoverLayout>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="success"
          mx={2}
          mt={-3}
          p={3}
          mb={1}
          textAlign="center"
        >
          <MDBox
            component="img"
            src={brandLogo}
            alt="DocONERED Logo"
            width="50px"
            mb={1}
            sx={{ filter: "brightness(0) invert(1)" }}
          />
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Registros DocONERED
          </MDTypography>
          <MDTypography display="block" variant="button" color="white" my={1}>
            Ingresa tus datos para registrarte
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleSignUp}>
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="Nombre"
                variant="standard"
                fullWidth
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="email"
                label="Email"
                variant="standard"
                fullWidth
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="password"
                label="Contraseña"
                variant="standard"
                fullWidth
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </MDBox>
            <MDBox display="flex" alignItems="center" ml={-1}>
              <Checkbox required />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
              >
                &nbsp;&nbsp;Acepto los&nbsp;
              </MDTypography>
              <MDTypography
                component="a"
                href="#"
                variant="button"
                fontWeight="bold"
                color="info"
                textGradient
              >
                Términos
              </MDTypography>
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton variant="gradient" color="info" fullWidth type="submit">
                Registrarse
              </MDButton>
            </MDBox>
            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                ¿Ya tienes cuenta?{" "}
                <MDTypography
                  component={Link}
                  to="/authentication/sign-in"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  Inicia Sesión
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>

      {/* COMPONENTE DE NOTIFICACIÓN DE ÉXITO */}
      <MDSnackbar
        color="success"
        icon="check"
        title="DocONERED"
        content="¡Registro exitoso! Ya puedes iniciar sesión."
        dateTime="Ahora"
        open={successSB}
        onClose={closeSuccessSB}
        close={closeSuccessSB}
        bgWhite
      />
    </CoverLayout>
  );
}

export default Cover;
