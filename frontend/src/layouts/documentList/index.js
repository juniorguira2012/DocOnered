import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import InputAdornment from "@mui/material/InputAdornment";
import Divider from "@mui/material/Divider";

// IMPORTACIONES PARA DIÁLOGOS Y NOTIFICACIONES
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import MDBadge from "components/MDBadge";
import MDSnackbar from "components/MDSnackbar"; // Importamos MDSnackbar

// Layout components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// IMPORTAMOS EL CONTEXTO DE SEGURIDAD
import { useMaterialUIController } from "context";

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

function DocumentList() {
  const navigate = useNavigate();
  const [controller] = useMaterialUIController();
  const { user } = controller;
  const isAdmin = user?.rol === "admin";

  const [docs, setDocs] = useState(() => JSON.parse(localStorage.getItem("projects")) || []);
  const [search, setSearch] = useState("");
  const [selectedTech, setSelectedTech] = useState("Todas");
  const [selectedClient, setSelectedClient] = useState("Todos");

  // Estados para el diálogo de confirmación y notificaciones
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [notification, setNotification] = useState(false);

  const logActivity = (action, docTitle) => {
    if (!isAdmin) return;
    const activity = JSON.parse(localStorage.getItem("doc_activity")) || [];
    const newLog = { id: Date.now(), action, docTitle, date: new Date().toISOString() };
    localStorage.setItem("doc_activity", JSON.stringify([newLog, ...activity].slice(0, 20)));
  };

  // Prepara el borrado abriendo el Modal
  const handleDeleteClick = (id, title) => {
    if (!isAdmin) return;
    setSelectedDoc({ id, title });
    setOpenConfirm(true);
  };

  // Ejecuta el borrado real tras confirmar en el UI
  const handleConfirmDelete = () => {
    if (selectedDoc) {
      const updatedDocs = docs.filter((d) => String(d.id) !== String(selectedDoc.id));
      localStorage.setItem("projects", JSON.stringify(updatedDocs));
      setDocs(updatedDocs);
      logActivity("eliminó", selectedDoc.title);

      setOpenConfirm(false);
      setNotification(true); // Dispara el Snackbar
      setSelectedDoc(null);
    }
  };

  const handleNavigate = (path, doc) => {
    const slug = createSlug(doc.titulo);
    navigate(`/${path}/${slug}`);
  };

  const handleDownloadSingle = (documentToDownload) => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(documentToDownload, null, 2));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute(
      "download",
      `${documentToDownload.titulo.replace(/\s+/g, "_")}.json`
    );
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleBackupAll = () => {
    if (!isAdmin) return;
    if (docs.length === 0) return;
    const dataStr =
      "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(docs, null, 2));
    const downloadAnchorNode = document.createElement("a");
    const date = new Date().toISOString().split("T")[0];
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `BACKUP_DocONERED_${date}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    logActivity("respaldó", "Toda la biblioteca");
  };

  const allTechs = useMemo(() => {
    const techs = new Set();
    docs.forEach((doc) => doc.tecnologias?.forEach((t) => techs.add(t)));
    return ["Todas", ...Array.from(techs)];
  }, [docs]);

  const allClients = useMemo(() => {
    const clients = new Set();
    docs.forEach((doc) => {
      if (doc.cliente) clients.add(doc.cliente);
    });
    return ["Todos", ...Array.from(clients)];
  }, [docs]);

  const filteredDocs = docs.filter((doc) => {
    const title = doc.titulo ? doc.titulo.toLowerCase() : "";
    const matchesSearch = title.includes(search.toLowerCase());
    const matchesTech =
      selectedTech === "Todas" || (doc.tecnologias && doc.tecnologias.includes(selectedTech));
    const docClient = doc.cliente || "General";
    const matchesClient = selectedClient === "Todos" || docClient === selectedClient;
    return matchesSearch && matchesTech && matchesClient;
  });

  const handleImportJSON = (event) => {
    if (!isAdmin) return;
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        const currentDocs = JSON.parse(localStorage.getItem("projects")) || [];
        let updated = Array.isArray(importedData) ? importedData : [...currentDocs, importedData];
        localStorage.setItem("projects", JSON.stringify(updated));
        setDocs(updated);
        // Aquí podrías usar otro Snackbar para "Importación exitosa"
      } catch (err) {
        console.error("Error importando");
      }
      event.target.value = "";
    };
    reader.readAsText(file);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />

      {/* CONTENEDOR FLEX: 
          Usamos minHeight="80vh" para asegurar que el footer baje 
          incluso si hay pocos documentos.
      */}
      <MDBox display="flex" flexDirection="column" minHeight="85vh">
        <MDBox pt={6} pb={3} sx={{ flex: 1 }}>
          {" "}
          {/* flex: 1 empuja el footer hacia abajo */}
          <MDBox mb={4} display="flex" justifyContent="space-between" alignItems="center">
            <MDTypography variant="h4" fontWeight="medium">
              Biblioteca OneRed{" "}
              {!isAdmin && (
                <MDTypography variant="caption" color="secondary">
                  (MODO LECTURA)
                </MDTypography>
              )}
            </MDTypography>

            {isAdmin && (
              <MDBox display="flex" gap={1}>
                <MDButton variant="contained" color="dark" onClick={handleBackupAll}>
                  <Icon>save</Icon>&nbsp;Exportar Todo
                </MDButton>
                <input
                  type="file"
                  accept=".json"
                  id="file-upload-global"
                  style={{ display: "none" }}
                  onChange={handleImportJSON}
                />
                <MDButton
                  variant="contained"
                  color="info"
                  onClick={() => document.getElementById("file-upload-global").click()}
                >
                  <Icon>upload</Icon>&nbsp;Importar
                </MDButton>
                <MDButton variant="gradient" color="success" onClick={() => navigate("/new")}>
                  <Icon>add</Icon>&nbsp;Nueva
                </MDButton>
              </MDBox>
            )}
          </MDBox>
          <Card sx={{ mb: 4, p: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
                <MDInput
                  label="Buscar manual..."
                  fullWidth
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Icon>search</Icon>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <MDInput
                  select
                  label="Filtrar Cliente"
                  fullWidth
                  value={selectedClient}
                  onChange={(e) => setSelectedClient(e.target.value)}
                  SelectProps={{ native: true }}
                >
                  {allClients.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </MDInput>
              </Grid>
              <Grid item xs={12} md={5}>
                <MDBox display="flex" gap={1} sx={{ overflowX: "auto", pb: 1 }}>
                  {allTechs.map((tech) => (
                    <MDBadge
                      key={tech}
                      variant="gradient"
                      color={selectedTech === tech ? "info" : "secondary"}
                      badgeContent={tech}
                      container
                      sx={{ cursor: "pointer", px: 2, py: 1 }}
                      onClick={() => setSelectedTech(tech)}
                    />
                  ))}
                </MDBox>
              </Grid>
            </Grid>
          </Card>
          <Grid container spacing={3}>
            {filteredDocs.map((doc) => (
              <Grid item xs={12} md={6} lg={4} key={doc.id}>
                {/* ... (Contenido de la Card sin cambios) ... */}
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "transform 0.2s",
                    "&:hover": { transform: "translateY(-5px)", boxShadow: 3 },
                  }}
                >
                  <MDBox p={3} flexGrow={1}>
                    <MDTypography
                      variant="caption"
                      color="info"
                      fontWeight="bold"
                      textTransform="uppercase"
                    >
                      {doc.cliente || "General"}
                    </MDTypography>
                    <MDBox
                      display="flex"
                      justifyContent="space-between"
                      alignItems="flex-start"
                      mt={1}
                    >
                      <MDTypography
                        variant="h5"
                        textTransform="capitalize"
                        fontWeight="bold"
                        mb={1}
                      >
                        {doc.titulo || "Sin título"}
                      </MDTypography>
                      <Icon color="info" fontSize="medium">
                        description
                      </Icon>
                    </MDBox>
                    <MDBox display="flex" flexWrap="wrap" gap={0.5} mb={2}>
                      {doc.tecnologias?.map((t) => (
                        <MDBadge
                          key={t}
                          badgeContent={t}
                          color="dark"
                          variant="gradient"
                          size="xs"
                        />
                      ))}
                    </MDBox>
                    <MDTypography variant="caption" color="text" display="flex" alignItems="center">
                      <Icon sx={{ fontSize: "14px !important", mr: 0.5 }}>calendar_today</Icon>
                      {doc.fecha ? new Date(doc.fecha).toLocaleDateString() : "S/F"}
                    </MDTypography>
                  </MDBox>
                  <Divider sx={{ my: 0, opacity: 0.1 }} />
                  <MDBox p={2}>
                    <MDButton
                      variant="gradient"
                      color="info"
                      fullWidth
                      sx={{ mb: 1.5 }}
                      onClick={() => handleNavigate("doc", doc)}
                    >
                      <Icon>visibility</Icon>&nbsp; Ver Manual
                    </MDButton>
                    <MDBox display="flex" gap={1}>
                      {isAdmin && (
                        <MDButton
                          variant="contained"
                          color="secondary"
                          fullWidth
                          size="small"
                          onClick={() => handleNavigate("edit", doc)}
                        >
                          <Icon>edit</Icon>
                        </MDButton>
                      )}
                      <MDButton
                        variant="contained"
                        color="dark"
                        fullWidth
                        size="small"
                        onClick={() => handleDownloadSingle(doc)}
                      >
                        <Icon>download</Icon>
                      </MDButton>
                      {isAdmin && (
                        <MDButton
                          variant="contained"
                          color="error"
                          fullWidth
                          size="small"
                          onClick={() => handleDeleteClick(doc.id, doc.titulo)}
                        >
                          <Icon>delete</Icon>
                        </MDButton>
                      )}
                    </MDBox>
                  </MDBox>
                </Card>
              </Grid>
            ))}
          </Grid>
        </MDBox>

        {/* Footer queda dentro del contenedor flex para mantenerse al final */}
        <Footer />
      </MDBox>

      {/* COMPONENTES DE INTERFAZ (DIALOGS Y SNACKBARS) */}
      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>¿Deseas eliminar este manual?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Estás a punto de borrar <strong>{selectedDoc?.title}</strong>. Esta acción quitará el
            manual de la base de datos local.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <MDButton onClick={() => setOpenConfirm(false)} color="dark">
            Cancelar
          </MDButton>
          <MDButton onClick={handleConfirmDelete} color="error" variant="gradient">
            Eliminar
          </MDButton>
        </DialogActions>
      </Dialog>

      <MDSnackbar
        color="success"
        icon="check"
        title="Manual Eliminado"
        content="El documento se ha quitado de la biblioteca correctamente."
        open={notification}
        onClose={() => setNotification(false)}
        close={() => setNotification(false)}
        bgWhite
      />
    </DashboardLayout>
  );
}

export default DocumentList;
