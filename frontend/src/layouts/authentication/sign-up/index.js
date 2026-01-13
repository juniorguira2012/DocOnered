import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// @mui components
import Card from "@mui/material/Card";
//import Checkbox from "@mui/material/Checkbox";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Layout
import CoverLayout from "layouts/authentication/components/CoverLayout";

// Imagen de fondo
const bgImage = "https://images.unsplash.com/photo-1497294815431-98652445ef9e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80";

function Cover() {
  const navigate = useNavigate();

  // --- ESTADOS PARA LOS INPUTS ---
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:4000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: nombre,
          email: email,
          password: password, // El backend lo recibe como 'password' y lo guarda en 'pass'
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert("¡Cuenta creada con éxito! Ahora puedes iniciar sesión.");
        navigate("/authentication/sign-in");
      } else {
        alert(data.message || "Error al registrar usuario");
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      alert("No se pudo conectar con el servidor.");
    }
  };

  return (
    <CoverLayout image={bgImage}>
      <Card>
        <MDBox variant="gradient" bgColor="info" borderRadius="lg" coloredShadow="success" mx={2} mt={-3} p={3} mb={1} textAlign="center">
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Únete a OneRed
          </MDTypography>
          <MDTypography display="block" variant="button" color="white" my={1}>
            Introduce tu nombre, email y contraseña para registrarte
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleSignUp}>
            <MDBox mb={2}>
              <MDInput 
                type="text" 
                label="Nombre Completo" 
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
            <MDBox mt={4} mb={1}>
              <MDButton variant="gradient" color="info" fullWidth type="submit">
                Registrarme
              </MDButton>
            </MDBox>
            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                ¿Ya tienes una cuenta?{" "}
                <MDTypography component={Link} to="/authentication/sign-in" variant="button" color="info" fontWeight="medium" textGradient>
                  Inicia sesión
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </CoverLayout>
  );
}

export default Cover;