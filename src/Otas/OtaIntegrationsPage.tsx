import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  Card,
  Tag,
  Select,
  Tooltip,
  Empty,
} from "antd";
import {
  EyeInvisibleOutlined,
  PlusOutlined,
  EditOutlined,
  DownloadOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import {
  getOtaConfigs,
  saveOtaConfig,
  deleteOtaConfig,
  importOtaReservations,
} from "./otaIntegrationService";
import {
  OtaIcalConfig,
  OtaIcalConfigCreateDTO,
  ImportResultDTO,
} from "./otaInterface";

//?Importa las imágenes desde assets
import airbnbLogo from "../assets/airbnb.png";
import bookingLogo from "../assets/booking.png";
import expediaLogo from "../assets/expedia.png";
import defaultLogo from "../assets/default.png";

const OTAS = ["Airbnb", "Booking", "Expedia"];

//?Diccionario nombre → imagen
const OTA_IMAGES: Record<string, string> = {
  Airbnb: airbnbLogo,
  Booking: bookingLogo,
  Expedia: expediaLogo,
};

export const OtaIntegrationsPage: React.FC = () => {
  const [configs, setConfigs] = useState<OtaIcalConfig[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCreateMode, setIsCreateMode] = useState(true);
  const [currentOta, setCurrentOta] = useState<OtaIcalConfig | null>(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [otaToDelete, setOtaToDelete] = useState<OtaIcalConfig | null>(null);
  const [isResultModalVisible, setIsResultModalVisible] = useState(false);
  const [resultModalTitle, setResultModalTitle] = useState<string>("");
  const [resultModalContent, setResultModalContent] = useState<string>("");
  const [form] = Form.useForm();

  useEffect(() => {
    loadConfigs();
  }, []);

  const loadConfigs = async () => {
    const data = await getOtaConfigs();
    setConfigs(Array.isArray(data) ? data : []);
  };

  const showCreateModal = () => {
    setCurrentOta(null);
    setIsCreateMode(true);
    form.resetFields();
    setIsModalVisible(true);
  };

  const showEditModal = (ota: OtaIcalConfig) => {
    setCurrentOta(ota);
    setIsCreateMode(false);
    form.setFieldsValue({
      otaName: ota.otaName,
      icalUrl: ota.icalUrl || "",
    });
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    const values = form.getFieldsValue();

    try {
      if (isCreateMode) {
        const newConfig: OtaIcalConfigCreateDTO = {
          otaName: values.otaName,
          icalUrl: values.icalUrl,
          active: true,
        };
        await saveOtaConfig(newConfig);
        showResultModal(
          "Integración creada",
          `La integración OTA <strong>${values.otaName}</strong> fue creada exitosamente.`
        );
      } else if (currentOta) {
        const updateConfig: OtaIcalConfig = {
          ...currentOta,
          icalUrl: values.icalUrl,
          active: true,
        };
        await saveOtaConfig(updateConfig);
        showResultModal(
          "Integración actualizada",
          `La integración OTA <strong>${currentOta.otaName}</strong> fue actualizada exitosamente.`
        );
      }
    } catch (error) {
      console.error(error);
      showResultModal(
        "Error",
        "Ocurrió un error al guardar la integración OTA."
      );
    }

    setIsModalVisible(false);
    loadConfigs();
  };

  const handleImport = async (ota: OtaIcalConfig) => {
    if (!ota.icalUrl) {
      showResultModal("Error", "Esta OTA no tiene URL configurada.");
      return;
    }

    try {
      const result: ImportResultDTO = await importOtaReservations(
        ota.icalUrl,
        ota.otaName
      );

      let html = "";

      if (result.importedReservations.length > 0) {
        html += `<h3 style="color: green; margin-bottom: 10px;">Importadas:</h3>`;
        html += "<ul style='padding-left: 20px;'>";
        result.importedReservations.forEach((res) => {
          html += `<li><strong>${res.roomName}</strong> — ${res.dates} (UID: ${res.uid})</li>`;
        });
        html += "</ul>";
      }

      if (result.rejectedReservations.length > 0) {
        html += `<h3 style="color: red; margin-top: 20px; margin-bottom: 10px;">❌ Rechazadas:</h3>`;
        html += "<ul style='padding-left: 20px;'>";
        result.rejectedReservations.forEach((rej) => {
          html += `<li><strong>${rej.roomName}</strong> — ${rej.reason} (UID: ${rej.uid})</li>`;
        });
        html += "</ul>";
      }

      if (html === "") {
        html = `No se importaron reservas para <strong>${ota.otaName}</strong>.`;
      }

      showResultModal(`Importación de ${ota.otaName}`, html);
    } catch (error: any) {
      console.error(error);

      let errorMsg = `Ocurrió un error técnico al importar reservas de <strong>${ota.otaName}</strong>.`;

      if (error?.response?.data?.message) {
        errorMsg += `<br/><br/>Detalle: ${error.response.data.message}`;
      }

      showResultModal("Error durante la importación", errorMsg);
    }
  };

  const showResultModal = (title: string, content: string) => {
    setResultModalTitle(title);
    setResultModalContent(content);
    setIsResultModalVisible(true);
  };

  return (
    <>
      <h2 className="text-2xl mb-4 font-bold">Integraciones OTA</h2>
      
      

      <Button
        type="primary"
        icon={<PlusOutlined />}
        style={{
          marginBottom: 24,
          backgroundColor: "#005b96",
          borderColor: "#005b96",
        }}
        onClick={showCreateModal}
      >
        Agregar Integración OTA
      </Button>

    <p
  style={{
    marginTop: 32,
    paddingBottom: 32,
    fontSize: 14,
    color: "#666",
    maxWidth: 700,
    lineHeight: 1.6,
  }}
>
  Administra y conecta tus plataformas de reservas desde un solo lugar. Configura las URLs iCal para importar las reservas y mantener actualizado tu PMS.
</p>



      {configs.length === 0 && (
        <Empty
          description="No hay integraciones configuradas."
          style={{ marginTop: 50 }}
        >
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={showCreateModal}
            style={{
              backgroundColor: "#005b96",
              borderColor: "#005b96",
            }}
          >
            Agregar Integración OTA
          </Button>
        </Empty>
      )}

      {configs.map((c) => (
        <Card
          key={c.id}
          style={{
            marginBottom: 16,
            borderRadius: 8,
            border: "1px solid #f0f0f0",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
          bodyStyle={{ padding: 24 }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                flex: 1,
                minWidth: 250,
              }}
            >
              <img
                src={OTA_IMAGES[c.otaName] || defaultLogo}
                alt={c.otaName}
                style={{
                  width: 48,
                  height: 48,
                  objectFit: "contain",
                  borderRadius: 8,
                }}
              />
              <div>
                <h3 style={{ fontSize: 18, marginBottom: 8 }}>
                  {c.otaName}
                </h3>
                <p style={{ marginBottom: 4, fontSize: 14, color: "#555" }}>
                  Estado:{" "}
                  {c.active ? (
                    <Tag color="green">Configurada</Tag>
                  ) : (
                    <Tag color="red">No configurada</Tag>
                  )}
                </p>
                <p style={{ marginBottom: 0, fontSize: 14, color: "#555" }}>
                  URL:{" "}
                  {c.icalUrl ? (
                    <>
                      <span style={{ color: "#52c41a" }}>
                        Configurada
                      </span>{" "}
                      <EyeInvisibleOutlined
                        title="URL oculta por seguridad"
                        style={{ color: "#999" }}
                      />
                    </>
                  ) : (
                    <span style={{ color: "#999" }}>
                      No configurada
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <Button
                type="primary"
                ghost
                icon={<EditOutlined />}
                onClick={() => showEditModal(c)}
              >
                {c.active ? "Cambiar URL" : "Configurar URL"}
              </Button>
              <Tooltip
                title={
                  !c.icalUrl
                    ? "Configura la URL para poder importar reservas"
                    : ""
                }
              >
                <Button
                  type="default"
                  icon={<DownloadOutlined />}
                  disabled={!c.icalUrl}
                  onClick={() => handleImport(c)}
                >
                  Actualizar
                </Button>
              </Tooltip>
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={() => {
                  setOtaToDelete(c);
                  setIsDeleteModalVisible(true);
                }}
              >
                Eliminar
              </Button>
            </div>
          </div>
        </Card>
      ))}

      <Modal
        open={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
        okText="Guardar"
        title={
          isCreateMode
            ? "Agregar Integración OTA"
            : `Configurar ${currentOta?.otaName || ""}`
        }
        bodyStyle={{
          padding: 24,
        }}
      >
        <Form form={form} layout="vertical">
          {isCreateMode && (
            <Form.Item
              label="Nombre de OTA"
              name="otaName"
              rules={[{ required: true, message: "Selecciona una OTA" }]}
            >
              <Select placeholder="Selecciona OTA">
                {OTAS.map((ota) => (
                  <Select.Option key={ota} value={ota}>
                    {ota}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          )}

          <Form.Item
            label="URL iCal"
            name="icalUrl"
            rules={[
              {
                required: true,
                message: "Por favor ingresa la URL iCal",
              },
            ]}
          >
            <Input placeholder="https://..." />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        open={isDeleteModalVisible}
        title="Eliminar Integración OTA"
        onOk={async () => {
          if (otaToDelete) {
            try {
              await deleteOtaConfig(otaToDelete.id);
              showResultModal(
                "Integración eliminada",
                `La integración <strong>${otaToDelete.otaName}</strong> fue eliminada.`
              );
              setIsDeleteModalVisible(false);
              loadConfigs();
            } catch (error) {
              console.error(error);
              showResultModal(
                "Error",
                "Error al eliminar la integración OTA."
              );
            }
          }
        }}
        onCancel={() => setIsDeleteModalVisible(false)}
        okText="Eliminar"
        okButtonProps={{ danger: true }}
        cancelText="Cancelar"
      >
        <p>
          ¿Estás seguro de que deseas eliminar la integración{" "}
          <b>{otaToDelete?.otaName}</b>?
        </p>
      </Modal>

      <Modal
        open={isResultModalVisible}
        title={
          <span style={{ fontSize: "22px", fontWeight: "bold" }}>
            {resultModalTitle}
          </span>
        }
        onOk={() => setIsResultModalVisible(false)}
        centered
        width={850}
        cancelButtonProps={{ style: { display: "none" } }}
        bodyStyle={{
          backgroundColor: "#fafafa",
          padding: "24px",
          borderRadius: "8px",
        }}
      >
        <div
          style={{ fontSize: "16px", lineHeight: "1.6" }}
          dangerouslySetInnerHTML={{
            __html: resultModalContent,
          }}
        ></div>
      </Modal>
    </>
  );
};
