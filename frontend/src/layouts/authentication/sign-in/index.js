import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import MDSnackbar from "components/MDSnackbar"; // Importamos las alertas

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";

// --- IMPORTACIÓN DEL LOGO ---
import brandLogo from "assets/images/logos/logo-onered.png";

// --- IMPORTACIONES DEL CONTEXTO ---
import { useMaterialUIController, setAuthUser } from "context";

const bgImage =
  "https://images.unsplash.com/photo-1497294815431-98652445ef9e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80";

function Basic() {
  const [rememberMe, setRememberMe] = useState(false);
  const [controller, dispatch] = useMaterialUIController();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // --- ESTADO PARA LA ALERTA DE ERROR ---
  const [errorSB, setErrorSB] = useState(false);
  const closeErrorSB = () => setErrorSB(false);

  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  const handleSignIn = (e) => {
    e.preventDefault();

    const adminMaster = {
      email: "admin@oneredrd.info",
      pass: "admin123",
      nombre: "Admin Onered",
      rol: "admin",
    };

    const usuariosRegistrados = JSON.parse(localStorage.getItem("usuarios_registrados")) || [];
    const todosLosUsuarios = [adminMaster, ...usuariosRegistrados];

    const usuarioEncontrado = todosLosUsuarios.find(
      (u) => u.email === email && u.pass === password
    );

    if (usuarioEncontrado) {
      const userToLogin = {
        nombre: usuarioEncontrado.nombre,
        email: usuarioEncontrado.email,
        rol: usuarioEncontrado.rol,
        foto: "",
      };

      localStorage.setItem("user_active", JSON.stringify(userToLogin));
      setAuthUser(dispatch, userToLogin);
      navigate("/dashboard");
    } else {
      // EN LUGAR DE ALERT, ACTIVAMOS EL SNACKBAR
      setErrorSB(true);
    }
  };

  return (
    <BasicLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDBox
            component="img"
            src={brandLogo}
            alt="DocONERED Logo"
            width="50px"
            mt={1}
            mb={0}
            sx={{ filter: "brightness(0) invert(1)" }}
          />

          <MDTypography variant="h4" fontWeight="medium" color="white" mt={0}>
            DocONERED
          </MDTypography>
          <MDTypography display="block" variant="button" color="white" my={1}>
            Sistema de Documentación Técnica
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleSignIn}>
            <MDBox mb={2}>
              <MDInput
                type="email"
                label="Usuario / Email"
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
                fullWidth
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </MDBox>
            <MDBox display="flex" alignItems="center" ml={-1}>
              <Switch checked={rememberMe} onChange={handleSetRememberMe} />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                onClick={handleSetRememberMe}
                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
              >
                &nbsp;&nbsp;Recordarme
              </MDTypography>
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton variant="gradient" color="info" fullWidth type="submit">
                Entrar
              </MDButton>
            </MDBox>
            <MDBox mt={3} textAlign="center">
              <MDTypography variant="button" color="text">
                ¿No tienes cuenta?{" "}
                <MDTypography
                  component={Link}
                  to="/authentication/sign-up"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  Regístrate aquí
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>

      {/* NOTIFICACIÓN DE ERROR EN EL LOGIN */}
      <MDSnackbar
        color="error"
        icon="warning"
        title="Fallo de autenticación"
        content="Usuario no encontrado o contraseña incorrecta."
        dateTime="Ahora"
        open={errorSB}
        onClose={closeErrorSB}
        close={closeErrorSB}
        bgWhite
      />
    </BasicLayout>
  );
}

export default Basic;
