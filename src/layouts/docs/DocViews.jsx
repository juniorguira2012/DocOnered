import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

// Librerías de exportación
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";

// @mui material components
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Layout components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// IMPORTAMOS EL CONTEXTO Y LA FUNCIÓN PARA MANIPULAR EL LAYOUT
import { useMaterialUIController, setLayout } from "context";

// Función auxiliar para limpiar el slug
const createSlug = (text) => {
  if (!text) return "manual";
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
};

function DocViews() {
  const { id: slugFromUrl } = useParams();
  const navigate = useNavigate();

  const [controller, dispatch] = useMaterialUIController();
  const { user } = controller;

  // --- CORRECCIÓN DE SEGURIDAD ---
  // Ahora isAdmin será 'true' solo si el rol del usuario es 'admin'.
  // Los usuarios con rol 'lector' tendrán esto en 'false' y no verán el botón.
  const isAdmin = user?.rol === "admin";

  const [doc, setDoc] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    const docs = JSON.parse(localStorage.getItem("projects")) || [];
    const foundDoc = docs.find((d) => createSlug(d.titulo) === slugFromUrl);
    if (foundDoc) {
      setDoc(foundDoc);
    }
  }, [slugFromUrl]);

  const toggleFullScreen = () => {
    if (!isFullScreen) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      }
      setLayout(dispatch, "page");
      setIsFullScreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setLayout(dispatch, "dashboard");
      setIsFullScreen(false);
    }
  };

  useEffect(() => {
    const handleExit = () => {
      if (!document.fullscreenElement) {
        setLayout(dispatch, "dashboard");
        setIsFullScreen(false);
      }
    };
    document.addEventListener("fullscreenchange", handleExit);
    return () => document.removeEventListener("fullscreenchange", handleExit);
  }, [dispatch]);

  const handleExportPDF = async () => {
    const element = contentRef.current;
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`DocONERED_${doc.titulo}.pdf`);
  };

  const handleExportWord = () => {
    const header = `<h1>${doc.titulo}</h1><p>Fecha: ${doc.fecha}</p><hr>`;
    const fullHtml = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'></head><body>${header}${doc.contenido}</body></html>`;
    const blob = new Blob(["\ufeff", fullHtml], { type: "application/msword" });
    saveAs(blob, `DocONERED_${doc.titulo}.doc`);
  };

  if (!doc) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox p={5} textAlign="center">
          <MDTypography variant="h6">Buscando manual...</MDTypography>
        </MDBox>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {!isFullScreen && <DashboardNavbar />}

      <MDBox
        py={isFullScreen ? 0 : 3}
        mb={5}
        display="flex"
        justifyContent={isFullScreen ? "flex-start" : "center"}
        sx={{
          bgcolor: "white",
          minHeight: "100vh",
          overflowY: "auto",
          transition: "all 0.3s ease",
        }}
      >
        <MDBox
          width="100%"
          sx={{
            maxWidth: isFullScreen ? "1100px" : "1000px",
            ml: isFullScreen ? "8%" : "auto",
            mr: "auto",
            px: isFullScreen ? 5 : 0,
          }}
        >
          {!isFullScreen && (
            <MDBox mb={2} display="flex" justifyContent="space-between" alignItems="center">
              <MDButton
                variant="text"
                color="dark"
                onClick={() => navigate(-1)}
                startIcon={<Icon>arrow_back</Icon>}
              >
                Volver
              </MDButton>

              <MDBox display="flex" gap={1}>
                <Tooltip title="Modo Presentación">
                  <MDButton variant="outlined" color="dark" iconOnly onClick={toggleFullScreen}>
                    <Icon>fullscreen</Icon>
                  </MDButton>
                </Tooltip>

                <Tooltip title="Exportar Word">
                  <MDButton variant="outlined" color="info" iconOnly onClick={handleExportWord}>
                    <Icon>description</Icon>
                  </MDButton>
                </Tooltip>

                <Tooltip title="Exportar PDF">
                  <MDButton variant="outlined" color="error" iconOnly onClick={handleExportPDF}>
                    <Icon>picture_as_pdf</Icon>
                  </MDButton>
                </Tooltip>

                {/* --- EL BOTÓN SOLO SE MUESTRA SI ES ADMIN --- */}
                {isAdmin && (
                  <MDButton
                    variant="gradient"
                    color="info"
                    onClick={() => navigate(`/edit/${createSlug(doc.titulo)}`)}
                  >
                    <Icon>edit</Icon>&nbsp;Editar
                  </MDButton>
                )}
              </MDBox>
            </MDBox>
          )}

          {isFullScreen && (
            <MDBox position="fixed" top={30} right={50} zIndex={9999}>
              <MDButton variant="gradient" color="dark" iconOnly onClick={toggleFullScreen}>
                <Icon>fullscreen_exit</Icon>
              </MDButton>
            </MDBox>
          )}

          <div ref={contentRef}>
            <Card
              sx={{
                p: { xs: 3, md: isFullScreen ? 5 : 5 },
                borderRadius: isFullScreen ? 0 : "xl",
                boxShadow: isFullScreen ? "none" : 3,
                minHeight: isFullScreen ? "100vh" : "auto",
                bgcolor: "white",
              }}
            >
              <MDTypography variant="h2" fontWeight="bold">
                {doc.titulo}
              </MDTypography>
              <MDTypography variant="button" color="text">
                Publicado el {new Date(doc.fecha).toLocaleDateString()}
              </MDTypography>

              <Divider sx={{ my: 3 }} />

              <MDBox
                dangerouslySetInnerHTML={{ __html: doc.contenido }}
                sx={{
                  fontSize: "1.1rem",
                  lineHeight: 1.7,
                  color: "#344767",
                  "& pre": {
                    backgroundColor: "#282c34",
                    p: 2,
                    borderRadius: "12px",
                    color: "#abb2bf",
                    overflowX: "auto",
                  },
                  "& img": {
                    maxWidth: "100%",
                    borderRadius: "8px",
                    my: 2,
                  },
                }}
              />
            </Card>
          </div>
        </MDBox>
      </MDBox>

      {!isFullScreen && <Footer />}
    </DashboardLayout>
  );
}

export default DocViews;
