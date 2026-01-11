import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import Dialog from "@mui/material/Dialog"; // Nuevo: Para el diálogo
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import MDSnackbar from "components/MDSnackbar";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["code-block"],
    ["link", "image", "video"],
    ["clean"],
  ],
};

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

function DocForm() {
  const navigate = useNavigate();
  const { id: slugFromUrl } = useParams();
  const isEdit = Boolean(slugFromUrl);

  // --- ESTADOS PARA ALERTAS Y DIÁLOGOS ---
  const [successSB, setSuccessSB] = useState(false);
  const [errorSB, setErrorSB] = useState(false);
  const [openCancelDialog, setOpenCancelDialog] = useState(false); // Estado para el modal de cancelar

  const openSuccessSB = () => setSuccessSB(true);
  const closeSuccessSB = () => setSuccessSB(false);
  const openErrorSB = () => setErrorSB(true);
  const closeErrorSB = () => setErrorSB(false);

  const [form, setForm] = useState({
    id: null,
    titulo: "",
    cliente: "",
    tecnologias: "",
    contenido: "",
  });

  useEffect(() => {
    if (isEdit) {
      const docs = JSON.parse(localStorage.getItem("projects")) || [];
      const docToEdit = docs.find((d) => createSlug(d.titulo) === slugFromUrl);

      if (docToEdit) {
        setForm({
          id: docToEdit.id,
          titulo: docToEdit.titulo || "",
          cliente: docToEdit.cliente || "",
          tecnologias: Array.isArray(docToEdit.tecnologias)
            ? docToEdit.tecnologias.join(", ")
            : docToEdit.tecnologias || "",
          contenido: docToEdit.contenido || "",
        });
      }
    }
  }, [slugFromUrl, isEdit]);

  const logActivity = (action, docTitle, docId) => {
    const currentActivity = JSON.parse(localStorage.getItem("doc_activity")) || [];
    const newLog = { id: Date.now(), action, docTitle, docId, date: new Date().toISOString() };
    localStorage.setItem("doc_activity", JSON.stringify([newLog, ...currentActivity].slice(0, 30)));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.titulo.trim()) {
      openErrorSB();
      return;
    }

    const docs = JSON.parse(localStorage.getItem("projects")) || [];

    const normalizeTecnologias = (value) => {
      if (!value) return [];
      if (Array.isArray(value)) return value;
      return value
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
    };

    const docData = {
      titulo: form.titulo,
      cliente: form.cliente.trim() || "General",
      tecnologias: normalizeTecnologias(form.tecnologias),
      contenido: form.contenido,
    };

    if (isEdit && form.id) {
      const updatedDocs = docs.map((d) =>
        String(d.id) === String(form.id)
          ? { ...d, ...docData, ultimaEdicion: new Date().toISOString() }
          : d
      );
      localStorage.setItem("projects", JSON.stringify(updatedDocs));
      logActivity("editó", form.titulo, form.id);
    } else {
      const newId = Date.now().toString();
      const newDoc = { id: newId, ...docData, fecha: new Date().toISOString() };
      localStorage.setItem("projects", JSON.stringify([...docs, newDoc]));
      logActivity("creó", form.titulo, newId);
    }

    openSuccessSB();
    setTimeout(() => {
      navigate(`/doc/${createSlug(form.titulo)}`);
    }, 1500);
  };

  // --- LÓGICA PARA CANCELAR ---
  const handleCancelClick = () => {
    // Solo mostramos el diálogo si el usuario ha escrito algo
    if (form.titulo || form.contenido || form.cliente) {
      setOpenCancelDialog(true);
    } else {
      navigate(-1);
    }
  };

  const confirmCancel = () => {
    setOpenCancelDialog(false);
    navigate(-1);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container justifyContent="center">
          <Grid item xs={12} md={10}>
            <Card>
              <MDBox p={3}>
                <MDTypography variant="h5">
                  {isEdit ? "Editar documentación" : "Nueva documentación"}
                </MDTypography>
              </MDBox>
              <MDBox p={3}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={8}>
                    <MDInput
                      label="Título del Manual"
                      name="titulo"
                      value={form.titulo}
                      onChange={handleChange}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <MDInput
                      label="Cliente / Proyecto"
                      name="cliente"
                      value={form.cliente}
                      onChange={handleChange}
                      placeholder="Ej: OneRed, Banco..."
                      fullWidth
                    />
                  </Grid>
                </Grid>

                <MDInput
                  label="Tecnologías (separadas por coma)"
                  name="tecnologias"
                  value={form.tecnologias}
                  onChange={handleChange}
                  fullWidth
                  sx={{ mt: 2, mb: 2 }}
                />

                <MDTypography variant="h6" mt={3} mb={1}>
                  Contenido
                </MDTypography>
                <MDBox sx={{ minHeight: "400px", mb: 8 }}>
                  <ReactQuill
                    theme="snow"
                    modules={modules}
                    value={form.contenido}
                    onChange={(val) => setForm({ ...form, contenido: val })}
                    style={{ height: "350px" }}
                  />
                </MDBox>
                <MDBox display="flex" justifyContent="flex-end" gap={2}>
                  <MDButton color="secondary" onClick={handleCancelClick}>
                    Cancelar
                  </MDButton>
                  <MDButton color="success" onClick={handleSubmit}>
                    <Icon>save</Icon>&nbsp;Guardar
                  </MDButton>
                </MDBox>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>

      {/* COMPONENTES DE ALERTA */}
      <MDSnackbar
        color="success"
        icon="check"
        title="DocONERED"
        content="Documentación guardada correctamente"
        dateTime="Ahora"
        open={successSB}
        onClose={closeSuccessSB}
        close={closeSuccessSB}
        bgWhite
      />
      <MDSnackbar
        color="error"
        icon="warning"
        title="Error de validación"
        content="El título es obligatorio para guardar."
        dateTime="Ahora"
        open={errorSB}
        onClose={closeErrorSB}
        close={closeErrorSB}
        bgWhite
      />

      {/* DIÁLOGO DE CONFIRMACIÓN PARA CANCELAR */}
      <Dialog
        open={openCancelDialog}
        onClose={() => setOpenCancelDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"¿Descartar cambios?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Tienes cambios sin guardar en este manual. Si sales ahora, perderás toda la información
            ingresada.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <MDButton onClick={() => setOpenCancelDialog(false)} color="dark">
            Seguir editando
          </MDButton>
          <MDButton onClick={confirmCancel} color="error" variant="gradient">
            Sí, salir
          </MDButton>
        </DialogActions>
      </Dialog>

      <Footer />
    </DashboardLayout>
  );
}

export default DocForm;
