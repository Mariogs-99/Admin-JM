import { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Modal,
  Switch,
  Typography,
  Card,
  Row,
  Col,
  Divider,
  Select,
  Upload,
} from "antd";
import { getCompany, updateCompany,uploadCertificate } from "../../Company/companyService";
import { departamentos, municipios } from "./locationOptions";

const { Title } = Typography;
const { Option } = Select;

interface MunicipioOption {
  label: string;
  value: string;
  departamento: string;
}

export const CompanyPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [municipiosFiltrados, setMunicipiosFiltrados] = useState<MunicipioOption[]>([]);
  const [certFile, setCertFile] = useState<File | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const company = await getCompany();
        form.setFieldsValue(company);
        if (company.departamento) {
          const filtered = municipios.filter(
            (m) => m.departamento === company.departamento
          );
          setMunicipiosFiltrados(filtered);
        }
      } catch (error) {
        setModalTitle("Error");
        setModalContent("No se pudieron obtener los datos del hotel.");
        setModalVisible(true);
      }
    };
    loadData();
  }, [form]);

  const handleDepartamentoChange = (value: string) => {
    const filtered = municipios.filter((m) => m.departamento === value);
    setMunicipiosFiltrados(filtered);
    form.setFieldsValue({ municipio: undefined });
  };

const handleFinish = async (values: any) => {
  try {
    setLoading(true);
    await updateCompany(values);

    if (certFile) {
      await uploadCertificate(certFile);
    }

    setModalTitle("Éxito");
    setModalContent(
      certFile
        ? "La información y el certificado fueron actualizados correctamente."
        : "La información del hotel fue actualizada correctamente."
    );
    setModalVisible(true);
  } catch (error) {
    setModalTitle("Error");
    setModalContent("No se pudieron guardar los cambios del hotel.");
    setModalVisible(true);
  } finally {
    setLoading(false);
  }
};


  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "2rem" }}>
      <Title level={3} style={{ marginBottom: "1.5rem", fontWeight: 500 }}>
        Configuración del Hotel
      </Title>

      <Card bordered={false}>
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Row gutter={[24, 16]}>
            <Col xs={24}>
              <Form.Item
                label="Nombre del hotel"
                name="name"
                rules={[{ required: true, message: "El nombre es obligatorio" }]}
              >
                <Input size="large" placeholder="Ej. Hotel El Paraíso" />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item
                label="Nombre comercial"
                name="nombreComercial"
                rules={[{ required: true, message: "El nombre comercial es obligatorio" }]}
              >
                <Input size="large" placeholder="Ej. Hotel Jardines del Sol" />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item
                label="Correo"
                name="correo"
                rules={[
                  { required: true, message: "El correo es obligatorio" },
                  { type: "email", message: "Correo inválido" },
                ]}
              >
                <Input size="large" placeholder="Ej. hotel@correo.com" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                label="Teléfono"
                name="telefono"
                rules={[
                  { required: true, message: "El teléfono es obligatorio" },
                  {
                    pattern: /^[0-9]{8,15}$/,
                    message: "Solo números de 8 a 15 dígitos",
                  },
                ]}
              >
                <Input size="large" placeholder="Ej. 77443322" maxLength={15} />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item
                label="Dirección"
                name="direccion"
                rules={[{ required: true, message: "La dirección es obligatoria" }]}
              >
                <Input size="large" placeholder="Ej. Calle El Mirador #123" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                label="NIT"
                name="nit"
                rules={[
                  { required: true, message: "El NIT es obligatorio" },
                  {
                    pattern: /^\d{14}$/,
                    message: "Debe contener 14 dígitos numéricos",
                  },
                ]}
              >
                <Input size="large" placeholder="Ej. 06140308061025" maxLength={14} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                label="NRC"
                name="nrc"
                rules={[
                  { required: true, message: "El NRC es obligatorio" },
                  {
                    pattern: /^[A-Za-z0-9\-]{5,15}$/,
                    message: "Entre 5 y 15 caracteres alfanuméricos",
                  },
                ]}
              >
                <Input size="large" placeholder="Ej. 123456-7" maxLength={15} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                label="Departamento"
                name="departamento"
                rules={[{ required: true, message: "Selecciona un departamento" }]}
              >
                <Select
                  size="large"
                  placeholder="Selecciona un departamento"
                  onChange={handleDepartamentoChange}
                >
                  {departamentos.map((dep) => (
                    <Option key={dep.value} value={dep.value}>
                      {dep.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                label="Municipio"
                name="municipio"
                rules={[{ required: true, message: "Selecciona un municipio" }]}
              >
                <Select size="large" placeholder="Selecciona un municipio">
                  {municipiosFiltrados.map((mun) => (
                    <Option key={mun.value} value={mun.value}>
                      {mun.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            {/* CAMPOS NUEVOS */}
            <Col xs={24} sm={12}>
              <Form.Item
                label="Código Establecimiento (MH)"
                name="codEstableMh"
                rules={[{ required: true, message: "Este campo es obligatorio" }]}
              >
                <Input size="large" placeholder="Ej. S006" maxLength={10} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                label="Código Establecimiento Interno"
                name="codEstable"
                rules={[{ required: true, message: "Este campo es obligatorio" }]}
              >
                <Input size="large" placeholder="Ej. S006" maxLength={10} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                label="Código Punto de Venta (MH)"
                name="codPuntoVentaMh"
                rules={[{ required: true, message: "Este campo es obligatorio" }]}
              >
                <Input size="large" placeholder="Ej. M201" maxLength={10} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                label="Código Punto de Venta Interno"
                name="codPuntoVenta"
                rules={[{ required: true, message: "Este campo es obligatorio" }]}
              >
                <Input size="large" placeholder="Ej. M201" maxLength={10} />
              </Form.Item>
            </Col>

            {/* SWITCH DTE */}
            <Col xs={24}>
              <Divider />
              <Form.Item
                label="Emisión de DTE"
                name="dteEnabled"
                valuePropName="checked"
              >
                <Switch checkedChildren="Sí" unCheckedChildren="No" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
            <Form.Item
              label="Contraseña MH"
              name="mhPassword"
              tooltip="Contraseña para autenticación en Hacienda"
              rules={[
                {
                  min: 6,
                  message: "Debe tener al menos 6 caracteres",
                },
              ]}
            >
              <Input.Password size="large" placeholder="Contraseña MH" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              label="Contraseña del Certificado"
              name="certPassword"
              tooltip="Contraseña asociada al certificado (.p12)"
              rules={[
                {
                  min: 6,
                  message: "Debe tener al menos 6 caracteres",
                },
              ]}
            >
              <Input.Password size="large" placeholder="Contraseña del certificado" />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item label="Certificado Digital (.crt o .pfx)">
              <Upload
                beforeUpload={(file) => {
                  setCertFile(file);
                  return false; // ⚠️ evitar que lo suba automáticamente
                }}
                fileList={certFile ? [certFile as any] : []}
                accept=".crt,.pfx"
                maxCount={1}
              >
                <Button type="dashed">Seleccionar Certificado (.crt o .pfx)</Button>
              </Upload>
            </Form.Item>
          </Col>




            
          </Row>

          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <Button type="primary" htmlType="submit" loading={loading} size="large">
              Guardar cambios
            </Button>
          </div>
        </Form>
      </Card>

      <Modal
        title={<span style={{ fontWeight: 600 }}>{modalTitle}</span>}
        open={modalVisible}
        onOk={() => setModalVisible(false)}
        onCancel={() => setModalVisible(false)}
        cancelButtonProps={{ style: { display: "none" } }}
        okText="OK"
        centered
      >
        <p>{modalContent}</p>
      </Modal>
    </div>
  );
};

