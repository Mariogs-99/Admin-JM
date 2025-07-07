import React, { useEffect, useState } from "react";
import OtaTable from "./OtaTable";
import { OtaIcalConfig } from "./otaInterface";
import { Button, Modal, Form, Input } from "antd";
import { getOtaConfigs, saveOtaConfig } from "./otaIntegrationService";

export const OtaIntegrationsPage: React.FC = () => {
  const [otas, setOtas] = useState<OtaIcalConfig[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentOta, setCurrentOta] = useState<OtaIcalConfig | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    loadConfigs();
  }, []);

  const loadConfigs = async () => {
    const data = await getOtaConfigs();
    setOtas(Array.isArray(data) ? data : []);
  };

  const handleEdit = (ota: OtaIcalConfig) => {
    setCurrentOta(ota);
    form.setFieldsValue({ icalUrl: ota.icalUrl });
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    const values = form.getFieldsValue();
    if (currentOta) {
      await saveOtaConfig({
        ...currentOta,
        icalUrl: values.icalUrl,
        active: true,
      });
    }
    setIsModalVisible(false);
    loadConfigs();
  };

  return (
    <>
      <h2 className="text-xl font-bold mb-4">Integraciones OTA</h2>
      <OtaTable data={otas} onEdit={handleEdit} />

      <Modal
        open={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
        okText="Guardar"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="URL iCal"
            name="icalUrl"
            rules={[{ required: true, message: "Por favor ingresa la URL iCal" }]}
          >
            <Input placeholder="https://..." />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
