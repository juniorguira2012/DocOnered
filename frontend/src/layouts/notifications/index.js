import { useState, useEffect } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import TimelineItem from "examples/Timeline/TimelineItem";

function Notifications() {
  const [activity, setActivity] = useState([]);

  useEffect(() => {
    // 1. Obtenemos actividad de Documentos
    const docData = JSON.parse(localStorage.getItem("doc_activity")) || [];

    // 2. Obtenemos actividad de Proyectos
    const projectData = JSON.parse(localStorage.getItem("onered_activity")) || [];

    // 3. NUEVO: Obtenemos actividad de Usuarios (Perfil/Passwords)
    const userData = JSON.parse(localStorage.getItem("user_activity")) || [];

    // 4. Unificamos y ordenamos por fecha (más reciente primero)
    const unified = [...docData, ...projectData, ...userData].sort((a, b) => {
      const dateA = new Date(a.date || a.fecha).getTime();
      const dateB = new Date(b.date || b.fecha).getTime();
      return dateB - dateA;
    });

    setActivity(unified);
  }, []);

  // Función inteligente para asignar iconos
  const getIcon = (log) => {
    if (log.type === "security") return "lock"; // Icono para passwords
    if (log.type === "profile") return "person_search"; // Icono para cambios de perfil
    if (log.docTitle) return "description";
    if (log.mensaje?.includes("Proyecto")) return "assignment";
    if (log.mensaje?.includes("Tarea")) return "task_alt";
    return "notifications";
  };

  // Función inteligente para asignar colores
  const getColor = (log) => {
    const action = log.action || log.tipo;
    if (log.type === "security") return "warning"; // Color ámbar para seguridad
    if (action === "eliminó" || action === "error") return "error";
    if (action === "creó" || action === "success") return "success";
    if (action === "editó" || action === "warning") return "warning";
    return "info";
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mt={6} mb={3}>
        <Grid container justifyContent="center">
          <Grid item xs={12} lg={8}>
            <Card>
              <MDBox p={3} display="flex" alignItems="center" justifyContent="space-between">
                <MDBox display="flex" alignItems="center">
                  <Icon fontSize="medium" color="info" sx={{ mr: 2 }}>
                    history
                  </Icon>
                  <MDTypography variant="h5">Historial General OneRed</MDTypography>
                </MDBox>
              </MDBox>

              <MDBox p={3}>
                {activity.length > 0 ? (
                  activity.map((log, index) => {
                    // Lógica de títulos según el tipo de log
                    let title = "";
                    let description = "";

                    if (log.type === "security" || log.type === "profile") {
                      title = log.title;
                      description = log.description;
                    } else {
                      title = log.docTitle
                        ? `Documento: "${log.docTitle}" (${log.action})`
                        : log.mensaje;
                      description = log.docId ? `ID Doc: ${log.docId}` : "Actividad en Tablero";
                    }

                    const date = log.date || log.fecha;

                    return (
                      <TimelineItem
                        key={log.id || index}
                        color={getColor(log)}
                        icon={getIcon(log)}
                        title={title}
                        dateTime={new Date(date).toLocaleString()}
                        description={description}
                        lastItem={index === activity.length - 1}
                      />
                    );
                  })
                ) : (
                  <MDBox textAlign="center" py={4}>
                    <MDTypography variant="button" color="text">
                      Aún no hay actividad registrada.
                    </MDTypography>
                  </MDBox>
                )}
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Notifications;
