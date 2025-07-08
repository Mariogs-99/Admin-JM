import React, { useEffect, useState } from "react";
import OtaTable from "./OtaTable";
import { OtaIcalConfig } from "./otaInterface";
import { Modal, Form, Input } from "antd";
import { getOtaConfigs, saveOtaConfig } from "./otaIntegrationService";
import { SaveOutlined } from "@ant-design/icons";

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
      <h2 className="text-2xl font-bold mb-4">Integraciones OTA</h2>
      
      <OtaTable data={otas} onEdit={handleEdit} />

    
      <Modal
        open={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
        okText="Guardar"
        okButtonProps={{
          style: {
            backgroundColor: "#005b96",
            borderColor: "#005b96",
            borderRadius: 6,
            height: 40,
            fontWeight: "bold",
          },
          icon: <SaveOutlined />,
        }}
        bodyStyle={{ padding: 24 }}
      >
        <Form form={form} layout="vertical">
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
    </>
  );
};
