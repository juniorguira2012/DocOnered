import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Card } from "@mui/material";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDProgress from "components/MDProgress";
import MDBadge from "components/MDBadge";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import DataTable from "examples/Tables/DataTable";

function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalDocs: 0,
    totalProjects: 0,
    totalTasks: 0,
    storageSize: "0 KB",
  });

  const [projChartData, setProjChartData] = useState({
    labels: [],
    datasets: { label: "Tareas", data: [] },
  });
  const [docFreqData, setDocFreqData] = useState({
    labels: [],
    datasets: { label: "Docs", data: [] },
  });
  const [projectsTable, setProjectsTable] = useState({ columns: [], rows: [] });
  const [docsTable, setDocsTable] = useState({ columns: [], rows: [] });

  // NUEVA LÓGICA DE PROGRESO POR COLUMNAS
  const calculateProgress = (project) => {
    if (!project.tareas || project.tareas.length === 0) return 0;

    // Pesos definidos: Ideas(15), Por Hacer(30), En Proceso(55), QA(75), Listo(100)
    const pesos = [15, 30, 55, 75, 100];

    const sumaPorcentajes = project.tareas.reduce((acc, tarea) => {
      const colIndex = project.columnas.findIndex((col) => col.id === tarea.status);
      const pesoTarea = colIndex !== -1 ? pesos[colIndex] : 0;
      return acc + pesoTarea;
    }, 0);

    return Math.round(sumaPorcentajes / project.tareas.length);
  };

  useEffect(() => {
    const docs = JSON.parse(localStorage.getItem("projects")) || [];
    const projects = JSON.parse(localStorage.getItem("mis_proyectos_dashboard")) || [];

    const tasksCount = projects.reduce((acc, proj) => acc + (proj.tareas?.length || 0), 0);
    const size = ((JSON.stringify(docs).length + JSON.stringify(projects).length) / 1024).toFixed(
      2
    );

    setStats({
      totalDocs: docs.length,
      totalProjects: projects.length,
      totalTasks: tasksCount,
      storageSize: `${size} KB`,
    });

    setProjChartData({
      labels: projects.slice(-6).map((p) => p.nombre.substring(0, 8)),
      datasets: { label: "Tareas", data: projects.slice(-6).map((p) => p.tareas?.length || 0) },
    });

    setDocFreqData({
      labels: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
      datasets: {
        label: "Documentación",
        data: [1, 3, 2, 5, 4, stats.totalDocs > 6 ? stats.totalDocs - 1 : 2, stats.totalDocs],
      },
    });

    setProjectsTable({
      columns: [
        { Header: "Proyecto", accessor: "nombre", width: "45%" },
        { Header: "Progreso Real", accessor: "progreso", align: "center" },
      ],
      rows: projects
        .slice(-4)
        .reverse()
        .map((p) => {
          const progressValue = calculateProgress(p);
          return {
            nombre: (
              <MDTypography
                variant="button"
                fontWeight="medium"
                sx={{ cursor: "pointer", "&:hover": { color: "#1a73e8" } }}
                onClick={() => navigate("/projects")}
              >
                {p.nombre}
              </MDTypography>
            ),
            progreso: (
              <MDBox width="8rem">
                <MDProgress
                  value={progressValue}
                  color={progressValue === 100 ? "success" : progressValue < 30 ? "error" : "info"}
                  variant="gradient"
                />
              </MDBox>
            ),
          };
        }),
    });

    setDocsTable({
      columns: [
        { Header: "Manual", accessor: "titulo", width: "50%" },
        { Header: "Tecnología", accessor: "tech", align: "center" },
      ],
      rows: docs
        .slice(-4)
        .reverse()
        .map((d) => ({
          titulo: (
            <MDTypography
              variant="button"
              fontWeight="medium"
              sx={{ cursor: "pointer", "&:hover": { color: "#1a73e8" } }}
              onClick={() => navigate("/do")}
            >
              {d.titulo}
            </MDTypography>
          ),
          tech: (
            <MDBadge
              badgeContent={d.tecnologia || "Dev"}
              color="dark"
              variant="gradient"
              size="xs"
            />
          ),
        })),
    });
  }, [navigate, stats.totalDocs]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <ComplexStatisticsCard
              color="dark"
              icon="description"
              title="Documentación"
              count={stats.totalDocs}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <ComplexStatisticsCard
              color="info"
              icon="assignment"
              title="Proyectos"
              count={stats.totalProjects}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <ComplexStatisticsCard
              color="success"
              icon="task_alt"
              title="Tareas"
              count={stats.totalTasks}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <ComplexStatisticsCard
              color="primary"
              icon="storage"
              title="Datos"
              count={stats.storageSize}
            />
          </Grid>
        </Grid>

        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <ReportsBarChart
                color="info"
                title="Carga de Trabajo"
                description="Tareas por proyecto"
                chart={projChartData}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <ReportsLineChart
                color="success"
                title="Actividad Doc"
                description="Frecuencia semanal"
                chart={docFreqData}
              />
            </Grid>
          </Grid>
        </MDBox>

        <MDBox mt={4}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={6}>
              <Card>
                <MDBox p={3} display="flex" justifyContent="space-between" alignItems="center">
                  <MDTypography variant="h6">Estado de Proyectos</MDTypography>
                  <MDTypography
                    variant="button"
                    color="info"
                    fontWeight="bold"
                    sx={{ cursor: "pointer" }}
                    onClick={() => navigate("/projects")}
                  >
                    {" "}
                    Ver todos{" "}
                  </MDTypography>
                </MDBox>
                <DataTable
                  table={projectsTable}
                  showTotalEntries={false}
                  isSorted={false}
                  noEndBorder
                  entriesPerPage={false}
                />
              </Card>
            </Grid>
            <Grid item xs={12} lg={6}>
              <Card>
                <MDBox p={3} display="flex" justifyContent="space-between" alignItems="center">
                  <MDTypography variant="h6">Últimas Documentaciones</MDTypography>
                  <MDTypography
                    variant="button"
                    color="info"
                    fontWeight="bold"
                    sx={{ cursor: "pointer" }}
                    onClick={() => navigate("/docs")}
                  >
                    {" "}
                    Ver todos{" "}
                  </MDTypography>
                </MDBox>
                <DataTable
                  table={docsTable}
                  showTotalEntries={false}
                  isSorted={false}
                  noEndBorder
                  entriesPerPage={false}
                />
              </Card>
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
