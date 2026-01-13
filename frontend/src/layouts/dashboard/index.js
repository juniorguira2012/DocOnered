import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Card, CircularProgress } from "@mui/material";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDProgress from "components/MDProgress";
import MDBadge from "components/MDBadge";

// Componentes de Layout
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import DataTable from "examples/Tables/DataTable";

function Dashboard() {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName") || "Usuario";
  const [loading, setLoading] = useState(true);

  // Estados de datos
  const [stats, setStats] = useState({
    totalDocs: 0,
    totalProjects: 0,
    totalTasks: 0,
    storageSize: "Calculando...",
  });

  const [projectsTable, setProjectsTable] = useState({ columns: [], rows: [] });
  const [docsTable, setDocsTable] = useState({ columns: [], rows: [] });

  // Función de progreso (la misma que ya tenías)
  const calculateProgress = (project) => {
    if (!project.tareas || project.tareas.length === 0) return 0;
    const pesos = [15, 30, 55, 75, 100];
    const sumaPorcentajes = project.tareas.reduce((acc, tarea) => {
      const colIndex = (project.columnas || []).findIndex((col) => col.id === tarea.status);
      return acc + (colIndex !== -1 ? pesos[colIndex] : 0);
    }, 0);
    return Math.round(sumaPorcentajes / project.tareas.length);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // 1. Llamadas a tu API de Node.js
        const [resDocs, resProj] = await Promise.all([
          fetch("http://localhost:4000/api/docs"), // Ajusta estas rutas a tu backend
          fetch("http://localhost:4000/api/projects")
        ]);

        const docs = await resDocs.json();
        const projects = await resProj.json();

        // 2. Calcular Estadísticas
        const tasksCount = projects.reduce((acc, proj) => acc + (proj.tareas?.length || 0), 0);
        
        setStats({
          totalDocs: docs.length,
          totalProjects: projects.length,
          totalTasks: tasksCount,
          storageSize: "Sincronizado",
        });

        // 3. Armar Tabla de Proyectos
        setProjectsTable({
          columns: [
            { Header: "Proyecto", accessor: "nombre", width: "45%" },
            { Header: "Tareas", accessor: "tasks", align: "center" },
            { Header: "Progreso", accessor: "progreso", align: "center" },
          ],
          rows: projects.slice(0, 5).map((p) => ({
            nombre: (
              <MDTypography variant="button" fontWeight="medium" sx={{ cursor: "pointer" }} onClick={() => navigate("/projects")}>
                {p.nombre}
              </MDTypography>
            ),
            tasks: <MDTypography variant="caption">{p.tareas?.length || 0}</MDTypography>,
            progreso: (
              <MDBox width="8rem">
                <MDProgress value={calculateProgress(p)} color="info" variant="gradient" label />
              </MDBox>
            ),
          })),
        });

        // 4. Armar Tabla de Documentación
        setDocsTable({
          columns: [
            { Header: "Manual", accessor: "titulo", width: "50%" },
            { Header: "Tecnología", accessor: "tech", align: "center" },
          ],
          rows: docs.slice(0, 5).map((d) => ({
            titulo: (
              <MDTypography variant="button" fontWeight="medium" sx={{ cursor: "pointer" }} onClick={() => navigate("/docs")}>
                {d.titulo}
              </MDTypography>
            ),
            tech: <MDBadge badgeContent={d.tecnologia || "Dev"} color="dark" variant="gradient" size="xs" />,
          })),
        });

      } catch (error) {
        console.error("Error cargando datos del dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  if (loading) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
          <CircularProgress color="info" />
        </MDBox>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      
      <MDBox mt={4} mb={3} px={1}>
        <MDTypography variant="h4" fontWeight="bold">¡Hola, {userName}! 👋</MDTypography>
        <MDTypography variant="button" color="text">Resumen de OneRed en tiempo real.</MDTypography>
      </MDBox>

      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <ComplexStatisticsCard color="dark" icon="description" title="Documentación" count={stats.totalDocs} />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <ComplexStatisticsCard color="info" icon="assignment" title="Proyectos" count={stats.totalProjects} />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <ComplexStatisticsCard color="success" icon="task_alt" title="Tareas" count={stats.totalTasks} />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <ComplexStatisticsCard color="primary" icon="storage" title="Estado" count={stats.storageSize} />
          </Grid>
        </Grid>

        <Grid container spacing={3} mt={4}>
          <Grid item xs={12} lg={6}>
            <Card>
              <MDBox p={3}><MDTypography variant="h6">Estado de Proyectos</MDTypography></MDBox>
              <DataTable table={projectsTable} showTotalEntries={false} isSorted={false} noEndBorder entriesPerPage={false} />
            </Card>
          </Grid>
          <Grid item xs={12} lg={6}>
            <Card>
              <MDBox p={3}><MDTypography variant="h6">Últimas Documentaciones</MDTypography></MDBox>
              <DataTable table={docsTable} showTotalEntries={false} isSorted={false} noEndBorder entriesPerPage={false} />
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;