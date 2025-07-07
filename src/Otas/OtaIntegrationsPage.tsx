import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  Card,
  Tag,
  Select,
} from "antd";
import {
  EyeInvisibleOutlined,
  PlusOutlined,
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

const OTAS = ["Airbnb", "Booking", "Expedia"];

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
    const result: ImportResultDTO = await importOtaReservations(ota.icalUrl, ota.otaName);

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
        style={{ marginBottom: 16 }}
        onClick={showCreateModal}
      >
        Agregar Integración OTA
      </Button>

      {configs.map((c) => (
        <Card key={c.id} style={{ marginBottom: 16 }}>
          <h3 className="text-lg font-semibold">{c.otaName}</h3>
          <p>
            Estado:{" "}
            {c.active ? (
              <Tag color="green">Configurada</Tag>
            ) : (
              <Tag color="red">No configurada</Tag>
            )}
          </p>
          <p>
            URL actual:{" "}
            {c.icalUrl ? (
              <>
                <span className="text-green-600">Configurada</span>{" "}
                <EyeInvisibleOutlined
                  style={{ color: "#888" }}
                  title="URL oculta por seguridad"
                />
              </>
            ) : (
              <span className="text-gray-500">No configurada</span>
            )}
          </p>
          <Button
            type="primary"
            style={{ marginRight: 8 }}
            onClick={() => showEditModal(c)}
          >
            {c.active ? "Cambiar URL" : "Configurar URL"}
          </Button>
          <Button
            type="default"
            style={{ marginRight: 8 }}
            onClick={() => handleImport(c)}
            disabled={!c.icalUrl}
          >
            Actualizar reservas
          </Button>
          <Button
            danger
            onClick={() => {
              setOtaToDelete(c);
              setIsDeleteModalVisible(true);
            }}
          >
            Eliminar
          </Button>
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
              { required: true, message: "Por favor ingresa la URL iCal" },
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
          <span
            style={{
              fontSize: "22px",
              fontWeight: "bold",
            }}
          >
            {resultModalTitle}
          </span>
        }
        onOk={() => setIsResultModalVisible(false)}
        centered
        width={850}
        cancelButtonProps={{ style: { display: "none" } }}
      >
        <div
          style={{ fontSize: "18px", lineHeight: "1.6" }}
          dangerouslySetInnerHTML={{
            __html: resultModalContent,
          }}
        ></div>
      </Modal>
    </>
  );
};
